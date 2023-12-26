import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
axios.defaults.timeout = 10000;

const API = 'http://brandysa.com/api/user/';

export const getCountriesAndCities = callBack => {
  axios
    .get(API + 'countries', {})
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const register = async (
  name,
  email,
  mobile,
  countryID,
  cityID,
  password,
  countryCode,
  callBack,
) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  axios
    .post(API + 'employee', {
      fullnameAR: name,
      fullnameEN: name,
      mobile,
      email: email.toLowerCase(),
      password,
      type: 2,
      countryID,
      cityID,
      countryCode,
      userKey: fcmToken,
    })
    .then(response => {
      console.log( {
        fullnameAR: name,
        fullnameEN: name,
        mobile,
        email: email.toLowerCase(),
        password,
        type: 2,
        countryID,
        cityID,
        code:countryCode,
        userKey: fcmToken,
      })
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const facebookSignIn = async (
  name,
  email,
  imageURL,
  userID,
  callBack,
) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  axios
    .post(API + 'facebook', {
      fullnameAR: name,
      fullnameEN: name,
      email: email,
      logo: imageURL,
      facebookID: userID,
      type: 2,
      userKey: fcmToken,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const googleSignIn = async (name, email, imageURL, userID, callBack) => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  axios
    .post(API + 'gmail', {
      fullnameAR: name,
      fullnameEN: name,
      email: email,
      logo: imageURL,
      gmailID: userID,
      type: 2,
      userKey: fcmToken,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const login = async (mobile, password,country, callBack) => {
  console.log({
    val: mobile,
    password,
    code:country,
    type: 2,
    userKey: fcmToken,
})
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  axios
    .get(API + 'login', {
      params: {
        val: mobile,
        password,
        code:country,
        type: 2,
        userKey: fcmToken,
      },
    })
    .then(response => {
      console.log(response.data);
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e.response.data.message);
      return callBack({ error: e.response.data.message });
    });
};

export const updateUser = (id, data, callBack) => {
  axios
    .put(API + 'employee/' + id, data)
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};

export const getAdv = callBack => {
  axios
    .get(API + 'adsMobile', {})
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getCategories = async (userId , callBack) => {
    let fcmToken = await AsyncStorage.getItem('fcmToken');

  axios
    .get(API + 'getAllCategories', {
      params:{
        token:fcmToken,
        userId 
      }
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getSettings = callBack => {
  axios
    .get(API + 'setting', {})
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getCategoryProducts = (countryId, categoryId, callBack) => {
  axios
    .get(API + 'offersByCategory', {
      params: {
        country: countryId ? countryId : '60c9c6a111c77e7c7506c6f4',
        category: categoryId,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getProductReviews = (productId, callBack) => {
  axios
    .get(API + 'offersRate', {
      params: {
        offers: productId,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getSimilarProducts = (categoryId,adsID, callBack) => {
  axios
    .get(API + 'similarOffers', {
      params: {
        category: categoryId,
        adsID: adsID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getBrandsByCategory = (categoryId, callBack) => {
  axios
    .get(API + 'brands', {
      params: {
        categoryID: categoryId,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const addAdvertise = (
  image,
  categoryId,
  userID,
  brandId,
  countryID,
  cityID,
  title,
  adsStatus,
  mobile,
  countryCode,
  whatsapp,
  price,
  desc,
  callBack,
) => {

  
  axios
    .post(API + 'addOffer', {
      img: image,
      categoryID: categoryId,
      userID: userID,
      brandsID: brandId,
      countryID: countryID,
      cityID,
      titleAR: title,
      titleEN: title,
      adsStatus,
      mobile,
      countryCode,
      wtsappMobile: whatsapp,
      price,
      descAR: desc,
      descEN: desc,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};
export const addAdvertiseedit = (
  userID1, image,
  categoryId,
  userID,
  brandId,
  countryID,
  cityID,
  title,
  adsStatus,
  countryCode,
  whatsapp,
  price,
  desc,
  callBack,
) => {
  axios
    .put(API + 'offersAdmin/' + userID1, {
      img: image,
      categoryID: categoryId,
      userID: userID,
      brandsID: brandId,
      countryID: countryID,
      cityID,
      titleAR: title,
      titleEN: title,
      adsStatus,
      // mobile,
      wtsappMobile: whatsapp,
      price,
      descAR: desc,
      descEN: desc,
      countryCode:countryCode
    })
    .then(response => {

      console.log("FFFFFFFFFFFFFFFFFFFF")
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};

export const uploadPhoto = (imagePicked, callBack) => {
  try {
    const data = new FormData();
    data.append('personalImg', {
      uri: imagePicked.uri,
      name: imagePicked.uri,
      type: imagePicked.type,
    });
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axios
      .post(API + 'uploadFile', data, config)
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        return callBack({ error: e });
      });
  } catch (error) {
    return callBack({ error: e });
  }
};

export const getInbox = (userID, callBack) => {
  axios
    .get(API + 'chatByOffers', {
      params: {
        userID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getCity = (countryID, callBack) => {
  axios
    .get(API + 'city', {
      params: {
        countryID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};




export const getChatMsgs = (ownerID, memberID, userID, callBack) => {
  axios
    .get(API + 'chatHistory', {
      params: {
        ownerID,
        memberID,
        userID
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};

export const sendMsg = (ownerID, memberID, type, msg, userID, callBack) => {
  axios
    .post(API + 'sendmsg', {
      ownerID,
      memberID,
      dateTime: new Date(),
      type,
      msg,
      userID,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const checkFav = (userID, offersID, callBack) => {
  axios
    .get(API + 'checkFav', {
      params: {
        userID,
        offersID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const deleteAccountFunc = (id, callBack) => {
  axios
    .post(API + 'deleteAccount/' + id)
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};


export const addRemoveFav = (userID, offersID, callBack) => {
  axios
    .post(API + 'favorite', {
      userID,
      offersID,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};
export const searchforword = (wor, callBack) => {
  axios
    .post(API + 'generalSearch', {
      word: wor,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getTerms = callBack => {
  axios
    .get(API + 'terms')
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const getAbout = callBack => {
  axios
    .get(API + 'about')
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const addContactUs = (msg, userID, callBack) => {
  axios
    .post(API + 'contactus', {
      msg: msg,
      userID: userID,
      type: 1,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const complaintsAndSuggestions = (msg, userID, type, callBack) => {
  axios
    .post(API + 'contactus', {
      msg: msg,
      userID: userID,
      type: type,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const offersUser = (userID, callBack) => {
  axios
    .get(API + 'offersByUser', {
      params: {
        userID: userID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};



export const offersUserUpdate = (id,price, callBack) => {
  console.log(id , price)
  console.log(API + 'renewOffer/' + id)

  axios
    .put(API + 'renewOffer/'+ id ,{
      price :price
    })
    
    .then(response => {
 console.log(response)
    
      return callBack({ data: response.data });
    })
    .catch(e => {
     
      return callBack({ error: e });
    });
};


export const removeOffersUser = (id, callBack) => {
  axios
    .post(API + 'offersDelete', {
      id: id,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const favoriteByUser = (userID, callBack) => {
  axios
    .get(API + 'favoriteByUser', {
      params: {
        userID: userID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};
export const offersadmin = (userID, obj) => {
  axios
    .put(API + 'offersAdmin/' + userID,
      {
        obj: obj,
      },
    )
    .then(response => {
      console.log(response.data, "respooons");
    })
    .catch(e => {
      console.log(e, "dhjasgdhjsad");
      // return callBack({ error: e });
    });
};
export const blockMessage = (id, userid, status, callBack) => {
  if (status == 1) {
    axios
      .put(API + 'chatBox/' + id,
        {
          blockOwner: userid,
          // status: status
        },
      )
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        console.log(e);
        return callBack({ error: e });
      });


  } else {
    axios
      .put(API + 'chatBox/' + id,
        {
          blockMember: userid,
          // status: status
        },
      )
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        console.log(e);
        return callBack({ error: e });
      });




  }

};
export const offersRate = (comment, offers, userID, callBack) => {
  axios
    .post(API + 'offersRate', {
      comment: comment,
      offers: offers,
      userID: userID,
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      return callBack({ error: e });
    });
};

export const offersDeleteRate = (offerID, callBack) => {
  axios
   .put(API + 'offersRate/' + offerID, {

        status: 2,

      })
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        console.log(e);
        return callBack({ error: e });
      });
};

export const getUserNotifications = (userID, callBack) => {
  axios
    .get(API + 'notifyByUser', {
      params: {
        userID: userID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};
export const deleteMessage = (userID, state, callBack) => {
  if (state == 1) {

    axios
      .put(API + 'chatBox2/' + userID, {

        deleteOwner: 2,

      })
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        console.log(e);
        return callBack({ error: e });
      });
  } if (state == 2) {

    axios
      .put(API + 'chatBox2/' + userID, {
        deleteMember: 2,

      })
      .then(response => {
        return callBack({ data: response.data });
      })
      .catch(e => {
        console.log(e);
        return callBack({ error: e });
      });

  }
}
  ;


export const getUserNotificationsCount = (userID, callBack) => {
  axios
    .get(API + 'notifyByUserCount', {
      params: {
        userID: userID,
      },
    })
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};

export const userNotificationSeen = (id, callBack) => {
  axios
    .put(API + 'notifyByUserEdit/' + id, {})
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};

export const getBankTransferVat = callBack => {
  axios
    .get(API + 'bankTransferVat', {})
    .then(response => {
      return callBack({ data: response.data });
    })
    .catch(e => {
      console.log(e);
      return callBack({ error: e });
    });
};
