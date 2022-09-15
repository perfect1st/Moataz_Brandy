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
  FlatList,
  RefreshControl,
  Alert,
  Image,
  Text,
  ActivityIndicator,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {useTranslation} from 'react-i18next';
import {useSelector, useDispatch} from 'react-redux';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ModalAlert from '../../components/ModalAlert/ModalAlert';

import {
  getCategoryProducts,
  addRemoveFav,
  favoriteByUser,
} from './../../services/APIs';

import {setFavourites} from '../../redux/actions';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const CategoryProducts = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);
  const SortBy = useSelector(state => state.SortAndFilterReducer.SortBy);
  const Brands = useSelector(state => state.SortAndFilterReducer.Brands);
  const City = useSelector(state => state.SortAndFilterReducer.City);
  const Country = useSelector(state => state.SortAndFilterReducer.Country);

  const Favourites = useSelector(state => state.FavouritesReducer.Favourites);
  const dispatch = useDispatch();
  const [Processing, setProcessing] = useState(false);
  const [viewType, setViewType] = useState(1);
  const category = route.params.category;
  const [oldData, setOldData] = useState([]);
  const [data, setData] = useState([]);
  const [featured, setFeatured] = useState(2);
  const [loginv, setloginv] = useState(false);
  const [errorv, seterrorv] = useState(false);

  // console.log('category', data, 'category---');

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    dispatch({type: 'RESET_SORT_BRANDS'});
    console.log(Brands)
        console.log(City)

    setRefreshing(true);
    getCategoryProducts(null, category._id, response => {
      setProcessing(false);
      if (response.data) {
        // console.log(response.data);
        setOldData(response.data);
        // setData(response.data);
        doSort(SortBy, response.data);
      } else {
        seterrorv(!errorv);
      }
    });
    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    setProcessing(true);
    console.log("________________________",Brands)
    console.log("_______________",City)
    console.log("+++++++++++++++++++++++++",Country)

    getCategoryProducts(null, category._id, response => {
      setProcessing(false);
      if (response.data) {
        // console.log(response.data);
        setOldData(response.data);
        // setData(response.data);
        doSort(SortBy, response.data);
      } else {
        seterrorv(!errorv);
      }
    });
    return () => {};
  }, []);

  useEffect(() => {
    doSort(SortBy, data);
  }, [SortBy]);

  const findInArr = (id, arr) => {
    if (arr.length == 0) {
      return true;
    } else {
      let index = arr.findIndex(o => o === id);
      if (index >= 0) {
        return true;
      }
      return false;
    }
  };

  const doSort = (sort, data) => {
    /*
      Sort :
      1-> most recent
      2-> most watched
      3-> least watched
      4-> highest price
      5-> lowest price
    */
    if (sort == 1) {
      const arr = [...data];
      arr.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0,
      );
      setData(arr.reverse());
    } else if (sort == 2) {
      // most recent
      const arr = [...data];
      arr.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0,
      );
      setData(arr.reverse());
    } else if (sort == 3) {
      // most recent
      const arr = [...data];
      arr.sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : b.createdAt > a.createdAt ? -1 : 0,
      );
      setData(arr.reverse());
    } else if (sort == 4) {
      const arr = [...data];
      arr.sort((a, b) => (a.price > b.price ? 1 : b.price > a.price ? -1 : 0));
      setData(arr.reverse());
    } else {
      const arr = [...data];
      arr.sort((a, b) => (a.price > b.price ? 1 : b.price > a.price ? -1 : 0));
      setData(arr);
    }
  };

  const getFeatured = () => {
    var arr = [...oldData];
    var featured = arr.filter(item => item.featured == 1);
    setData(featured);
    setFeatured(1);
  };

  const getFeaturedAndNotFeatured = () => {
    var arr = [...oldData];
    setData(arr);
    setFeatured(2);
  };

  const getFormattedDate = dateUnformatted => {
    var d = new Date(dateUnformatted);
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
      min = '0' + min;
    }
    var ampm = 'am';
    if (hr > 12) {
      hr -= 12;
      ampm = 'pm';
    }
    var date = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    return year + '-' + month + '-' + date + ' ' + hr + ':' + min + ' ' + ampm;
  };

  const addRemoveFromFav = product => {
    addRemoveFav(User._id, product._id, response => {
      if (response.data) {
        setIsFav(old => !old);
      }
      favoriteByUser(User._id, responseFav => {
        if (responseFav.data) {
          var responseArr = responseFav.data;
          var arr = [];
          if (responseArr.length > 0) {
            for (let index = 0; index < responseArr.length; index++) {
              const element = responseArr[index];
              arr.push(element.offersID._id);
              if (index == responseArr.length - 1) {
                dispatch(setFavourites(arr));
              }
            }
          } else {
            dispatch(setFavourites([]));
          }
        }
      });
    });
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
            size={29}
            style={styles.flipRTL}
          />
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.headerTxt}>
          {i18n.language == 'ar' ? category.titleAR : category.titleEN}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    );
  };

  const renderFilters = () => {
    return (
      <View style={styles.fitersView}>
        <TouchableOpacity
          onPress={() =>
            featured == 1 ? getFeaturedAndNotFeatured() : getFeatured()
          }
          style={styles.filterItem}>
          <FontAwesome
            name={featured == 1 ? 'check-square-o' : 'square-o'}
            size={18}
            color={'#202F3A'}
          />
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.filterItemTxt}>
            {t('Featured')}
          </Text>
        </TouchableOpacity>
        <View style={styles.vl} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Brand', {category});
          }}
          style={styles.filterItem}>
          {(Brands.length || City.length) !== 0 ? <FontAwesome5 name={'filter'} size={18} color={'#D6A230'} /> :
          <AntDesign name={'filter'} size={18} color={'#202F3A'} />
          }

          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.filterItemTxt}>
            {t('Brand')}
          </Text>
          <TouchableOpacity style={{marginHorizontal:2,padding:2}} onPress={
            onRefresh
          }>
          {(Brands.length || City.length) !== 0 && <FontAwesome5 name={'ban'} size={18} color={'red'} />}

          </TouchableOpacity>

        </TouchableOpacity>
        <View style={styles.vl} />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            navigation.navigate('Sort');
          }}
          style={styles.filterItem}>
          <FontAwesome5 name={'sort'} size={18} color={'#202F3A'} />
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.filterItemTxt}>
            {t('Sort')}
          </Text>
        </TouchableOpacity>
        <View style={styles.vl} />
        <TouchableOpacity
          onPress={() => setViewType(old => (old == 1 ? 2 : 1))}
          style={styles.filterItem}>
          <FontAwesome name={'list-ul'} size={18} color={'#202F3A'} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderListItem = (item, index) => {
    // console.log(item, 'UUUUUUUUUUUUUUUUu');
    if(City.length == 0){
      return (
        findInArr(item.brandsID ? item.brandsID._id : null, Brands) &&(
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetails', {category, product: item})
            }
            key={index.toString()}
            style={[styles.item, styles.shadow]}>
            <View style={styles.itemCol}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.itemTxt}>
                {i18n.language == 'ar' ? item.titleAR : item.titleEN}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={(styles.itemTxt, {color: '#D6A230'})}>
                {item.price == null ? (
                  <Text style={[styles.itemTxt, {color: '#D6A230'}]}>
                    {i18n.language == 'ar' ?
                   <Text style={{textAlign:'right'}}>{t('No price added')}</Text>  :
                    t('No price added')
                    }
                  </Text>
                ) : (
                  <Text style={{fontFamily: 'Cairo-Regular',fontWeight:'bold'}}>
                    {i18n.language == 'ar'
                      ? item.price + t('Sar')
                      : item.price + t('Sar')}
                  </Text>
                )}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.itemTxtSec}>
                {i18n.language == 'ar'
                  ? item.userID.fullnameAR
                  : item.userID.fullnameEN}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.itemTxtSec}>
                {getFormattedDate(item.createdAt)}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.itemTxtSec}>
                {item.cityID == null ? (
                  <Text>{t('No city added')}</Text>
                ) : (
                  <>
                    {i18n.language == 'ar'
                      ? item.cityID.titleAR + ' ,' + item.countryID.titleAR
                      : item.cityID.titleEN + ' ,' + item.countryID.titleEN}
                  </>
                )}
              </Text>
            </View>
            {Favourites.find(a => a == item._id) ? (
              <TouchableOpacity
                onPress={() => {
                  if (User) {
                    addRemoveFromFav(item);
                  } else {
                    setloginv(!loginv);
                  }
                }}
                style={styles.itemDeleteBtn}>
                <FontAwesome name={'heart'} color={'#FFF'} size={22} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (User) {
                    addRemoveFromFav(item);
                  } else {
                    setloginv(!loginv);
                  }
                }}
                style={styles.itemDeleteBtn}>
                <FontAwesome name={'heart-o'} color={'#FFF'} size={22} />
              </TouchableOpacity>
            )}
            <Image source={{uri: item.img[0]}} style={styles.itemImage} />
          </TouchableOpacity>
        )
      );
  
    }else{
  
    }

          return (
        findInArr(item.brandsID ? item.brandsID._id : null, Brands) && findInArr(item.cityID ? item.cityID._id : null, [City]) &&(
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductDetails', {category, product: item})
            }
            key={index.toString()}
            style={[styles.item, styles.shadow]}>
            <View style={styles.itemCol}>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.itemTxt}>
                {i18n.language == 'ar' ? item.titleAR : item.titleEN}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={(styles.itemTxt, {color: '#D6A230'})}>
                {item.price == null ? (
                  <Text style={[styles.itemTxt, {color: '#D6A230'}]}>
                    {i18n.language == 'ar' ?
                   <Text style={{textAlign:'right'}}>{t('No price added')}</Text>  :
                    t('No price added')
                    }
                  </Text>
                ) : (
                  <Text style={{fontFamily: 'Cairo-Regular',fontWeight:'bold'}}>
                    {i18n.language == 'ar'
                      ? item.price + t('Sar')
                      : item.price + t('Sar')}
                  </Text>
                )}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.itemTxtSec}>
                {i18n.language == 'ar'
                  ? item.userID.fullnameAR
                  : item.userID.fullnameEN}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.itemTxtSec}>
                {getFormattedDate(item.createdAt)}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={2}
                style={styles.itemTxtSec}>
                {item.cityID == null ? (
                  <Text>{t('No city added')}</Text>
                ) : (
                  <>
                    {i18n.language == 'ar'
                      ? item.cityID.titleAR + ' ,' + item.countryID.titleAR
                      : item.cityID.titleEN + ' ,' + item.countryID.titleEN}
                  </>
                )}
              </Text>
            </View>
            {Favourites.find(a => a == item._id) ? (
              <TouchableOpacity
                onPress={() => {
                  if (User) {
                    addRemoveFromFav(item);
                  } else {
                    setloginv(!loginv);
                  }
                }}
                style={styles.itemDeleteBtn}>
                <FontAwesome name={'heart'} color={'#FFF'} size={22} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (User) {
                    addRemoveFromFav(item);
                  } else {
                    setloginv(!loginv);
                  }
                }}
                style={styles.itemDeleteBtn}>
                <FontAwesome name={'heart-o'} color={'#FFF'} size={22} />
              </TouchableOpacity>
            )}
            <Image source={{uri: item.img[0]}} style={styles.itemImage} />
          </TouchableOpacity>
        )
      );

  };

  const renderSquareItem = (item, index) => {
    return (
      findInArr(item.brandsID ? item.brandsID._id : null, Brands) && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductDetails', {category, product: item})
          }
          key={index.toString()}
          style={styles.itemSquare}>
          <Image source={{uri: item.img[0]}} style={styles.itemImageSquare} />
          <View style={styles.itemColSquare}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.itemTxt}>
              {i18n.language == 'ar' ? item.titleAR : item.titleEN}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.itemTxtSec}>
              {i18n.language == 'ar'
                ? item.userID.fullnameAR
                : item.userID.fullnameEN}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={(styles.itemTxt, {color: '#D6A230'})}>
              {item.price == null ? (
                <Text style={(styles.itemTxt, {color: '#D6A230'})}>
                  {t('No price added')}
                </Text>
              ) : (
                <>
                  {i18n.language == 'ar'
                    ? item.price + t('Sar')
                    : item.price + t('Sar')}
                </>
              )}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={2}
              style={styles.itemTxtSec}>
              {item.cityID == null ? (
                <Text>{t('No city added')}</Text>
              ) : (
                <>
                  {i18n.language == 'ar'
                    ? item.cityID.titleAR + ' ,' + item.countryID.titleAR
                    : item.cityID.titleEN + ' ,' + item.countryID.titleEN}
                </>
              )}
            </Text>
            <View style={styles.fullRowSquare}>
              <Text
                allowFontScaling={false}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                style={styles.itemTxtSec}>
                {getFormattedDate(item.createdAt)}
              </Text>
              {Favourites.find(a => a == item._id) ? (
                <TouchableOpacity
                  onPress={() => {
                    if (User) {
                      addRemoveFromFav(item);
                    } else {
                      setloginv(!loginv);
                    }
                  }}
                  style={styles.itemDeleteBtn2}>
                  <FontAwesome name="heart" color={'#FFF'} size={20} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (User) {
                      addRemoveFromFav(item);
                    } else {
                      setloginv(!loginv);
                    }
                  }}
                  style={styles.itemDeleteBtn2}>
                  <FontAwesome name="heart-o" color={'#FFF'} size={20} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableOpacity>
      )
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <View style={styles.container}>
        {renderHeader()}
        {renderFilters()}
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.scrollView}>
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
            Title={''}
            TextBody={t('Please Add Message')}
            onPress={() => {
              seterrorv(!errorv);
            }}
            Mvasible={errorv}
            CancleText={t('Cancel')}
          />
          {Processing ? (
            <ActivityIndicator
              color={'#999999'}
              size={'large'}
              style={{marginTop: 32}}
            />
          ) : viewType == 1 ? (
            data.map((item, index) => {
              return renderListItem(item, index);
            })
          ) : (
            <View style={styles.gridContainer}>
              {data.map((item, index) => {
                return renderSquareItem(item, index);
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CategoryProducts;

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
    flexWrap: 'wrap',
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
    marginHorizontal: 8,
    color: '#FFF',
    fontFamily: 'Cairo-Regular',
  },
  flipRTL: {
    transform: [{scaleX: I18nManager.isRTL ? 1 : -1}],
    marginLeft: 4,
    marginTop: 4,
  },
  fitersView: {
    width: '100%',
    flexDirection: 'row',
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 2,
  },
  filterItemTxt: {
    flex: 1,
    marginLeft: 4,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
    textAlign: 'left',
  },
  vl: {
    height: '65%',
    width: 1,
    backgroundColor: '#202F3A',
  },
  item: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 12,
  },
  itemCol: {
    flex: 1,
    paddingHorizontal: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
  },
  itemTxt: {
    width: '103%',
    textAlign: 'left',
    fontSize: Platform.OS === 'android' ? 12 : 14,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
  },
  itemTxtSec: {
    flex: 1,
    textAlign: 'left',
    fontSize: Platform.OS === 'android' ? 10 : 14,
    color: '#B2B2B2',
    fontFamily: 'Cairo-Regular',
    paddingHorizontal: 4,
  },
  itemDeleteBtn: {
    padding: 6,
    backgroundColor: '#D6A230',
    alignSelf: 'flex-start',
    borderRadius: 8,
    marginRight: -22,
    zIndex: 1,
  },
  itemDeleteBtn2: {
    padding: 6,
    backgroundColor: '#D6A230',
    alignSelf: 'flex-start',
    borderRadius: 8,
    zIndex: 1,
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    paddingHorizontal: 0,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  itemSquare: {
    width: width * 0.4,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 15,
  },
  itemImageSquare: {
    width: width * 0.44,
    height: width * 0.44,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
  },
  itemColSquare: {
    paddingHorizontal: 12,
    width: width * 0.44,
    backgroundColor: '#EEEEEE',
    borderRadius: 5,
    marginTop: -15,
  },
  fullRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  fullRowSquare: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
