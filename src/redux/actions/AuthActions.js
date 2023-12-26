import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const SaveUser = usr => {
  return dispatch => {
    dispatch({type: 'SAVE_USER', payload: {User: usr}});
  };
};

export const logOut = () => {
  return async dispatch => {
    try {
      await AsyncStorage.removeItem('User');
      await AsyncStorage.removeItem('fcmToken');
      requestUserPermission();
      dispatch({type: 'LOGOUT'});
    } catch (e) {
      // remove error
    }
  };
};

const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission({
    provisional: true,
    sound:false,
    badge:false
  });
  if (authorizationStatus) {
    console.log('Permission settings:', authorizationStatus);
    if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
      getToken();
      console.log('User has notification permissions enabled.');
    } else if (
      authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      getToken();
      console.log('User has provisional notification permissions.');
    } else {
      console.log('User has notification permissions disabled');
    }
  }
};

const getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('Firebase Cloud Messaging => ', fcmToken);
  if (!fcmToken) {
    // Get the device token
    await messaging()
      .getToken()
      .then(async token => {
        console.log('Firebase Cloud Messaging => ', token);
        await AsyncStorage.setItem('fcmToken', token);
      })
      .catch(err => {
        console.log(err);
      });
  }
};
