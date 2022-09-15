const initialState = {
  SortBy: 1,
  Brands: [],
  City: [],
  Country: [],

};

/*
  Sort : 
  1-> most recent
  2-> most watched
  3-> least watched
  4-> highest price
  5-> lowest price
*/

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SORT':
      return {
        ...state,
        SortBy: action.payload.SortBy,
      };

    case 'SET_BRANDS':
      return {
        ...state,
        Brands: action.payload.Brands,
      };

      case 'SET_CITY':
        return {
          ...state,
          City: action.payload.City,
        };
        case 'SET_COUNTRY':
        return {
          ...state,
          Country: action.payload.Country,
        };

    case 'RESET_SORT_BRANDS':
      return {
        ...state,
        SortBy: 1,
        Brands: [],
        City: [],
        Country: []

      };

    default:
      return state;
  }
};
