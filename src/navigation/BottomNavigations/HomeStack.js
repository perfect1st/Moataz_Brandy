import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Home from './../../screens/Home';
import CategoryProducts from './../../screens/Home/CategoryProducts';
import Brand from './../../screens/Home/Brand';
import Sort from './../../screens/Home/Sort';
import ProductDetails from './../../screens/Home/ProductDetails';
import Test from './../../screens/Home/Test';
import Chat from './../../screens/Messages/Chat';
import ComplaintsAndSuggestions from './../../screens/drawerScreens/ComplaintsAndSuggestions';
import customershowadv from '../../screens/Home/customershowadv';
import editproduct from '../../screens/Home/editproduct';
import SearchScreen from '../../screens/Home/SearchScreen';
import Favourite from '../../screens/Favourite/Favourite';
import MyAdvs from '../../screens/drawerScreens/MyAdvs';
import TermsAndConditions from '../../screens/drawerScreens/TermsAndConditions';
import Messages from './../../screens/Messages';


export default Routes = () => {
  return (
    <Stack.Navigator 
    initialRouteName="Home"
    >
      <Stack.Screen
        name="Home"
        component={Home}
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
        name="CategoryProducts"
        component={CategoryProducts}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Brand"
        component={Brand}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Sort"
        component={Sort}
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
        name="Favourite"
        component={Favourite}
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
      
      {/* <Stack.Screen
        name="Test"
        component={Test}
        options={{
          header: () => { },
          headerStyle: {
            height: 0,
          },
        }}
      /> */}
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
        name="ComplaintsAndSuggestions"
        component={ComplaintsAndSuggestions}
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
