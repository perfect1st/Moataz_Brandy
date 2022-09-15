/**
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Settings} from 'react-native-fbsdk-next';

// Ask for consent first if necessary
// Possibly only do this for iOS if no need to handle a GDPR-type flow
Settings.initializeSDK();

const HeadlessCheck = ({isHeadless}) => {
  if (isHeadless) {
    return null;
  }
  return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
