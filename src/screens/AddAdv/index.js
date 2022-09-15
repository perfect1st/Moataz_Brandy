import React, {useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaView, I18nManager, StatusBar, StyleSheet} from 'react-native';
const Drawer = createDrawerNavigator();

import DrawerNavigator from './../../navigation/DrawerNavigator';
import AddAdv from './AddAdv';

export default DrawerNavigatorRoutes = ({navigation}) => {
  return (
    <SafeAreaView
      style={styles.safeAreaViewContainer}
      forceInset={{top: 'always', horizontal: 'never'}}>
      <StatusBar backgroundColor="#202F3A" barStyle="dark-content" />
      <Drawer.Navigator
        initialRouteName="AddAdv"
        backBehavior="initialRoute"
        drawerPosition={I18nManager.isRTL ? 'right' : 'left'}
        drawerStyle={styles.drawerStyle}
        drawerType="front"
        drawerContent={() => <DrawerNavigator navigation={navigation} />}
        drawerContentOptions={{
          activeTintColor: '#444444',
          inactiveTintColor: '#888888',
          activeBackgroundColor: '#F4F4F4',
          inactiveBackgroundColor: '#FFFFFF',
          itemStyle: {},
          labelStyle: {},
        }}>
        <Drawer.Screen
          name="AddAdv"
          component={AddAdv}
          options={{
            unmountOnBlur: true,
          }}
        />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaViewContainer: {flex: 1, backgroundColor: '#202F3A'},
  drawerStyle: {
    width: '80%',
    borderTopRightRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
  },
});
