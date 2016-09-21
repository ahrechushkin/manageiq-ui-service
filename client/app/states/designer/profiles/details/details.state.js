(function() {
  'use strict';

  angular.module('app.states')
    .run(appRun);

  /** @ngInject */
  function appRun(routerHelper) {
    routerHelper.configureStates(getStates());
  }

  function getStates() {
    return {
      'designer.profiles.details': {
        url: '/:profileId',
        templateUrl: 'app/states/designer/profiles/details/details.html',
        controller: StateController,
        controllerAs: 'vm',
        title: N_('Profile Details'),
        resolve: {
          profile: resolveProfile,
        },
      },
    };
  }

  /** @ngInject */
  function resolveProfile($stateParams, ProfilesState) {
    if ($stateParams.profileId) {
      return ProfilesState.getProfileDetails($stateParams.profileId);
    } else {
      return null;
    }
  }

  /** @ngInject */
  function StateController(profile, ProfilesState, $state, sprintf) {
    var vm = this;

    function setTitle() {
      vm.title = sprintf(__("View Profile: %s"), vm.profile.name);
    }

    function editProfile() {
      $state.go('designer.profiles.editor', {profileId: vm.profile.id});
    }

    function setInitialVars(vm) {
      vm.profile = profile;
      vm.profile.providerType = ProfilesState.getProviderType(vm.profile.ext_management_system);
      vm.profile.providerImage = ProfilesState.getProviderTypeImage(vm.profile.ext_management_system);

      setTitle();
      vm.editProfile = editProfile;
    }

    setInitialVars(vm);

    activate();

    function activate() {
    }
  }
})();