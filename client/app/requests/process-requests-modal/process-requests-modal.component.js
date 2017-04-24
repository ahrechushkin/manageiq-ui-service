import templateUrl from './process-requests-modal.html';

export const ProcessRequestsModalComponent = {
  controller: ComponentController,
  controllerAs: 'vm',
  bindings: {
    resolve: '<',
    modalInstance: '<',
    close: '&',
    dismiss: '&',
  },
  templateUrl,
};

/** @ngInject */
function ComponentController($state, $controller, lodash, CollectionsApi, EventNotifications, ActionNotifications) {
  var vm = this;

  angular.extend(vm, {
    modalData: {},
    requests: vm.resolve.requests,
    modalType: vm.resolve.modalType,
    save: save,
  });
  angular.extend(vm, $controller('BaseModalController', {
    $uibModalInstance: vm.modalInstance,
  }));
  vm.save = save;

  function save() {
    var data = {
      action: vm.modalType === 'approve' ? 'approve' : 'deny',
      resources: vm.requests,
    };

    lodash.forEach(data.resources, addReason);
    CollectionsApi.post('requests', '', {}, data).then(saveSuccess, saveFailure);

    function addReason(item) {
      item.reason = vm.modalData.reason;
    }

    function saveSuccess(response) {
      vm.close();
      switch (vm.modalType) {
        case "approve":
          ActionNotifications.add(response, __('Request approved.'), __('Error approving request.'));
          break;
        case "deny":
          ActionNotifications.add(response, __('Request denied.'), __('Error denying request.'));
          break;
      }
      $state.go($state.current, {}, {reload: true});
    }

    function saveFailure() {
      EventNotifications.error(__('There was an error processing one or more requests.'));
    }
  }
}