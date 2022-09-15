
import React, { useState, useEffect, useRef } from 'react';
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
const { width, height } = Dimensions.get('window');
import { Input } from 'native-base';

import { useTranslation } from 'react-i18next';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';
import { searchforword } from '../../services/APIs';
import { useSelector } from 'react-redux';
import ModalAlert from '../../components/ModalAlert/ModalAlert';

// create a component

const SearchScreen = ({ navigation }) => {
    const User = useSelector(state => state.AuthReducer.User);
    const { t, i18n } = useTranslation();
    const [searchTxt, setSearchTxt] = useState(null);
    const [searchresopns, setsearchresopns] = useState([]);
    const [data, setData] = useState([]);
    const [loginv, setloginv] = useState(false);



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
    const search = () => {
        if (searchTxt) {
            searchforword(searchTxt, response => {
                if (response.data) {
                    var responseArr = response.data;
                    setData(responseArr)
                    console.log(responseArr);
                    // var arr = [];
                    // for (let index = 0;index < responseArr.length;index++) {
                    //   const element = responseArr[index];
                    //   arr.push(element.offersID._id);
                    //   if (index == responseArr.length - 1) {
                    //     dispatch(setFavourites(arr));
                    //   }
                    // }
                }
            })

        }
    };
    const renderHeader = () => {
        return (
            <View style={styles.header}>
                <View
                    style={styles.headerIcon}
                >
                </View>
                <TouchableOpacity onPress={() => { navigation.navigate("SearchScreen") }} style={styles.searchInput}>
                    <FontAwesome5 name="search" size={22} color={'#202F3A'} />
                    <Input
                        placeholder={t('Search')}
                        // ref={ref}
                        placeholderTextColor={'#B2B2B2'}
                        defaultValue={searchTxt}
                        returnKeyType={'done'}
                        style={{ flex: 1, color: '#000' ,fontFamily: 'Cairo-Bold'}}
                        textAlign={styles.inputFieldsText.textAlign}
                        onChangeText={text => {
                            setSearchTxt(text);
                        }}
                        onSubmitEditing={() => {
                            search();
                        }}
                    />



                </TouchableOpacity>
                <View style={styles.headerIcon} />
            </View>
        );
    };
    const renderListItem = ({ item, index }) => {
        console.log(item);
        return (
            <TouchableOpacity
                onPress={() =>
                    navigation.navigate('ProductDetails', { category: item.categoryID, product: item })
                }
                // key={index.toString()}
                style={[styles.item, styles.shadow]}>
                <View style={styles.itemCol}>
                    <Text
                        allowFontScaling={false}
                        numberOfLines={2}
                        style={styles.itemTxt}>
                        {i18n.language == 'ar'
                            ? item.titleAR
                            : item.titleEN}
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
                </View>

                <TouchableOpacity
                    onPress={() => {
                        if (User) {
                            addRemoveFromFav(item);
                        } else {
                            setloginv(!loginv);
                        }
                    }}
                    style={styles.itemDeleteBtn}>
                    {/* <FontAwesome name={'heart-o'} color={'#FFF'} size={22} /> */}
                </TouchableOpacity>
                <Image source={{ uri: item.img[0] }} style={styles.itemImage} />
            </TouchableOpacity>
        )
    };
    const renderItem = ({ item }) => {

        return (

            <View style={{
                height: 100, alignSelf: "center", borderRadius: 12,
                width: "90%", backgroundColor: "#000", marginVertical: 10
            }} >

            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View style={styles.gridContainer}>
                <ModalAlert
                    Title={''}
                    TextBody={t('Login first')}
                    onPress={() => {
                        setloginv(!loginv);
                    }}
                    Mvasible={loginv}
                    CancleText={t('Cancel')}
                />
                {data.length == 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={styles.titleNew}>{t(`There are no search results !`)}</Text>
                    </View>
                    :
                    <FlatList
                        data={data}
                        renderItem={renderListItem}
                        keyExtractor={item => item._id}
                    />
                }
            </View>
        </SafeAreaView>
    );
};

// define your styles
const styles = StyleSheet.create({

    titleNew: {
        flex: 1,
        color: '#202F3A',
        fontFamily: 'Cairo-Bold',
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
    scrollView: { flexGrow: 1, alignItems: 'center', paddingBottom: 22 },
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
    inputFieldsText: { textAlign: I18nManager.isRTL ? 'right' : 'left' },
    advContainer: { width: '100%', height: height * 0.18 },
    advSliderItem: { width, backgroundColor: '#FFF' },
    advSliderItemImg: { flex: 1, width: null, height: null, resizeMode: 'cover' },
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
        width: null,
        height: null,
        resizeMode: 'cover',
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
        paddingHorizontal: 4,
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
        marginTop: 4,
        borderRadius: 12,
        alignSelf: "center", marginBottom: 4
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
        fontFamily: 'Cairo-Bold',
    },
    itemTxtSec: {
        flex: 1,
        textAlign: 'left',
        fontSize: 12,
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
        // justifyContent: 'space-evenly',
        paddingHorizontal: width * 0.05,
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
        marginHorizontal: width * 0.025,
    },
    itemImageSquare: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 12,
        backgroundColor: '#F1F1F1',
        resizeMode: 'cover',
    },
    itemColSquare: {
        paddingHorizontal: 12,
        width: '100%',
        backgroundColor: '#EEEEEE',
        borderRadius: 18,
        marginTop: -18,
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

//make this component available to the app
export default SearchScreen;
