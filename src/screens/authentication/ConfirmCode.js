import React, {useCallback, useEffect, useState, useRef} from 'react';
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
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Image,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {Input} from 'native-base';
import {State, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SaveUser} from '../../redux/actions';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');
import Entypo from 'react-native-vector-icons/Entypo';

const ConfirmCode = ({navigation, route}) => {
  const [code1, setCode1] = useState(null);
  const [code2, setCode2] = useState(null);
  const [code3, setCode3] = useState(null);
  const [code4, setCode4] = useState(null);

  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const input4 = useRef();

  const [selectedInput, setSelectedInput] = useState(1);

  const [Processing, setProcessing] = useState(false);
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();

  // const email = route.params.email;

  // const validate = () => {
  //   // goChangeForgottenPasswordScreen(user) // change password without verify for testing
  //   // navigation.navigate("ChangePassword")
  //   //Validate and verify code
  //   if (code1 && code2 && code3 && code4) {
  //     // console.log(code1+code2+code3+code4)
  //     post(code1 + code2 + code3 + code4);
  //   } else {
  //   }
  // };

  // const post = code => {
  //   setProcessing(true);
  //   try {
  //     axios
  //       .get('http://46.101.28.46/api/user/verifycode', {
  //         params: {
  //           code,
  //           email: email.toLowerCase(),
  //         },
  //       })
  //       .then(async function (response) {
  //         console.log(response.data);
  //         setProcessing(false);
  //         navigation.navigate('ChangePassword', {user: response.data});
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //         setProcessing(false);
  //         if (
  //           error.response &&
  //           error.response.data &&
  //           error.response.data.message
  //         ) {
  //           setTimeout(() => {
  //           }, 100);
  //         } else {
  //           setTimeout(() => {
  //           }, 100);
  //         }
  //       });
  //   } catch (error) {
  //     // console.log(error)
  //     setProcessing(false);
  //     setTimeout(() => {
  //     }, 100);
  //   }
  // };

  // const resend = () => {
  //   setProcessing(true);
  //   const random = Math.floor(Math.random() * (9999 - 1000)) + 1000;
  //   const obj = {email: email.toLowerCase(), code: random.toString()};
  //   try {
  //     axios
  //       .post('http://46.101.28.46/api/user/forgetpassword', obj)
  //       .then(async function (response) {
  //         // console.log(response.data)
  //         setProcessing(false);
  //         setTimeout(() => {
  //         }, 200);
  //       })
  //       .catch(function (error) {
  //         // console.log(error)
  //         setProcessing(false);
  //         if (
  //           error.response &&
  //           error.response.data &&
  //           error.response.data.message
  //         ) {
  //           setTimeout(() => {
  //           }, 100);
  //         } else {
  //           setTimeout(() => {
  //           }, 100);
  //         }
  //       });
  //   } catch (error) {
  //     // console.log(error)
  //     setProcessing(false);
  //     setTimeout(() => {
  //     }, 100);
  //   }
  // };

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
          <View>
            <Text allowFontScaling={false} style={styles.loginTxt}>
              {t('Code has been sent')}
            </Text>
            <Text allowFontScaling={false} style={styles.dontHaveAccTxt}>
              {t('Please confirm code') + ' 00000000'}
            </Text>
          </View>
          <View style={{marginVertical: '20%'}}>
            <View style={styles.codeFieldsContainer}>
              {/* First Number */}
              <View style={[styles.codeField, styles.shadow]}>
                <Input
                  ref={input1}
                  onFocus={() => {
                    setSelectedInput(1);
                  }}
                  placeholderTextColor={'#CACACA'}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  value={code1}
                  style={styles.inputFields}
                  textAlign={'center'}
                  maxLength={1}
                  onChangeText={text => {
                    if (text == '') {
                      setCode1(null);
                      setCode2(null);
                      setCode3(null);
                      setCode4(null);
                    } else {
                      setCode1(text);
                      setTimeout(() => {
                        input2.current._root.focus();
                      }, 100);
                    }
                  }}
                />
              </View>
              {/* Second Number */}
              <View
                style={[
                  styles.codeField,
                  styles.shadow,
                  !code1 && {backgroundColor: '#F5F5F5'},
                ]}>
                <Input
                  ref={input2}
                  onFocus={() => {
                    setSelectedInput(2);
                  }}
                  placeholderTextColor={'#CACACA'}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  value={code2}
                  style={styles.inputFields}
                  disabled={!code1}
                  textAlign={'center'}
                  maxLength={1}
                  onChangeText={text => {
                    if (text == '') {
                      setCode2(null);
                      setCode3(null);
                      setCode4(null);
                      setTimeout(() => {
                        input1.current._root.focus();
                      }, 100);
                    } else {
                      setCode2(text);
                      setTimeout(() => {
                        input3.current._root.focus();
                      }, 100);
                    }
                  }}
                />
              </View>
              {/* Third Number */}
              <View
                style={[
                  styles.codeField,
                  styles.shadow,
                  !code2 && {backgroundColor: '#F5F5F5'},
                ]}>
                <Input
                  ref={input3}
                  onFocus={() => {
                    setSelectedInput(3);
                  }}
                  placeholderTextColor={'#CACACA'}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  value={code3}
                  disabled={!code2}
                  style={styles.inputFields}
                  textAlign={'center'}
                  maxLength={1}
                  onChangeText={text => {
                    if (text == '') {
                      setCode3(null);
                      setCode4(null);
                      setTimeout(() => {
                        input2.current._root.focus();
                      }, 100);
                    } else {
                      setCode3(text);
                      setTimeout(() => {
                        input4.current._root.focus();
                      }, 100);
                    }
                  }}
                />
              </View>
              {/* Forth Number */}
              <View
                style={[
                  styles.codeField,
                  styles.shadow,
                  !code3 && {backgroundColor: '#F5F5F5'},
                ]}>
                <Input
                  ref={input4}
                  onFocus={() => {
                    setSelectedInput(4);
                  }}
                  placeholderTextColor={'#CACACA'}
                  keyboardType={'numeric'}
                  returnKeyType={'done'}
                  value={code4}
                  disabled={!code3}
                  style={styles.inputFields}
                  textAlign={'center'}
                  maxLength={1}
                  onChangeText={text => {
                    if (text == '') {
                      setCode4(null);
                      setTimeout(() => {
                        input3.current._root.focus();
                      }, 100);
                    } else {
                      setCode4(text);
                    }
                  }}
                />
              </View>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => {
                if (!Processing) {
                  // validate();
                }
              }}
              style={styles.loginBtn}>
              {Processing ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text allowFontScaling={false} style={styles.loginBtnTxt}>
                  {t('Done')}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // resend();
              }}
              style={styles.registerViewContainer}>
              <Text allowFontScaling={false} style={styles.dontHaveAccTxt}>
                {t('Not sent')}
              </Text>
              <Text allowFontScaling={false} style={styles.registerTxt}>
                {t('Resend')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConfirmCode;

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
    fontFamily: 'Cairo-Regular',
    marginTop: '10%',
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 18,
  },
  registerViewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 8,
  },
  dontHaveAccTxt: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 14,
    color: '#7C7D7E',
    fontFamily: 'Cairo-Regular',
  },
  registerTxt: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#5D98CC',
    fontWeight: 'bold',
    fontFamily: 'Cairo-Bold',
    marginLeft: 4,
  },
  mobileTxtInput: {
    height: 56,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  passTxtInput: {
    marginTop: 25,
    width: '100%',
    height: 56,
    backgroundColor: '#F2F2F2',
    borderRadius: 12,
    paddingHorizontal: 32,
  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  loginBtn: {
    marginTop: 5,
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
  forgotPassTxt: {
    marginTop: 20,
    alignSelf: 'center',
    fontSize: 14,
    color: '#367FC0',
    fontFamily: 'Cairo-Regular',
  },
  codeFieldsContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  inputFields: {flex: 1, color: '#000'},
  codeField: {
    flexDirection: 'row',
    width: 50,
    height: 50,
    borderRadius: 12,
    marginHorizontal: 6,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
