function OmrStateService($state, loaderService) {
    return {
        goHomeIndex: function () {
            $state.go('home.index');
        },
        goHomeStore: function() {
            $state.go('home.store');
        },
        goToPlay: function (questId) {
            loaderService.show();
            $state.go('quest', {questId: questId});
        }
    };
}

angular.module('omr').factory('stateService', ['$state', 'loaderService', OmrStateService]);
