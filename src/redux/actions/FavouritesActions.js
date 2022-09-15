export const setFavourites = favourites => {
  return dispatch => {
    dispatch({type: 'SET_FAVOURITES', payload: {Favourites: favourites}});
  };
};
