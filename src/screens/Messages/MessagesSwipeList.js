import React,{useState,useEffect} from 'react';
import {SafeAreaView,View,Text,StyleSheet,Animated,TouchableOpacity,StatusBar,Image,RefreshControl} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { SwipeListView } from 'react-native-swipe-list-view';
import {useSelector, useDispatch} from 'react-redux';
import {getInbox, blockMessage, deleteMessage} from './../../services/APIs';
import {useTranslation} from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const MessagesSwipeList = ({navigation}) => {
  const User = useSelector(state => state.AuthReducer.User);
  const {t, i18n} = useTranslation();

  const [listData ,setListData] = useState(

  );
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {

    setRefreshing(true);
    if (User) {
      getInbox(User._id, response => {
        if (response.data) {
          setListData(response.data);
         
        } else {
          seterrorv(!errorv)
        }
      });
    }

    wait(1000).then(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    if (User) {
      getInbox(User._id, response => {
        if (response.data) {
          setListData(response.data);
         
        } else {
          seterrorv(!errorv)
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
          {t('Messages')}
        </Text>
        <View style={styles.headerIcon} />
      </View>
    );
  };

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


  const closeRow = (rowMap,rowKey)=>{
    console.log('22222222')
    if(rowMap[rowKey]){
      rowMap[rowKey].closeRow();

    }
  }
  const enterRow = (rowMap,rowKey)=>{
    closeRow(rowMap,rowKey)
    const prev = listData.find(item => item._id === rowKey)
    if (User) {
      var status = prev.status == 1 ? 2 : 1;
      if (prev.ownerID._id == User._id) {
        blockMessage(
          prev._id,
          (User._id == prev.ownerID._id) &
            (prev.blockOwner != 2)
            ? 2
            : 1,
          1,
          response => {
            if (response.data) {
              getInbox(User._id, response => {
                if (response.data) {
                  setListData(response.data);
                 
                } else {
                }
              });
            }
          },
        );
      } else {
        blockMessage(
          prev._id,
          (User._id == prev.memberID._id) &
            (prev.blockMember != 2)
            ? 2
            : 1,
          2,
          response => {
            if (response.data) {
              getInbox(User._id, response => {
                if (response.data) {
                  setListData(response.data);
                  // console.log(response.data);
                } else {
                }
              });
            }
          },
        );
      }
    }

  }
  const deleteRow = (rowMap,rowKey)=>{
  closeRow(rowMap,rowKey)
  const newData = [...listData]
  const prevIndex = listData.findIndex(item => item._id === rowKey)
  newData.splice(prevIndex,1)
  const prev = listData.find(item => item._id === rowKey)

  if (User) {
    if (prev.ownerID._id == User._id) {
      deleteMessage(prev._id, 1, response => {
        if (response.data) {
          getInbox(User._id, response => {
            if (response.data) {
              setListData(response.data);
            } else {
            }
          });
        }
      });
    }
    if (prev.memberID._id == User._id) {
      deleteMessage(prev._id, 2, response => {

        if (response.data) {

          getInbox(User._id, response => {
            if (response.data) {
              setListData(response.data);
            } else {
            }
          });
        }
      });
    }
  }

setListData(newData)
  }
const VisibleItem = prop =>{
  const {data} = prop
  return(
    <TouchableOpacity
    activeOpacity={1.0}
    onPress={() => {
      let ownerId = data.item && data.item.ownerID._id
      if(User._id == ownerId & data.item.blockOwner != 2 ||
      User._id == data.item.memberID._id & data.item.blockMember != 2){
        
         navigation.navigate('Chat', {
            memberID: data.item.memberID,
            ownerID: data.item.ownerID,
          });
          
      }else{
        return null
      }
    }}

    >

    <View style={styles.rowFront}>
    <TouchableHighlight style={[styles.rowFrontVisible,{backgroundColor: (data.item.lastMsgID == User._id|| (data.item.lastMsgID != User._id && data.item.seen == 2) )  ? '#fff' : '#ccc'}]} >
      <View style={{flexDirection:'row'}}>
        <View style={{marginEnd:20}}>
        <Image source={
                          User._id == data.item.memberID._id
                        ? data.item.ownerID.logo
                          ? {uri: data.item.ownerID.logo}
                          : require('./../../assets/images/usr.png')
                        : data.item.memberID.logo
                        ? {uri: data.item.memberID.logo}
                        : require('./../../assets/images/usr.png')
                    }
                    style={styles.itemImage}
                  />

        </View>
    <View>
        <Text style={[styles.title,{textAlign: 'left'}]} numberOfLines={1}>
    {User._id == data.item.memberID._id
                        ? i18n.language == 'ar'
                          ? data.item.ownerID.fullnameAR
                          : data.item.ownerID.fullnameEN
                        : i18n.language == 'ar'
                        ? data.item.memberID.fullnameAR
                        : data.item.memberID.fullnameEN}
        </Text>
        <Text style={[styles.details,{textAlign:'left'}]} numberOfLines={1}>
    {data.item.lastMsg}
        </Text>

      </View>
      <View style={{flex:1,alignItems:'flex-end',justifyContent:'flex-end',paddingBottom:5}}>
      <Text
            numberOfLines={1}>
          {getFormattedDate(data.item.updatedAt)}
      </Text>

      </View>

      </View>
    </TouchableHighlight>
    </View>
    </TouchableOpacity>

  )
}

const renderItem = (data,rowMap)=>{
return(
  <VisibleItem data={data}/>
)
}

const HiddenItemWithActions = props =>{
const {onClose,onDelete,onEnter,flag} = props;
return(
<View style={styles.rowBack}>
  <TouchableOpacity onPress={onEnter}>
  {flag ? <MaterialCommunityIcons name="lock-open-variant-outline" style={styles.trash} size={25} color="black" /> : <MaterialCommunityIcons name="lock" style={styles.trash} size={25} color="red" />}
  </TouchableOpacity>

  <TouchableOpacity style={[styles.backRightBtn,styles.backRightBtnLeft]} onPress={onClose}>
  <MaterialCommunityIcons name="close-circle-outline" style={styles.trash} size={25} color="#fff"/>
  </TouchableOpacity>
  
  <TouchableOpacity style={[styles.backRightBtn,styles.backRightBtnRight]} onPress={onDelete}>
  <View style={styles.trash}>
  <MaterialCommunityIcons name="trash-can-outline" size={25} color="#fff"/>
  </View>
  
  </TouchableOpacity>

</View>
)
}

const renderHiddenItem =  (data,rowMap) => {

  
  return(<HiddenItemWithActions 
    data = {data} 
    rowMap= {rowMap} 
    onClose = {()=> closeRow(rowMap,data.item._id)}
    onDelete =  {()=> deleteRow(rowMap,data.item._id)}
    onEnter =  {()=> enterRow(rowMap,data.item._id)}
    flag = { User & (User._id == data.item && data.item.ownerID._id) &
      (data.blockOwner != 2) ||
    (User._id == data.item.memberID._id) & (data.item.blockMember != 2)
      ? true
      : false}
    />)
};
const left = i18n.language == 'ar' ? 150 : 75
const right = i18n.language == 'ar' ? -75 : -150

  return(
    <SafeAreaView style={styles.safeAreaView}>
    <StatusBar backgroundColor={'#202F3A'} barStyle={'light-content'} />

  <View style={styles.container}>
  {renderHeader()}
        <SwipeListView

            keyExtractor={item => item._id}
            data={listData}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={left}
            rightOpenValue={right}
            // disableRightSwipe
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
  
        />
  </View>
  </SafeAreaView>
  );
}

export default MessagesSwipeList;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: '#202F3A',
  },

  container:{
    backgroundColor:'#f4f4f4',
    flex:1,
  },backTextWhite:{
    color:'white'
  },rowFront:{
    backgroundColor:'#fff',
    borderRadius:5,
    height:70,
    margin:0,
    shadowColor:'#999',
    shadowOffset:{width:0,height:1},
    shadowOpacity:0.8,
    shadowRadius:2,
    elevation:5
  },
  rowFrontVisible:{
    backgroundColor:'#fff',
    borderRadius:5,
    height:70,
    padding:10,
    marginBottom:15,
  },
  rowBack:{
    alignItems:'center',
    backgroundColor:'#DDD',
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    paddingLeft:15,
    margin:0,
    marginBottom:0,
    borderRadius:5
  },
  backRightBtn:{
    alignItems:'flex-end',
    bottom:0,
    justifyContent:'center',
    position:'absolute',
    top:0,
    width:75,
    paddingRight:17
  },
  backRightBtnLeft:{
    backgroundColor:'#1f65ff',
    right:75
  },
  backRightBtnRight:{
    backgroundColor:'red',
    right:0,
    borderTopRightRadius:5,
    borderBottomRightRadius:5
  },
  trash:{
    height:25,
    width:25,
    marginRight:7
  },
  title:{
    fontSize:14,
    fontWeight:'bold',
    marginBottom:5,
    color:'#666',
    fontFamily: 'Cairo-Regular',
  },
  details:{
    fontSize:12,
    color:'#999',
    fontFamily: 'Cairo-Regular',

    // textAlign:'left'
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F1F1',
    resizeMode: 'cover',
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

})