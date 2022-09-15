const initialState = {
  Favourites: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FAVOURITES':
      return {
        ...state,
        Favourites: action.payload.Favourites,
      };

    default:
      return state;
  }
};
