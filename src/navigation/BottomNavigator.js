import React, { useEffect, useState } from 'react';
import { Image, Text, StyleSheet, Platform, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { useTranslation } from 'react-i18next';
import HomeStack from './BottomNavigations/HomeStack';
import FavouriteStack from './BottomNavigations/FavouriteStack';
import AddAdvertiseStack from './BottomNavigations/AddAdvertiseStack';
import MessageStack from './BottomNavigations/MessageStack';
import NotificationStack from './BottomNavigations/NotificationStack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserNotificationsCount } from './../services/APIs';
import { useDispatch, useSelector } from 'react-redux';

const TabNavigator = () => {
  const { t, i18n } = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);
  const [notif, setNotif] = useState(0);
  const [chatcount, setchatcount] = useState(0);

  useEffect(() => {
    if (User) {
      setInterval(() => {
        getUserNotificationsCount(User._id, response => {
          if (response.data) {
            setNotif(response.data.message);
          }
        });
        getUserNotificationsCount(User._id, response => {
          
          if (response.data) {
              setchatcount(response.data.message2);
            
          
          }
        });

      }, 3000);
    }
  }, []);

  return (
    <Tab.Navigator
      initialRouteName={'HomeStack'}
      tabBarOptions={{
        tabStyle: styles.tabStyle,
        style: styles.tabBarStyle,
        activeTintColor: '#D6A230',
        inactiveTintColor: '#FFFFFF',
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          unmountOnBlur: true,
          title: () => { },
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[styles.tabItemTitle,{color: focused ? "#D6A230" : '#FFFFFF'}]}>
              {t('Home')}
            </Text>
            )
        },
          tabBarIcon: ({ focused, color, size }) => {
            return <AntDesign name="home" style={{marginTop:4}} size={Platform.OS == 'android' ? 22:26} color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="FavouriteStack"
        component={FavouriteStack}
        options={{
          unmountOnBlur: true,
       
          title: () => { },
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[styles.tabItemTitle,{color: focused ? "#D6A230" : '#FFFFFF'}]}>
              {t('Favourite')}
            </Text>
            )
        },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <MaterialIcons name="favorite-outline"
              style={{marginTop:4}}
              size={Platform.OS == 'android' ? 25:27} color={color} />
            );
          },
        }}
      />

      <Tab.Screen
        name="AddAdvertiseStack"
        component={AddAdvertiseStack}
        options={{
          unmountOnBlur: true,
          title: () => (
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={styles.tabItemTitle}>
              {t('Add advertise')}
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            return (
              // <Image
              //   source={require('./../assets/images/BottomTabAddIcon.png')}
              //   style={styles.addImage}
              // />
              <View style={{width:46,height:46,backgroundColor:'#d6a230',justifyContent:'center',borderRadius:22,
              marginBottom:20,}}>
              <AntDesign name="plus"
              style={{justifyContent:'center',alignItems:'center',
              paddingLeft:Platform.OS == 'android' ? 10:8,paddingRight:Platform.OS == 'android' ? 10:8,
            }}
              size={Platform.OS == 'android' ? 25:30} color="#fff" />
              </View>
            );
          },
        }}
      />

      
      <Tab.Screen
        name="MessageStack"
        component={MessageStack}
        options={{
          unmountOnBlur: true,
      
          title: () => { },
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[styles.tabItemTitle,{color: focused ? "#D6A230" : '#FFFFFF'}]}>
              {t('Messages')}
            </Text>
            )
        },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <Ionicons
                  name="chatbubble-outline"
                  size={Platform.OS == 'android' ? 24 :26}
                  color={color}
                  style={{marginTop:3 }}
                />
                {chatcount > 0 && (
                  <View style={styles.badge}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}
                      style={styles.notifNu}>
                      {chatcount}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
       
      />
      <Tab.Screen
        name="NotificationStack"
        component={NotificationStack}
        options={{
          unmountOnBlur: true,
          title: () => { },
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <Text
              allowFontScaling={false}
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              style={[styles.tabItemTitle,{color: focused ? "#D6A230" : '#FFFFFF'}]}>
              {t('Notifications')}
            </Text>
            )
        },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <View>
                <Ionicons
                  name="notifications-outline"
                  size={Platform.OS == 'android' ? 24 : 26}
                  color={color}
                  style={{marginTop:  Platform.OS == 'android' ? 3: 5    }}
                />
                {notif > 0 && (
                  <View style={styles.badge}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      adjustsFontSizeToFit={true}
                      style={styles.notifNu}>
                      {notif}
                    </Text>
                  </View>
                )}
              </View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  tabBarStyle: {
    paddingHorizontal: 12,
    backgroundColor: '#202F3A',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: Platform.OS == 'android' ? 50 : 75,
    paddingBottom:Platform.OS == 'android' ? 0 : 18,
  },
  tabStyle: {
    borderTopColor: '#EFEFEF',
    borderTopWidth: 1,
    paddingHorizontal: 4,
    borderTopWidth: 0,
  },
  tabItemTitle: {
    width: '100%',
    fontFamily: 'Cairo-Regular',
    textAlign: 'center',
    fontSize: Platform.OS == 'android' ? 12 : 14,
    color: '#FFFFFF',
    lineHeight: 21,
    fontWeight: Platform.OS == 'android' ? 'normal' : 'normal',
    marginTop: 1
    
  },
  addImage: {
    width: 46,
    height: 46,
    marginTop: -17,
  },
  badge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'red',
    position: 'absolute',
    top: -18,
    left: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifNu: { color: '#FFF', fontWeight: 'bold' },
});
