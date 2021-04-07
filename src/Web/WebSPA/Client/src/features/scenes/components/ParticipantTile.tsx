import { fade, IconButton, makeStyles, Typography, useTheme } from '@material-ui/core';
import clsx from 'classnames';
import { motion, MotionValue, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import AnimatedMicIcon from 'src/assets/animated-icons/AnimatedMicIcon';
import { useParticipantAudio } from 'src/features/media/components/ParticipantMicManager';
import { selectParticipantMicActivated } from 'src/features/media/selectors';
import { RootState } from 'src/store';
import useConsumer from 'src/store/webrtc/hooks/useConsumer';
import { Size } from 'src/types';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ParticipantContextMenuPopper from 'src/features/conference/components/ParticipantContextMenuPopper';
import useMyParticipantId from 'src/hooks/useMyParticipantId';
import { Participant } from 'src/features/conference/types';
import ConsumerDiagnosticInfo from './ConsumerDiagnosticInfo';
import useWebRtc from 'src/store/webrtc/hooks/useWebRtc';
import { selectEnableVideoOverlay } from 'src/features/settings/selectors';

const useStyles = makeStyles((theme) => ({
   root: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[6],
   },
   video: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      height: '100%',
      borderRadius: theme.shape.borderRadius,
      objectFit: 'cover',
   },
   infoBox: {
      position: 'absolute',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      left: theme.spacing(1),
      bottom: theme.spacing(1),

      backgroundColor: fade(theme.palette.background.paper, 0.5),
      padding: theme.spacing(0, 1),
      borderRadius: theme.shape.borderRadius,
   },
   micIconWithoutWebcam: {
      position: 'absolute',
      left: theme.spacing(2),
      bottom: theme.spacing(2),
   },
   centerText: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
   },
   volumeBorder: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
      borderRadius: theme.shape.borderRadius,
      borderStyle: 'solid',
      borderColor: theme.palette.primary.main,
      borderWidth: 0,
   },
   moreButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
   },
   consumerInfo: {
      position: 'absolute',
      right: 0,
      bottom: 0,
   },
}));

type Props = {
   className?: string;
   participant: Participant;
   size: Size;
   disableLayoutAnimation?: boolean;
};

const getBestLayer = (width: number) => {
   if (width <= 320) return 0;

   if (width <= 800) return 1;

   return 2;
};

export default function ParticipantTile({ className, participant, size, disableLayoutAnimation }: Props) {
   const classes = useStyles();
   const consumer = useConsumer(participant.id, 'webcam');
   const videoRef = useRef<HTMLVideoElement | null>(null);
   const micActivated = useSelector((state: RootState) => selectParticipantMicActivated(state, participant?.id));
   const isWebcamActive = consumer?.paused === false;
   const myParticipantId = useMyParticipantId();

   const isMe = participant.id === myParticipantId;

   const audioInfo = useParticipantAudio(participant.id);
   const connection = useWebRtc();

   useEffect(() => {
      if (consumer?.track) {
         const stream = new MediaStream();
         stream.addTrack(consumer.track);

         if (videoRef.current) {
            videoRef.current.srcObject = stream;
         }
      }
   }, [consumer]);

   useEffect(() => {
      if (connection && consumer) {
         connection.setConsumerLayers({
            consumerId: consumer.id,
            layers: { spatialLayer: getBestLayer(size.width) },
         });
      }
   }, [size.width, connection, consumer]);

   const theme = useTheme();
   const audioBorder = useTransform(audioInfo?.audioLevel ?? new MotionValue(0), [0, 1], [0, 10]);

   const isSmall = size.width < 400;
   const fontSize = isWebcamActive ? (isSmall ? 14 : 18) : isSmall ? 16 : 24;

   const [contextMenuOpen, setContextMenuOpen] = useState(false);
   const moreIconRef = useRef(null);

   const showDiagnostics = useSelector(selectEnableVideoOverlay);

   const handleOpenContextMenu = () => {
      setContextMenuOpen(true);
   };

   const handleCloseContextMenu = () => {
      setContextMenuOpen(false);
   };

   return (
      <>
         <motion.div className={clsx(classes.root, className)}>
            <video ref={videoRef} className={classes.video} hidden={!isWebcamActive} autoPlay />
            <motion.div style={{ borderWidth: audioBorder }} className={classes.volumeBorder} />

            {consumer && showDiagnostics && (
               <div className={classes.consumerInfo}>
                  <ConsumerDiagnosticInfo consumer={consumer} tileSize={size} />
               </div>
            )}

            {isWebcamActive && (
               <motion.div className={classes.infoBox}>
                  <AnimatedMicIcon activated={micActivated} disabledColor={theme.palette.error.main} />
                  <Typography
                     component={motion.h4}
                     layoutId={disableLayoutAnimation ? undefined : `name-${participant.id}`}
                     variant="h4"
                     style={{ fontSize, marginLeft: 8 }}
                  >
                     {participant.displayName}
                  </Typography>
               </motion.div>
            )}

            {!isWebcamActive && (
               <>
                  <AnimatedMicIcon
                     activated={micActivated}
                     disabledColor={theme.palette.error.main}
                     className={classes.micIconWithoutWebcam}
                  />
                  <div className={classes.centerText}>
                     <Typography
                        component={motion.span}
                        layoutId={disableLayoutAnimation ? undefined : `name-${participant.id}`}
                        variant="h4"
                        style={{ fontSize }}
                     >
                        {participant.displayName}
                     </Typography>
                  </div>
               </>
            )}

            {!isMe && (
               <div className={classes.moreButton}>
                  <IconButton
                     ref={moreIconRef}
                     aria-label="options"
                     size={isSmall ? 'small' : 'medium'}
                     onClick={handleOpenContextMenu}
                  >
                     <MoreVertIcon />
                  </IconButton>
               </div>
            )}
         </motion.div>
         <ParticipantContextMenuPopper
            open={contextMenuOpen}
            onClose={handleCloseContextMenu}
            participant={participant}
            anchorEl={moreIconRef.current}
         />
      </>
   );
}
