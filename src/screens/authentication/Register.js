import React, {useRef, useEffect, useState ,useCallback} from 'react';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
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
  TouchableOpacity,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SaveUser} from '../../redux/actions';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SelectDropdown from 'react-native-select-dropdown';
import {getCountriesAndCities, register} from './../../services/APIs';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Register = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [Processing, setProcessing] = useState(false);
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const User = useSelector(state => state.AuthReducer.User);
  const dispatch = useDispatch();

  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [mobile, setMobile] = useState(null);
  const [countryID, setCountryID] = useState(null);
  const [cityID, setCityID] = useState(null);
  const [password, setPassword] = useState(null);
  const [cPassword, setCPassword] = useState(null);

  const [nameV, setnameV] = useState(false);
  const [ToggleV, setToggleV] = useState(false);

  const [mobileV, setmobileV] = useState(false);
  const [countryV, setcountryV] = useState(false);
  const [cityV, setcityV] = useState(false);
  const [passwordV, setpasswordV] = useState(false);
  const [passwordVV, setpasswordVV] = useState(false);
  const [emailV, setemailV] = useState(false);
  const [emailusedV, setemailusedV] = useState(false);
  const [mobileusedV, setemobileusedV] = useState(false);
  const [countries, setCountries] = useState([]);
  const countriesDropdownRef = useRef();
  const [cities, setCities] = useState([]);
  const citiesDropdownRef = useRef();

  useEffect(() => {
    getCountriesAndCities(response => {
      setCountries(response.data);
    });
    return () => {};
  }, []);

  useEffect(() => {
    if (User) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'BottomNavigator'}],
        }),
      );
    }
  }, [User]);

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
    if (!name) {
      setnameV(!nameV);
    } else if (!email || !emailIsValid(email)) {
      setemailV(!emailV);
    } else if (toggleCheckBox == false) {
      setToggleV(!ToggleV);
    } else if (!mobile) {
      setmobileV(!mobileV);
    } else if (!countryID) {
      setcountryV(!countryV);
    } else if (!cityID) {
      setcityV(!cityV);
    } else if (!password || password.length < 8) {
      setpasswordV(!passwordV);
    } else if (!cPassword || cPassword != password) {
      setpasswordVV(!passwordVV);
    } else {
      registerUser();
    }
  };

  const processNumber = mobile => {
    var string = fixNumbers(mobile);
    var stringWithoutSpaces = string.replace(/\s/g, '');
    if (stringWithoutSpaces.charAt(0) == '0') {
      return stringWithoutSpaces.substring(1);
    } else {
      return stringWithoutSpaces;
    }
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

  const emailIsValid = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const registerUser = async () => {
    setProcessing(true);
    register(
      name,
      email,
      processNumber(mobile),
      countryID,
      cityID,
      password,
      async response => {
        setProcessing(false);
        if (response.data) {
          console.log('logggg111');
          const usr = response.data;
          await AsyncStorage.setItem('User', JSON.stringify(usr));
          dispatch(SaveUser(usr));
          setProcessing(false);
        } else {
          console.log('-----2-----');
          if (response.error.message == 'Request failed with status code 415') {
            setemailusedV(!emailusedV);
          } else if (
            response.error.message == 'Request failed with status code 416'
          ) {
            setemobileusedV(!mobileusedV);
          }

          console.log(response.error.message, 'respoooooooonse');
        }
      },
    );
  };

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
          <Text allowFontScaling={false} style={styles.loginTxt}>
            {t('Register')}
          </Text>
          <Text allowFontScaling={false} style={styles.addYourDataTxt}>
            {t('Add your data and start shopping.')}
          </Text>
          <View style={[styles.shadow, styles.textInputAll]}>
            <FontAwesome name={'user-o'} size={22} color={'#B2B2B2'} />
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setName(text);
              }}
              value={name}
              placeholder={t('Name')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              placeholderTextColor="gray"
              returnKeyType={'done'}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
            <MaterialCommunityIcons
              name={'email-outline'}
              size={22}
              color={'#B2B2B2'}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setEmail(text);
              }}
              value={email}
              placeholder={t('Email')}
              placeholderTextColor="gray"
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
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
              value={mobile}
              keyboardType={'numeric'}
              placeholderTextColor="gray"
              placeholder={t('Mobile')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
            <SimpleLineIcons name={'flag'} size={22} color={'#B2B2B2'} />
            <SelectDropdown
              ref={countriesDropdownRef}
              data={countries}
              defaultButtonText={t('Country')}
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
              onSelect={(selectedItem, index) => {
                setCityID(null);
                setCountryID(selectedItem._id);
                citiesDropdownRef.current.reset();
                setCities([]);
                setCities(selectedItem.city);
              }}
              buttonStyle={styles.textInput}
              buttonTextStyle={styles.label2}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
            <FontAwesome name={'building-o'} size={22} color={'#B2B2B2'} />
            <SelectDropdown
              ref={citiesDropdownRef}
              data={cities}
              defaultButtonText={t('City')}
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
              onSelect={(selectedItem, index) => {
                setCityID(selectedItem._id);
              }}
              buttonStyle={styles.textInput}
              buttonTextStyle={styles.label2}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
            <MaterialCommunityIcons
              name={'lock-outline'}
              size={22}
              color={'#B2B2B2'}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setPassword(text);
              }}
              value={password}
              placeholder={t('Password')}
              placeholderTextColor="gray"
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              secureTextEntry={hidePass2 ? true : false}
              placeholderStyle={styles.textboxfieldd}
              ref={setRef}

            />

            <Icon
              name={hidePass2 ? 'eye-slash' : 'eye'}
              size={15}
              color="grey"
              onPress={() => setHidePass2(!hidePass2)}
            />
          </View>
          <View style={[styles.shadow, styles.textInputAll]}>
            <MaterialCommunityIcons
              name={'lock-outline'}
              size={22}
              color={'#B2B2B2'}
            />
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setCPassword(text);
              }}
              value={cPassword}
              placeholder={t('Confirm password')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              placeholderTextColor="gray"
              returnKeyType={'done'}
              secureTextEntry={hidePass ? true : false}
              ref={setRef}
            />
            <Icon
              name={hidePass ? 'eye-slash' : 'eye'}
              size={15}
              color="grey"
              onPress={() => setHidePass(!hidePass)}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#FFF',
              alignSelf: 'center',
              marginTop: 5,
              marginRight: I18nManager.isRTL ? 110 : 75,
            }}>
            <CheckBox
              lineWidth={2}
              disabled={false}
              value={toggleCheckBox}
              boxType={'square'}
              onFillColor={'#F8B704'}
              onCheckColor={'#fff'}
              onTintColor={'#fff'}
              onAnimationType={'fill'}
              offAnimationType={'fill'}
              onValueChange={newValue => setToggleCheckBox(newValue)}
            />
            <Text
              allowFontScaling={false}
              style={{
                alignSelf: 'center',
                fontSize: 16,
                color: '#707070',
                fontFamily: 'Cairo-Regular',
                marginBottom: 25,
                marginTop: 5,
                marginHorizontal:5
              }}>
              {t('Agree to the terms and conditions')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('TermsAndConditions');
              }}
              style={styles.rowViewContainer}>
              <Text
                allowFontScaling={false}
                style={{
                  alignSelf: 'center',
                  fontSize: 16,
                  color: '#7caddf',
                  fontFamily: 'Cairo-Regular',
                  marginBottom: 25,
                  textDecorationLine: 'underline',
                  marginTop: 5,
                }}>
                {t('Terms and conditions')}
              </Text>
            </TouchableOpacity>
          </View>

          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Alert conditions')}
            onPress={() => {
              setToggleV(!ToggleV);
            }}
            Mvasible={ToggleV}
            CancleText={t('Cancel')}
          />

          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Please add fullname')}
            onPress={() => {
              setnameV(!nameV);
            }}
            Mvasible={nameV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Please add mobile')}
            onPress={() => {
              setmobileV(!mobileV);
            }}
            Mvasible={mobileV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Email is not valid')}
            onPress={() => {
              setemailV(!emailV);
            }}
            Mvasible={emailV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Please choose country')}
            onPress={() => {
              setcountryV(!countryV);
            }}
            Mvasible={countryV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Please choose city')}
            onPress={() => {
              setcityV(!cityV);
            }}
            Mvasible={cityV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Please add password that has at least 8 characters')}
            onPress={() => {
              setpasswordV(!passwordV);
            }}
            Mvasible={passwordV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Password and confirm password does not match')}
            onPress={() => {
              setpasswordVV(!passwordVV);
            }}
            Mvasible={passwordVV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Email is already used')}
            onPress={() => {
              setemailusedV(!emailusedV);
            }}
            Mvasible={emailusedV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={t('Remind')}
            TextBody={t('Mobile is already used')}
            onPress={() => {
              setemobileusedV(!mobileusedV);
            }}
            Mvasible={mobileusedV}
            CancleText={t('Cancel')}
          />

          <View>
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
                  {t('Register')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Register;

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
  loginTxt: {
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 22,
    color: '#707070',
    fontFamily: 'Cairo-Bold',
    width: '90%',
  },
  addYourDataTxt: {
    alignSelf: 'center',
    textAlign: 'left',
    fontSize: 12,
    color: '#707070',
    fontFamily: 'Cairo-Bold',
    width: '90%',
    marginBottom: 25,
  },
  textInputAll: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 14,
    fontFamily: 'Cairo-Bold',
  },
  textInputAlign: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: 'Cairo-Regular',
  },

  textInput: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    height: '100%',
    fontFamily: 'Cairo-Regular',
  },
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
    fontFamily: 'Cairo-Regular',
  },
  label2: {
    textAlign: 'left',
    fontSize: 16,
    paddingHorizontal: 8,
    fontFamily: 'Cairo-Regular',
    color: 'gray',
  },
});
