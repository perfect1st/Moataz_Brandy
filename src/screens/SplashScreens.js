import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Dimensions} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {SaveUser} from './../redux/actions';
import './../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');

























const SplachScreen = ({navigation}) => {
  const User = useSelector(state => state.AuthReducer.User);
  const dispatch = useDispatch();

  useEffect(() => {
    checkUserDataInCache();
    return () => {};
  }, []);

  useEffect(() => {
    if (User) {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'BottomNavigator'}],
          }),
        );
      }, 2000);
    }
  }, [User]);

  const checkUserDataInCache = async () => {
    const user = await AsyncStorage.getItem('User');
    if (user) {
      dispatch(SaveUser(JSON.parse(user)));
    } else {
      setTimeout(() => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Login'}],
          }),
        );
      }, 2000);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('./../assets/images/logo2.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default SplachScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width / 4,
    height: width / 2,
    resizeMode: 'contain',
  },
});
