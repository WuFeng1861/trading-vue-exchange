const routeParams = {};

export const useRouteParams = (unicode) => {
  return routeParams[unicode];
};

export const setRouteParams = (unicode, params) => {
  routeParams[unicode] = params;
};
