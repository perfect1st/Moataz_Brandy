import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {useDispatch, useSelector} from 'react-redux';
import {setSort} from '../../redux/actions';
import {useTranslation} from 'react-i18next';

import AntDesign from 'react-native-vector-icons/AntDesign';

const Sort = ({navigation}) => {
  const {t, i18n} = useTranslation();

  const SortBy = useSelector(state => state.SortAndFilterReducer.SortBy);
  const dispatch = useDispatch();

  /*
  Sort : 
  1-> most recent
  2-> most watched
  3-> least watched
  4-> highest price
  5-> lowest price
*/

  // useEffect(() => {

  // }, [SortBy]);

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
          {t('Sort')}
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
          {/* <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(0));
              }}>
              {SortBy == 0 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('Defualt')}
            </Text>
          </View> */}
          <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(1));
              }}>
              {SortBy == 1 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('The most recent')}
            </Text>
          </View>
          {/* <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(2));
              }}>
              {SortBy == 2 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('Most watched')}
            </Text>
          </View>
          <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(3));
              }}>
              {SortBy == 3 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('Least watched')}
            </Text>
          </View> */}
          <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(4));
              }}>
              {SortBy == 4 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('Highst price')}
            </Text>
          </View>
          <View style={styles.fullRow}>
            <TouchableOpacity
              style={styles.radioCirle}
              onPress={() => {
                dispatch(setSort(5));
              }}>
              {SortBy == 5 && <View style={styles.radioSelected} />}
            </TouchableOpacity>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.label2}>
              {t('Lowest price')}
            </Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            justifyContent: 'center',
            height: 50,
            width: width / 2,
            marginHorizontal: 20,
            backgroundColor: '#D6A230',
            borderRadius: 12,
            alignSelf: 'center',
            marginBottom: 50,
          }}>
          <Text style={{alignSelf: 'center', color: '#fff', fontSize: 18}}>
            {' '}
            {t('Done')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Sort;

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
  radioCirle: {
    width: 18,
    height: 18,
    borderRadius: 18 / 2,
    borderWidth: 2,
    borderColor: '#202F3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: '#202F3A',
  },
  label2: {
    textAlign: 'left',
    fontSize: 14,
    paddingHorizontal: 8,
    fontFamily: 'Cairo-Bold',
    color: '#202F3A',
    flex: 1,
  },
});
