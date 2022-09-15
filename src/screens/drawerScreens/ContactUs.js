import React, {useState,useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  TextInput,
  Animated,
  Platform,
  Image,
  Text,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Input} from 'native-base';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fileExtensions from '../../components/file-extension-to-mime-types.json';
import {useDispatch, useSelector} from 'react-redux';
import {addContactUs,getSettings} from './../../services/APIs';
import Textarea from 'react-native-textarea';
import ModalAlert from '../../components/ModalAlert/ModalAlert';

const AddAdvData = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const [Processing, setProcessing] = useState(false);
  const User = useSelector(state => state.AuthReducer.User);
  const [msg, setMsg] = useState(null);
  const [errorv, seterrorv] = useState(false);
  const [loginv, setloginv] = useState(false);
  const [successv, setsuccessv] = useState(false);
  const [wtsappNumber, setwtsappNumber] = useState('');
  const [email, setemail] = useState('');

  useEffect(() => {
    getSettings(async respone =>{
      if(respone && respone.data){
        setwtsappNumber(respone.data[4].value)
        setemail(respone.data[3].value)
      }
    })
  }, [])

  const number = '+966548754875';

  const contactUs = () => {
    if (User) {
      if (!msg) {
        seterrorv(!errorv);
      } else {
        setProcessing(true);
        addContactUs(msg, User._id, async response => {
          setProcessing(false);
          // navigation.navigate('HomeStack');
          setsuccessv(!successv)
          setMsg('')
        });
      }
    } else {
      setloginv(!loginv);
    }
  };

  const callNumber = () => {
    Linking.openURL(`whatsapp://send?phone=${wtsappNumber}`);
  };
  const sendEmail = () => {
    Linking.openURL(`mailto:${email}`)
  };

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
          {t('Contact us')}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <View style={styles.container}>
        {renderHeader()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <Image
            source={require('./../../assets/images/logo2.png')}
            style={styles.logo}
          />
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Contact us through')}
          </Text>
          <TouchableOpacity onPress={callNumber}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={styles.number}>
              <FontAwesome name={'whatsapp'} color={'#D6A230'} size={22} /> {wtsappNumber}{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendEmail}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={styles.number}>
              <FontAwesome name={'send'} color={'#D6A230'} size={22} /> {email}{' '}
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={() => {
              callNumber();
            }}
            style={styles.loginBtn}
            >
            {Processing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text allowFontScaling={false} style={styles.loginBtnTxt}>
                {t('Call')}
              </Text>
            )}
          </TouchableOpacity> */}
          <ModalAlert
            Title={''}
            TextBody={t('Please Add Message')}
            onPress={() => {
              seterrorv(!errorv);
            }}
            Mvasible={errorv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Login first')}
            onPress={() => {
              setloginv(!loginv);
            }}
            Mvasible={loginv}
            CancleText={t('Cancel')}
          />
            <ModalAlert
            Title={t('Send')}
            TextBody={t('msgs sent success')}
            onPress={() => {
              setsuccessv(!successv)
            }}
            Mvasible={successv}
            CancleText={t('Done')}
          />
          <View style={styles.hr} />
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Or send a text message')}
          </Text>
          <View style={styles.borderedField}>
          <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textarea}
              onChangeText={text => {
                setMsg(text);
              }}
              textAlign={styles.textInputAlign.textAlign}
              value={msg}
              placeholderStyle={styles.textboxfieldd}
              placeholderTextColor={'#707070'}
              underlineColorAndroid={'transparent'}
              editable={!Processing}
              returnKeyType={'done'}
              placeholder={t('Write your message here')}
            />
            {/* <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setMsg(text);
              }}
              value={msg}
              placeholder={t('Write your message here')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              multiline={true}
            /> */}
          </View>
          <TouchableOpacity
            onPress={() => {
              if (!Processing) {
                contactUs();
              }
            }}
            style={styles.loginBtn}>
            {Processing ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text allowFontScaling={false} style={styles.loginBtnTxt}>
                {t('Send')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddAdvData;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: '#202F3A',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFF',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 22,
    paddingTop: 12,
  },
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
  textboxfieldd :{
    fontFamily: 'Cairo-Bold',

  },
  headerTxt: {
    flex: 1,
    textAlign: 'left',
    fontSize: 22,
    marginHorizontal: 12,
    color: '#FFF',
    fontFamily: 'Cairo-Bold',
  },
  flipRTL: {transform: [{scaleX: I18nManager.isRTL ? 1 : -1}]},
  fullRow: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: width * 0.2,
    height: width * 0.2 * 1.7,
    resizeMode: 'contain',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#202F3A',
  },
  number: {
    color: '#202F3A',
    fontSize: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    textAlign: 'center',
  },
  loginBtn: {
    width: '40%',
    backgroundColor: '#F8B704',
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 18,
    alignSelf: 'center',
  },
  loginBtnTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
  },

  hr: {
    width: '90%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 22,
  },
  textInputAlign: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    fontFamily: 'Cairo-Bold',
    color:'#707070'
    },
  borderedField: {
    width: '70%',
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
  },
   textarea: {
    textAlignVertical: 'top', // hack android
    height: 170,
    fontFamily: 'Cairo-Bold',
    fontSize: 14,
    color: '#333',
  },
  textInput: {
    borderRadius: 12,
    marginHorizontal: 8,
    height: 120,
    paddingHorizontal: 14,
    textAlignVertical: 'top', // hack android
    height: 170,
    fontSize: 14,
    color: '#333',
  },
});
