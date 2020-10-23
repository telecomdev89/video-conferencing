import { HubConnection } from '@microsoft/signalr';
import { PayloadAction } from '@reduxjs/toolkit';
import { AnyAction, Dispatch, Middleware, MiddlewareAPI } from 'redux';
import { initializationFailed, initialize, initialized } from './actions';
import app from './application-soup';
import { SoupManager } from './SoupManager';

export type RtcListener = {
   middleware: Middleware;
};

export default function createRtcManager(getConnection: () => HubConnection | undefined): RtcListener {
   let dispatch: Dispatch<AnyAction>;
   let soupManager: SoupManager | undefined;

   const middleware: Middleware = (store: MiddlewareAPI) => {
      dispatch = store.dispatch;

      return (next) => async (action: PayloadAction<any>) => {
         switch (action.type) {
            case initialize.type: {
               const connection = getConnection();
               if (!connection) {
                  dispatch(initializationFailed);
                  return;
               }

               soupManager = new SoupManager(connection);
               if (!(await soupManager.initializeDevice())) {
                  console.log('could not be initialized');
                  return;
               }

               const { device } = soupManager;

               const canProduceAudio = device.canProduce('audio');
               const canProduceVideo = device.canProduce('video');

               const result = await connection.invoke('InitializeConnection', {
                  sctpCapabilities: device.sctpCapabilities,
                  rtpCapabilities: device.rtpCapabilities,
               });
               if (result) return;

               dispatch(initialized({ canProduceAudio, canProduceVideo }));

               app.registerSoupManager(soupManager);

               if (canProduceAudio || canProduceVideo) {
                  await soupManager.createSendTransport();
               }

               await soupManager.createReceiveTransport();
               break;
            }
            default:
               break;
         }

         return next(action);
      };
   };

   return { middleware };
}
