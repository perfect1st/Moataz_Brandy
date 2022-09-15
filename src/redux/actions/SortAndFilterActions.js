export const setSort = sort => {
  return dispatch => {
    dispatch({type: 'SET_SORT', payload: {SortBy: sort}});
  };
};

export const setBrands = brands => {
  return dispatch => {
    dispatch({type: 'SET_BRANDS', payload: {Brands: brands}})
  };
};
export const setCity = city => {
  return dispatch => {
    dispatch({type: 'SET_CITY', payload: {City: city}})
  };
};
export const setCountry = country => {
  return dispatch => {
    dispatch({type: 'SET_COUNTRY', payload: {Country: country}})
  };
};

export const resetSortAndBrands = () => {
  return dispatch => {
    dispatch({type: 'RESET_SORT_BRANDS'});
  };
};
