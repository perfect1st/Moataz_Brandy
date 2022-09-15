import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Routes from './src/navigation/Routes';

import {I18nManager} from 'react-native';
import RNRestart from 'react-native-restart';
import {useTranslation} from 'react-i18next';
import languages from './src/i18n/languages';
import './src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import Reducers from './src/redux/reducers';

import messaging from '@react-native-firebase/messaging';

import FlashMessage from 'react-native-flash-message';

const Mohassan = () => {
  const {t, i18n} = useTranslation();
  const [languageLoaded, setLanguageLoaded] = useState(false);

  const checkLanguageInCache = async callback => {
    const lang = await AsyncStorage.getItem('Language');
    if (lang) {
      return callback(lang);
    }
    return callback(null);
  };

  useEffect(() => {
    checkLanguageInCache(savedCacheLanguage => {
      // maybe null as its restored from async storage
      const defaultAppLanguage = languages[0]; // app default lang "ar"

      let savedLanguage = languages.find(o => o.code === savedCacheLanguage);
      savedLanguage = savedLanguage ? savedLanguage : defaultAppLanguage;

      i18n.changeLanguage(savedLanguage.code).then(() => {
        if (savedLanguage.isRTL && !I18nManager.isRTL) {
          // saved lang is rtl ?
          I18nManager.allowRTL(true); // force allow rtl
          I18nManager.forceRTL(true); // force rtl
          RNRestart.Restart(); // restart
        } else if (!savedLanguage.isRTL && I18nManager.isRTL) {
          // saved lang is not rtl ?
          I18nManager.forceRTL(false); // force disallow rtl
          I18nManager.allowRTL(false); // force disable rtl
          RNRestart.Restart(); // restart
        } else {
          setLanguageLoaded(true);
          requestUserPermission();
        }
      });
    });

    return () => {};
  }, []);

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission({
      provisional: true,
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
    let notifStatus = await AsyncStorage.getItem('notifStatus');
    var status = true;
    if (!notifStatus) {
      await AsyncStorage.setItem('notifStatus', JSON.stringify(status));
    } else {
      status = JSON.parse(notifStatus);
    }
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
    } else {
    }
  };

  return (
    <>
      <Provider store={createStore(Reducers, {}, applyMiddleware(ReduxThunk))}>
        <NavigationContainer>
          {languageLoaded && <Routes />}
        </NavigationContainer>
      </Provider>
      <FlashMessage
        position="top"
        floating={true}
        hideStatusBar={false}
        duration={5000}
        icon="auto"
      />
    </>
  );
};

export default Mohassan;
