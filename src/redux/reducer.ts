import { connectRouter, RouterState } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import authReducer, { AuthState } from '../modules/auth/redux/authReducer';
import productReducer, { ProductState } from '../modules/product/redux/productReducer';
import intlReducer, { IntlState } from '../modules/intl/redux/intlReducer';
import brandReducer, { BrandState } from '../modules/product/redux/brandReducer';
import categoryReducer, { CategoryState } from '../modules/product/redux/categoryReducer';
import shippingReducer, { ShippingState } from '../modules/product/redux/shippingReducer';

export interface AppState {
  router: RouterState;
  intl: IntlState;
  profile: AuthState;
  product: ProductState;
  brand: BrandState;
  category: CategoryState;
  shipping: ShippingState;
}

export default function createRootReducer(history: History) {
  return combineReducers({
    router: connectRouter(history),
    intl: intlReducer,
    profile: authReducer,
    product: productReducer,
    brand: brandReducer,
    category: categoryReducer,
    shipping: shippingReducer,
  });
}
