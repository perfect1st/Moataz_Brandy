import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  Image,
  Text,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import {useSelector, useDispatch} from 'react-redux';

import {useTranslation} from 'react-i18next';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import fileExtensions from '../../components/file-extension-to-mime-types.json';

import {getInbox, blockMessage, deleteMessage} from './../../services/APIs';
import ModalAlert from '../../components/ModalAlert/ModalAlert';

const Messages = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);

  const [Processing, setProcessing] = useState(false);

  const [messages, setMessage] = useState([]);

  useEffect(() => {
    if (User) {
      setProcessing(true);
      getInbox(User._id, response => {
        setProcessing(false);
        if (response.data) {
          setMessage(response.data);
          response.data.forEach(element => {
               console.log( " \n DATA" ,element.lastMsgID,"data chat \n ");
          console.log( " \n DATA" ,User._id,"data chat \n ");
            console.log( " \n DATA" ,element.seen,"data chat \n ");
          });
         
        } else {
          seterrorv(!errorv)
        }
      });
    }
  }, []);
  const [errorv, seterrorv] = useState(false);
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
          {t('Messages')}
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
        ) : messages.length == []? (
          <Text style={styles.NoMes}> 
                    {t('No Mes')}
                  </Text>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollView}>
            {messages.map((item, index) => {
              return (
                
                <TouchableOpacity
                  onPress={() => {
                    if(User._id == item.ownerID._id & item.blockOwner != 2 ||
                    User._id == item.memberID._id & item.blockMember != 2){
                      
                       navigation.navigate('Chat', {
                          memberID: item.memberID,
                          ownerID: item.ownerID,
                        });
                        
                    }else{
                      return null
                    }
                  }}
                  key={index.toString()}
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: (item.lastMsgID == User._id|| (item.lastMsgID != User._id && item.seen == 2) )  ? '#fff' : '#ccc',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    marginTop: 5,
                    borderRadius: 12,
                    borderBottomWidth:1,
                    borderBottomColor:'grey',
                
                    }}>
                  <Image
                    source={
                      User._id == item.memberID._id
                        ? item.ownerID.logo
                          ? {uri: item.ownerID.logo}
                          : require('./../../assets/images/usr.png')
                        : item.memberID.logo
                        ? {uri: item.memberID.logo}
                        : require('./../../assets/images/usr.png')
                    }
                    style={styles.itemImage}
                  />
                  <View style={styles.itemCol}>
                 
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemTxt}>
                      {User._id == item.memberID._id
                        ? i18n.language == 'ar'
                          ? item.ownerID.fullnameAR
                          : item.ownerID.fullnameEN
                        : i18n.language == 'ar'
                        ? item.memberID.fullnameAR
                        : item.memberID.fullnameEN}
                    </Text>
                    
                     
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemTxtSec}>
                      {item.lastMsg}
                    </Text>
                     
                     <Text
                    allowFontScaling={false}
                    numberOfLines={1}
                    style={styles.itemTxtSec}>
                    {getFormattedDate(item.updatedAt)}
                  </Text>
                    
                   
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (User) {
                        var status = item.status == 1 ? 2 : 1;
                        if (item.ownerID._id == User._id) {
                          blockMessage(
                            item._id,
                            (User._id == item.ownerID._id) &
                              (item.blockOwner != 2)
                              ? 2
                              : 1,
                            1,
                            response => {
                              if (response.data) {
                                getInbox(User._id, response => {
                                  setProcessing(false);
                                  if (response.data) {
                                    setMessage(response.data);
                                   
                                  } else {
                                   seterrorv(!errorv)
                                  }
                                });
                              }
                            },
                          );
                        } else {
                          blockMessage(
                            item._id,
                            (User._id == item.memberID._id) &
                              (item.blockMember != 2)
                              ? 2
                              : 1,
                            2,
                            response => {
                              if (response.data) {
                                getInbox(User._id, response => {
                                  setProcessing(false);
                                  if (response.data) {
                                    setMessage(response.data);
                                    // console.log(response.data);
                                  } else {
                                    seterrorv(!errorv)
                                  }
                                });
                              }
                            },
                          );
                        }
                      }
                    }}
                    style={styles.itemBanBtn}>
                    <Text
                      allowFontScaling={false}
                      numberOfLines={1}
                      style={styles.itemBanBtnTxt}>
                      {(User._id == item.ownerID._id) &
                        (item.blockOwner != 2) ||
                      (User._id == item.memberID._id) & (item.blockMember != 2)
                        ? // item.status == 1

                          t('Ban')
                        : t('Unblock')}
                    </Text>
                  </TouchableOpacity>
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
                    onPress={() => {
                      if (User) {
                        if (item.ownerID._id == User._id) {
                          // console.log(item._id, 'dhjghasdasdg');
                          deleteMessage(item._id, 1, response => {
                            if (response.data) {
                              getInbox(User._id, response => {
                                setProcessing(false);
                                if (response.data) {
                                  setMessage(response.data);
                                  // console.log(response.data);
                                } else {
                                 seterrorv(!errorv)
                                }
                              });
                            }
                          });
                        }
                        if (item.memberID._id == User._id) {
                          deleteMessage(item._id, 2, response => {
                            // console.log(item._id, 'dhjghasdasdg');

                            if (response.data) {
                              // console.log(
                              //   response.data,
                              //   'delllllllllllllllllllllet',
                              // );

                              getInbox(User._id, response => {
                                setProcessing(false);
                                if (response.data) {
                                  setMessage(response.data);
                                  // console.log(response.data, "delllllllllllllllllllllet");
                                } else {
                                 seterrorv(!errorv)
                                }
                              });
                            }
                          });
                        }
                      }
                    }}
                    style={styles.itemDeleteBtn}>
                    <FontAwesome5 name={'trash'} color={'#202F3A'} size={15} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  NoMes:{
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
    height: 62,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
  },
  itemTxt: {
    width: '100%',
    textAlign: 'left',
    fontSize: 15,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
    marginBottom: 0,
    paddingBottom:0,
  },
  itemTxtSec: {
    marginTop: 0,
    paddingTop:0,
    width: '100%',
    textAlign: 'left',
    fontSize: 14,
    color: 'black',
    fontFamily: 'Cairo-Regular',
  },
  itemBanBtn: {
    paddingVertical: 2,
    paddingHorizontal: 12,
    backgroundColor: '#202F3A',
    borderRadius: 8,
  },
  itemBanBtnTxt: {
    textAlign: 'center',
    fontSize: 12,
    color: '#D6A230',
    fontFamily: 'Cairo-Regular',
  },
  itemDeleteBtn: {
    padding: 12,
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
