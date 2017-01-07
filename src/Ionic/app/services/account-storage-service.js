function OmrAccountStorageService(localStorageService) {
    var currentLoggedUserKey = '';

    function _buildKey(key) {
        var prefix = currentLoggedUserKey + '__';

        if(key.indexOf(prefix) === 0) {
            return key;
        }

        return prefix + key;
    }

    return {
        setLoggedUserKey: function(key) {
            currentLoggedUserKey = key;
        },

        set: function(key, value) {
            localStorageService.set(_buildKey(key), value);
        },
        getString: function(key, defaultValue) {
            return localStorageService.getString(_buildKey(key), defaultStatus);
        },
        getNumber: function(key, defaultValue) {
            return localStorageService.getNumber(_buildKey(key), defaultValue);
        },
        getBoolean: function(key, defaultValue) {
            return localStorageService.getBoolean(_buildKey(key), defaultValue);
        },
        setObject: function(key, value) {
            return localStorageService.setObject(_buildKey(key), value);
        },
        getObject: function(key, defaultValue) {
            return localStorageService.getObject(_buildKey(key), defaultValue);
        },
        remove: function(key) {
            return localStorageService.remove(_buildKey(key));
        },
        getAllKeys: function() {
            return localStorageService.getAllKeys();
        }
    };
}

angular.module('omr').factory('accountStorageService', ['localStorageService', OmrAccountStorageService]);
