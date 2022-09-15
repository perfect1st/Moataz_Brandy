import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import AddAdv from './../../screens/AddAdv';
import AddAdvData from './../../screens/AddAdv/AddAdvData';
import ProductDetails from './../../screens/Home/ProductDetails';

export default Routes = () => {
  return (
    <Stack.Navigator initialRouteName="AddAdv">
      <Stack.Screen
        name="AddAdv"
        component={AddAdv}
        options={{
          header: () => {},
          headerStyle: {
            height: 0,
          },
        }}
      />
        <Stack.Screen
        name="ProductDetails"
        component={ProductDetails}
        options={{
          header: () => {},
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="AddAdvData"
        component={AddAdvData}
        options={{
          header: () => {},
          headerStyle: {
            height: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
};
