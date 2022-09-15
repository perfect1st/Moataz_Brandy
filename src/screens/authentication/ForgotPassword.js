import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  Platform,
  View,
  Text,
  I18nManager,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import {State, TouchableOpacity} from 'react-native-gesture-handler';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

const ForgetPassword = ({navigation}) => {
  const [Mobile, setMobile] = useState(null);
  const [Processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  // const emailIsValid = (email) => {
  //     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  // }

  const validate = () => {
    navigation.navigate('ConfirmCode');

    
  };

  // const post = (obj) => {
  //     setProcessing(true)
  //     try {
  //         axios.post('http://46.101.28.46/api/user/forgetpassword', obj)
  //             .then(async function (response) {
  //                 // console.log(response.data)
  //                 setProcessing(false)
  //                 navigation.navigate("ConfirmCode", {email})
  //             }).catch(function (error) {
  //                 // console.log(error)
  //                 setProcessing(false)
  //                 if (error.response && error.response.data && error.response.data.message) {
  //                     setTimeout(() => {
  //                     }, 100);
  //                 } else {
  //                     setTimeout(() => {
  //                     }, 100);
  //                 }
  //             })
  //     } catch (error) {
  //         // console.log(error)
  //         setProcessing(false)
  //         setTimeout(() => {
  //         }, 100);
  //     }
  // }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.goBack();
          }}>
          <Entypo
            name="chevron-left"
            color={'#4A4B4D'}
            size={32}
            style={styles.flipRTL}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollView}>
          <Image
            source={require('./../../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text allowFontScaling={false} style={styles.loginTxt}>
            {t('Forgot password ?')}
          </Text>
          <Text allowFontScaling={false} style={styles.dontHaveAccTxt}>
            {t('Change password')}
          </Text>
          <Text allowFontScaling={false} style={styles.dontHaveAccTxt}>
            {t('Enter mobile')}
          </Text>
          <View style={[styles.shadow, styles.mobileTxtInput]}>
            <MaterialCommunityIcons
              name={'cellphone-android'}
              size={22}
              color={'#B2B2B2'}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setMobile(text);
              }}
              value={Mobile}
              keyboardType={'numeric'}
              placeholder={'+966 12-345-6789'}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!Processing) {
                validate();
              }
            }}
            style={styles.loginBtn}>
            {Processing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text allowFontScaling={false} style={styles.loginBtnTxt}>
                {t('Next')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  safeAreaView: {flex: 1, backgroundColor: '#fff'},
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {flexGrow: 1, justifyContent: 'flex-start'},
  header: {
    flexDirection: 'row-reverse',
    width: '100%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIcon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    marginTop: '20%',
    width: width / 6,
    height: width / 6,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  loginTxt: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 22,
    color: '#4A4B4D',
    marginBottom: 4,
    fontFamily: 'Cairo-Regular',
    marginTop: '10%',
  },
  dontHaveAccTxt: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 12,
    color: '#7C7D7E',
    fontFamily: 'Cairo-Regular',
    marginBottom: 32,
  },
  mobileTxtInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 14,
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  loginBtn: {
    marginTop: 22,
    width: '80%',
    backgroundColor: '#F8B704',
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  loginBtnTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
  },
});
