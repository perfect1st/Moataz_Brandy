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
  Animated,
  Platform,
  Image,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {Input} from 'native-base';

import {useTranslation} from 'react-i18next';

import ModalAlert from '../../components/ModalAlert/ModalAlert';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {SliderBox} from 'react-native-image-slider-box';

import fileExtensions from '../../components/file-extension-to-mime-types.json';
import Video from '../../components/video';
import {
  getCategories,
  getAdv,
  favoriteByUser,
  searchforword,
} from './../../services/APIs';
import {setFavourites} from '../../redux/actions';

import {useSelector, useDispatch} from 'react-redux';

const Home = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);
  const dispatch = useDispatch();

  const [Processing, setProcessing] = useState(false);

  const [searchTxt, setSearchTxt] = useState(null);
  const [scrollX, setScrollX] = useState(new Animated.Value(0));
  const [errorv, seterrorv] = useState(false);

  const [oldData, setOldData] = useState([]);
  const [data, setData] = useState([]);
  const [searchresopns, setsearchresopns] = useState([]);

  const [advs, setAdvs] = useState([]);

  useEffect(() => {
    setProcessing(true);
    getCategories(User?._id, response => {
      setProcessing(false);
      if (response.data) {
        console.log(data)
        setOldData(response.data);
        setData(response.data);
      } else {
        seterrorv(!errorv);
      }
    });
    getAdv(response => {
      if (response.data) {
        let newArr = [];
        response.data.forEach((element, e) => {
          newArr.push(element.adsPath);
          if (e == response.data.length - 1) {
            setAdvs(newArr);
          }
        });
      } else {
        // console.log(response.error);
      }
    });
    if (User) {
      favoriteByUser(User._id, response => {
        if (response.data) {
          var responseArr = response.data;
          var arr = [];
          for (let index = 0; index < responseArr.length; index++) {
            const element = responseArr[index];
            arr.push(element.offersID._id);
            if (index == responseArr.length - 1) {
              dispatch(setFavourites(arr));
            }
          }
        }
      });
    }
    return () => {};
  }, []);

  const search = () => {
    if (searchTxt) {
      searchforword(searchTxt, response => {
        if (response.data) {
          var responseArr = response.data;
          setsearchresopns(responseArr);
          console.log(responseArr);
        
        }
      });
      
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <MaterialIcons name="menu" color={'#FFF'} size={32} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SearchScreen');
          }}
          style={styles.searchInput}>
          <FontAwesome5 name="search" size={22} color={'#202F3A'} />
          <View
            placeholder={t('Search')}
            // disabled={true}
            placeholderTextColor={'#B2B2B2'}
            defaultValue={searchTxt}
            returnKeyType={'done'}
            style={{flex: 1, color: '#000',fontFamily: 'Cairo-Bold',}}
            textAlign={styles.inputFieldsText.textAlign}
            // onChangeText={text => {
            //   setSearchTxt(text);
            // }}
            // onSubmitEditing={() => {
            //   search();
            // }}
          >
            <Text style={{fontFamily: 'Cairo-Bold',textAlign: I18nManager.isRTL ? 'left':'left' ,marginHorizontal:5,fontSize:18}}>{t('Search')}</Text>
            </View>
        </TouchableOpacity>

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
          <View style={styles.advContainer}>
            <SliderBox
              images={advs}
              // onCurrentImagePressed={ }
              autoplay 
              circleLoop
            
            />
           
          </View>

          {Processing ? (
            <ActivityIndicator
              color={'#999999'}
              size={'large'}
              style={{marginTop: 32}}
            />
          ) : (
            <View style={styles.gridContainer}>
              {data.map((item, index) => {
                return (
                  
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CategoryProducts', {category: item});
                    }}
                    style={styles.gridItem}
                    key={index.toString()}>
                    <Image
                      style={styles.gridItemTitleImage}
                      source={{uri: item.imgPath}}
                    />
                    <View style={styles.gridItemTitleView}>
                    <ModalAlert
            Title={''}
            TextBody={t('Something went wrong')}
            onPress={() => {
              seterrorv(!errorv);
            }}
            Mvasible={errorv}
            CancleText={t('Cancel')}
          />
                      <Text style={styles.gridItemTitleTxt}>
                        {i18n.language == 'ar' ? item.titleAR : item.titleEN}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Home;

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
  scrollView: {flexGrow: 1, alignItems: 'center', paddingBottom: 22},
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
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 8,
  },
  inputFieldsText: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  advContainer: {width: '100%', height: height * 0.25},
  advSliderItem: {width, backgroundColor: '#FFF'},
  advSliderItemImg: {flex: 1, width: null, height: null, resizeMode: 'cover'},
  dotsView: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 30,
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    marginHorizontal: 4,
    borderColor: '#D6A230',
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '50%',
    aspectRatio: 1.2,
    backgroundColor: '#FFFFFF',
    marginVertical: 6,
    overflow: 'hidden',
  },
  gridItemTitleView: {
    width: '100%',
    paddingVertical: 6,
    paddingHorizontal: 12,
    zIndex: 1,
    flexDirection: 'row',
  },
  gridItemTitleTxt: {
    flex: 1,
    textAlign: 'center',
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
  },
  gridItemTitleImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
