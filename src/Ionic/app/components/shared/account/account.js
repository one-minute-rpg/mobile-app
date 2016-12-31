function OmrAccountController($scope, $timeout, soundService, $ionicModal, translationService, splashScreenService, $window, EVENTS, accountService) {
    var self = this;

    var $modalScope = $scope;

    $modalScope.cancel = function () {
        $modalScope.$modal.remove();
    };

    $modalScope.$modal = null;

    self.openAccount = function () {
        _initModalData();

        $ionicModal.fromTemplateUrl('components/shared/account/modal.tpl.html', {
            scope: $modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalScope.facebookLogin = _facebookLogin;
            $modalScope.$modal = modal;
            $modalScope.$modal.show();
        });
    };



    self.$onInit = function () {

    };

    self.$onDestroy = function () {
        if ($modalScope.$modal) {
            $modalScope.$modal.remove();
        }
    };

    function _facebookLogin() {
        accountService.facebookLogin()
            .then(function (res) {
                console.log(res);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    function _initModalData() {
        $modalScope.TRANSLATIONS = translationService.getCurrentTranslations();
    }
}


angular.module('omr').component('omrAccount', {
    templateUrl: 'components/shared/account/account.html',
    controller: [
        '$scope',
        '$timeout',
        'soundService',
        '$ionicModal',
        'translationService',
        'splashScreenService',
        '$window',
        'EVENTS',
        'accountService',
        OmrAccountController],
    bindings: {
    }
});
