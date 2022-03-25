import { APIHost } from '../utils/constants';

enum APIService {
  auth,
  public,
  admin,
  normal
}

function getBaseUrl(service: APIService) {
  if (service === APIService.auth) {
    return `${APIHost}/api/authentication`;
  } else if (service === APIService.admin) {
    return `${APIHost}/apiAdmin`;
  } else if (service === APIService.normal) {
    return `${APIHost}/api`;
  } else if (service === APIService.public) {
    return `${APIHost}`;
  }

  return '';
}

export const API_PATHS = {
  login: `${getBaseUrl(APIService.auth)}/login`,
  adminProfile: `${getBaseUrl(APIService.auth)}/login`,
  productList: `${getBaseUrl(APIService.normal)}/products/list`,
  category: `${getBaseUrl(APIService.normal)}/categories/list`,
  productAdmin: `${getBaseUrl(APIService.admin)}/products`,
  brand: `${getBaseUrl(APIService.admin)}/brands`,
  shipping: `${getBaseUrl(APIService.admin)}/shipping/list`,
  vendors: `${getBaseUrl(APIService.admin)}/vendors/list`,
  userRole: `${getBaseUrl(APIService.admin)}/commons/role`,
  countries: `${getBaseUrl(APIService.admin)}/commons/country`,
  state: `${getBaseUrl(APIService.admin)}/commons/state`,
  userAdmin: `${getBaseUrl(APIService.admin)}/users`,
  uploadImage: `${getBaseUrl(APIService.normal)}/products/upload-image`,
  userProfileDetail: 'https://api.gearfocus.div4.pgtest.co/apiVendor/profile/detail',
};
