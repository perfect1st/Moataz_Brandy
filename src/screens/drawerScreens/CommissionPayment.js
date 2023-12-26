import React, {useState, useEffect} from 'react';
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
} from 'react-native';
const {width, height} = Dimensions.get('window');
import ModalAlert from '../../components/ModalAlert/ModalAlert';

import {useTranslation} from 'react-i18next';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import fileExtensions from '../../components/file-extension-to-mime-types.json';
import {showMessage} from 'react-native-flash-message';

import {config} from './../../services/URWAY/config';
import {Alert} from 'react-native';

import {getBankTransferVat} from './../../services/APIs';

const AddAdvData = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const [Processing, setProcessing] = useState(false);

  const [allAmount, setAllAmount] = useState('');

  const [trackId, setTrackId] = useState(false);
  const [amount, setAmount] = useState('');

  const [errorv, seterrorv] = useState(false);
  const [amountv, setamountv] = useState(false);

  const [vat, setVat] = useState(null);
  const [bankTransfers, setBankTransfers] = useState([]);

  useEffect(() => {
    setRandomOrder();
    getBankTransferVat(response => {
      if (response.data) {
        setVat(response.data.vat.value);
        setBankTransfers(response.data.bankTransfer);
      }
    });
  }, []);


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
      for (var i = 0;i < 10;i++) {
        str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
      }
    }
    return str;
  };

  const setRandomOrder = () => {
    let mask = '0123456789';
    let result = '';
    for (let i = 10; i > 0; --i) {
      result += mask[Math.floor(Math.random() * mask.length)];
      if (i == 1) {
        setTrackId(result);
      }
    }
  };

  const calculate = () => {
    if (allAmount) {
      if (vat) {
        const allamount = parseFloat(allAmount).toFixed(2);
        const appVat = parseFloat(appVat).toFixed(2);
        setAmount(((allamount * vat) / 100).toFixed(2).toString());
      } else {
        seterrorv(!errorv);
      }
    } else {
     
      setamountv(!amountv);
    }
  };

  const payNow = () => {
    if(amount == '') return setamountv(true) 
    const obj = {
      country: 'IN',
      first_name: 'Adel',
      last_name: 'ElGohary',
      address: '101 ABC Street',
      city: '5f9001920679700692778370',
      state: 'West Bengal',
      zip: '11564',
      phone_number: '54654654654',
      customerEmail: 'adel.elgo@test.com',
      udf2: config.responseUrl,
      udf3: 'en',
      trackid: trackId,
      tranid: '',
      amount: amount,
      currency: 'SAR',
      action: 1,
      tokenOperation: 'A',
      cardToken: '',
      maskCardNum: '',
      tokenizationType: 0,
    };
    navigation.navigate('Payment', {
      request: obj,
      callBack: onProcessPayment,
    });
  };

  const onProcessPayment = responseData => {
    if (responseData.status == 'success') {
      navigation.navigate('Response', {
        response: responseData.data,
      });
    } else {
      showMessage({message: responseData.error, type: 'danger'});
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
          {t('Commission payment')}
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
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Enter value here mo')}
          </Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                // processNumber(allAmount);
                setAllAmount(processNumber(text));
              }}
              value={allAmount}
              keyboardType={'numeric'}
              placeholder={t('')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
            />
             <ModalAlert
            Title={''}
            TextBody={t('Enter amount first')}
            onPress={() => {
              setamountv(!amountv);
            }}
            Mvasible={amountv}
            CancleText={t('Done')}
          />
           <ModalAlert
            Title={''}
            TextBody={t('Something went wrong')}
            onPress={() => {
              seterrorv(!errorv);
            }}
            Mvasible={errorv}
            CancleText={t('Cancel')}
          />
            <TouchableOpacity
              onPress={() => calculate()}
              style={styles.sendBtn}>
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={styles.sendBtnTxt}>
                {t('Calculator')}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textInputContainer}>
            <Text
              numberOfLines={1}
              allowFontScaling={false}
              style={styles.priceTxt}>
              {t('Price')}
            </Text>
            <View style={styles.calculatedSize}>
              <Text
                numberOfLines={1}
                allowFontScaling={false}
                style={styles.calculatedTxt}>
                {amount}
              </Text>
            </View>
          </View>
          <View style={styles.hr} />
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Site commission transfer only')}
          </Text>
          <View style={styles.paymentMethodsContainer}>
            <TouchableOpacity
              // onPress={() => payNow()}
              style={[styles.paymentMethod, styles.selectedPayment]}>
              <Image
                source={require('./../../assets/images/payment1.png')}
                style={styles.paymentMethodImg}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => payNow()}
              style={styles.paymentMethod}>
              <Image
                source={require('./../../assets/images/allPay.png')}
                style={styles.paymentMethodImg}
              />
            </TouchableOpacity>
          </View>

          {bankTransfers.map((item, index) => {
            return (
              <View key={index.toString()} style={styles.item}>
                <Image source={{uri: item.logo}} style={styles.itemImage} />
                <View style={styles.itemCol}>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxt}>
                    {item.bankName}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxtSec}>
                    {t('Account name')} {' : '} {item.accountName}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxtSec}>
                    {t('Account number')} {' : '} {item.accountNumber}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxtSec}>
                    {t('IBAN number')} {' : '} {item.ibanNumber}
                  </Text>
                </View>
              </View>
            );
          })}
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
  title: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    paddingHorizontal: 16,
    color: '#202F3A',
  },
  textInputContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    marginTop: 14,
  },
  textInput: {
    flex: 1,
    height: '100%',
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    fontFamily:'Cairo'
  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  sendBtn: {
    height: 40,
    backgroundColor: '#D6A230',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  sendBtnTxt: {
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#FFF',
  },
  hr: {
    width: '90%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 16,
  },
  calculatedSize: {
    flex: 1,
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 8,
    marginLeft: 12,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calculatedTxt: {
    width: '100%',
    textAlign: 'center',
    fontFamily:  'Cairo-Bold',
    fontSize: 16,
    color: '#B2B2B2',
  },
  priceTxt: {
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    fontSize: 16,
    color: '#202F3A',
  },
  paymentMethodsContainer: {
    width: '90%',
    paddingVertical: 18,
    flexDirection: 'row',
  },
  paymentMethod: {
    flex: 1,
    height: 100,
    backgroundColor: '#EEEEEE',
    marginHorizontal: 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems:'center'
  },
  paymentMethodImg: {
    height: '100%',
    width: '60%',
    // alignSelf: 'stretch',
    resizeMode:'stretch'
  },
  selectedPayment: {
    backgroundColor: '#1473E6',
  },

  item: {
    width: '90%',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#EEEEEE',
  },
  itemCol: {
    flex: 1,
    paddingHorizontal: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
  },
  itemTxt: {
    width: '100%',
    textAlign: 'left',
    fontSize: 16,
    color: '#000',
    fontFamily: 'Cairo-Bold',
  },
  itemTxtSec: {
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    color: '#202F3A',
    fontFamily: 'Cairo-Regular',
  },
});