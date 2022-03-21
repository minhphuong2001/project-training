import { APIHost } from '../utils/constants';

enum APIService {
  auth,
  public,
}

function getBaseUrl(service: APIService) {
  if (service === APIService.auth) {
    return `${APIHost}/authentication`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  login: `${getBaseUrl(APIService.auth)}/login`,
  adminProfile: `${getBaseUrl(APIService.auth)}/login`,
  productList: `${getBaseUrl(APIService.public)}/products/list`,
  category: `${getBaseUrl(APIService.public)}/categories/list`,
  productAdmin: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/products',
  brand: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/brands',
  shipping: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/shipping/list',
  vendors: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/vendors/list',
  userRole: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/role',
  countries: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/commons/country',
  userAdmin: 'https://api.gearfocus.div4.pgtest.co/apiAdmin/users',
  userProfileDetail: 'https://api.gearfocus.div4.pgtest.co/apiVendor/profile/detail',
  uploadImage: `${getBaseUrl(APIService.public)}/products/upload-image`
};
