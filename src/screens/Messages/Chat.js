import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StatusBar,
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  I18nManager,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  Text,
  Keyboard,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler'

const {width, height} = Dimensions.get('window');
import {useSelector, useDispatch} from 'react-redux';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import ModalAlert from '../../components/ModalAlert/ModalAlert';

import {useTranslation} from 'react-i18next';

import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {getChatMsgs, sendMsg, uploadPhoto} from './../../services/APIs';
import {launchImageLibrary} from 'react-native-image-picker';

const AddAdvData = ({navigation, route}) => {
  const {t, i18n} = useTranslation();
  const User = useSelector(state => state.AuthReducer.User);
  const pickImageFromPhone = () => {
    const options = {
      mediaType: 'photo',
    };
    launchImageLibrary(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        // setProcessing(false)
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        // setProcessing(false)
        console.log('ImagePicker Error: ', response.error);
      } else if (response.errorMessage) {
        // setProcessing(false)
        console.log('User tapped custom button: ', response.errorMessage);
      } else {
        const source = {
          uri:
            Platform.OS === 'android'
              ? response.uri
              : response.uri.replace('file://', ''),
          fileName: response.fileName,
          type: response.type,
        };
        uploadPhoto(source, response => {
          if (response.data) {
            // console.log('hi');
            // updateUser(User._id, { logo: response.data }, async response2 => {
            //   console.log(response2);
            //   if (response2.data) {
            //     await AsyncStorage.setItem(
            //       'User',
            //       JSON.stringify(response2.data),
            //     );
            //     dispatch(SaveUser(response2.data));
            //   }
            // });
            sendMsg(
              ownerID._id,
              memberID._id,
              2,
              response.data,
              User._id,
              response => {
                if (response.data) {
                  var arr = [...messages];
                  var obj = response.data;
                  obj.userID = User;
                  arr.push(obj);
                  setMessage(arr);
                }
              },
            );
          } else {
          }
        });
      }
    });
  };
  const memberID = route.params.memberID;
  const ownerID = route.params.ownerID;

  // console.log(memberID._id + "   ", ownerID._id,
  //   'hhihihi');

  const [Processing, setProcessing] = useState(false);

  const [messages, setMessage] = useState([]);
  const [msg, setMsg] = useState(null);

  const scrollview = useRef();
  const [scrollFlag, setScrollFlag] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const [errorv, seterrorv] = useState(false);
  useEffect(() => {
    setProcessing(true);
    console.log(ownerID);
    console.log(memberID);
    console.log(User._id);
    getChatMsgs(ownerID._id, memberID._id, User._id, response => {
      setProcessing(false);
      // console.log("response.data", response.data, "---*-*-**-*-*-*-chat-----******")
      if (response.data) {
        var data = {},
          arrofdata = [];
        for (let index = 0; index < response.data.length; index++) {
          console.log(
            response.data[index].deleteMember,
            'deleteMemberdeleteMemberdeleteMemberdeleteMember',
          );
          console.log(
            response.data[index].deleteOwner,
            'deleteOwnerdeleteOwnerdeleteOwnerdeleteOwner',
          );

          // console.log(response.data[index].deleteMember, "yama");
          let owner = 1;
          if (ownerID._id == User._id) {
            owner = 1;
          }
          if (memberID._id == User._id) {
            owner = 2;
          }
          if (ownerID._id == User._id) {
            console.log('owwwnerererer');
            if (response.data[index].deleteOwner != 2) {
              data = response.data[index];
              console.log(
                'response.data[index].deleteOwner',
                'owwwwwwwwwwwwwwner',
              );
              arrofdata.push(data);
            }
          }
          if (memberID._id == User._id) {
            console.log('meeeeeeeeeember');
            if (response.data[index].deleteMember != 2) {
              data = response.data[index];
              console.log('meeeeeeeeeemberresbonseeeeeeeeeeeeeee');
              arrofdata.push(data);
            }
          }
        }
        setMessage(arrofdata);
      } else {
        seterrorv(!errorv);
      }
    });
  }, []);

  const sendTxtMsg = () => {
    console.log('sending')
    const msgTemp = msg;
    if (msg) {
      setMsg(null);
      sendMsg(ownerID._id, memberID._id, 1, msgTemp, User._id, response => {
        if (response.data) {
          var arr = [...messages];
          var obj = response.data;
          obj.userID = User;
          arr.push(obj);
          setMessage(arr);
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
            navigation.goBack();
          }}>
          <AntDesign
            name="arrowright"
            color={'#FFF'}
            size={32}
            style={styles.flipRTL}
          />
        </TouchableOpacity>
        <Image
          source={
            User._id == memberID._id
              ? ownerID.logo
                ? {uri: ownerID.logo}
                : require('./../../assets/images/usr.png')
              : memberID.logo
              ? {uri: memberID.logo}
              : require('./../../assets/images/usr.png')
          }
          style={styles.usrImg}
        />
        {/* <TouchableOpacity onPress={()=>{
    navigation.navigate('MyAdvs',{

      id:memberID._id
    });
}} > */}

        <Text
          allowFontScaling={false}
          numberOfLines={1}
          onPress={() => {
            navigation.navigate('customershowadv', {
              productuserid:
                memberID._id == User._id ? ownerID._id : memberID._id,
              name:
                i18n.language == 'ar'
                  ? memberID._id == User._id
                    ? ownerID.fullnameAR
                    : memberID.fullnameAR
                  : memberID._id == User._id
                  ? ownerID.fullnameEN
                  : memberID.fullnameEN,
            });
          }}
          style={styles.headerTxt}>
          {User._id == memberID._id
            ? i18n.language == 'ar'
              ? ownerID.fullnameAR
              : ownerID.fullnameEN
            : i18n.language == 'ar'
            ? memberID.fullnameAR
            : memberID.fullnameEN}
        </Text>
        <View style={styles.headerIcon} />

        {/* </TouchableOpacity> */}
      </View>
    );
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
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' && 'padding'}
        style={styles.container}>
        {renderHeader()}
        <ScrollView
          ref={scrollview}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={(contentWidthChange, contentHeightChange) => {
            if (scrollFlag) {
              scrollview.current.scrollToEnd({animated: true});
            } else {
              scrollview.current.scrollTo({
                x: 0,
                y: contentHeightChange - contentHeight,
                animated: false,
              });
              setScrollFlag(true);
            }
            setContentHeight(contentHeightChange);
          }}>
          {Processing ? (
            <ActivityIndicator
              color={'#999999'}
              size={'large'}
              style={{marginTop: 32}}
            />
          ) : (
            messages.map((item, index) => {
              // var hour = new Date(item.createdAt);
              // console.log(
              //   '.getHours()',
              //   hour.getHours() + ':' + hour.getMinutes(),
              // );
              return item.userID._id.toString() != User._id.toString() ? (
                item.type == 1 ? (
                  <View key={index.toString()} style={styles.fullRow}>
                    <ModalAlert
                      Title={''}
                      TextBody={t('Something went wrong')}
                      onPress={() => {
                        seterrorv(!errorv);
                      }}
                      Mvasible={errorv}
                      CancleText={t('Cancel')}
                    />
                    {/* <Image
                      source={
                        item.userID.logo
                          ? {uri: item.userID.logo}
                          : require('./../../assets/images/usr.png')
                      }
                      style={styles.senderImg}
                    /> */}
                    <View style={styles.senderMsg}>
                      <Text
                        allowFontScaling={false}
                        style={styles.senderMsgTxt}>
                        {item.msg}
                      </Text>
                      <Text
                        allowFontScaling={false}
                        style={styles.recieverTimeTxt}>
                        {/* {item.msg} */}

                        {getFormattedDate(item.createdAt)}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                  key={index.toString()} style={styles.fullRow}>
                    {/* <Image
                      source={
                        item.userID.logo
                          ? {uri: item.userID.logo}
                          : require('./../../assets/images/usr.png')
                      }
                      style={styles.senderImg}
                    /> */}
                    <View
                      style={{
                        width: '70%',
                        // paddingHorizontal: 12,
                        // backgroundColor: '#1473E6',
                        // paddingVertical: 12,
                        marginHorizontal: 12,
                        borderRadius: 12,
                      }}>
                    <TouchableOpacity onPress={ () => navigation.navigate('Test', {
      test: [item.msg],
    })}>
                      <Image
                        source={{uri: item.msg}}
                        
                        style={{
                          height: 200,
                          width: '100%',
                          alignSelf: 'center',
                        }}
                      />
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              ) : item.type == 1 ? (
                <View key={index.toString()} style={styles.fullRowRev}>
                  <ModalAlert
                    Title={''}
                    TextBody={t('Something went wrong')}
                    onPress={() => {
                      seterrorv(!errorv);
                    }}
                    Mvasible={errorv}
                    CancleText={t('Cancel')}
                  />
                  {/* <Image
                    source={
                      item.userID.logo
                        ? {uri: item.userID.logo}
                        : require('./../../assets/images/usr.png')
                    }
                    style={styles.senderImg}
                  /> */}
                  <View style={styles.recieverMsg}>
                    <Text
                      allowFontScaling={false}
                      style={styles.recieverMsgTxt}>
                      {item.msg}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={styles.recieverTimeTxt2}>
                      {/* {item.msg} */}
                      {getFormattedDate(item.createdAt)}
                    </Text>
                  </View>
                </View>
              ) : (
                <View
                key={index.toString()} style={styles.fullRowRev}>
                  {/* <Image
                    source={
                      item.userID.logo
                        ? {uri: item.userID.logo}
                        : require('./../../assets/images/usr.png')
                    }
                    style={styles.senderImg}
                  /> */}
                  <View
                    style={{
                      width: '70%',
                      // paddingHorizontal: 12,
                      backgroundColor: '#1473E6',
                      // paddingVertical: 12,
                      marginHorizontal: 12,
                      borderRadius: 12,
                    }}>
                    <TouchableOpacity onPress={ () => navigation.navigate('Test', {
      test: [item.msg],
    })}>

                    <Image
                      source={{uri: item.msg}}
                      style={{height: 200, width: '100%', alignSelf: 'center'}}
                    />
                  </TouchableOpacity>

                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
        <View
          style={styles.container1}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.borderedField}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={text => {
                    setMsg(text);
                  }}
                  value={msg}
                  placeholder={t('Write here')}
                  textAlign={styles.textInputAlign.textAlign}
                  editable={!Processing}
                  returnKeyType={'done'}
                />
                <TouchableOpacity
                  onPress={() => {
                    pickImageFromPhone();
                  }}
                  style={styles.addPhotoBtn}>
                  <Image
                    style={styles.addPhotoBtnImg}
                    source={require('./../../assets/images/camera2.png')}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => sendTxtMsg()}
                style={styles.sendBtn}>
                <FontAwesome name={'send'} color={'#FFF'} size={22} />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddAdvData;

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
    paddingBottom: 24,
    paddingTop: 12,
    justifyContent: 'flex-end',
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
  usrImg: {
    width: 40,
    height: 40,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  fullRow: {
    width: '100%',

    paddingHorizontal: 8,
    marginTop: 8,
    flexDirection: 'row-reverse',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  senderImg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  senderMsg: {
    paddingHorizontal: 12,
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  senderMsgTxt: {
    flex: 1,
    fontSize: Platform.OS === 'android' ? 12 : 16,
    color: '#202F3A',
    fontFamily: 'Cairo-Bold',
  },
  fullRowRev: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  recieverMsg: {
    paddingHorizontal: 12,
    backgroundColor: '#1473E6',
    paddingVertical: 12,
    marginHorizontal: 12,
    borderRadius: 12,
  },
  recieverMsgTxt: {
    flex: 1,
    fontSize: Platform.OS === 'android' ? 12 : 16,
    color: '#FFF',
    fontFamily: 'Cairo-Bold',
  },
  recieverTimeTxt: {
    flex: 1,
    textAlign: 'left',
    fontSize: Platform.OS === 'android' ? 8 : 10,
    color: '#000',
    fontFamily: 'Cairo-Bold',
  },
  recieverTimeTxt2: {
    flex: 1,
    textAlign: 'right',
    fontSize: Platform.OS === 'android' ? 8 : 10,
    color: '#fff',
    fontFamily: 'Cairo-Bold',
  },
  borderedField: {
    width: '95%',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    paddingBottom: 60,
    paddingTop: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 0,
    marginBottom: -28,
  },
  textInputContainer: {
    flex: 1,
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 8,
    backgroundColor: '#EEEEEE',
    marginRight: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    fontFamily: 'Cairo-Bold',

  },
  textInputAlign: {textAlign: I18nManager.isRTL ? 'right' : 'left'},
  sendBtn: {
    height: 40,
    width: 40,
    backgroundColor: '#D6A230',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoBtn: {
    padding: 2,
  },
  addPhotoBtnImg: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
  },
});
