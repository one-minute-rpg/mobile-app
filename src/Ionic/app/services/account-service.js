/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrAccountService(localStorageService, API, $http, $q, $rootScope, EVENTS, translationService) {
    var LOGGED_USER_KEY = 'OmrAccountService_LOGGED_USER_KEY';
    
    function login(email, password) {
        var d = $q.defer();

        var data = {
            email: email,
            password: password
        };

        $http.post(API.URL + '/account/login', data)
            .then(function(res) {
                localStorageService.setObject({
                    loginToken: res.data.token
                });

                return true;
            })
            .catch(function(err){
                var message = translationService.getLocalizedText(err.data.code);

                d.reject({
                    message: message
                });
            });

        return d.promise;
    };

    function createAccount(account) {
        var d = $q.defer();

        $http.post(API.URL + '/account/create', account)
            .then(function(token) {
                return true;
            })
            .catch(function(err){
                var message = translationService.getLocalizedText(err.data.code);

                d.reject({
                    message: message
                });
            });

        return d.promise;
    }

    return {
        login: login,
        createAccount: createAccount
    };
}

angular.module('omr').factory('accountService', ['localStorageService', 'API', '$http', '$q', '$rootScope', 'EVENTS', 'translationService', OmrAccountService]);
