function ActionBarController($scope, $timeout, platformService, $ionicModal) {
    var self = this;

    self.$onInit = function () {
    };
}


angular.module('omr').component('omrActionBar', {
    templateUrl: 'components/shared/action-bar/action-bar.html',
    controller: ['$scope', '$timeout', 'platformService', '$ionicModal', ActionBarController],
    bindings: {
        settings: '=',
        home: '=',
        audio: '=',
        store: '='
    }
});
