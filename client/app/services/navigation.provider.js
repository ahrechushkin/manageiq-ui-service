/** @ngInject */
export function NavigationProvider() {
  var provider = {
    $get: Navigation,
    configure: configure,
  };

  var model = {
    items: {
      primary: {},
    },
  };

  return provider;

  function configure(value) {
    angular.extend(model, value);
  }

  /** @ngInject */
  function Navigation($rootScope, $window, lodash) {
    var service = {
      items: model.items,
    };

    return service;
  }
}
