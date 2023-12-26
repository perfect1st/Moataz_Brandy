import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import SplachScreen from './../screens/SplashScreens';
import Login from './../screens/authentication/Login';
import Register from './../screens/authentication/Register';
import ForgotPassword from './../screens/authentication/ForgotPassword';
import ConfirmCode from './../screens/authentication/ConfirmCode';
import BottomNavigator from './../navigation/BottomNavigator';
import MyAdvs from './../screens/drawerScreens/MyAdvs';
import CommissionPayment from './../screens/drawerScreens/CommissionPayment';
import TermsAndConditions from './../screens/drawerScreens/TermsAndConditions';
import ContactUs from './../screens/drawerScreens/ContactUs';
import AboutUs from './../screens/drawerScreens/AboutUs';
import ComplaintsAndSuggestions from './../screens/drawerScreens/ComplaintsAndSuggestions';
import Payment from './../screens/drawerScreens/CommisionPayment/Payment';
import Response from './../screens/drawerScreens/CommisionPayment/Response';
import Editproduct from '../screens/Home/Editproduct';
import customershowadv from '../screens/Home/customershowadv';
import ProductDetails from '../screens/Home/ProductDetails';
import Chat from '../screens/Messages/Chat';
import Messages from '../screens/Messages/Messages';

import Test from '../screens/Home/Test'
import Profile from './../screens/drawerScreens/Profile';
export default Routes = () => {
  return (
    <Stack.Navigator initialRouteName="SplachScreen">
      <Stack.Screen
        name="SplachScreen"
        component={SplachScreen}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />

      <Stack.Screen
        name="customershowadv"
        component={customershowadv}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Editproduct"
        component={Editproduct}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="ConfirmCode"
        component={ConfirmCode}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="BottomNavigator"
        component={BottomNavigator}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />

      <Stack.Screen
        name="MyAdvs"
        component={MyAdvs}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="CommissionPayment"
        component={CommissionPayment}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
            <Stack.Screen
        name="Chat"
        component={Chat}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
            <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />

      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="ComplaintsAndSuggestions"
        component={ComplaintsAndSuggestions}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Response"
        component={Response}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />

      <Stack.Screen
        name="Test"
        component={Test}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};
