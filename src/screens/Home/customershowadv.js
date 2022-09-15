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
import ModalAlert2 from '../../../src/components/ModalAlert/ModalAlert2';
import { offersUser, removeOffersUser } from './../../services/APIs';
import { useDispatch, useSelector } from 'react-redux';

const customershowadv = ({ navigation, route }) => {
    const { t, i18n } = useTranslation();
    const name = route.params.name;
    const productuserid = route.params.productuserid;
    const productuser = route.params.productuser;
    const [Processing, setProcessing] = useState(false);
    const User = useSelector(state => state.AuthReducer.User);
    const favs = [1, 2, 3, 4, 5];
    const [loginv, setloginv] = useState(false);
    const [offer, setOffer] = useState([]);
    useEffect(() => {
        offersUser(productuserid, async response => {
            setOffer(response.data)
        });
    }, []);

    const removeOffers = (id) => {
        removeOffersUser(id, async response => {
            offersUser(User._id, async response => {
                setOffer(response.data)
            });
        });
    }
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
                    {name}
                </Text>
                
                {!User ?     
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
                  }}
                  Mvasible={loginv}
                  YesText={t('Yes')}
                  CancleText={t('No')}
                />
              </TouchableOpacity>
              :    
              <TouchableOpacity
                onPress={() => {
                    console.log(productuserid)
                     console.log(User._id)
                   navigation.navigate('Chat', {
                    memberID: productuser,
                    ownerID: User,
                  });
                }}
                style={styles.iconBtn}>
                <AntDesign name="message1" color={'#B2B2B2'} size={20} />
              </TouchableOpacity> }
            
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
                    {offer.map((item, index) => {
                        return (
                            <TouchableOpacity
                                onPress={() =>
                                navigation.navigate('ProductDetails', { product: item, category: item.categoryID })
                                // console.log("item",item)
                                }
                                key={index.toString()} style={[styles.item, styles.shadow]}>
                                <Image
                                    // source={require('./../../assets/images/usr.png')}
                                    source={{ uri: item.img[0] }}
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
                                        style={styles.itemTxtSec}>
                                        {getFormattedDate(item.createdAt)}
                                    </Text>

                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default customershowadv;

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
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
    item: {
        width: '90%',
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
});
