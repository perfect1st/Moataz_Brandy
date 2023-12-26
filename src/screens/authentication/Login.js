import React, {useCallback, useEffect, useState ,useRef } from 'react';
import {
  ScrollView,
  Platform,
  View,
  Text,
  I18nManager,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {State, TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SaveUser} from '../../redux/actions';

import axios from 'axios';
axios.defaults.timeout = 10000;
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
const {width, height} = Dimensions.get('window');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {login, facebookSignIn, googleSignIn, getCountriesAndCities} from './../../services/APIs';
import SelectDropdown from 'react-native-select-dropdown';

import {
  AccessToken,
  LoginManager,
  Profile,
  AuthenticationToken,
} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
GoogleSignin.configure();

const Login = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const [mobile, setMobile] = useState(null);
  const [password, setPassword] = useState(null);
  const [Processing, setProcessing] = useState(false);
  const [mobileVisible, setMobileVisible] = useState(false);
  const [passwordVisible, setpasswordVisible] = useState(false);
  const [password1Visible, setpassword1Visible] = useState(false);
  const [countryIDVisible, setcountryIDVisible] = useState(false);
  const [mobileCount, setmobileCount] = useState(false);

  const [emailValidate, setemailValidate] = useState(false);
  const countriesDropdownRef = useRef();
  const [countries, setCountries] = useState([]);
  const [countryID, setCountryID] = useState("60c9c6a111c77e7c7506c6f4");

  const User = useSelector(state => state.AuthReducer.User);
  const dispatch = useDispatch();

  const [showAlert, setshowAlert] = useState(false);

  useEffect(() => {
    console.log(countryID)
    console.log('______________________',User)
    if (User) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BottomNavigator'}],
        }),
      );
    }
  }, [User]);

  
  useEffect(() => {
    getCountriesAndCities(response => {
      setCountries(response.data);
    });
    return () => {};
  }, []);

  const _inputRef = useRef(null);
  const setRef = useCallback((node) => {
    if (_inputRef.current) {
      // Make sure to cleanup any events/references added to the last instance
    }
    if (node) {
      // Check if a node is actually passed. Otherwise node would be null.
      // You can now do what you need to, setNativeProps, addEventListeners, measure, etc.
      node.setNativeProps({
        style: { fontFamily: "Cairo-Regular" },
      });
    }
    // Save a reference to the node
    _inputRef.current = node;
  }, []);


  const validate = () => {
    
    if (!mobile) {
      setMobileVisible(!mobileVisible);
    } else if (!password) {
      setpasswordVisible(!passwordVisible);
    } else if (password.length < 6) {
      setpassword1Visible(!password1Visible);
    }
    else if (!countryID) {
      setcountryIDVisible(!countryIDVisible);

    }
    else {

    const countryObj = countries.find((el)=> el._id == countryID)
      if(countryObj.mobileCount != mobile.length){
        setmobileCount(!mobileCount);
        return
      }

      loginUser();
    }
  };

  const processNumber = mobile => {
    var string = fixNumbers(mobile);
    var stringWithoutSpaces = string.replace(/\s/g, '');

    // if (stringWithoutSpaces.charAt(0) == '0') {
    //   return stringWithoutSpaces.substring(1);
    // } else {
    //   return stringWithoutSpaces;
    // }

    return stringWithoutSpaces;

  };

  const fixNumbers = str => {
    var persianNumbers = [
      /۰/g,
      /۱/g,
      /۲/g,
      /۳/g,
      /۴/g,
      /۵/g,
      /۶/g,
      /۷/g,
      /۸/g,
      /۹/g,
    ];
    var arabicNumbers = [
      /٠/g,
      /١/g,
      /٢/g,
      /٣/g,
      /٤/g,
      /٥/g,
      /٦/g,
      /٧/g,
      /٨/g,
      /٩/g,
    ];
    if (typeof str === 'string') {
      for (var i = 0; i < 10; i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };

  const loginUser = () => {
    setProcessing(true);
    login(processNumber(mobile), password, countryID,async response => {
      setProcessing(false);
      if (response.data) {
        const usr = response.data;
        await AsyncStorage.setItem('User', JSON.stringify(usr));
        dispatch(SaveUser(usr));
        setProcessing(false);
      } else {
        setemailValidate(!emailValidate);
      }
    });
  };

  const facebookLogin = () => {
    // LoginManager.logOut()
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          Profile.getCurrentProfile().then(currentProfile => {
            if (currentProfile) {
              // name, userID, imageURL, email
              facebookLoginUser(
                currentProfile.name,
                currentProfile.userID,
                currentProfile.imageURL,
                currentProfile.email,
              );
            }
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const facebookLoginUser = (name, userID, imageURL, email) => {
    setProcessing(true);
    facebookSignIn(name, email, imageURL, userID, async response => {
      setProcessing(false);
      if (response.data) {
        const usr = response.data;
        await AsyncStorage.setItem('User', JSON.stringify(usr));
        dispatch(SaveUser(usr));
        setProcessing(false);
        console.log('response.data', response.data, 'response.data');
      } else {
        console.log(response.error);
        Alert.alert(t(''), t('Something went wrong'));
      }
    });
  };

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // user.name, user.id, user.photo, user.email
      googleLoginUser(
        userInfo.user.name,
        userInfo.user.id,
        userInfo.user.photo,
        userInfo.user.email,
      );
    } catch (error) {
      console.log(error, statusCodes);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const googleLoginUser = (name, userID, imageURL, email) => {
    setProcessing(true);
    googleSignIn(name, email, imageURL, userID, async response => {
      setProcessing(false);
      if (response.data) {
        const usr = response.data;
        await AsyncStorage.setItem('User', JSON.stringify(usr));
        dispatch(SaveUser(usr));
        setProcessing(false);
        console.log('response.data', response.data, 'response.data');
      } else {
        console.log(response.error);
        Alert.alert(t(''), t('Something went wrong'));
      }
    });
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={false}
          contentContainerStyle={styles.scrollView}>
          <Image
            source={require('./../../assets/images/logo.png')}
            style={styles.logo}
          />

          <Text allowFontScaling={false} style={styles.welcomeTxt}>
            {t('Welcome back')}
          </Text>
          <Text allowFontScaling={false} style={styles.doRegisterAgainTxt}>
            {t('Do register again')}
          </Text>
          <View style={[styles.shadow, styles.mobileTxtInput]}>
            <MaterialCommunityIcons
              name={'cellphone-android'}
              size={22}
              color={'#B2B2B2'}
            />
            <SelectDropdown
              ref={countriesDropdownRef}
              data={countries}
              defaultButtonText={countryID == '60c9c6a111c77e7c7506c6f4' ? '966':t('Country code')}
              
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.code : item.code;
              }}
              onSelect={(selectedItem, index) => {
                setCountryID(selectedItem._id);
              }}
              buttonStyle={[styles.textInput2,{borderRightWidth:1,borderColor:'#bbb'}]}
              buttonTextStyle={styles.label3}
              rowTextStyle={styles.label3}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.code : item.code;
              }}
            />
            <TextInput
              style={[styles.textInput,{flex:2}]}
              onChangeText={text => {
                setMobile(text);
              }}
              value={mobile}
              keyboardType={'numeric'}
              placeholder={t('Mobile')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              placeholderTextColor="gray"
              returnKeyType={'done'}
            />

          </View>
          
          <Modal
            // animationType='slide'
            transparent={true}
            visible={mobileVisible}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' ,fontFamily: 'Cairo-Bold', fontSize:18}}>
                  { '\n' +t('Please add mobile') + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setMobileVisible(!mobileVisible)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Regular', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
          </Modal>
          <Modal
            // animationType='slide'
            transparent={true}
            visible={passwordVisible}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' ,fontFamily: 'Cairo-Regular', fontSize:18}}>
                  { '\n' +t('Please add password') + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setpasswordVisible(!passwordVisible)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Regular', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
            
          </Modal>
          <Modal
            // animationType='slide'
            transparent={true}
            visible={countryIDVisible}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' ,fontFamily: 'Cairo-Regular', fontSize:18}}>
                  { '\n' +t('Please select country code') + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setcountryIDVisible(!countryIDVisible)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Regular', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
            
          </Modal>
          <Modal
            // animationType='slide'
            transparent={true}
            visible={mobileCount}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' ,fontFamily: 'Cairo-Regular', fontSize:18}}>
                  { '\n' +t('Please select right mobile length') + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setmobileCount(!mobileCount)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Regular', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
            
          </Modal>

          <Modal
            // animationType='slide'
            transparent={true}
            visible={password1Visible}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' , fontSize:18,fontFamily: 'Cairo-Regular'}}>
                  { '\n' +t('Please add password that has at least 8 characters')  + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setpassword1Visible(!password1Visible)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Regular', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
          </Modal>
          <Modal
            // animationType='slide'
            transparent={true}
            visible={emailValidate}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {t('error')}
                </Text>
                <Text style={{textAlign:'center' ,fontFamily: 'Cairo-Regular', fontSize:18}}>
                  { '\n' +t('invalid username or password') + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => setemailValidate(!emailValidate)}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Bold', fontSize: 16})
                      }>{t('Cancel')}</Text>
                </Pressable></View>

              </View>
            </View>
       
          </Modal>
          <View style={[styles.shadow, styles.passTxtInput]}>
            <MaterialCommunityIcons
              name={'lock-outline'}
              size={22}
              color={'#B2B2B2'}
            />
            <TextInput
              style={styles.textInput}
              secureTextEntry={true}
              onChangeText={text => {
                setPassword(text);
              }}
              value={password}
              placeholder={t('Password')}
              placeholderTextColor="gray"
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              textContentType={'oneTimeCode'}
              ref={setRef}

            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}>
            <Text allowFontScaling={false} style={styles.forgotPassTxt}>
              {t('Forgot password ?')}
            </Text>
          </TouchableOpacity>

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
                {t('Login')}
              </Text>
            )}
          </TouchableOpacity>
          {Platform.OS == 'android' && (
            <Text allowFontScaling={false} style={styles.orLoginByTxt}>
              {t('Or login by')}
            </Text>
          )}
          {Platform.OS == 'android' && (
            <View style={styles.rowViewContainer}>
              <TouchableOpacity
                onPress={() => {
                  googleLogin();
                }}
                style={styles.socialImagesTO}>
                <Image
                  style={styles.socialImages}
                  source={require('./../../assets/images/google.png')}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  facebookLogin();
                }}
                style={styles.socialImagesTO}>
                <Image
                  style={styles.socialImages}
                  source={require('./../../assets/images/facebook.png')}
                />
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Register');
            }}
            style={styles.rowViewContainer}>
            <Text allowFontScaling={false} style={styles.dontHaveAccTxt}>
              {t("Don't have an account.")}
            </Text>
            <Text allowFontScaling={false} style={styles.registerTxt}>
              {t('Register')}
            </Text>
          </TouchableOpacity>
          <View style={styles.fullRowViewContainer}>
            <MaterialCommunityIcons
              name={'arrow-right'}
              size={22}
              color={'#000000'}
              style={styles.flipRTL}
            />
            <Text
              onPress={() => navigation.navigate('BottomNavigator')}
              allowFontScaling={false}
              style={styles.skipTxt}>
              {t('Skip')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

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
  modalText: {
    // textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
  },
   

  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  scrollView: {flexGrow: 1, justifyContent: 'flex-start'},
  logo: {
    marginTop: '20%',
    width: width / 6,
    height: width / 6,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  subviewoverlay: {
    height: 40,
    width: 70,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderColor: '#D6A230',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  subviewoverlaytext: {
    alignSelf: 'center',
    alignSelf: 'center',
    color: '#D6A230',
  },
  welcomeTxt: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 22,
    color: '#4A4B4D',
    marginBottom: 4,
    fontFamily: 'Cairo-Bold',
    marginTop: 12,
  },
  doRegisterAgainTxt: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#7C7D7E',
    fontFamily: 'Cairo-Regular',
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    fontFamily: 'Cairo-Regular',

  },
  textInput2: {
    flex: 1,
    borderRadius: 12,
    fontFamily: 'Cairo-Regular',
    backgroundColor:'#fff',
  },

  mobileTxtInput: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginTop: 26,
  },
  passTxtInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
    height: 50,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignSelf: 'center',
  },
  forgotPassTxt: {
    marginTop: 12,
    fontSize: 14,
    color: '#367FC0',
    fontFamily: 'Cairo-Regular',
    width: '80%',
    alignSelf: 'center',
    textAlign: 'left',
  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  loginBtn: {
    width: '80%',
    backgroundColor: '#F8B704',
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 42,
    alignSelf: 'center',
  },
  loginBtnTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
  },
  orLoginByTxt: {
    alignSelf: 'center',
    fontSize: 12,
    color: '#7C7D7E',
    fontFamily: 'Cairo-Regular',
    marginTop: 12,
  },
  rowViewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12,
  },
  socialImagesTO: {
    marginHorizontal: 6,
  },
  socialImages: {
    width: 40,
    height: 40,
  },
  dontHaveAccTxt: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#7C7D7E',
    fontFamily: 'Cairo-Regular',
  },
  registerTxt: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#1473E6',
    fontFamily: 'Cairo-Regular',
    marginLeft: 4,
  },
  fullRowViewContainer: {
    flexDirection: 'row',
    marginTop: 12,
    width: '86%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  centeredViewPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  modalViewM: {
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '70%',
    marginBottom: 100,
  },

  flipRTL: {transform: [{scaleX: I18nManager.isRTL ? 1 : -1}], marginTop: 5},
  skipTxt: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'Cairo-Regular',
    flex: 1,
    textAlign: 'left',
    paddingHorizontal: 8,
    alignContent: 'center',
    alignItems: 'center',
  },
  label3: {
    textAlign: 'left',
    fontSize: 16,
    paddingHorizontal: 8,
    fontFamily: 'Cairo-Regular',
    color: 'gray',
  },

});
