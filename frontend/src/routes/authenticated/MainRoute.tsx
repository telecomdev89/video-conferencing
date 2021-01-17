import { Button, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import { signOut } from 'src/features/auth/reducer';
import MyConferencesList from 'src/features/conference/components/MyConferencesList';
import ConferenceControls from 'src/features/create-conference/components/ConferenceControls';

const useStyles = makeStyles((theme) => ({
   root: {
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      [theme.breakpoints.down('sm')]: {
         flexDirection: 'column-reverse',
         alignItems: 'center',
         justifyContent: 'center',
      },
   },
   sideList: {
      width: 300,
      backgroundColor: 'red',
      minHeight: 200,
      [theme.breakpoints.down('sm')]: {
         marginTop: 40,
      },
   },
   container: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      [theme.breakpoints.down('sm')]: {
         height: 'auto',
         flex: '0 1 auto',
      },
   },
   contentContainer: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
   },
   title: {
      marginBottom: theme.spacing(4),
      height: 72,
      marginTop: -72,
      [theme.breakpoints.down('md')]: {
         fontSize: '2rem',
         marginTop: 0,
         height: 'auto',
      },
   },
   buttonContainer: {
      display: 'flex',
      flexDirection: 'column',
      width: 400,
   },
   signOutButton: {
      right: theme.spacing(2),
      top: theme.spacing(2),
      position: 'absolute',
   },
}));

export default function MainRoute() {
   const classes = useStyles();

   const dispatch = useDispatch();
   const handleSignOut = () => dispatch(signOut());

   return (
      <div className={classes.root}>
         <Button className={classes.signOutButton} onClick={handleSignOut}>
            Sign out
         </Button>
         <div className={classes.sideList}>
            <MyConferencesList />
         </div>
         <div className={classes.container}>
            <div className={classes.contentContainer}>
               <Typography variant="h2" className={classes.title} align="center">
                  Welcome to PaderConference
               </Typography>
               <div className={classes.buttonContainer}>
                  <ConferenceControls />
               </div>
            </div>
         </div>
      </div>
   );
}
