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
  TouchableHighlight,
  Text,
  
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { favoriteByUser, addRemoveFav } from './../../services/APIs';
import { useDispatch, useSelector } from 'react-redux';

import { setFavourites } from '../../redux/actions';
// import { TouchableHighlight } from 'react-native-gesture-handler';

const Favourite = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);
  const Favourites = useSelector(state => state.FavouritesReducer.Favourites);

  const dispatch = useDispatch();

  const [Processing, setProcessing] = useState(false);
  const [Fav, setFav] = useState([]);
  const [lang, setLang] = useState(i18n.language);
  const favs = [1, 2, 3, 4, 5];

  useEffect(() => {
    if (User) {
      console.log(User._id);
      favoriteByUser(User._id, async response => {
        console.log("response.data",response.data,"878787878787878");
        setFav(response.data);
      });
    }
  }, []);

  const removeFav = offersID => {
    addRemoveFav(User._id, offersID, async response => {
      favoriteByUser(User._id, async response => {
        setFav(response.data);
      });
      favoriteByUser(User._id, responseFav => {
        if (responseFav.data) {
          var responseArr = responseFav.data;
          var arr = [];
          if (responseArr.length > 0) {
            for (let index = 0;index < responseArr.length;index++) {
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

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <MaterialIcons name="menu" color={'#FFF'} size={30} style={{marginTop:4}} />
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.headerTxt}>
          {t('Favourite')}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    );
  };

  return (
    <View style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <View style={styles.container}>
        {renderHeader()}
        {!User ? (
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Login first')}
          </Text>
        ) : (
         
            <View 
              // showsVerticalScrollIndicator={false}
              // contentContainerStyle={styles.scrollView}
              >
                {Fav.length == [] ? 
                (
                  <Text style={styles.NoFav}> 
                    {t('No Fov')}
                  </Text>
                ): (
                  <SafeAreaView 
                  showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollView}
                  >
                  {Fav.map((item, index) => {
                    console.log(item.offersID.categoryID,"TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
                   return (
                     <TouchableOpacity   onPress={() =>
                       navigation.navigate('ProductDetails', {category:item.offersID.categoryID , product: item.offersID })
                     } >
                     <View
                     key={index.toString()}
                     style={[styles.item, styles.shadow]}>
                     <Image
                       source={{ uri: item.offersID.img[0] }}
                       style={styles.itemImage}
                     />
                     <View style={styles.itemCol}>
                       <Text
                         allowFontScaling={false}
                         numberOfLines={2}
                         style={styles.itemTxt}>
                         {!lang == 'en'
                           ? item.offersID.titleAR
                           : item.offersID.titleEN}
                       </Text>
                       <Text
                         allowFontScaling={false}
                         numberOfLines={1}
                         style={styles.itemTxtSec}>
                         {!lang == 'en'
                           ? item.offersID.brandsID && item.offersID.brandsID.titleAR
                           : item.offersID.brandsID && item.offersID.brandsID.titleEN
                         }
                       </Text>
                       <Text
                         allowFontScaling={false}
                         numberOfLines={1}
                         style={styles.itemTxtSec}>
                         {getFormattedDate(item.offersID.createdAt)}
                       </Text>
                     </View>
                     <TouchableOpacity
                       style={styles.itemDeleteBtn}
                       onPress={() => {
                         removeFav(item.offersID._id);
                       }}>
                       <FontAwesome5 name={'heart'} color={'#FFF'} size={22} />
                     </TouchableOpacity>
                   </View>
   
                     </TouchableOpacity>
                  
                   );
                 })}
                  </SafeAreaView>
                )}
              
            </View>
          )}
      </View>
    </View>
  );
};

export default Favourite;

const styles = StyleSheet.create({
  NoFav:{
    color: 'black',
    fontSize: 16,
    fontFamily:'Cairo-Regular',
    textAlign:'center',
    alignItems:'center',
    paddingTop: 150,
  },
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
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    color: '#202F3A',
    fontFamily:  'Cairo-Bold',
  },
  itemTxtSec: {
    width: '100%',
    textAlign: 'left',
    fontSize: 12,
    color: '#B2B2B2',
    fontFamily: 'Cairo-Regular',
  },
  itemDeleteBtn: {
    padding: 6,
    backgroundColor: '#D6A230',
    alignSelf: 'flex-end',
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
