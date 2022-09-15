import React, {useState, useRef, useEffect} from 'react'
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
  ActivityIndicator,
  KeyboardAvoidingView,
  Image,
  Text,
  Alert,
  Platform,
  ToastAndroid,
} from 'react-native'
const {width, height} = Dimensions.get('window')
import SelectDropdown from 'react-native-select-dropdown'
import {CommonActions} from '@react-navigation/native'
import {launchImageLibrary} from 'react-native-image-picker'
import ModalAlert from '../../components/ModalAlert/ModalAlert';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import {useTranslation} from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import ImagePicker from 'react-native-image-crop-picker'
import axios from 'axios'
import {launchCamera} from 'react-native-image-picker'

axios.defaults.timeout = 10000
import {useDispatch, useSelector} from 'react-redux'
import {
  getCountriesAndCities,
  getCategories,
  getBrandsByCategory,
  uploadPhoto,
  addAdvertiseedit,
} from './../../services/APIs'

const editproduct = ({navigation, route}) => {
  const {t, i18n} = useTranslation()
  const User = useSelector(state => state.AuthReducer.User)
  const product = route.params.product
  console.log('here', product, 'here')
  const [Processing, setProcessing] = useState(false)
  const [Processing2, setProcessing2] = useState(false)

  //product.cityID
  const [image, setImage] = useState([])

  const [image22, setImage22] = useState([...product.img])
  const [categoryId, setCategoryId] = useState(product.categoryID._id)
  const [brandId, setBrandId] = useState(
    product.brandsID ? product.brandsID._id : null,
  )
  const [countryID, setCountryID] = useState(
    product.countryID ? product.countryID._id : null,
  )
  const [cityID, setCityID] = useState(
    product.cityID ? product.cityID._id : null,
  )
  const [adsStatus, setAdsStatus] = useState(product.adsStatus)
  const [title, setTitle] = useState(product.titleAR)
  const [mobile, setMobile] = useState(product.mobile)
  const [whatsapp, setWhatsapp] = useState(product.wtsappMobile)
  const [price, setPrice] = useState(product.price)
  const [desc, setDesc] = useState(product.descAR)

  const [brands, setBrands] = useState([])
  const brandsDropdownRef = useRef()
  const [categories, setCategories] = useState([])
  const [countries, setCountries] = useState([])
  const countriesDropdownRef = useRef()
  const [cities, setCities] = useState([])
  const citiesDropdownRef = useRef()


  const [categoryV, setcategoryV] = useState(false);
  const [brandv, setbrandv] = useState(false);
  const [countryv, setcountryv] = useState(false);
  const [cityv, setcityv] = useState(false);
  const [statev, setstatev] = useState(false);
  const [titlev, settitlev] = useState(false);
  const [descv, setdescv] = useState(false);
  const [whatsappv, setwhatsappv] = useState(false);
  const [advv, setadvv] = useState(false);
  const [errorv, seterrorv] = useState(false);

  useEffect(() => {
    // console.log(product)
    // console.log('__________________________________')

    getBrandsByCategory(product.categoryID._id, response => {
      if (response.data) {
        setBrands(response.data)
      }
    })
    getCategories(response => {
      if (response.data) {
        setCategories(response.data)
      }
    })
    getCountriesAndCities(response => {
      if (response.data) {
        setCountries(response.data)
      }
    })
    return () => {}
  }, [])

  const pickImageFromPhone = () => {
    try {
      ImagePicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        compressImageQuality: 0.5,
      }).then(images => {
        setProcessing2(true)
        Platform.OS == 'android'
          ? ToastAndroid.show('يتم الان رفع الصور', ToastAndroid.SHORT)
          : Alert.alert('يتم الان رفع الصور')
        for (let index = 0; index < images.length; index++) {
          const element = images[index]
          if (Platform.OS === 'android') {
            source = {
              uri:
                Platform.OS === 'android'
                  ? images[index].path
                  : images[index].sourceURL.replace('file://', ''),
              fileName: images[index].modificationDate,
              type: images[index].mime,
            }
            var arr = [...image]
            uploadPhoto(source, response => {
              if (response.data) {
                console.log(response.data)
                arr.push(response.data)
                setImage([...arr])
                setImage22([...product.img,...arr])
              }
            })
          } else {
            source = {
              uri:
                Platform.OS === 'android'
                  ? images[index].sourceURL
                  : images[index].sourceURL.replace('file://', ''),
              fileName: images[index].filename,
              type: images[index].filename.split('.')[1],
            }
            var arr = [...image]
            uploadPhoto(source, response => {
              if (response.data) {
                console.log(response.data)
                arr.push(response.data)
                setImage([...arr])
                setImage22([...product.img,...arr])

              }
            })
          }
        }
        setProcessing2(false)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const pickImageFromCamera = () => {
    const options = {
      mediaType: 'photo',
    }
    launchCamera(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // setProcessing(false)
        console.log('User cancelled image picker')
      } else if (response.errorCode) {
        // setProcessing(false)
        console.log('ImagePicker Error: ', response.errorCode)
      } else if (response.errorMessage) {
        // setProcessing(false)
        console.log('User tapped custom button: ', response.errorMessage)
      } else {
        const source = {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          fileName: response.fileName,
          type: response.type,
        }
        setProcessing2(true)
        Platform.OS == 'android'
          ? ToastAndroid.show('يتم الان رفع الصور', ToastAndroid.SHORT)
          : Alert.alert('يتم الان رفع الصور')
        uploadPhoto(source, response => {
          if (response.data) {
            var arr = [...image]
            arr.push(response.data)
            setImage(arr)
            setImage22([...product.img,...arr])

            setProcessing2(false)
          }
        })
      }
    })
  }

  const validate = () => {
    if (!categoryId) {
       setcategoryV(!categoryV);
    } else if (!brandId) {
     setbrandv(!brandv);
    } else if (!cityID) {
      setcityv(!cityv);
    } else if (!adsStatus) {
   setstatev(!statev);
    } else if (!title) {
       settitlev(!titlev);
    }
    else if (whatsapp.length > 0 && whatsapp.length < 9) {
      setwhatsappv(!whatsappv);
    }
     else if (!desc) {
       setdescv(!descv);
    } else {
      setProcessing(true)
      addAdvertiseedit(
        product._id,
        image22,
        categoryId,
        User._id,
        brandId,
        countryID,
        cityID,
        title,
        adsStatus,
        mobile,
        whatsapp.length > 0 ? '966' + whatsapp.toString() : '',
        price,
        desc,
        response => {
          setProcessing(false)
          if (response.data) {

            console.log('1111111111111111111111',response.data,'2222222222222222222222');

            // navigation.navigate('ProductDetails', {
            //   id: User._id,
            // })
            navigation.navigate('ProductDetails', {categoryId, product: response.data})

            setadvv(!advv)
          } else {
            seterrorv(!errorv)
          }
        },
      )
    }
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
          {t('Edit advertise')}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        {renderHeader()}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}>
          <View style={styles.borderedField}>
            <View style={styles.borderedField}>
              {image.length == 0 && !Processing2 && (
                <View style={styles.addPhotoBtnBordered}>
                  <Image
                    style={styles.addPhotoBtnImgBordered}
                    source={{
                      uri: image22[0],
                    }}
                  />
                </View>
              )}
              {image.length == 0 && Processing2 && (
                <View
                  style={{
                    margin: 12,
                  }}>
                  <ActivityIndicator size='small' color='#000' />
                </View>
              )}
              {image.length > 0 &&
                !Processing2 &&
                image.map((item, index) => {
                  return (
                    <View key={index} style={styles.addPhotoBtnBordered}>
                      <Image
                        style={styles.addPhotoBtnImgBordered}
                        source={{
                          uri: item,
                        }}
                      />
                    </View>
                  )
                })}
              {image.length > 0 &&
                Processing2 &&
                image.map((item, index) => {
                  return (
                    <View key={index} style={styles.addPhotoBtnBordered}>
                      <ActivityIndicator size='small' color='#000' />
                    </View>
                  )
                })}
            </View>
          </View>

          <View style={{flexDirection: 'row', width: width, marginLeft: 20}}>
            <View style={styles.addPhotoBtnRow}>
              <TouchableOpacity
                onPress={() => {
                  pickImageFromCamera()
                }}
                style={styles.addPhotoBtn}>
                <FontAwesome name='camera' color={'grey'} size={34} />
              </TouchableOpacity>
            </View>

            <View style={styles.addPhotoBtnRow}>
              <TouchableOpacity
                onPress={() => {
                  pickImageFromPhone()
                  // console.log("hi")
                }}
                style={styles.addPhotoBtn}>
                <FontAwesome name='image' color={'grey'} size={34} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.borderedField}>
            <SelectDropdown
              defaultValue={product.categoryID}
              data={categories}
              defaultButtonText={
                i18n.language == 'ar' ? product.categoryID : product.categoryID
              }
              onSelect={(selectedItem, index) => {
                setBrandId(null)
                setCategoryId(selectedItem._id)
                brandsDropdownRef.current.reset()
                setBrands([])
                getBrandsByCategory(selectedItem._id, response => {
                  if (response.data) {
                    setBrands(response.data)
                  }
                })
                // console.log(selectedItem, index)
              }}
              buttonStyle={[styles.dropdownBtn, styles.shadow]}
              renderCustomizedButtonChild={(selectedItem, index) => {
                // console.log(categories,"categoriescategoriescategoriescategories");
                // console.log(product.categoryID,"product.categoryIDproduct.categoryIDproduct.categoryID");
                // console.log(selectedItem,"selectedItemselectedItemselectedItemselectedItem");
                return (
                  <View style={styles.aboutViewRow}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.label2}>
                      {selectedItem
                        ? i18n.language == 'ar'
                          ? selectedItem.titleAR
                          : selectedItem.titleEN
                        : product.categoryID
                        ? product.categoryID.titleAR
                        : t('Category')}
                    </Text>
                  </View>
                )
              }}
              dropdownIconPosition={'right'}
              renderDropdownIcon={() => {
                return (
                  <Entypo name='chevron-down' color={'#202F3A'} size={26} />
                )
              }}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
            />
          </View>
          <View style={styles.borderedField}>
            <SelectDropdown
              defaultButtonText={
                categoryId == product.categoryID._id ? product.brandsID : null
              }
              defaultValue={product.brandsID}
              ref={brandsDropdownRef}
              data={brands}
              onSelect={(selectedItem, index) => {
                setBrandId(selectedItem._id)
                // console.log(selectedItem, index)
              }}
              buttonStyle={[styles.dropdownBtn, styles.shadow]}
              renderCustomizedButtonChild={(selectedItem, index) => {
                return (
                  <View style={styles.aboutViewRow}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.label2}>
                      {selectedItem
                        ? i18n.language == 'ar'
                          ? selectedItem.titleAR
                          : selectedItem.titleEN
                        : product.brandsID
                        ? product.brandsID.titleAR
                        : t('Brand')}
                    </Text>
                  </View>
                )
              }}
              dropdownIconPosition={'right'}
              renderDropdownIcon={() => {
                return (
                  <Entypo name='chevron-down' color={'#202F3A'} size={26} />
                )
              }}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
            />
          </View>
          <View style={styles.borderedField}>
            <SelectDropdown
              defaultValue={product.countryID}
              ref={countriesDropdownRef}
              data={countries}
              defaultButtonText={
                product.countryID ? product.countryID.titleAR : t('Country')
              }
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
              onSelect={(selectedItem, index) => {
                setCityID(null)
                setCountryID(selectedItem._id)
                citiesDropdownRef.current.reset()
                setCities([])
                setCities(selectedItem.city)
              }}
              buttonStyle={[styles.dropdownBtn, styles.shadow]}
              dropdownIconPosition={'right'}
              renderDropdownIcon={() => {
                return (
                  <Entypo name='chevron-down' color={'#202F3A'} size={26} />
                )
              }}
              buttonTextStyle={styles.label2}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
            />
          </View>
          <View style={styles.borderedField}>
            <SelectDropdown
              defaultValue={product.cityID}
              ref={citiesDropdownRef}
              data={cities}
              defaultButtonText={
                product.cityID ? product.cityID.titleAR : t('City')
              }
              buttonTextAfterSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
              onSelect={(selectedItem, index) => {
                setCityID(selectedItem._id)
              }}
              buttonStyle={[styles.dropdownBtn, styles.shadow]}
              dropdownIconPosition={'right'}
              renderDropdownIcon={() => {
                return (
                  <Entypo name='chevron-down' color={'#202F3A'} size={26} />
                )
              }}
              buttonTextStyle={styles.label2}
              rowTextStyle={styles.label2}
              rowTextForSelection={(item, index) => {
                return i18n.language == 'ar' ? item.titleAR : item.titleEN
              }}
            />
          </View>
          <View style={styles.borderedField}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setTitle(text)
              }}
              value={title}
              placeholder={t('Advertise title')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
            />
          </View>
          <Text allowFontScaling={false} numberOfLines={1} style={styles.label}>
            {t('Product status')}
          </Text>
          <View style={styles.fullRow}>
            <View style={styles.borderedFieldStatus}>
              <View style={styles.productStatus}>
                <TouchableOpacity
                  onPress={() => setAdsStatus(1)}
                  style={styles.radioCirle}>
                  {adsStatus == 1 && <View style={styles.radioSelected} />}
                </TouchableOpacity>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={styles.label3}>
                  {t('New')}
                </Text>
              </View>
            </View>
            <ModalAlert
            Title={''}
            TextBody={t('Please choose city')}
            onPress={() => {
              setcityv(!cityv);
            }}
            Mvasible={cityv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Please choose category')}
            onPress={() => {
              setcategoryV(!categoryV);
            }}
            Mvasible={categoryV}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Please choose brand')}
            onPress={() => {
              setbrandv(!brandv);
            }}
            Mvasible={brandv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Please choose country')}
            onPress={() => {
              setcountryv(!countryv);
            }}
            Mvasible={countryv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Choose advertise status')}
            onPress={() => {
              setstatev(!statev);
            }}
            Mvasible={statev}
            CancleText={t('Cancel')}
          />
            <ModalAlert
            Title={''}
            TextBody={t('Add advertise Title')}
            onPress={() => {
              settitlev(!titlev);
            }}
            Mvasible={titlev}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Whatsapp should be 9 numbers')}
            onPress={() => {
              setwhatsappv(!whatsappv);
            }}
            Mvasible={whatsappv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('Add advertise description')}
            onPress={() => {
              setdescv(!descv);
            }}
            Mvasible={descv}
            CancleText={t('Cancel')}
          />
          <ModalAlert
            Title={''}
            TextBody={t('AdvertisementSuccessfullyEdit')}
            onPress={() => {
              setadvv(!advv);
            }}
            Mvasible={advv}
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
          <ModalAlert
            Title={''}
            TextBody={t('Please choose country')}
            onPress={() => {
              setcountryv(!countryv);
            }}
            Mvasible={countryv}
            CancleText={t('Cancel')}
          />
            <View style={styles.borderedFieldStatus}>
              <View style={styles.productStatus}>
                <TouchableOpacity
                  onPress={() => setAdsStatus(2)}
                  style={styles.radioCirle}>
                  {adsStatus == 2 && <View style={styles.radioSelected} />}
                </TouchableOpacity>
                <Text
                  allowFontScaling={false}
                  numberOfLines={1}
                  style={styles.label3}>
                  {t('Used')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.borderedField}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setMobile(text)
              }}
              value={mobile}
              keyboardType={'numeric'}
              placeholder={t('Mobile (optional)')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              placeholderTextColor="gray"

            />
          </View>
          <View style={styles.borderedField}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setWhatsapp(text)
              }}
              value={whatsapp.length > 9 ? whatsapp.slice(3) : whatsapp}
              keyboardType={'numeric'}
              maxLength={9}
              placeholder={t('whatsapp (optional)')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              placeholderTextColor="gray"

            />
          </View>
          <View style={styles.borderedField}>
            <TextInput
              style={styles.textInput}
              onChangeText={text => {
                setPrice(text)
              }}
              value={price ? price.toString() : ''}
              keyboardType={'numeric'}
              placeholder={t('Price (optional)')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              placeholderTextColor="gray"

            />
          </View>

          <View style={styles.borderedField}>
            <TextInput
              style={[styles.textInput, {height: 120}]}
              onChangeText={text => {
                setDesc(text)
              }}
              value={desc}
              placeholder={t('Advertise details')}
              textAlign={styles.textInputAlign.textAlign}
              editable={!Processing}
              returnKeyType={'done'}
              multiline={true}
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              if (!Processing) {
                validate()
              }
            }}
            style={styles.loginBtn}>
            {Processing ? (
              <ActivityIndicator size='small' color='#fff' />
            ) : (
              <Text allowFontScaling={false} style={styles.loginBtnTxt}>
                {t('Done')}
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default editproduct

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
  addPhotoBtn: {
    padding: 12,
  },
  addPhotoBtnBordered: {
    margin: 12,
    borderRadius: 8,
    borderColor: '#888',
    borderWidth: 1,
    overflow: 'hidden',
  },
  addPhotoBtnImg: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  addPhotoBtnImgBordered: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
  dropdownBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 12,
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
  textInput: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    height: 40,
    paddingHorizontal: 14,
    fontFamily:'Cairo-Regular'


  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  label: {
    width: '90%',
    textAlign: 'left',
    marginTop: 12,
    fontFamily:'Cairo-Bold',
    color: '#202F3A',
    marginTop: 12,
    alignSelf: 'center',
  },
  productStatus: {
    width: width * 0.4,
    height: 40,
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderedFieldStatus: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 4,
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
  label3: {
    textAlign: 'left',
    fontSize: 14,
    paddingHorizontal: 8,
    fontFamily: 'Cairo-Bold',
    color: '#202F3A',
    flex: 1,
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#F8B704',
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 42,
    alignSelf: 'center',
  },
  loginBtnTxt: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
  },
})
