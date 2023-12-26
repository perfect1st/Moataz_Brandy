import React, {useState, useEffect, useCallback, useRef} from 'react';
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
  FlatList,
  Image,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
  Modal,
  // Share
} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
const {width, height} = Dimensions.get('window');
import {StackActions} from '@react-navigation/native';
import Share from 'react-native-share';
import {useTranslation} from 'react-i18next';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Button, Overlay} from 'react-native-elements';
import {useSelector, useDispatch} from 'react-redux';
import {logOut, setFavourites} from '../../redux/actions';
import {
  getProductReviews,
  getSimilarProducts,
  checkFav,
  addRemoveFav,
  offersUser,
  offersDeleteRate,
  removeOffersUser,
  offersUserUpdate,
  offersadmin,
} from './../../services/APIs';
import {offersRate, favoriteByUser} from './../../services/APIs';
import {Platform} from 'react-native';
import {set} from 'react-native-reanimated';
import RNFetchBlob from 'rn-fetch-blob';
import ImageView from 'react-native-image-viewing';
import {SliderBox} from 'react-native-image-slider-box';
import ModalAlert from '../../components/ModalAlert/ModalAlert';
import ModalAlert2 from '../../components/ModalAlert/ModalAlert2';
import axios from 'axios';
const ProductDetails = ({navigation, route}) => {
  const [loginv, setloginv] = useState(false);
  const [errorv, seterrorv] = useState(false);
  const [commentv, setcommentv] = useState(false);
  const [checkYv, setcheckYv] = useState(false);
  const [checkNv, setcheckNv] = useState(false);
  const [sendItemID, setcsendItemID] = useState('');
  const [checkACtYv, setcheckACtYv] = useState(false);
  const [checkACtNv, setcheckACtNv] = useState(false);
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const category = route.params.category ? route.params.category : null;
  const product = route.params.product;
  const [visible, setVisible] = useState(false);
  const [itemuse, setitemuse] = useState(false);
  const [offer, setOffer] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({});
  const [userDeteled, setuserDeteled] = useState(false);

  // console.log("photo", category, "***photos-category***")
  // console.log('product.wtsappMobile', product.titleAR, 'product.wtsappMobile');
  const [Processing, setProcessing] = useState(false);
  const [baseImage, setBaseImage] = useState('');
  const [reviews, setReviews] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const User = useSelector(state => state.AuthReducer.User);
  const [num, setnum] = useState(0);
  const [img64, setimg64] = useState('');

  const [errorupv, seterrorupv] = useState(false);
  const [seccupv, setseccupv] = useState(false);

  const [isFav, setIsFav] = useState(false);
  const [comment, setComment] = useState(null);
  const [photobigrt, setphotobigrt] = useState(false);
  // const [arrofphoto, setarrofphoto] = useState(product.img[0]);
  const [visible2, setIsVisible2] = useState(false);
  const [price, updateNewPrice] = useState(0);

  const toggleOverlay = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    console.log('_________________________________________________________________________________________')
    console.log(route.params.product)
        console.log(route.params.edit)
        console.log('route.params.myAds',route.params.myAds)

    offersUser(product._id, async response => {
      setOffer(response.data);
    });
  }, []);

  console.log('www=----', product.wtsappMobile);
  const whatsapplink = 'whatsapp://send?text=&phone=+' + product?.countryCode?.code + product.wtsappMobile;
  console.log(whatsapplink)
  console.log(product?.countryCode)
  // const OpenURLButtonwhats = () => {
  //   const handlePress = useCallback(async () => {
  //     const supported = await Linking.canOpenURL(whatsapplink);
  //     if (supported) {
  //       await Linking.openURL(whatsapplink);
  //     } else {
  //       Linking.openURL('https://web.whatsapp.com/');
  //     }
  //   }, [whatsapplink]);
  //   return (
  //     <TouchableOpacity
  //       onPress={() => {
  //         handlePress();
  //       }}>
  //       <FontAwesome name="whatsapp" style={{color: 'green', fontSize: 28}} />
  //     </TouchableOpacity>
  //   );
  // };

  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(whatsapplink);
    if (supported) {
      await Linking.openURL(whatsapplink);
    } else {
      Linking.openURL('https://web.whatsapp.com/');
    }
  }, [whatsapplink]);

  const successMsgUpdate = () => {
    setseccupv(true);
  };

  const errorMsgUpdate = () => {
    seterrorupv(true);
  };

  const updateItem = (product, price) => {
    offersUserUpdate(product._id, parseInt(product.price), async response => {
      console.log(response);
      if (response.data) {
        successMsgUpdate();
      }
      if (response.error) {
        errorMsgUpdate();
      }
    });
  };

  useEffect(() => {
    getProductReviews(product._id, response => {
      if (response.data) {
        //  console.log(response.data,"hi");
        setReviews(response.data);
      } else {
        seterrorv(!errorv);
      }
    });

    if (category) {
      getSimilarProducts(category._id,product._id,response => {
        if (response.data) {
          // console.log(response.data,"bys");
          setSimilarProducts(response.data);
        } else {
          seterrorv(!errorv);
        }
      });
    }

    if (User) {
      checkFav(User._id, product._id, response => {
        console.log(response.data);
        if (
          response.data &&
          photobigrt &&
          response.data.message &&
          response.data.message == 'fav'
        ) {
          setIsFav(true);
        }
      });
    }
    // return () => { };

    offersUser(product.userID._id, async response => {
      setOffer(response.data);
    });
  }, []);

  useEffect(() => {
    // console.log(product.img[0]);
    if(product.img[0]){
      const fs = RNFetchBlob.fs;
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', product.img[0])
        // the image is now dowloaded to device's storage
        .then(resp => {
          console.log(product.img[0])
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(base64Data => {
          // here's base64 encoded image
          // console.log(base64Data,"hihihi");
          // remove the file from storage
          setimg64('data:image/png;base64,' + base64Data);
          // console.log(img64);
          return fs.unlink(imagePath);
        });
  
    }else{
      const fs = RNFetchBlob.fs;
      let imagePath = null;
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', 'https://brandysa.com/BrandyAdmin/image/logoApp2.png')
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(base64Data => {
          // here's base64 encoded image
          // console.log(base64Data,"hihihi");
          // remove the file from storage
          setimg64(`data:image/image/${product.img[0].split('.').pop()};base64,` + base64Data);
          // console.log(img64);
          return fs.unlink(imagePath);
        });
  
    }
  }, []);

  const removeOffers = id => {
    removeOffersUser(id, async response => {
      offersUser(User._id, async response => {
        setOffer(response.data);
      });
    });
  };

  const checkYes = () => {
    setcheckYv(true);
  };

  const checkNo = () => {
    setcheckNv(true);
  };

  const addRemoveFromFav = () => {
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

  const commentData = offers => {
    if (User) {
      axios
      .get('http://brandysa.com/api/user/employeeByID', {
        params: {
          id: User._id,
        },
      })
      .then(response => {
        console.log(response.data)
        if(response.data.status == 1){
  
      if (!comment) {
        setcommentv(!commentv);
      } else {
        offersRate(comment, offers, User._id, async response => {
          setComment(null);
          getProductReviews(product._id, response => {
            if (response.data) {
              // console.log(response.data);
              setReviews(response.data);
            } else {
              seterrorv(!errorv);
            }
          });
          // setReviews(false);
        });
      }
    }else{
      setuserDeteled(!userDeteled);
      dispatch(logOut());
      setTimeout(()=>{
        navigation.reset({
          index: 0,
          routes: [{name: 'Home'}],
        });
        
        navigation.navigate('Login');
    },1500)

    }
  })
    } else {
      setloginv(!loginv);
      // NAVIGATE HERE
    }
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

  const sharee = async () => {
    try {
      const result = await Share.open({
        message:
          'Brandy Application \n' + product.titleAR + ' ' + product.descAR,

        url: 'https://brandysa.com/?id=' + product._id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const share = async () => {
    console.log('___________________', product.img[0], '___________________');
    console.log('extention',product.img[0].split('.').pop())
    // console.log('share', img64, 'share');
    const shareOptions = {
      message:
        'Brandy Application \n' +
        product.titleAR  + 
        '\n'
        +
       'https://brandysa.com/offer?id=' + product._id,
      // url: img64,
      // type: `image/${product.img[0].split('.').pop()}`,
      // failOnCancel: false
      // url:
      // urls: [files.image1, files.image2]
    };



    try {
      console.log(shareOptions)
      const ShareResponse = await Share.open(shareOptions);
      console.log(JSON.stringify(ShareResponse));
    } catch (error) {
      console.log('Error => ', error);
    }
  };

  const sendImage = index => {
    navigation.navigate('Test', {
      test: product.img,
    });
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <SliderBox
          images={product.img}
          onCurrentImagePressed={index => sendImage(index)}
          autoplay
          circleLoop
        />

        <View style={styles.headerTopRow}>
          <TouchableOpacity
            onPress={() =>route.params.myAds?navigation.navigate('MyAdvs', {id: User._id,}): navigation.goBack()}
            style={styles.iconBtn}>
            <AntDesign
              name="arrowright"
              color={'#B2B2B2'}
              size={20}
              style={styles.flipRTL}
            />
          </TouchableOpacity>
          <View style={styles.row}>
            {User && (
              <TouchableOpacity
                onPress={() => {
                  addRemoveFromFav();
                }}
                style={[styles.iconBtn, isFav && {backgroundColor: '#D6A230'}]}>
                <AntDesign
                  name="hearto"
                  color={isFav ? '#FFF' : '#B2B2B2'}
                  size={20}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => share()} style={styles.iconBtn}>
              <Entypo name="share" color={'#B2B2B2'} size={20} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerBottomRow}>
          <View style={styles.row}>
            {User && User._id != product.userID._id && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Chat', {
                    memberID: product.userID,
                    ownerID: User,
                  });
                }}
                style={styles.iconBtn}>
                <AntDesign name="message1" color={'#B2B2B2'} size={20} />
              </TouchableOpacity>
            )}
            {!User && (
              <TouchableOpacity
                onPress={() => {
                  setloginv(!loginv);
                }}
                style={styles.iconBtn}>
                <AntDesign name="message1" color={'#B2B2B2'} size={20} />
                <ModalAlert2
                  Title=""
                  TextBody={t('Login first')}
                  onPress={() => {
                    setloginv(!loginv);
                  }}
                  onPress1={() => {
                    navigation.navigate('Login');
                    setloginv(!loginv);
                  }}
                  Mvasible={loginv}
                  YesText={t('Yes')}
                  CancleText={t('No')}
                />
              </TouchableOpacity>
            )}

            {User && product.userID._id != User._id && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ComplaintsAndSuggestions', {
                    productOrder: product.order,
                  });
                }}
                style={styles.iconBtn}>
                <FontAwesome name="flag" color={'#B2B2B2'} size={18} />
              </TouchableOpacity>
            )}

            {User &&
            product.userID._id != User._id &&
            product.wtsappMobile != '' ? (
              <View style={styles.iconBtn2}>
                <TouchableOpacity
                  onPress={() => {
                    handlePress();
                  }}>
                  <FontAwesome
                    name="whatsapp"
                    style={{color: 'green', fontSize: 28}}
                  />
                </TouchableOpacity>

                {/* {product.wtsappMobile && product.wtsappMobile == " " && OpenURLButtonwhats()} */}
              </View>
            ) : (
              <View></View>
            )}

            {(User && product.userID._id != User._id && product.wtsappMobile != '') ||
            (!User && product.wtsappMobile != '') ? (
              <View style={styles.iconBtn}>
                <ModalAlert2
                  Title=""
                  TextBody={t('Login first')}
                  onPress={() => {
                    setloginv(!loginv);
                  }}
                  onPress1={() => {
                    navigation.navigate('Login');
                    setloginv(!loginv);
                  }}
                  Mvasible={loginv}
                  YesText={t('Yes')}
                  CancleText={t('No')}
                />
                {product.wtsappMobile && (
                  <TouchableOpacity
                    style={{flexDirection: 'row', borderColor: 'green'}}
                    onPress={() => {
                      dialCall(11226);
                    }}>
                    <Ionicons
                      name="call"
                      style={{color: 'grey', fontSize: 26}}
                    />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View></View>
            )}

            {User && product.userID._id == User._id && (
              <View style={styles.iconBtn}>
                <TouchableOpacity
                  style={{flexDirection: 'row', borderColor: 'green'}}
                  onPress={() => {
                    setModalVisible(true);
                    setNewItem(product);
                    updateNewPrice(price);
                  }}>
                  <View>
                    <ModalAlert2
                      Title=""
                      TextBody={t('ChangePrice')}
                      onPress={() => {
                        setModalVisible(false);
                      }}
                      onPress1={() => {
                        updateItem(newItem, product.price);

                        setModalVisible(false);
                      }}
                      Mvasible={modalVisible}
                      YesText={t('Yes')}
                      CancleText={t('No')}
                    />

                    <ModalAlert
                      Title={''}
                      TextBody={t('SuccessfullyUpdateNew')}
                      onPress={() => {
                        setseccupv(false);
                      }}
                      Mvasible={seccupv}
                      CancleText={t('Cancel')}
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
                  </View>
                  <EvilIcons
                    name="refresh"
                    style={{color: 'grey', fontSize: 31}}
                  />
                </TouchableOpacity>
              </View>
            )}

            {User && product.userID._id == User._id && (
              <View style={styles.iconBtn}>
                <TouchableOpacity
                  style={{flexDirection: 'row', borderColor: 'green'}}
                  onPress={() => {
                    navigation.navigate('Editproduct', {
                      category: product.categoryID,
                      product: product,
                    });
                  }}>
                  <MaterialIcons
                    name="edit"
                    style={{color: 'grey', fontSize: 24}}
                  />
                </TouchableOpacity>
              </View>
            )}

            {User && product.userID._id == User._id && (
              <View style={styles.iconBtn}>
                <TouchableOpacity
                  style={{flexDirection: 'row', borderColor: 'green'}}
                  onPress={() => {
                    toggleOverlay();
                    setitemuse(product._id);
                  }}>
                  <AntDesign
                    name="delete"
                    style={{color: 'grey', fontSize: 24}}
                  />
                </TouchableOpacity>
              </View>
            )}

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
                      setVisible(false);

                      offersUser(itemuse, async response => {
                        setOffer(response.data);
                        checkYes();
                      });
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
                      setVisible(false);
                      offersUser(itemuse, async response => {
                        setOffer(response.data);
                        checkNo();
                      });
                    }}
                    style={styles.subviewoverlay}>
                    <Text style={[styles.subviewoverlaytext]}>{t('No')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setVisible(false);
                    }}
                    style={styles.subviewoverlay}>
                    <Text style={[styles.subviewoverlaytext]}>
                      {t('Cancel')}
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
              TextBody={t('Successfully')}
              onPress={() => {
                setcheckACtNv(false);
                removeOffers(itemuse);
                navigation.navigate('Home');
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
              TextBody={t('Successfully')}
              onPress={() => {
                setcheckACtYv(false);
                navigation.navigate('CommissionPayment');
                removeOffers(itemuse);
              }}
              Mvasible={checkACtYv}
              CancleText={t('Done')}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderComment = (item, index) => {
    return (
      <View>
        {/* ad user name after he/she add comment */}
        <View style={styles.fullRowComment}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('customershowadv', {
                name:
                  i18n.language == 'ar'
                    ? item?.userID?.fullnameAR
                    : item?.userID?.fullnameEN,
                productuserid: item?.userID?._id,
                productuser: item?.userID,
              });
            }}>
            <Text style={styles.addusername}>
              {i18n.language == 'ar'
                ? item?.userID?.fullnameAR
                : item?.userID?.fullnameEN}
            </Text>
           
          </TouchableOpacity>

          {User && product.userID._id == User._id ? (
            <View style={styles.iconBtncomment}>
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
                style={{flexDirection: 'row', borderColor: 'green'}}
                onPress={() => {
                  setcheckYv(true);
                  setcsendItemID(item._id);
                  console.log(item._id);
                }}>
                <ModalAlert2
                  Title=""
                  TextBody={t('Conferm')}
                  onPress={() => {
                    setcheckYv(false);
                  }}
                  onPress1={() => {
                    setcheckYv(false);
                    console.log(sendItemID);
                    offersDeleteRate(sendItemID, async response => {
                      getProductReviews(product._id, response => {
                        if (response.data) {
                          // console.log(response.data);
                          setReviews(response.data);
                        } else {
                          seterrorv(!errorv);
                        }
                      });
                    });
                  }}
                  Mvasible={checkYv}
                  YesText={t('Yes')}
                  CancleText={t('No')}
                />

                <AntDesign
                  name="delete"
                  style={{color: 'grey', fontSize: 20}}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View></View>
          )}
        </View>
        <Text
          key={index.toString()}
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.commentTxt}>
          {item.comment}
        </Text>
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={styles.commentDate}>
          {getFormattedDate(item.createdAt)}
        </Text>
        <View style={{
          borderBottomColor :"#ccc",
          borderBottomWidth :1,
          marginTop:2, 
          marginHorizontal: 8
        }} />
      </View>
    );
  };

  const renderAdvBody = () => {
    return (
      <View style={styles.whiteBody}>
        <View style={styles.fullRow}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.title2}>
            {t('Advertise number')}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.bodyTxt}>
            {product.order}
          </Text>
        </View>
        <View style={styles.fullRow}></View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('customershowadv', {
              name:
                i18n.language == 'ar'
                  ? product.userID.fullnameAR
                  : product.userID.fullnameEN,
              productuserid: product.userID._id,
              productuser: product.userID,
            });
          }}
          style={styles.fullRow}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.title4}>
            {t('Advertiser name')}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.bodyTxt3}>
            {i18n.language == 'ar'
              ? product.userID.fullnameAR
              : product.userID.fullnameEN}
          </Text>
        </TouchableOpacity>
        <View style={styles.fullRow}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.title2}>
            {t('Advertise date')}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.bodyTxt}>
            {getFormattedDate(product.createdAt)}
          </Text>
        </View>
        <View style={styles.fullRow}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.title2}>
            {t('Product status')}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.bodyTxt}>
            {product.adsStatus == 1 ? t('New') : t('Used')}
          </Text>
        </View>
      </View>
    );
  };

  const renderSimilarItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index.toString()}
        onPress={() =>
          navigation.dispatch(
            StackActions.push('ProductDetails', {category, product: item}),
          )
        }
        key={index.toString()}
        style={[styles.itemSquare, styles.shadow]}>
        <Image source={{uri: item.img[0]}} style={styles.itemImageSquare} />
        <View style={styles.itemColSquare}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={styles.itemTxt}>
            {i18n.language == 'ar' ? item.titleAR : item.titleEN}
          </Text>
          <View style={styles.fullRow}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.itemTxtSec}>
              {getFormattedDate(item.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const dialCall = number => {
    let phoneNumber = '';
    console.log('__________',product?.countryCode?.code,product.wtsappMobile)
    Linking.openURL(`tel:${product?.countryCode?.code}${product.wtsappMobile.toString()}`);
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#FFF'} barStyle={'dark-content'} />
      {visible2 ? (
        <ImageView
          images={ounted}
          imageIndex={0}
          visible={visible2}
          onRequestClose={() => setIsVisible2(false)}
        />
      ) : (
            <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}

         style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            {renderHeader()}

            <View style={styles.fullRow}>
              <Text
                allowFontScaling={false}
                numberOfLines={3}
                style={styles.title1}>
                {i18n.language == 'ar' ? product.titleAR : product.titleEN}
              </Text>
              <Text
                allowFontScaling={false}
                numberOfLines={1}
                style={styles.price}>
                {product.price ? product.price + t('Sar') : t('No price added')}
              </Text>
            </View>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.brandName}>
              {product.brandsID &&
                (i18n.language == 'ar'
                  ? product.brandsID.titleAR
                  : product.brandsID.titleEN)}
            </Text>
            <View style={styles.hr} />
            {renderAdvBody()}
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.title3}>
              {t('Advertise details')}
            </Text>
            <Text allowFontScaling={false} style={styles.productDetails}>
              {i18n.language == 'ar' ? product.descAR : product.descEN}
            </Text>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.title3}>
              {t('Comments')}
            </Text>
            {reviews.length == 0 ? (
              <Text allowFontScaling={false} style={styles.productDetails}>
                {t('No one commented')}
              </Text>
            ) : (
              <View style={styles.whiteBody}>
                {reviews.map((item, index) => {
                  return renderComment(item, index);
                })}
              </View>
            )}

            {
              <View style={styles.fullRow}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={text => {
                    setComment(text);
                  }}
                  value={comment}
                  placeholder={t('Write comment')}
                  textAlign={styles.textInputAlign.textAlign}
                  editable={!Processing}
                  returnKeyType={'done'}
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
            TextBody={t('This user is blocked or deleted')}
            onPress={() => {
              setuserDeteled(!userDeteled);
            }}
            Mvasible={userDeteled}
            CancleText={t('Cancel')}
          />
                <ModalAlert2
                  Title=""
                  TextBody={t('Login first')}
                  onPress={() => {
                    setloginv(!loginv);
                  }}
                  onPress1={() => {
                    navigation.navigate('Login');
                    setloginv(!loginv);
                  }}
                  Mvasible={loginv}
                  YesText={t('Yes')}
                  CancleText={t('No')}
                />
                <TouchableOpacity
                  onPress={() => {
                    commentData(product._id);
                  }}
                  style={styles.sendBtn}>
                  <FontAwesome name={'send'} color={'#FFF'} size={22} />
                </TouchableOpacity>
                <ModalAlert
                  Title={''}
                  TextBody={t('Please Add Message')}
                  onPress={() => {
                    setcommentv(!commentv);
                  }}
                  Mvasible={commentv}
                  CancleText={t('Cancel')}
                />
              </View>
            }
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.title3}>
              {t('Similar advertises')}
            </Text>
            <View style={styles.slider2}>
              <FlatList
                horizontal
                scrollEnabled
                showsHorizontalScrollIndicator={false}
                decelerationRate={0}
                scrollEventThrottle={16}
                snapToAlignment="center"
                data={similarProducts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item, index}) => renderSimilarItem(item, index)}
                style={styles.flatList2}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  centeredViewPhoto: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  modalViewM: {
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
  Button: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalText: {
    marginTop: 30,
    // textAlign: "center",
    fontSize: 18,
    paddingTop: 0,
    alignItems: 'flex-end',
  },
  //style username comment
  addusername: {
    fontSize: 12,
    textAlign: 'left',
    marginLeft: 10,
    color: '#D6A230',
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
    backgroundColor: '#FFF',
    flexWrap: 'wrap',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#EEEEEE',
  },
  scrollView: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 22,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    height: height * 0.2,
    backgroundColor: '#CCC',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 34,
  },
  headerPhoto: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  headerTopRow: {
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBottomRow: {
    width: '100%',
    position: 'absolute',
    bottom: -21,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  flipRTL: {transform: [{scaleX: I18nManager.isRTL ? 1 : -1}]},
  iconBtncomment: {
    width: 25,
    height: 25,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  iconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  iconBtn2: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullRowComment: {
    width: '100%',
    marginTop: 2,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fullRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  title1: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Cairo-Bold',
    color: '#D6A230',
    fontSize: 14,
  },
  price: {
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    color: '#D6A230',
    fontSize: 14,
    marginHorizontal: 4,
    // alignItems:'flex-end'
  },
  brandName: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Bold',
    color: '#B2B2B2',
    fontSize: 12,
    paddingHorizontal: 12,
  },
  hr: {
    width: '90%',
    alignSelf: 'center',
    height: 1,
    backgroundColor: '#E3E3E3',
    marginVertical: 12,
  },
  whiteBody: {
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  title4: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#D6A230',
    fontSize: 14,
  },
  title2: {
    flex: 1,
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#202F3A',
    fontSize: 14,
  },
  bodyTxt: {
    // flex: 1,
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#707070',
    fontSize: 14,
  },
  bodyTxt3: {
    // flex: 1,
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#D6A230',
    fontSize: 14,
  },
  title3: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Bold',
    color: '#000000',
    fontSize: 14,
    paddingHorizontal: 12,
    textDecorationLine: 'underline',
    marginTop: 12,
  },
  productDetails: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Bold',
    color: '#D6A230',
    fontSize: 14,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  commentName: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#B2B2B2',
    fontSize: 14,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  commentTxt: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#000000',
    fontSize: 14,
    paddingHorizontal: 12,
  },
  commentDate: {
    width: '100%',
    textAlign: 'left',
    fontFamily: 'Cairo-Regular',
    color: '#707070',
    fontSize: 12,
    paddingHorizontal: 12,
  },
  textInput: {
    flex: 1,
    borderRadius: 12,
    marginHorizontal: 8,
    height: 40,
    borderColor: '#B2B2B2',
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  sendBtn: {
    height: 40,
    width: 40,
    backgroundColor: '#D6A230',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  slider2: {
    flexDirection: 'row',
    width,
    paddingVertical: 8,
    marginTop: 16,
    backgroundColor: '#F2F2F2',
  },
  flatList2: {overflow: 'hidden'},
  itemSquare: {
    width: width * 0.35,
    backgroundColor: '#FFF',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: width * 0.025,
  },
  itemImageSquare: {
    width: width * 0.35,
    height: width * 0.35,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
  },
  itemColSquare: {
    paddingHorizontal: 12,
    width: '100%',
    backgroundColor: '#EEEEEE',
    borderRadius: 12,
    marginTop: -18,
    paddingVertical: 12,
  },
  itemTxt: {
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
  },
  itemTxtSec: {
    width: '100%',
    textAlign: 'left',
    fontSize: 12,
    color: '#B2B2B2',
    fontFamily: 'Cairo-Regular',
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 0,
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '27%',
    marginBottom: 100,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 20,
    // textAlign: "center",
    fontSize: 18,
    paddingTop: 0,
    alignItems: 'flex-end',
  },
});
