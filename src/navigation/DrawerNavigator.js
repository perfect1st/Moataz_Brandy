import React, { useEffect, useState } from 'react';
import { DrawerItem } from '@react-navigation/drawer';
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text,
  I18nManager,
  Linking,
  Alert,
  Platform,
  Modal,
  Pressable,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Switch } from 'native-base';

import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { logOut, SaveUser } from './../redux/actions';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import { updateUser, uploadPhoto } from './../services/APIs';
import Share from 'react-native-share';
import files from '../file/fileBase64';
import ModalAlert2 from '../components/ModalAlert/ModalAlert2';

export default DrawerNavigator = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [langVisible, setlanVisible] = useState(false);


  const User = useSelector(state => state.AuthReducer.User);

  const [notifStatus, setNotifStatus] = useState(User == null || User.notifyMe  == 1? true : false);

  const dispatch = useDispatch();

  const showAlert = () => {
    setlanVisible(!langVisible);
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
        const source = {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          fileName: response.fileName,
          type: response.type,
        };
        uploadPhoto(source, response => {
          if (response.data) {
            updateUser(User._id, { logo: response.data }, async response2 => {
              console.log(response2);
              if (response2.data) {
                await AsyncStorage.setItem(
                  'User',
                  JSON.stringify(response2.data),
                );
                dispatch(SaveUser(response2.data));
              }
            });
          } else {
          }
        });
      }
    });

    setModalVisible(!modalVisible);
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
        const source = {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          fileName: response.fileName,
          type: response.type,
        };

        uploadPhoto(source, response => {
          if (response.data) {
            updateUser(User._id, { logo: response.data }, async response2 => {
              console.log(response2);
              if (response2.data) {
                await AsyncStorage.setItem(
                  'User',
                  JSON.stringify(response2.data),
                );
                dispatch(SaveUser(response2.data));
              }
            });
          } else {
          }
        });
      }
    });

    setModalVisible(!modalVisible);
  };

  const changeLanguage = async () => {
    if (i18n.language == 'ar') {
      await AsyncStorage.setItem('Language', 'en');
      I18nManager.forceRTL(false); // force disallow rtl
      I18nManager.allowRTL(false); // force disable rtl
      RNRestart.Restart(); // restart
    } else {
      await AsyncStorage.setItem('Language', 'ar');
      I18nManager.allowRTL(true); // force allow rtl
      I18nManager.forceRTL(true); // force rtl
      RNRestart.Restart(); // restart
    }
  };

  const changeNotifStatus = async status => {
    console.log('___________')
    console.log(status)
    let notifyValue = User.notifyMe
    if(status == true){
      notifyValue = 1
    }else{
      notifyValue = 2
    }
    console.log('_________________')
    console.log(notifyValue)
    updateUser(User._id, {notifyMe:notifyValue}, async response2 => {
      console.log(response2);
      if (response2.data) {
          await AsyncStorage.setItem(
              'User',
              JSON.stringify(response2.data),
          );
          dispatch(SaveUser(response2.data));
          setNotifStatus(status);
      }
  });

    
    // let fcmToken = await AsyncStorage.getItem('fcmToken');
    // postUserDeviceInfo(DeviceInfo.getUniqueId(), fcmToken, status, async (response) => {
    //     if (response.data) {
    //         await AsyncStorage.setItem('notifStatus', JSON.stringify(status));
    //     }
    // })
  };

  const share = async () => {
    const shareOptions = {
      message:
        'تطبيق براندي \n رابط التطبيق علي جوجل بلاي : https://play.google.com/store/apps/details?id=com.perfect.brandy \n رابط التطبيق علي ابل ستور : https://apps.apple.com/eg/app/brandy-%D8%A8%D8%B1%D8%A7%D9%86%D8%AF%D9%89/id1576103766',
      url: files.logo,
      // urls: [files.image1, files.image2]
    };

    try {
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const shareshare = async () => {
    try {
      const result = await Share.share({
        message:
          'تطبيق براندي \n رابط التطبيق علي جوجل بلاي : https://play.google.com/store/apps/details?id=com.perfect.brandy \n رابط التطبيق علي ابل ستور : https://apps.apple.com/eg/app/brandy-%D8%A8%D8%B1%D8%A7%D9%86%D8%AF%D9%89/id1576103766',
        url:
          'https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fimages%2Fsearch%2Fsea%2F&psig=AOvVaw2CLYVhfLCAXqZ70b1ALwVM&ust=1627474085024000&source=images&cd=vfe&ved=0CAgQjRxqFwoTCPDpjMibg_ICFQAAAAAdAAAAABAO',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderIcon = source => {
    return <Image source={source} style={styles.itemIcon} />;
  };

  const renderLabel = label => {
    return (
      <Text allowFontScaling={false} numberOfLines={1} style={styles.itemLabel}>
        {label}
      </Text>
    );
  };

  return (
    <View style={styles.viewContainer}>
      <View style={styles.viewHeader}>
        <TouchableOpacity
          onPress={() => {
            if (User) {
              navigation.navigate('Profile');
            }
          }}>
          <ModalAlert2
            Title=""
            TextBody={t('Are you sure you want to change language')}
            onPress={() => {
              setlanVisible(!langVisible);
            }}
            onPress1={() => {
              changeLanguage();
            }}
            Mvasible={langVisible}
            YesText={t('Yes')}
            CancleText={t('No')}
          />
          {/* <View style={styles.centeredView}>
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
                      }}>
                      {t('Close')}{' '}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View> */}

          <Image
            source={
              User && User.logo
                ? { uri: User.logo }
                : require('./../assets/images/usr.png')
            }
            style={styles.usrImage}
          />
        </TouchableOpacity>
        <Text allowFontScaling={false} numberOfLines={1} style={styles.usrName}>
          {User ? User.fullnameAR : ''}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('Profile');
            }}>
            {renderIcon(require('./../assets/images/menu8.png'))}
            {renderLabel(t('Edit Profile'))}
          </TouchableOpacity>
        )}



        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('AddAdvertiseStack');
              // navigation.navigate('AddAdvertiseStack', {
              //   screen: 'AddAdvData',
              // });
            }}>
            {renderIcon(require('./../assets/images/menu1.png'))}
            {renderLabel(t('Add your ad'))}
          </TouchableOpacity>
        )}
        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('MyAdvs', {
                id: User._id,
              });
            }}>
            {renderIcon(require('./../assets/images/menu2.png'))}
            {renderLabel(t('My ads'))}
          </TouchableOpacity>
        )}
        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('CommissionPayment');
            }}>
            {renderIcon(require('./../assets/images/menu3.png'))}
            {renderLabel(t('Commission payment'))}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemStyle}
          onPress={() => {
            if (Platform.OS == 'android') {
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.perfect.brandy',
              );
            } else {
              Linking.openURL(
                'https://apps.apple.com/eg/app/brandy-%D8%A8%D8%B1%D8%A7%D9%86%D8%AF%D9%89/id1576103766',
              );
            }
          }}>
          {renderIcon(require('./../assets/images/menu4.png'))}
          {renderLabel(t('Rate app'))}
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemStyle}
          onPress={() => {
            navigation.navigate('TermsAndConditions');
          }}>
          {renderIcon(require('./../assets/images/menu5.png'))}
          {renderLabel(t('Terms and conditions'))}
        </TouchableOpacity>

        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('ContactUs');
            }}>
            {renderIcon(require('./../assets/images/menu6.png'))}
            {renderLabel(t('Contact us'))}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemStyle}
          onPress={() => {
            navigation.navigate('AboutUs');
          }}>
          {renderIcon(require('./../assets/images/menu7.png'))}
          {renderLabel(t('About us'))}
        </TouchableOpacity>
        {User && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('ComplaintsAndSuggestions', {
                productOrder: null,
              });
            }}>
            {renderIcon(require('./../assets/images/menu8.png'))}
            {renderLabel(t('Complaints and suggestions'))}
          </TouchableOpacity>
        )}
        {User && (
          <TouchableOpacity activeOpacity={1} style={styles.itemStyle}>
            {renderIcon(require('./../assets/images/menu9.png'))}
            {renderLabel(t('Notifications'))}
            <Switch
              value={notifStatus}
              onValueChange={value => changeNotifStatus(value)}
              style={{ alignSelf: 'flex-end', color: '#202F3A' }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemStyle}
          onPress={() => {
            showAlert();
          }}>
          {renderIcon(require('./../assets/images/menu10.png'))}
          {renderLabel(t('Language'))}
          <Text style={styles.language}>
            {i18n.language == 'en' ? 'العربية' : 'English'}
          </Text>
          <Image
            style={styles.languageFlag}
            source={
              i18n.language == 'en'
                ? require('./../assets/images/arabic.jpeg')
                : require('./../assets/images/english.jpg')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.itemStyle}
          onPress={() => {
            share();
          }}>
          {renderIcon(require('./../assets/images/menu11.png'))}
          {renderLabel(t('Share app'))}
        </TouchableOpacity>
        {User ? (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              dispatch(logOut());
            }}>
            {renderIcon(require('./../assets/images/menu12.png'))}
            {renderLabel(t('Logout'))}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.itemStyle}
            onPress={() => {
              navigation.navigate('Login');
            }}>
            {renderIcon(require('./../assets/images/menu13.png'))}
            {renderLabel(t('Login'))}
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer: { flex: 1, width: '100%', backgroundColor: '#FFF' },
  viewHeader: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    width: '100%',
    backgroundColor: '#202F3A',
    justifyContent: 'center',
    alignItems: 'center',

  },
  usrImage: {
    height: 100,
    width: 100,
    borderRadius: 50,
    resizeMode: 'cover',

  },
  usrName: {
    width: '100%',
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    marginTop: 5,
  },
  scrollView: { flexGrow: 1, alignItems: 'center', paddingBottom: 22 },
  itemStyle: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  itemLabel: {
    flex: 1,
    color: '#202F3A',
    fontSize: 14,
    textAlign: 'left',
    fontFamily: 'Cairo-Bold',
    paddingHorizontal: 12,
  },
  language: {
    color: '#202F3A',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
  },
  languageFlag: {
    width: 50,
    height: 30,
    resizeMode: 'cover',
    marginLeft: 8,
    borderRadius: 8,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    // textAlign: "center",
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    justifyContent: 'flex-start',
    fontSize: 18,
    paddingTop: 0,
    alignItems: 'flex-end',
  },
});
