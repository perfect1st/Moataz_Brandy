import {combineReducers} from 'redux';

import AuthReducer from './AuthReducer';
import SortAndFilterReducer from './SortAndFilterReducer';
import FavouritesReducer from './FavouritesReducer';

export default combineReducers({
  AuthReducer: AuthReducer,
  SortAndFilterReducer: SortAndFilterReducer,
  FavouritesReducer: FavouritesReducer,
});
