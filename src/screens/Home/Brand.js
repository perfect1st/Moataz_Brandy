import React, {useState, useRef, useEffect} from 'react';
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
const {width, height} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';
import {useTranslation} from 'react-i18next';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {setBrands,setCity,setCountry} from '../../redux/actions';

import {
  getCountriesAndCities,
  getBrandsByCategory,
} from './../../services/APIs';
import axios from 'axios';
axios.defaults.timeout = 10000;
import {useDispatch, useSelector} from 'react-redux';

const Brand = ({navigation, route}) => {
  const {t, i18n} = useTranslation();

  const Brands = useSelector(state => state.SortAndFilterReducer.Brands);
  const city = useSelector(state => state.SortAndFilterReducer.City);
  const Country = useSelector(state => state.SortAndFilterReducer.Country);

  const dispatch = useDispatch();

  const category = route.params.category;

  const [countryID, setCountryID] = useState(null);
  const [cityID, setCityID] = useState(null);
  const [all, setall] = useState(null);
  const [all2, setall2] = useState(null);
  const [countries, setCountries] = useState([]);
  const countriesDropdownRef = useRef();
  const [cities, setCities] = useState([]);
  const citiesDropdownRef = useRef();

  const [brands, setBrandsArr] = useState([]);
  // console.log('brands', Brands);
  useEffect(() => {
    getCountriesAndCities(response => {
      setCountries(response.data);
      setCities(response.data[0].city)
    });
    getBrandsByCategory(category._id, response => {
      if (response.data) {
        setBrandsArr(response.data);
      }
    });
    return () => {};
  }, []);
  useEffect(() => {
    // console.log(all2, 'allll2 ', all, 'alllllll');
    setall(all2);
  }, [all2, all,Country]);
  const findInArr = (id, arr) => {
    let index = arr.findIndex(o => o === id);
    if (index >= 0) {
      return index;
    }
    return null;
  };

  const selectedBrand = brands.find(el=> {
    if(el._id == Brands){
      return  el;
    }
  } )
  const selectedCountry= countries.find(el=> {
    if(el._id == Country){
      return  el;
    }
  } )
  const selectedCity= selectedCountry && selectedCountry.city.find( el=> {
    if(el._id == city){
      return  el;
    }
  } )
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
          {t('Brand')}
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
          <Text allowFontScaling={false} numberOfLines={1} style={styles.label}>
            {t('Choose country and city')}
          </Text>
          <View style={styles.fullRow}>
            <View style={styles.shadow}>
              <SelectDropdown
                ref={countriesDropdownRef}
                data={countries}
                defaultButtonText={
                  Country.length != 0 ? 
                  // Brands 
                  selectedCountry && i18n.language == 'ar' ? selectedCountry.titleAR :selectedCountry && selectedCountry.titleEN
                  :  t('Country') 
                  }
                buttonTextAfterSelection={(item, index) => {
                  return i18n.language == 'ar' ? item.titleAR : item.titleEN;
                }}
                onSelect={(selectedItem, index) => {
                  setCityID(null);
                  setCountryID(selectedItem._id);
                  dispatch(setCountry(selectedItem._id));

                  citiesDropdownRef.current.reset();
                  setCities([]);
                  setCities(selectedItem.city);
                }}
                dropdownIconPosition={'right'}
                renderDropdownIcon={() => {
                  return (
                    <Entypo name="chevron-down" color={'#202F3A'} size={26} />
                  );
                }}
                buttonStyle={[styles.dropdownBtn, styles.shadow]}
                buttonTextStyle={styles.label2}
                rowTextStyle={styles.label2}
                rowTextForSelection={(item, index) => {
                  return i18n.language == 'ar' ? item.titleAR : item.titleEN;
                }}
              />
            </View>
            <View style={styles.shadow}>
              <SelectDropdown
                ref={citiesDropdownRef}
                data={cities}
             //   defaultButtonText={t('City')}
                defaultButtonText={ 
                  city.length != 0 ? 
                  // Brands 
                  selectedCity && i18n.language == 'ar' ? selectedCity.titleAR :selectedCity && selectedCity.titleEN
                  :  t('City') 
                  }

                buttonTextAfterSelection={(item, index) => {
                  return i18n.language == 'ar' ? item.titleAR : item.titleEN;
                }}
                onSelect={(selectedItem, index) => {
                  setCityID(selectedItem._id);

                  if (findInArr(selectedItem._id, cities) != null) {
                    var arr = [...cities];
                    arr.splice(findInArr(selectedItem._id, cities), 1);
                    dispatch(setCity(selectedItem._id));
                  } else {
                    var arr = [...cities];
                    arr.splice(findInArr(selectedItem._id, cities), 1);
                    arr.push(selectedItem._id);
                    dispatch(setCity(selectedItem._id));
                  }

                }}
                dropdownIconPosition={'right'}
                renderDropdownIcon={() => {
                  return (
                    <Entypo name="chevron-down" color={'#202F3A'} size={26} />
                  );
                }}
                buttonStyle={[styles.dropdownBtn, styles.shadow]}
                buttonTextStyle={styles.label2}
                rowTextStyle={styles.label2}
                rowTextForSelection={(item, index) => {
                  return i18n.language == 'ar' ? item.titleAR : item.titleEN;
                }}
              />
            </View>
          </View>

          <Text allowFontScaling={false} numberOfLines={1} style={styles.label}>
            {t('Brand')}
          </Text>

          <View style={styles.shadow}>
            <SelectDropdown
              data={brands}
              defaultButtonText={ 
                Brands.length != 0 ? 
                // Brands 
                selectedBrand && i18n.language == 'ar' ? selectedBrand.titleAR :selectedBrand && selectedBrand.titleEN
                :  t('Brand') 
              }
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
              onSelect={(item, index) => {
                // const myArray =[]
                // const myArray2 = myArray.push(item);

                // dispatch(setBrands(myArray2));

              
                    if (findInArr(item._id, Brands) != null) {
                        var arr = [...Brands];
                        arr.splice(findInArr(item._id, Brands), 1);
                        dispatch(setBrands(arr));
                      } else {
                        var arr = [...Brands];
                        arr.splice(findInArr(item._id, Brands), 1);
                        arr.push(item._id);
                        dispatch(setBrands(arr));
                      }
                   
             
              }}
              dropdownIconPosition={'right'}
              renderDropdownIcon={() => {
                return (
                  <Entypo name="chevron-down" color={'#202F3A'} size={26} />
                );
              }}
              buttonStyle={[styles.dropdownBtn2, styles.shadow]}
              buttonTextStyle={styles.label2}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN;
              }}
            />
          </View>

          {/* <TouchableOpacity
            onPress={() => {
              setall2(0);
              setall(0);
              var arr = [...Brands];
              dispatch(setBrands(arr));
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              paddingHorizontal: 12,
            }}>
            <FontAwesome
              name={all == 0 ? 'check-square-o' : 'square-o'}
              size={18}
              color={'#202F3A'}
            />
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.filterItemTxt}>
              {t('Defualt')}
            </Text>
          </TouchableOpacity>
          {brands.map((item, index) => {
            return (
              <View key={index.toString()} style={styles.fullRow}>
                <TouchableOpacity
                  onPress={() => {
                    // setall2(0);
                    // setall(0);

                    setTimeout(() => {
                      // setall(0);
                      // setall2(0);

                      if (findInArr(item._id, Brands) != null) {
                        var arr = [...Brands];
                        arr.splice(findInArr(item._id, Brands), 1);
                        dispatch(setBrands(arr));
                      } else {
                        var arr = [...Brands];
                        arr.push(item._id);
                        dispatch(setBrands(arr));
                      }
                    }, 10);
                    // setall(0);
                    // setall2(0);
                  }}
                  style={styles.filterItem}>
                  <FontAwesome
                    name={
                      findInArr(item._id, Brands) != null && all != 0
                        ? 'check-square-o'
                        : 'square-o'
                    }
                    size={18}
                    color={'#202F3A'}
                  />
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.filterItemTxt}>
                    {i18n.language == 'ar' ? item.titleAR : item.titleEN}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })} */}

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
              marginVertical: '20%',
            }}>
            <Text style={{alignSelf: 'center', color: '#fff', fontSize: 18}}>
              {' '}
              {t('Done')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Brand;

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
    paddingBottom: 22,
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
  label: {
    width: '100%',
    textAlign: 'left',
    paddingHorizontal: 16,
    marginTop: 12,
    fontFamily: 'Cairo-Bold',
    color: '#202F3A',
    marginTop: 32,
  },
  dropdownBtn: {
    width: width * 0.4,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 24,
    marginHorizontal: 8,
  },
  dropdownBtn2: {
    width: width * 0.4,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  aboutView: {
    flexDirection: 'column',
    width: '88%',
    paddingVertical: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CACACA',
    marginTop: 24,
  },
  label2: {
    textAlign: 'left',
    fontSize: 14,
    paddingHorizontal: 8,
    fontFamily: 'Cairo-Bold',
    color: '#707070',
  },
  fullRow: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 4,
  },
  filterItemTxt: {
    flex: 1,
    marginLeft: 4,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
    textAlign: 'left',
  },
});
