import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  FlatList,
  Animated,
  Platform,
  Image,
  Text,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Input } from 'native-base';
import { useSelector, useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {getSettings} from './../../services/APIs';

import fileExtensions from '../../components/file-extension-to-mime-types.json';

const AddAdv = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);

  const [Processing, setProcessing] = useState(false);

  const [agreeT1, setAgreeT1] = useState(0);
  const [agreeT2, setAgreeT2] = useState(0);
  const [firstCond, setfirstCond] = useState({});
  const [secondCond, setsecondCond] = useState({});

  
  useEffect(() => {
    if (!User) {
      navigation.navigate('Login');
    }
    getSettings(async respone =>{
      if(respone && respone.data){
        setfirstCond({
          ar : respone.data[5].value,
          en : respone.data[6].value
        })
        setsecondCond({
          ar : respone.data[7].value,
          en : respone.data[8].value
        })

      }
    })
  }, []);
  
  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <MaterialIcons name="menu" color={'#FFF'} size={30}  style={{marginTop:4}}/>
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.headerTxt}>
          {t('Terms of adding an ad')}
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
        {!User ? (
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Login first')}
          </Text>
        ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}>
              <Text allowFontScaling={false} style={styles.ayaStart}>
                {'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ'}
              </Text>
              <Text allowFontScaling={false} style={[styles.text, {textAlign: 'center'}]}
              >
                {
                  'وَأَوْفُوا بِعَهْدِ اللَّهِ إِذَا عَاهَدتُّمْ وَلَا تَنقُضُوا الْأَيْمَانَ بَعْدَ تَوْكِيدِهَا وَقَدْ جَعَلْتُمُ اللَّهَ عَلَيْكُمْ كَفِيلًا ۚ إِنَّ اللَّهَ يَعْلَمُ مَا تَفْعَلُونَ'
                }
              </Text>
              <View style={styles.hr} />
              <Text allowFontScaling={false} style={styles.text}>
                {i18n.language == 'ar' ? firstCond.ar : firstCond.en}
              </Text>
              <View style={styles.fullRow}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setAgreeT1(1);
                  }}
                  style={[styles.agreedBtn, agreeT1 == 1 && styles.selectedBtn]}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={false}
                    style={[
                      styles.disagreeBtnTxt,
                      agreeT1 == 1 && styles.agreedBtnTxt,
                    ]}>
                    {t('Agree')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setAgreeT1(0);
                  }}
                  style={[
                    styles.disagreeBtn,
                    agreeT1 == 0 && styles.selectedBtn,
                  ]}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={false}
                    style={[
                      styles.disagreeBtnTxt,
                      agreeT1 == 0 && styles.agreedBtnTxt,
                    ]}>
                    {t('Disagree')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.hr} />
              <Text allowFontScaling={false} style={styles.text}>
                {i18n.language == 'ar' ? secondCond.ar : secondCond.en}
              </Text>
              <View style={styles.fullRow}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setAgreeT2(1);
                  }}
                  style={[styles.agreedBtn, agreeT2 == 1 && styles.selectedBtn]}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={false}
                    style={[
                      styles.disagreeBtnTxt,
                      agreeT2 == 1 && styles.agreedBtnTxt,
                    ]}>
                    {t('Agree')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setAgreeT2(0);
                  }}
                  style={[
                    styles.disagreeBtn,
                    agreeT2 == 0 && styles.selectedBtn,
                  ]}>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    allowFontScaling={false}
                    style={[
                      styles.disagreeBtnTxt,
                      agreeT2 == 0 && styles.agreedBtnTxt,
                    ]}>
                    {t('Disagree')}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (agreeT1 == 1 && agreeT2 == 1) {
                    navigation.navigate('AddAdvData');
                  }


                }}
                style={[
                  styles.continueBtn,
                  agreeT1 == 1 && agreeT2 == 1 && { backgroundColor: '#F8B704' },
                ]}>
                <Text
                  numberOfLines={1}
                  adjustsFontSizeToFit={true}
                  allowFontScaling={false}
                  style={[
                    styles.continueBtnTxt,
                    agreeT1 == 1 && agreeT2 == 1 && { color: '#FFF' },
                  ]}>
                  {t('Continue')}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}
      </View>
    </SafeAreaView>
  );
};

export default AddAdv;

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
    paddingBottom: 10,
    paddingTop: 8,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: 70,
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
    fontSize: 20,
    marginHorizontal: 10,
    color: '#FFF',
    fontFamily: 'Cairo-Regular',
  },
  ayaStart: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom:4
  },
  text: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 18,
    fontSize: 14,
    marginTop: 0,
    color: '#202F3A',
  },
  hr: {
    width: '90%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  fullRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    justifyContent: 'center',
  },
  disagreeBtn: {
    paddingVertical: 4,
    backgroundColor: '#EEEEEE',
    width: '36%',
    zIndex: 0,
    borderRadius: 12,
    marginLeft: -10,
    paddingHorizontal: 14,
  },
  agreedBtn: {
    paddingVertical: 4,
    backgroundColor: '#EEEEEE',
    width: '36%',
    zIndex: 0,
    borderRadius: 12,
    marginRight: -10,
    paddingHorizontal: 14,
  },
  selectedBtn: {
    backgroundColor: '#202F3A',
    zIndex: 1,
  },
  disagreeBtnTxt: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#202F3A',
  },
  agreedBtnTxt: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#FFF',
  },
  continueBtn: {
    backgroundColor: '#EEEEEE',
    width: '80%',
    marginTop: 16,
    marginBottom: 22,
    alignSelf: 'center',
    paddingVertical: 10,
    borderRadius: 14,
  },
  continueBtnTxt: {
    width: '100%',
    textAlign: 'center',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 18,
    fontSize: 14,
    color: '#202F3A',
  },
  title: {
    width: '100%',
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    marginTop: 18,
  },
});

const firstCondition = {
  ar: `أتعهد وأقسم بالله أنا المعلن أن ادفع عمولة الموقع وهي 5% من قيمة السلعة في حالة بيعها عن طريق الموقع أو بسبب الموقع وأن هذه العموله هي أمانه في ذمتي. ملاحظة : عمولة الموقع هي علي المعلن ولا تبرأ ذمة المعلن من العمولة الا في حال دفعها ذمة المعلن لا تبرأ من العمولة بمجرد ذكر أن العمولة على المشتري في الاعلان`,
  en: `I pledge and swear to Allah that I am the advertiser to pay the commission of the site which is 5% of the value of the item if it is sold through the site or because of the site and that this activity is a safety in my community. Note: The
commission of the site is on the advertiser and does not absolve the advertiser of the commission unless it is paid by the advertiser, which does not absolve the commission once it is mentioned that the commission is on the buyer in the ad.`,
};

const secondCondition = {
  ar: `أتعهد أنا المعلن أن جميع المعلومات التي أذكرها بالاعلان  صحيحة وفي القسم الصحيح واتعهد ان الصور التي سوف يتم عرضها هي صور حديثة لنفس السلعة وليست لسبعة أخري مشابهة أتعهد أنا المعلن ان اقوم بدفع العمولة خلال أقل من 10 ايام من تاريخ استلام كامل سعر السلعة`,
  en: `I pledge that all the information I mention in the announcement is correct and in the correct section and I pledge that the images that will be displayed are recent images of the same item and not for seven other similar i pledge that I will pay the commission within 10 days of receipt of the full price of the item`,
};
