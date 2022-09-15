import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();

import Messages from './../../screens/Messages';
import Chat from './../../screens/Messages/Chat';

export default Routes = () => {
  return (
    <Stack.Navigator initialRouteName="Messages">
      <Stack.Screen
        name="Messages"
        component={Messages}
        options={{
          header: () => {},
          headerStyle: {
            height: 0,
          },
        }}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
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
