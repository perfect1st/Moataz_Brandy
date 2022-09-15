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
import { useTranslation } from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fileExtensions from '../../components/file-extension-to-mime-types.json';

import { getTerms } from './../../services/APIs';



const TermsAndConditions = ({ navigation }) => {
  const { t, i18n } = useTranslation();

  const [Processing, setProcessing] = useState(false);
  const [Terms, setTerms] = useState(false);
  const favs = [1, 2, 3, 4, 5];
  const [lang, setLang] = useState(i18n.language)

  useEffect(() => {
    getTerms(response => {
      if (lang == "en") {
        setTerms(response.data.titleEN)
      }
      else {
        setTerms(response.data.titleAR)
      }
    });
  }, []);


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
          {t('Terms and conditions')}
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
          <Text allowFontScaling={false} style={styles.txt}>
            {Terms}
          </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TermsAndConditions;

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
  flipRTL: { transform: [{ scaleX: I18nManager.isRTL ? 1 : -1 }] },
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
  txt: {
    width: '90%',
    alignSelf: 'center',
    fontFamily:  'Cairo-Bold',
    textAlign: 'left',
    color: '#202F3A',
  },
});

const loremIpsum = `
لوريم إيبسوم(Lorem Ipsum) هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من نص، لتكوّن كتيّب بمثابة دليل أو مرجع شكلي لهذه الأحرف. خمسة قرون من الزمن لم تقضي على هذا النص، بل انه حتى صار مستخدماً وبشكله الأصلي في الطباعة والتنضيد الإلكتروني. انتشر بشكل كبير في ستينيّات هذا القرن مع إصدار رقائق "ليتراسيت" (Letraset) البلاستيكية تحوي مقاطع من هذا النص، وعاد لينتشر مرة أخرى مؤخراَ مع ظهور برامج النشر الإلكتروني مثل "ألدوس بايج مايكر" (Aldus PageMaker) والتي حوت أيضاً على نسخ من نص لوريم إيبسوم.
`;
