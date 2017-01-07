/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrAccountService(localStorageService, API, $http, $q, $rootScope, EVENTS, translationService, accountStorageService) {
    var LOGGED_USER_KEY = 'OmrAccountService_LOGGED_USER_KEY';
    
    function login(email, password) {
        var d = $q.defer();

        var data = {
            email: email,
            password: password
        };

        $http.post(API.URL + '/account/login', data)
            .then(function(res) {
                localStorageService.setObject(LOGGED_USER_KEY, {
                    email: res.data.email,
                    token: res.data.token,
                    name: res.data.name
                });

                accountStorageService.setLoggedUserKey(res.data.email);

                return init();
            })
            .then(function() {
                return $http.get(API.URL + '/account-quest/like');
            })
            .then(function(res) {
                var likedQuests = res.data;

                likedQuests.forEach(function(quest) {
                    var key = 'QUESTS_LIKED_' + quest.quest_id;
                    accountStorageService.set(key, true);
                });

                return true;
            })
            .then(function(){
                d.resolve(true);
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
                return login(account.email, account.password);
            })
            .then(function() {
                d.resolve(true);
            })
            .catch(function(err){
                var message = translationService.getLocalizedText(err.data.code);

                d.reject({
                    message: message
                });
            });

        return d.promise;
    }

    function getLoggedUser() {
        var d = $q.defer();

        var loggedUser = localStorageService.getObject(LOGGED_USER_KEY, null);
        d.resolve(loggedUser);

        return d.promise;
    }

    function logout() {
        localStorageService.remove(LOGGED_USER_KEY);
        return $q.resolve(true);
    }

    function init() {
        return getLoggedUser()
            .then(function(loggedUser) {
                if(!!loggedUser) {
                    $http.defaults.headers.common['AuthToken'] = loggedUser.token;
                    accountStorageService.setLoggedUserKey(loggedUser.email);
                }
            });
    }

    return {
        login: login,
        createAccount: createAccount,
        getLoggedUser: getLoggedUser,
        logout: logout,
        init: init
    };
}

angular.module('omr').factory('accountService', ['localStorageService', 'API', '$http', '$q', '$rootScope', 'EVENTS', 'translationService', 'accountStorageService', OmrAccountService]);
