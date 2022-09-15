import React, {useState} from 'react';
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
  Alert,
  ActivityIndicator,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Input} from 'native-base';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fileExtensions from '../../components/file-extension-to-mime-types.json';
import {complaintsAndSuggestions} from './../../services/APIs';
import {useDispatch, useSelector} from 'react-redux';
import Textarea from 'react-native-textarea';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
const AddAdvData = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const productOrder = route.params.productOrder;

  const [Processing, setProcessing] = useState(false);
  const User = useSelector(state => state.AuthReducer.User);
  const [msg, setMsg] = useState(null);
   const [errorv, seterrorv] = useState(false);
   const [successv, setsuccessv] = useState(false);

  const complaints = () => {
    if (!msg) {
      seterrorv(!errorv);
    } else {
      setProcessing(true);
      var type = 3;
      var newMsg = productOrder ? 'رقم الاعلان : ' + productOrder.toString() + '\n' + msg : msg;
      complaintsAndSuggestions(newMsg, User._id, type, async response => {
        setProcessing(false);
        setsuccessv(!successv)
        setMsg('')
        productOrder ? navigation.goBack() : navigation.navigate('HomeStack');
      });
    }
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
          {t('Complaints and suggestions')}
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
          <Text numberOfLines={2} allowFontScaling={false} style={styles.title}>
            {t('We are glad to know your suggestion or complaint')}
          </Text>
          {productOrder && <Text>{'#' + productOrder}</Text>}
          <View style={styles.borderedField}>
          <Textarea
              containerStyle={styles.textareaContainer}
              style={styles.textInput}
              onChangeText={text => {
                setMsg(text);
              }}
              textAlign={styles.textInputAlign.textAlign}
              value={msg}
              multiline={true}
              placeholder={t('Write here')}
              placeholderTextColor={'#707070'}
              underlineColorAndroid={'transparent'}
              editable={!Processing}
              returnKeyType={'done'}
            />
           
          </View>
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
            Title={t('Send')}
            TextBody={t('msgs sent success')}
            onPress={() => {
              setsuccessv(!successv)
            }}
            Mvasible={successv}
            CancleText={t('Done')}
          />
          <TouchableOpacity
            onPress={() => {
              if (!Processing) {
                complaints();
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
  loginBtn: {
    width: '40%',
    backgroundColor: '#F8B704',
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: '15%',
    alignSelf: 'center',
  },
  loginBtnTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
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
    fontFamily: 'Cairo-Bold',

  },
  textInputAlign: {
    textAlign: I18nManager.isRTL ? 'right' : 'left'
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
  
});
