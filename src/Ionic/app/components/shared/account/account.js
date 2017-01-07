function OmrAccountController($scope, $timeout, soundService, $ionicModal, translationService, splashScreenService, $window, EVENTS, accountService, alertService, loaderService) {
    var self = this;
    var currentTranslations = translationService.getCurrentTranslations();

    var $modalScope = $scope;

    $modalScope.loggedUser = null;

    $modalScope.cancel = function () {
        $modalScope.$modal.remove();
    };

    $modalScope.close = function() {
        $modalScope.$modal.remove();
    }

    $modalScope.$modal = null;

    self.openAccount = function () {
        _initModalData();

        _loadLoggedUser()
            .then(function(){
                return $ionicModal.fromTemplateUrl('components/shared/account/modal.tpl.html', {
                    scope: $modalScope,
                    animation: 'slide-in-up'
                });
            })
            .then(function (modal) {
                $modalScope.$modal = modal;
                $modalScope.$modal.show();
            });
    };



    self.$onInit = function () {
        _loadLoggedUser();
    };

    self.$onDestroy = function () {
        if ($modalScope.$modal) {
            $modalScope.$modal.remove();
        }
    };

    function _createNewAccount(account) {
        accountService.createAccount(account)
            .then(function(res) {
                alertService.alert(
                    currentTranslations.ACCOUNT,
                    currentTranslations.ACCOUNT_CREATE_SUCCESS);

                 $modalScope.close();
            })
            .catch(function(err) {
                alertService.alert(currentTranslations.ACCOUNT, err.message);
            });
    }

    function _doLogin(email, password) {
        accountService.login(email, password)
            .then(function(res) {
                _loadLoggedUser();
            })
            .catch(function(err) {
                alertService.alert('Conta', err.message);
            });
    }

    function _logout() {
        accountService.logout()
            .then(function() {
                _loadLoggedUser();
            });
    }

    function _initModalData() {
        $modalScope.TRANSLATIONS = translationService.getCurrentTranslations();
        $modalScope.forms = {};
        $modalScope.newAccount = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        $modalScope.login = {
            email: '',
            password: ''
        };

        $modalScope.doLogin = function() {
            _doLogin($modalScope.login.email, $modalScope.login.password);
        };

        $modalScope.createAccount = function() {
            if($modalScope.newAccount.password != $modalScope.newAccount.confirmPassword) {
                $modalScope.forms.registerForm.confirmPassword.$setValidity('confirmpass', false);
                return;
            }

            _createNewAccount($modalScope.newAccount);
        };

        $modalScope.logout = function() {
            _logout();
        };
    }

    function _loadLoggedUser() {
        loaderService.show();

        return accountService.getLoggedUser()
            .then(function(logged) {
                $modalScope.loggedUser = logged; 
            })
            .catch(function() {
                $modalScope.loggedUser = null;
            })
            .finally(function(){
                loaderService.hide();
            });
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
        'alertService',
        'loaderService',
        OmrAccountController],
    bindings: {
    }
});
