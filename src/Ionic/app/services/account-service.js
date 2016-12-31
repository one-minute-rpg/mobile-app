/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrAccountService(localStorageService, API, $http, $q, $rootScope, EVENTS, $cordovaFacebook) {
    var LOGGED_USER_KEY = 'OmrAccountService_LOGGED_USER_KEY';
    
    function facebookLogin() {
        var d = $q.defer();

        $cordovaFacebook.login(["email"]).then(function(res) {
            // results
            var formatedRes = {
                email: res.authResponse.email,
                accessToken: res.authResponse.accessToken,
                userId: res.authResponse.userID
            };

            $http.post(API.URL + '/account/login-facebook', formatedRes)
            .then(function() {
                d.resolve();
            })
            .catch(function (err) {
                d.reject(err);
            });
        }, function(error) {
            d.reject(err);
        });

        return d.promise;
    }

    function isLogged() {
        var d = $q.defer();

        _getLoginStatus()
            .then(function(res) {
                d.resolve(true);
            })
            .catch(function(err) {
                d.resolve(false);
            })

        return d.promise;
    }

    function _getLoginStatus() {
        return $cordovaFacebook.getLoginStatus()
            .then(function(res) {
                console.log(res);
                return res;
            });
    }

    function _getAccessToken() {
        return $cordovaFacebook.getAccessToken()
            .then(function(res) {
                console.log(res);
                return res;
            });
    }

    return {
        facebookLogin: facebookLogin,
        isLogged: isLogged
    }
}

angular.module('omr').factory('accountService', ['localStorageService', 'API', '$http', '$q', '$rootScope', 'EVENTS', '$cordovaFacebook', OmrAccountService]);
