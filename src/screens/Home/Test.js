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
    Modal,
    FlatList,
    Alert,
    Image,
    Text,
    ImageBackground,
    Linking,
    ImageManipulator,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import { Input } from 'native-base';

import { useTranslation } from 'react-i18next';
import ImageView from "react-native-image-viewing";
import ImageViewer from 'react-native-image-zoom-viewer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {SliderBox} from 'react-native-image-slider-box';
const Test = ({ navigation, route }) => {

    const [visible, setIsVisible] = useState(true);
    const test2 = route.params.test;
    const [modalVisible, setModalVisible] = useState(false);
    const [num, setnum] = useState(0);
    console.log("test2", test2);

  
    return (
        <SafeAreaView style={styles.safeAreaView}>

          <Image
    source={require('../../../ic_launcher_round.png')}
    style={{
      height: 100,
      width: 100,
      opacity: 0.8,
      background: 'transparent',
      position: 'absolute',
      right: 0,
      bottom: 0,
      zIndex: 1,
      right: 18,
    }}
  />
      
  <SliderBox
          images={test2}
          sliderBoxHeight={'100%'}
         
        />

          <TouchableOpacity
          style={{
            // height: '8%',
            // width: '8%',
           position: 'absolute',
            right: 22,
            top: 50,
            width: 35,
            height: 35,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: '#EEEEEE',
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 4,
          }}
          onPress={() => {
          navigation.goBack()
          }}>
          <Text style={{ fontSize: 22, color: '#000' }}>X</Text>
        </TouchableOpacity>


        </SafeAreaView>
    );
};

export default Test;


const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        // backgroundColor: '#FFF',
        // flexWrap: 'wrap',    paddingTop: 50,
        // paddingTop: 50,

    },
    tinyLogo: {
      width: "100%",
      height: "100%",
    },
});




// <ImageView
// //     images={images}
// //     imageIndex={0}
// //     visible={visible}
// //     onRequestClose={() => navigation.goBack() && setIsVisible(false)}
// // />


// const myArray =  ['position zero', 'position one', 'position three', 'position four'];

// const res = myArray.map(position => ({position}));
// console.log(res);





// <View
// style={{
//   height: '100%',
//   width: '100%',
//   flex: 1,
// }}>
// <View
//   style={{
//     height: '100%',
//     width: '100%',
//     flex: 1,
//   }}>
//   <Image
//     source={require('../../../ic_launcher_round.png')}
//     style={{
//       height: 100,
//       width: 100,
//       opacity: 0.8,
//       background: 'transparent',
//       position: 'absolute',
//       right: 0,
//       bottom: 0,
//       zIndex: 1,
//     }}
//   />

//   <ImageBackground
//     style={{
//       height: height,
//       width: width,
//   // backgroundColor:'red',
//   // width: 600,
//   // height: 800
//     }}
//     source={{ uri: test2[0]}}
//   />
// </View>

// <TouchableOpacity
//   style={{
//     height: '5%',
//     width: '5%',
//     position: 'absolute',
//     right: 20,
//     top: 5,
//   }}
//   onPress={() => {
//   navigation.goBack()
//   }}>
//   <Text style={{ fontSize: 22, color: '#D6A230' }}>X</Text>
// </TouchableOpacity>

// {num != test2 - 1 && (
//   <TouchableOpacity
//     onPress={() => {
//       let x = num;
//       console.log(num, 'asjdsad');
//       setnum(x + 1);
//     }}
//     style={{
//       width: 30,
//       height: 30,
//       borderRadius: 8,
//       marginTop: height / 2,
//       borderWidth: 1,
//       borderColor: '#EEEEEE',
//       backgroundColor: '#D6A230',
//       justifyContent: 'center',
//       alignItems: 'center',
//       margin: 4,
//       position: 'absolute',
//     }}>
//     <AntDesign
//       name="arrowright"
//       color={'#fff'}
//       size={30}
//       style={styles.flipRTL}
//     />
//   </TouchableOpacity>
// )}
// {num != 0 && (
//   <TouchableOpacity
//     onPress={() => {
//       let x = num;
//       console.log(num, '*****asjdsadjjj***');
//       setnum(x - 1);
//     }}
//     style={{
//       width: 30,
//       height: 30,
//       marginTop: height / 2,
//       borderRadius: 8,
//       borderWidth: 1,
//       borderColor: '#EEEEEE',
//       backgroundColor: '#D6A230',
//       justifyContent: 'center',
//       alignItems: 'center',
//       position: 'absolute',
//       right: 0,
//       margin: 4,
//     }}>
//     <AntDesign
//       name="arrowleft"
//       color={'#fff'}
//       size={30}
//       style={styles.flipRTL}
//     />
//   </TouchableOpacity>
// )}

// </View>
