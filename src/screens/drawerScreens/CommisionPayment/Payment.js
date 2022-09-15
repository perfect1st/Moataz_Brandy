import React from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  I18nManager,
} from 'react-native';

import axios from 'axios';
import CryptoJS from 'crypto-js';
import queryString from 'query-string';
import publicIP from 'react-native-public-ip';

import {WebView} from 'react-native-webview';

import {config} from './../../../services/URWAY/config';
import {TouchableOpacity} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';

class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      baseURL: '',
      visible: true,
    };
  }

  componentDidMount() {
    const requestData = this.props.route.params.request;
    const sourcePage = this.props.route.params.source;

    // console.log('requestData', requestData);
    // console.log('sourcePage', sourcePage);
    // console.log('callBack', this.props.route.params.callBack);

    this.setState({source: sourcePage}, () => {
      this.processPayment(requestData)
        .then(response => {
          if (response.status == 'redirect') {
            this.setState({baseURL: response.redirectUrl});
          } else if (response.status == 'success') {
            //go back with success before processing payment
            this.returnResponse({status: 'success', data: {}});
          }
        })
        .catch(err => {
          //go back with error
          this.returnResponse({status: 'error', error: err});
        });
    });
  }

  onPaymentComplete = processUrl => {
    this.processResponse(processUrl)
      .then(response => {
        //go back with success after processing payment
        this.returnResponse({status: 'success', data: response});
      })
      .catch(err => {
        //go back with error
        this.returnResponse({status: 'error', error: err});
      });
  };

  returnResponse = data => {
    const {navigation} = this.props;
    setTimeout(() => {
      if (
        this.props.route &&
        this.props.route.params &&
        this.props.route.params.callBack
      ) {
        this.props.route.params.callBack(data);
      }
    }, 500);
    navigation.pop();
  };

  processPayment = requestData => {
    return new Promise((resolve, reject) => {
      const txn_details =
        '' +
        requestData['trackid'] +
        '|' +
        config.terminalId +
        '|' +
        config.password +
        '|' +
        config.key +
        '|' +
        requestData['amount'] +
        '|' +
        config.currency +
        '';
      const hash = CryptoJS.SHA256(txn_details).toString();

      publicIP()
        .then(ip => {
          let fields = {};
          if (
            requestData['action'] == '1' ||
            requestData['action'] == '4' ||
            requestData['action'] == '13'
          ) {
            if (
              requestData['trackid'] == '' ||
              requestData['customerEmail'] == '' ||
              requestData['first_name'] == '' ||
              requestData['last_name'] == '' ||
              requestData['country'] == '' ||
              requestData['amount'] == ''
            ) {
              reject('Required data for payment missing.');
            } else {
              if (
                requestData['cardToken'] != '' ||
                requestData['cardToken'] != null
              ) {
                fields = {
                  trackid: requestData['trackid'],
                  transid: requestData['trackid'],
                  terminalId: config.terminalId,
                  customerEmail: requestData['customerEmail'],
                  customerName:
                    requestData['first_name'] + ' ' + requestData['last_name'],
                  action: requestData['action'],
                  instrumentType: 'DEFAULT',
                  merchantIp: ip,
                  password: config.password,
                  currency: config.currency,
                  country: requestData['country'],
                  amount: requestData['amount'],
                  udf2: requestData['udf2'],
                  udf3: requestData['udf3'],

                  udf1: '1234',
                  udf5: '1234',
                  udf4: '1234',
                  tokenizationType: requestData['tokenizationType'],
                  cardToken: requestData['cardToken'],
                  requestHash: hash,
                };
              } else {
                fields = {
                  trackid: requestData['trackid'],
                  transid: requestData['trackid'],
                  terminalId: config.terminalId,
                  customerEmail: requestData['customerEmail'],
                  customerName:
                    requestData['first_name'] + ' ' + requestData['last_name'],
                  action: requestData['action'],
                  instrumentType: 'DEFAULT',
                  merchantIp: ip,
                  password: config.password,
                  currency: config.currency,
                  country: requestData['country'],
                  amount: requestData['amount'],
                  udf2: requestData['udf2'],
                  udf3: requestData['udf3'],

                  udf1: '1234',
                  udf5: '1234',
                  udf4: '1234',
                  requestHash: hash,
                };
              }
            }
          } else if (requestData['action'] == '12') {
            if (
              requestData['trackid'] == '' ||
              requestData['customerEmail'] == '' ||
              requestData['first_name'] == '' ||
              requestData['last_name'] == '' ||
              requestData['country'] == '' ||
              requestData['amount'] == ''
            ) {
              reject('Required data for payment missing.');
            } else {
              if (requestData['tokenOperation'] == 'A') {
                fields = {
                  trackid: requestData['trackid'],
                  transid: requestData['trackid'],
                  terminalId: config.terminalId,
                  instrumentType: 'DEFAULT',
                  customerEmail: requestData['customerEmail'],
                  customerName:
                    requestData['first_name'] + ' ' + requestData['last_name'],
                  action: requestData['action'],
                  merchantIp: ip,
                  password: config.password,
                  currency: config.currency,
                  country: requestData['country'],
                  amount: requestData['amount'],
                  udf2: requestData['udf2'],
                  udf3: requestData['udf3'],

                  udf1: '1234',
                  udf5: '1234',
                  udf4: '1234',
                  tokenizationType: requestData['tokenizationType'],
                  tokenOperation: requestData['tokenOperation'],
                  requestHash: hash,
                };
              } else {
                if (requestData['cardToken'] == '') {
                  reject('Required data for tokenization missing.');
                } else {
                  fields = {
                    trackid: requestData['trackid'],
                    transid: requestData['trackid'],
                    terminalId: config.terminalId,
                    customerEmail: requestData['customerEmail'],
                    customerName:
                      requestData['first_name'] +
                      ' ' +
                      requestData['last_name'],
                    action: requestData['action'],
                    instrumentType: 'DEFAULT',
                    merchantIp: ip,
                    password: config.password,
                    currency: config.currency,
                    country: requestData['country'],
                    amount: requestData['amount'],
                    udf2: requestData['udf2'],
                    udf3: requestData['udf3'],

                    udf1: '1234',
                    udf5: '1234',
                    udf4: '1234',
                    cardToken: requestData['cardToken'],
                    tokenizationType: requestData['tokenizationType'],
                    tokenOperation: requestData['tokenOperation'],
                    requestHash: hash,
                  };
                }
              }
            }
          } else {
            if (
              requestData['trackid'] == '' ||
              requestData['customerEmail'] == '' ||
              requestData['first_name'] == '' ||
              requestData['last_name'] == '' ||
              requestData['country'] == '' ||
              requestData['amount'] == ''
            ) {
              reject('Required data for payment missing.');
            } else {
              if (
                requestData['cardToken'] != '' ||
                requestData['cardToken'] != null
              ) {
                fields = {
                  trackid: requestData['trackid'],
                  transid: requestData['tranid'],
                  terminalId: config.terminalId,
                  instrumentType: 'DEFAULT',
                  customerEmail: requestData['customerEmail'],
                  customerName:
                    requestData['first_name'] + ' ' + requestData['last_name'],
                  action: requestData['action'],
                  merchantIp: ip,
                  password: config.password,
                  currency: config.currency,
                  country: requestData['country'],
                  amount: requestData['amount'],
                  udf2: requestData['udf2'],
                  udf3: requestData['udf3'],

                  udf1: '1234',
                  udf5: '1234',
                  udf4: '1234',
                  tokenizationType: requestData['tokenizationType'],
                  cardToken: requestData['cardToken'],
                  requestHash: hash,
                };
              } else {
                fields = {
                  trackid: requestData['trackid'],
                  transid: requestData['tranid'],
                  terminalId: config.terminalId,
                  instrumentType: 'DEFAULT',
                  customerEmail: requestData['customerEmail'],
                  customerName:
                    requestData['first_name'] + ' ' + requestData['last_name'],
                  action: requestData['action'],
                  merchantIp: ip,
                  password: config.password,
                  currency: config.currency,
                  country: requestData['country'],
                  amount: requestData['amount'],
                  udf2: requestData['udf2'],
                  udf3: requestData['udf3'],

                  udf1: '1234',
                  udf5: '1234',
                  udf4: '1234',
                  requestHash: hash,
                };
              }
            }
          }

          const data = JSON.stringify(fields);

          axios
            .request({
              method: 'post',
              url: config.requestUrl,
              headers: {
                'Content-Type': 'application/json',
              },
              data: data,
            })
            .then(response => {
              const urldecode = response.data;
              if (urldecode['payid'] != undefined) {
                let url = '';
                if (urldecode['targetUrl'].includes('?')) {
                  url =
                    urldecode['targetUrl'] + 'paymentid=' + urldecode['payid'];
                } else {
                  url =
                    urldecode['targetUrl'] + '?paymentid=' + urldecode['payid'];
                }

                resolve({status: 'redirect', redirectUrl: url});
              } else {
                if (urldecode['result'] != undefined) {
                  if (urldecode['result'] == 'Successful') {
                    resolve({status: 'success'});
                  } else {
                    let responsecode = '';
                    if (urldecode['responsecode'] != undefined) {
                      responsecode = urldecode['responsecode'];
                    } else {
                      responsecode = urldecode['responseCode'];
                    }

                    const json = {
                      result: '1',
                      responsecode: responsecode,
                      description: responsecode,
                    };

                    const json_data = JSON.stringify(json);
                    console.log(json_data);

                    reject(
                      'Something went wrong! Response Code - ' + responsecode,
                    );
                  }
                }
              }
            })
            .catch(function (error) {
              console.log(error);
              reject('Something went wrong!');
            });
        })
        .catch(error => {
          console.log(error);
          reject('Something went wrong detecting ip!');
        });
    });
  };

  processResponse = responseUrl => {
    return new Promise((resolve, reject) => {
      const responseObject = queryString.parse(responseUrl);

      const requestHash =
        '' +
        responseObject['TranId'] +
        '|' +
        config.key +
        '|' +
        responseObject['ResponseCode'] +
        '|' +
        responseObject['amount'] +
        '';
      const txn_details1 =
        '' +
        responseObject['TrackId'] +
        '|' +
        config.terminalId +
        '|' +
        config.password +
        '|' +
        config.key +
        '|' +
        responseObject['amount'] +
        '|' +
        config.currency +
        '';

      const hash = CryptoJS.SHA256(requestHash).toString();
      const hash1 = CryptoJS.SHA256(txn_details1).toString();

      if (hash == responseObject['responseHash']) {
        const apifields = {
          trackid: responseObject['TrackId'],
          terminalId: config.terminalId,
          action: '10',
          merchantIp: '',
          password: config.password,
          currency: config.currency,
          transid: responseObject['TranId'],
          amount: responseObject['amount'],
          udf5: 'Test5',
          udf3: 'Test3',
          udf4: 'Test4',
          udf1: 'Test1',
          udf2: 'Test2',
          requestHash: hash1,
        };

        const apifields_string = JSON.stringify(apifields);

        axios
          .request({
            method: 'post',
            url: config.requestUrl,
            headers: {
              'Content-Type': 'application/json',
            },
            data: apifields_string,
          })
          .then(response => {
            const urldecodeapi = response.data;
            let inquiryResponsecode = '';

            if (urldecodeapi['responseCode'] != undefined) {
              inquiryResponsecode = urldecodeapi['responseCode'];
            } else {
              inquiryResponsecode = urldecodeapi['responsecode'];
            }

            const inquirystatus = urldecodeapi['result'];

            if (
              inquirystatus === 'Approved' ||
              responseObject['ResponseCode'] === inquiryResponsecode
            ) {
              if (
                responseObject['cardToken'] != undefined &&
                responseObject['maskedPAN'] != undefined &&
                responseObject['maskedPAN'] != '' &&
                responseObject['cardToken'] != '' &&
                responseObject['cardToken'] != null &&
                responseObject['cardToken'] != 'null'
              ) {
                resolve({
                  type: 'receiptToken',
                  amount: responseObject['amount'],
                  tranid: responseObject['TranId'],
                  status: 'Successful',
                  cardtoken: responseObject['cardToken'],
                  maskedno: responseObject['maskedPAN'],
                });
              } else {
                resolve({
                  type: 'receipt',
                  amount: responseObject['amount'],
                  tranid: responseObject['TranId'],
                  status: responseObject['Result'],
                });
              }
            } else {
              reject('Something went wrong!!! Data Tamper!!!!!!!');
            }
          })
          .catch(error => {
            console.log(error);
            reject('Something went wrong processing response!');
          });
      } else {
        reject('Hash Mismatch!');
      }
    });
  };

  render() {
    const {baseURL, visible} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
            style={styles.backBtn}>
            <AntDesign
              name="arrowright"
              color={'#FFF'}
              size={32}
              style={styles.flipRTL}
            />
          </TouchableOpacity>
        </View>
        {baseURL.length > 0 && (
          <WebView
            source={{uri: baseURL}}
            scalesPageToFit={true}
            sharedCookiesEnabled={true}
            automaticallyAdjustContentInsets={true}
            startInLoadingState={true}
            renderError={() => null}
            renderLoading={() => null}
          enableApplePay={true}
            onLoadStart={() => this.setState({visible: true})}
            onLoadEnd={() => this.setState({visible: false})}
            onShouldStartLoadWithRequest={event => {
              if (event.url.startsWith(config.responseUrl)) {
                this.onPaymentComplete(event.url);
                return false;
              } else {
                return true;
              }
            }}
          />
        )}
        {visible && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: 'transparent',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </SafeAreaView>
    );
  }
}

export default PaymentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#202F3A',
  },
  header: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  backBtn: {
    width: 50,
    height: 50,
    backgroundColor: '#202F3A',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderRadius: 25,
  },
  flipRTL: {transform: [{scaleX: I18nManager.isRTL ? 1 : -1}]},
});

//5400000000000008
//05/21
//123
//Any one
