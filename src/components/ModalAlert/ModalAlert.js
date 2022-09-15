import React, {Component} from 'react';
import {View, Text, Pressable , Modal ,StyleSheet} from 'react-native';

const ModalAlert = (props) => {

  const { Title, TextBody, onPress , Mvasible , CancleText} = props;


  return (
    <Modal
            // animationType='slide'
            transparent={true}
            visible={Mvasible}>
            <View style={styles.centeredViewPhoto}>
              <View style={styles.modalViewM}>
              <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 5,
                    fontSize: 20,
                    color: 'black',
                    fontFamily: 'Cairo-Bold'
                  }}>
                  {Title}
                </Text>
                <Text style={{textAlign:'center' , fontSize:18 , fontFamily: 'Cairo-Regular'}}>
                  { '\n' + TextBody + '\n \n'}
                </Text>
                <View style={{alignItems : 'center'}}>
                
                <Pressable 
                style={[
                      styles.subviewoverlay,
                      {
                        backgroundColor: '#F8B704',
                      },
                    ]}
                onPress={() => onPress()}>
                  <Text   style={
                        ([styles.subviewoverlaytext],
                        {color: 'white', alignSelf: 'center' , fontFamily: 'Cairo-Bold', fontSize: 16})
                      }>{CancleText}</Text>
                </Pressable></View>

              </View>
            </View>
          </Modal>
  );
};

export default ModalAlert;

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
    borderRadius: 20,
    padding: 18,
    paddingTop: -0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '60%',
    marginBottom: 100,
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
});