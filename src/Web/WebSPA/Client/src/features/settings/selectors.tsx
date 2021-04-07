import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import { ProducerSource } from 'src/store/webrtc/types';
import { AnyInputDevice } from './types';

const getSource = (_: unknown, source: ProducerSource | undefined) => source;
const selectLocalDevices = (state: RootState) => state.settings.availableDevices;
export const selectEquipmentConnections = (state: RootState) => state.media.equipment?.connections;

export const selectAvailableInputDevices = createSelector(
   selectLocalDevices,
   selectEquipmentConnections,
   getSource,
   (devices, equipment, source) => {
      const result = new Array<DeviceGroup>();

      if (devices) {
         result.push({
            type: 'local',
            devices: devices
               .filter((x) => x.source === source)
               .map((x) => ({ label: x.label, device: { type: 'local', deviceId: x.deviceId } })),
         });
      }

      if (equipment) {
         for (const connected of Object.values(equipment)) {
            if (connected.devices)
               result.push({
                  type: 'equipment',
                  equipmentName: connected.name,
                  connectionId: connected.connectionId,
                  devices: Object.values(connected.devices)
                     .filter((x) => x.source === source)
                     .map((x) => ({
                        label: x.label,
                        device: { type: 'equipment', deviceId: x.deviceId, connectionId: connected.connectionId },
                     })),
               });
         }
      }

      return result;
   },
);

export const selectEnableVideoOverlay = (state: RootState) => state.settings.obj.diagnostics.enableVideoOverlay;

export type DeviceGroup = EquipmentDeviceGroup | LocalDeviceGroup;

export type EquipmentDeviceGroup = {
   type: 'equipment';
   connectionId: string;
   equipmentName?: string;
   devices: DeviceViewModel[];
};

export type LocalDeviceGroup = {
   type: 'local';
   devices: DeviceViewModel[];
};

export type DeviceViewModel = {
   device: AnyInputDevice;
   label?: string;
};
