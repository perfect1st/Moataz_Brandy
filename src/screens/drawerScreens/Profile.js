import React, { useRef, useEffect, useState, useCallback } from 'react';
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
    Image,
    TextInput,
    Alert,
    ActivityIndicator,
    Modal,
    KeyboardAvoidingView,
    TouchableOpacity,
    Pressable,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SaveUser,logOut } from '../../redux/actions';
import axios from 'axios';
axios.defaults.timeout = 10000;
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import SelectDropdown from 'react-native-select-dropdown';
import { getCity, getCountriesAndCities, updateUser,uploadPhoto ,deleteAccountFunc} from './../../services/APIs';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ModalAlert2 from '../../components/ModalAlert/ModalAlert2';
import ModalAlert3 from '../../components/ModalAlert/ModalAlert3';

const Register = ({ navigation }) => {
    const { t, i18n } = useTranslation();
    const [Processing, setProcessing] = useState(false);
    const User = useSelector(state => state.AuthReducer.User);
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);

    const [hidePass2, setHidePass2] = useState(true);
    const [name, setName] = useState(User.fullnameAR);
    const [email, setEmail] = useState(User.email);
    const [mobile, setMobile] = useState(User.mobile);
    const [countryID, setCountryID] = useState(
        User?.countryID ? User.countryID._id : null,
    )
    const [cityID, setCityID] = useState(
        User?.cityID ? User.cityID._id : null,
    )
    const [password, setPassword] = useState(User.password);
    const [nameV, setnameV] = useState(false);
    const [ToggleV, setToggleV] = useState(false);

    const [sourceImg, setSourceImg] = useState(null);
    const [imgPath, setImgPath] = useState(null);
    const [userLogo,setUserLogo] = useState(User.logo)
    const [mobileV, setmobileV] = useState(false);
    const [countryV, setcountryV] = useState(false);
    const [cityV, setcityV] = useState(false);
    const [passwordV, setpasswordV] = useState(false);
    const [emailV, setemailV] = useState(false);
    const [emailusedV, setemailusedV] = useState(false);
    const [mobileusedV, setemobileusedV] = useState(false);
    const [checkPassM, setcheckPassM] = useState(false);
    
    const [editSuccessV, seteditSuccessV] = useState(false);

    const [deleteAccount, setdeleteAccount] = useState(false);
    const [oldPass, setOldPass] = useState(false);
    const [oldPassConfirm, setOldPassConfirm] = useState(false);

    const [countries, setCountries] = useState([]);
    const countriesDropdownRef = useRef();
    const [cities, setCities] = useState([]);
    const citiesDropdownRef = useRef();
    const [inputText,setInputText] = useState('')

    useEffect(() => {
        getCountriesAndCities(response => {
            setCountries(response.data);
        });
        getCity(User.countryID._id, response => {
            console.log('aaa')
            console.log(response.data)
            setCities(response.data)
        })

        // console.log(User)
        // console.log(User.cityID.titleAR)
        // console.log(User.cityID)

        return () => { };
    }, []);

    //   useEffect(() => {
    //     if (User) {
    //       navigation.dispatch(
    //         CommonActions.reset({
    //           index: 0,
    //           routes: [{name: 'BottomNavigator'}],
    //         }),
    //       );
    //     }
    //   }, [User]);

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
        } else if (!mobile) {
            setmobileV(!mobileV);
        } else if (!countryID) {
            setcountryV(!countryV);
        } else if (!cityID) {
            setcityV(!cityV);
        } else if (!password || password.length < 8) {
            setpasswordV(!passwordV);
        } else {
            console.log('_________________________________________________')

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
    const pickImageFromPhone = () => {
        const options = {
            mediaType: 'photo',
        };
        launchImageLibrary(options, response => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                // setProcessing(false)
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                // setProcessing(false)
                console.log('ImagePicker Error: ', response.error);
            } else if (response.errorMessage) {
                // setProcessing(false)
                console.log('User tapped custom button: ', response.errorMessage);
            } else {
                // setProcessing(true);
                setModalVisible(!modalVisible);
                const source = {
                    uri:
                        Platform.OS === 'android'
                            ? response.uri
                            : response.uri.replace('file://', ''),
                    fileName: response.fileName,
                    type: response.type,
                };
                // uploadPhoto(source, response => {
                //     if (response.data) {
                //         updateUser(User._id, { logo: response.data }, async response2 => {
                //             console.log(response2);
                //             if (response2.data) {
                //                 await AsyncStorage.setItem(
                //                     'User',
                //                     JSON.stringify(response2.data),
                //                 );
                //                 dispatch(SaveUser(response2.data));
                //                 setProcessing(false);

                //             }
                //         });
                //     } else {
                //         setProcessing(false);

                //     }
                // });
                setUserLogo(Platform.OS === 'android'
                ? response.uri
                : response.uri.replace('file://', ''))
                setSourceImg(source)
            }
        });

        // setModalVisible(!modalVisible);
    };

    const pickImageFromCamera = () => {
        const options = {
            mediaType: 'photo',
        };
        launchCamera(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                // setProcessing(false)
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                // setProcessing(false)
                console.log('ImagePicker Error: ', response.errorCode);
            } else if (response.errorMessage) {
                // setProcessing(false)
                console.log('User tapped custom button: ', response.errorMessage);
            } else {
                // setProcessing(true);
                setModalVisible(!modalVisible);

                const source = {
                    uri:
                        Platform.OS === 'android'
                            ? response.uri
                            : response.uri.replace('file://', ''),
                    fileName: response.fileName,
                    type: response.type,
                };
                setUserLogo(Platform.OS === 'android'
                ? response.uri
                : response.uri.replace('file://', ''))

                setSourceImg(source)


                // uploadPhoto(source, response => {

                //     if (response.data) {
                //         updateUser(User._id, { logo: response.data }, async response2 => {
                //             console.log(response2);
                //             if (response2.data) {
                //                 await AsyncStorage.setItem(
                //                     'User',
                //                     JSON.stringify(response2.data),
                //                 );
                //                 dispatch(SaveUser(response2.data));
                //                 setProcessing(false);

                //             }
                //         });
                //     } else {
                //         setProcessing(false);

                //     }
                // });

            }
        });

        // setModalVisible(!modalVisible);
    };

    const registerUser = async () => {
        setProcessing(true);
        let params = {
            // logo: response.data,
            fullnameAR: name,
            email: email,
            mobile: processNumber(mobile),
            countryID: countryID,
            cityID: cityID,
            password: password
        }

        if (sourceImg !== null) {
            console.log('1123131312312312313')
           await uploadPhoto(sourceImg, response => {
                if (response.data) {

                    setImgPath(response.data)
                    params.logo = response.data;
                    console.log('paramssssssssssss')
                    console.log(params);
            
                } 
            });
        }

        updateUser(User._id, params, async response2 => {
            console.log(response2);
            if (response2.data) {
                await AsyncStorage.setItem(
                    'User',
                    JSON.stringify(response2.data),
                );
                dispatch(SaveUser(response2.data));
                setProcessing(false);
                seteditSuccessV(true)
            }
        });


        // register(
        //     name,
        //     email,
        //     processNumber(mobile),
        //     countryID,
        //     cityID,
        //     password,
        //     async response => {
        //         setProcessing(false);
        //         if (response.data) {
        //             console.log('logggg111');
        //             const usr = response.data;
        //             await AsyncStorage.setItem('User', JSON.stringify(usr));
        //             dispatch(SaveUser(usr));
        //             setProcessing(false);
        //         } else {
        //             console.log('-----2-----');
        //             if (response.error.message == 'Request failed with status code 415') {
        //                 setemailusedV(!emailusedV);
        //             } else if (
        //                 response.error.message == 'Request failed with status code 416'
        //             ) {
        //                 setemobileusedV(!mobileusedV);
        //             }

        //             console.log(response.error.message, 'respoooooooonse');
        //         }
        //     },
        // );
    };
    const deleteAccountHandler = ()=> {
        if(inputText == ''){
            setOldPass(!oldPass);
            setcheckPassM(!setcheckPassM);
        }else if(inputText != password){
            setInputText('')
            setOldPassConfirm(!oldPassConfirm);
            setcheckPassM(!setcheckPassM);
        }else{
            deleteAccountFunc(User._id, async response2 => {
                if (response2.data) {
                    console.log(response2);
                    setcheckPassM(!setcheckPassM);
                    seteditSuccessV(true)
                    setTimeout(()=>{
                        seteditSuccessV(false)
                        dispatch(logOut());
                        navigation.navigate('Login');
                    },1500)
                }
            });
        }
    }

    const addInputHandler =(password)=>{
        setInputText(password)
        console.log(inputText)
    }

    const renderHeader = () => {
        return (
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign
                name="arrowright"
                color={'#FFF'}
                size={32}
                style={styles.flipRTL}
              />
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.headerTxt}>
              {t('Profile')}
            </Text>
            <View style={styles.headerIcon} />
          </View>
        );
      };
        
    return (
        <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}>
                {renderHeader()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                    contentContainerStyle={styles.scrollView}>
                    {/* <Text allowFontScaling={false} style={styles.loginTxt}>
                        {t('Edit Profile')}
                    </Text> */}
                    {/* <Text allowFontScaling={false} style={styles.addYourDataTxt}>
            {t('Add your data and start shopping.')}
          </Text> */}
                    <View style={styles.perssableView} >
                        <Pressable style={styles.perssableBtn} onPress={()=>setdeleteAccount(true)}>
                            <Text style={{fontFamily: 'Cairo-Regular',fontSize:16,color:'red'}}>احذف الحساب</Text>
                        </Pressable>
                    </View>

                    <TouchableOpacity
                        style={styles.btnStyle}
                        onPress={() => {
                            if (User) {
                                setModalVisible(true);
                            }
                        }}>
                        <View style={styles.centeredView}>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {

                                    setModalVisible(!modalVisible);
                                }}>
                                <View style={styles.centeredViewPhoto}>
                                    <View style={styles.modalView}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                pickImageFromCamera();
                                            }}>
                                            <Text style={styles.modalText}>{t('Takephoto')}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => {
                                                pickImageFromPhone();
                                            }}>
                                            <Text style={styles.modalText}>
                                                {t('ChooseFromLibrary')}
                                            </Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setModalVisible(!modalVisible)}>
                                            <Text
                                                style={{
                                                    marginBottom: 15,
                                                    textAlign: i18n.language == 'ar' ? 'right' : 'right',
                                                    fontSize: 16,
                                                    paddingTop: 10,
                                                    fontFamily: 'Cairo-Regular',

                                                }}>
                                                {t('Close')}{' '}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        <Image
                                source={
                                    User && User.logo
                                        ? { uri: userLogo }
                                        : require('./../../assets/images/usr.png')
                                }
                                style={styles.usrImage}
                            />
                        {/* <Image
                            source={
                                User && User.logo
                                    ? { uri: User.logo }
                                    : require('./../../assets/images/usr.png')
                            }
                            style={styles.usrImage}
                        /> */}
                    </TouchableOpacity>

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
                            placeholder={'+966 12-345-6789'}
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
                            defaultButtonText={
                                User.countryID ? User.countryID.titleAR : t('Country')

                            }

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
                            defaultButtonText={
                                User.cityID ? User.cityID.titleAR : t('City')
                            }
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

                    <ModalAlert
                        Title={t('Remind')}
                        TextBody={t('Please add password')}
                        onPress={() => {
                            setOldPass(!oldPass);
                        }}
                        Mvasible={oldPass}
                        CancleText={t('Cancel')}
                    />
                    <ModalAlert
                        Title={t('Remind')}
                        TextBody={t('Password and confirm password does not match')}
                        onPress={() => {
                            setOldPassConfirm(!oldPassConfirm);
                        }}
                        Mvasible={oldPassConfirm}
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

                    <ModalAlert2
                        Title={t('Remind')}
                        TextBody={t('Are you sure to delete your account')}
                        onPress={() => {
                            setdeleteAccount(!deleteAccount);
                        }}
                        onPress1={() => {
                            setdeleteAccount(!deleteAccount);
                            setcheckPassM(true)
                        }}
                        Mvasible={deleteAccount}
                        YesText={t('Yes')}
                        CancleText={t('No')}
                        />
                        <ModalAlert3
                            TextBody={t('please enter your password')}
                            onPress={() => {
                                setcheckPassM(!checkPassM);
                            }}
                            onPress1={deleteAccountHandler}
                            onAddInput={addInputHandler}
                            Mvasible={checkPassM}
                            YesText={t('Yes')}
                            CancleText={t('Cancel')}
                    />
                    <ModalAlert
                        TextBody={t('Edited successfully')}

                        onPress={() => {
                            seteditSuccessV(!editSuccessV);
                        }}
                        Mvasible={editSuccessV}

                        CancleText={t('Done')}
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
                                    {t('Edit')}
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
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 10,
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#202F3A',
      },
        keyboardAvoidingView: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollView: { flexGrow: 1, justifyContent: 'flex-start' },
    btnStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 25
    },
    loginTxt: {
        alignSelf: 'center',
        textAlign: 'left',
        fontSize: 22,
        color: '#707070',
        fontFamily: 'Cairo-Bold',
        width: '90%',
    },
    centeredViewPhoto: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
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
    flipRTL: { transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] },
    header: {
        flexDirection: 'row',
        width: '100%',
        height: 80,
        backgroundColor: '#202F3A',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      headerIcon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
      },
      headerTxt: {
        flex: 1,
        textAlign: 'left',
        fontSize: 22,
        marginHorizontal: 12,
        color: '#FFF',
        fontFamily: 'Cairo-Bold',
      },
            usrImage: {
        height: 120,
        width: 120,
        borderRadius: 60,
        resizeMode: 'cover',

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
        marginTop: 20,
        width: '80%',
        backgroundColor: '#F8B704',
        height: 46,
        borderRadius: 12,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    modalView: {
        margin: 0,
        backgroundColor: '#fff',
        borderRadius: 0,
        padding: 18,

        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        height: '23%',
        marginBottom: 100,
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
        color: '#B2B2B2',
    },
    modalText: {
        marginBottom: 20,
        // textAlign: "center",
        textAlign: I18nManager.isRTL ? 'left' : 'right',
        justifyContent: 'flex-start',
        fontSize: 18,
        paddingTop: 0,
        alignItems: 'flex-end',
        fontFamily: 'Cairo-Regular',

      },
    perssableBtn:{
        padding:10,
    },
    perssableView:{
        marginTop:5,
        marginHorizontal:5,
        flexDirection:'row',
        justifyContent:'flex-end'}
});
