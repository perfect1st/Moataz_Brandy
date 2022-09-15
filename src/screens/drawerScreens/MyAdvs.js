import React, {useState, useEffect} from 'react'
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  I18nManager,
  Modal,
  TextInput,
  FlatList,
  Animated,
  Platform,
  Image,
  Text,
  Alert,
} from 'react-native'
const {width, height} = Dimensions.get('window')
import {Input} from 'native-base'
import {useTranslation} from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import fileExtensions from '../../components/file-extension-to-mime-types.json'
import {
  offersUser,
  removeOffersUser,
  offersadmin,
  offersUserUpdate,
  getCategoryProducts,
} from './../../services/APIs'
import {useDispatch, useSelector} from 'react-redux'
import {Button, Overlay} from 'react-native-elements'
import {color} from 'react-native-reanimated'

import ModalAlert from '../../components/ModalAlert/ModalAlert';
import ModalAlert2 from '../../components/ModalAlert/ModalAlert2';

const AddAdvData = ({navigation, route}) => {
  const [checkYv, setcheckYv] = useState(false);
  const [checkNv, setcheckNv] = useState(false);
  const [errorupv, seterrorupv] = useState(false);
  const [seccupv, setseccupv] = useState(false);
  const [checkACtYv, setcheckACtYv] = useState(false);
  const [checkACtNv, setcheckACtNv] = useState(false);

  const {t, i18n} = useTranslation()
  const id = route.params.id
  // console.log(id,"idididididi");

  const [Processing, setProcessing] = useState(false)
  const User = useSelector(state => state.AuthReducer.User)
  const [visible, setVisible] = useState(false)
  const [itemuse, setitemuse] = useState(false)
  const [price, updateNewPrice] = useState(0)

  const [newItem, setNewItem] = useState({})

  const [modalVisible, setModalVisible] = useState(false)
  const category = route.params.category

  const favs = [1, 2, 3, 4, 5]

  const [offer, setOffer] = useState([])
  const [offerUpdate, setOfferUpdate] = useState([])

  const toggleOverlay = () => {
    setVisible(!visible)
  }

  const toggleOverlayy = () => {
    setVisiblee(!visible)
  }

  useEffect(() => {
    offersUser(id, async response => {
      setOffer(response.data)
    })

    offersUserUpdate(id, async response => {
      console.log('----', response.data)
      setOfferUpdate(response.data)
    })
  }, [])

  const removeOffers = id => {
    removeOffersUser(id, async response => {
      offersUser(User._id, async response => {
        setOffer(response.data)
      })
    })
  }
  const getFormattedDate = dateUnformatted => {
    var d = new Date(dateUnformatted)
    var hr = d.getHours()
    var min = d.getMinutes()
    if (min < 10) {
      min = '0' + min
    }
    var ampm = 'am'
    if (hr > 12) {
      hr -= 12
      ampm = 'pm'
    }
    var date = d.getDate()
    var month = d.getMonth() + 1
    var year = d.getFullYear()
    return year + '-' + month + '-' + date + ' ' + hr + ':' + min + ' ' + ampm
  }
   const checkYes = () =>{

    setcheckYv(true);

    }
    

  const checkNo = () =>{

     setcheckNv(true);
  }
   

     

  const updateItem = (item, price) => {
    offersUserUpdate(item._id, parseInt(item.price), async response => {
      console.log(response)
      if (response.data) {
        validateUpdate()
      }  if (response.error) {
       
         validateee()
      }
    })
  }

  const validateUpdate = () => {
    setseccupv(true)
    offersUser(id, async response => {
      setOffer(response.data)
    })
    
  }

            

  const validateee = () => {
    seterrorupv(true)
    offersUser(id, async response => {
      setOffer(response.data)
    })
  }

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIcon}
          onPress={() => {
            navigation.goBack()
          }}>
          <AntDesign
            name='arrowright'
            color={'#FFF'}
            size={32}
            style={styles.flipRTL}
          />
        </TouchableOpacity>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.headerTxt}>
          {t('My ads')}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <View style={styles.container}>
        {renderHeader()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          {offer.map((item, index) => {
            // console.log(item,"item");
            return (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ProductDetails', {
                    category,
                    product: item,
                  })
                }}>
                 <ModalAlert
                Title={''}
                TextBody={t('SuccessfullyUpdateNew')}
                onPress={() => {
                  setseccupv(false);
                   
                }}
                Mvasible={seccupv}
                CancleText={t('Done')}
              />
              
             <ModalAlert
                Title={''}
                TextBody={t('SuccessfulltUpdateError')}
                onPress={() => {
                  seterrorupv(false);
                  
                }}
                Mvasible={errorupv}
                CancleText={t('Cancel')}
              />
                <View
                  key={index.toString()}
                  style={[styles.item, styles.shadow]}
                  
                  >
                  <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
                    <View
                      style={{
                        height: height / 6,
                        width: width * 0.8,
                        borderRadius: 12,
                        paddingHorizontal: 20,
                      }}>
                      <Text
                        style={{
                          alignSelf: 'center',
                          marginTop: 5,
                          fontSize: 20,
                          color: '#D6A230',
                        }}>
                        {t('Remind')}
                      </Text>
                      <Text
                        style={{
                          alignSelf: 'center',
                          fontSize: 16,
                          marginTop: 5,
                        }}>
                        {t(
                          'Is the reason for deleting the ad because it has been sold?',
                        )}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 15,
                          justifyContent: 'space-between',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(false)
                            
                            checkYes()
                            // offersUser(itemuse, async response => {
                            //   setOffer(response.data)
                              
                            // })
                          }}
                          style={[
                            styles.subviewoverlay,
                            {
                              backgroundColor: '#D6A230',
                            },
                          ]}>
                          <Text
                            style={
                              ([styles.subviewoverlaytext],
                              {color: '#fff', alignSelf: 'center'})
                            }>
                            {t('Yes')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(false)
                            checkNo()
                            // offersUser(itemuse, async response => {
                            //   setOffer(response.data)
                              
                            // })
                          }}
                          style={styles.subviewoverlay}>
                          <Text style={[styles.subviewoverlaytext]}>
                            {t('No')}
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            setVisible(false)
                          }}
                          style={styles.subviewoverlay}>
                          <Text style={[styles.subviewoverlaytext]}>
                            {t('exit')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Overlay>
                  <ModalAlert2
            Title=""
            TextBody={t('Conferm')}
            onPress={() => {
              setcheckNv(false);
            }}
            onPress1={() => {
              setcheckNv(false);
              setcheckACtNv(true);
            }}
            Mvasible={checkNv}
            YesText={t('Yes')}
            CancleText={t('No')}
          />
           <ModalAlert
                Title={''}
                TextBody={ t('Successfully')}
                onPress={() => {
                  setcheckACtNv(false);
                   removeOffers(itemuse);
                }}
                Mvasible={checkACtNv}
                CancleText={t('Done')}
              />
             <ModalAlert2
            Title=""
            TextBody={t('Conferm')}
            onPress={() => {
              setcheckYv(false);
            }}
            onPress1={() => {
              setcheckYv(false);
              setcheckACtYv(true);
            }}
            Mvasible={checkYv}
            YesText={t('Yes')}
            CancleText={t('No')}
          />
           <ModalAlert
                Title={''}
                TextBody={ t('Successfully')}
                onPress={() => {
                  setcheckACtYv(false);
                  navigation.navigate('CommissionPayment');
                   removeOffers(itemuse);
                }}
                Mvasible={checkACtYv}
                CancleText={t('Done')}
              />

                  <Image
                    // source={require('./../../assets/images/usr.png')}
                    source={{uri: item.img[0]}}
                    style={styles.itemImage}
                  />

                  <View style={styles.itemCol}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemTxt}>
                      {item.titleAR}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemTxt}>
                      {item.whatsapp}
                    </Text>

                    {/* add price and name of city & country  */}
                    <View>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={styles.itemTxtSec}>
                        {i18n.language == 'ar'
                          ? item.price + t('Sar')
                          : item.price + t('Sar')}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        numberOfLines={1}
                        style={styles.itemTxtSec}>
                        {item.cityID == null ? 
                         <Text>{t('No city added')}</Text>:
                        i18n.language == 'ar'
                          ? item.cityID.titleAR + ' ,' + item.countryID.titleAR
                          : item.cityID.titleEN + ' ,' + item.countryID.titleEN}
                      </Text>
                    </View>

                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemTxtSec}>
                      {getFormattedDate(item.updatedAt)}
                    </Text>

                    <View style={styles.fullRow}>
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible(true)
                          setNewItem(item)
                          updateNewPrice(price)
                        }}>
                        <View>
                        <ModalAlert2
            Title=""
            TextBody={t('ChangePrice')}
            onPress={() => {
               setModalVisible(false)
            }}
            onPress1={() => {
               updateItem(newItem, item.price)
                                      navigation.navigate('MyAdvs', {
                                        id: User._id,
                                      })
                                      setModalVisible(false)
            }}
            Mvasible={modalVisible}
            YesText={t('Yes')}
            CancleText={t('No')}
          />
                         
                        </View>

                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={styles.itemOptions}>
                          {t('Update')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('editproduct', {
                            category: item.categoryID,
                            product: item,
                          })
                        }}>
                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={styles.itemOptions}>
                          {t('Edit')}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => {
                          toggleOverlay()
                          setitemuse(item._id)
                        }}>
                        <Text
                          allowFontScaling={false}
                          numberOfLines={1}
                          style={styles.itemOptions}>
                          {t('Delete')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

export default AddAdvData

const styles = StyleSheet.create({
  // style row price and city & country name
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},

  borderedField: {
    width: '90%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    flexDirection: 'row',
  },
  centeredViewPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  modalView: {
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '70%',
    marginBottom: 100,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    marginTop: 30,
    // textAlign: "center",
    fontSize: 18,
    paddingTop: 0,
    alignItems: 'flex-end',
  },
  Button: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  itemOptions: {
    marginHorizontal: 4,
    textAlign: 'left',
    fontSize: 12,
    color: '#202F3A',
    fontFamily: 'Cairo-Regular',
    textDecorationLine: 'underline',
  },
  subviewoverlay: {
    height: 40,
    width: 70,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderColor: '#D6A230',
    borderWidth: 1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  subviewoverlaytext: {
    alignSelf: 'center',
    alignSelf: 'center',
    color: '#D6A230',
  },
})