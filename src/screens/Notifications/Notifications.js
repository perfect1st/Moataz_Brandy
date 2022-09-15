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
  ActivityIndicator,
  Animated,
  Platform,
  Image,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {useSelector, useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import fileExtensions from '../../components/file-extension-to-mime-types.json';
import {getUserNotifications, userNotificationSeen} from '../../services/APIs';

const Notifications = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);

  const [Processing, setProcessing] = useState(false);

  const [notifications, setNotifications] = useState([]);

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

  useEffect(() => {
    if (User) {
      setProcessing(true);
      console.log("lll",User._id);
      getUserNotifications(User._id, response => {
        setProcessing(false);
        // console.log('response.data', response.data, 'Notificationnns');
        if (response.data) {
          setNotifications(response.data);
          // console.log(response.data, 'response.dataresponse.dataresponse.data');
        }
      });
    }
  }, []);

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
          {t('Notifications')}
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
        {!User ? (
          <Text numberOfLines={1} allowFontScaling={false} style={styles.title}>
            {t('Login first')}
          </Text>
        ) : Processing ? (
          <ActivityIndicator
            color={'#999999'}
            size={'large'}
            style={{marginTop: 32}}
          />
        ) : notifications.length == []? (
          <Text style={styles.NoNot}> 
                    {t('No Notif')}
                  </Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            {notifications.map((item, index) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    item.seen == 1 &&
                      userNotificationSeen(item._id, response => {
                        console.log(response);
                        if (User) {
                          setProcessing(true);
                          getUserNotifications(User._id, response => {
                            setProcessing(false);
                            console.log(
                              'response.data',
                              response.data,
                              'Notificationnns',
                            );
                            if (response.data) {
                              setNotifications(response.data);
                            }
                          });
                        }
                      });
                    if (item.status != 2) {
                      navigation.navigate('ProductDetails', {
                        category: item.offers.categoryID,
                        product: item.offers,
                      });
                    }
                  }}
                  key={index.toString()}
                  style={{
                    width: '100%',
                    // flexDirection: 'row',
                    paddingHorizontal: 12,
                    marginTop: 8,
                    borderBottomColor: '#EEEEEE',
                    borderBottomWidth: 1,
                    paddingVertical: 4,
                    backgroundColor: item.seen == 1 ? '#ccc' : '#fff',
                  }}
                  // style={styles.item}
                >
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                    }}>
                      <Image
                    source={require('./../../assets/images/usr.png')}
                    style={styles.itemImage}
                  />
                  <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxt}>
                    {item.msg}
                  </Text>
                    </View>
                  {/* add time to date */}
                  <Text
                  style={{fontSize:Platform.OS === 'android' ? 8 : 10}}
                    allowFontScaling={false}
                    numberOfLines={1}
                    >
                    {getFormattedDate(item.createdAt)}
                  </Text> 
                  
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
const styles = StyleSheet.create({
  NoNot:{
    color: 'black',
    fontSize: 16,
    textAlign:'center',
    fontFamily:'Cairo-Regular',
    alignItems:'center',
    paddingTop: 150,
    direction:'rtl'
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
  scrollView: {flexGrow: 1, alignItems: 'center', paddingBottom: 22},
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
    paddingHorizontal: 12,
    marginTop: 8,
    borderBottomColor: '#EEEEEE',
    borderBottomWidth: 1,
    paddingVertical: 4,
    alignItems: 'center',
  },
  itemImage: {
    width: 30,
    height: 30,
    resizeMode: 'cover',
  },
  itemTxt: {
    flex: 1,
    textAlign: 'left',
    fontSize: Platform.OS === 'android' ? 12 : 14,
    marginHorizontal: 12,
    color: '#202F3A',
    fontFamily: 'Cairo-Regular',
  },
  title: {
    width: '100%',
    fontSize: Platform.OS === 'android' ? 14 : 16,
    color: '#444',
    textAlign: 'center',
    fontFamily: 'Cairo-Bold',
    marginTop: 18,
  },
});
