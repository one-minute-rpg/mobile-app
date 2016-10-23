function OmrLocalStorageService($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        getString: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        getNumber: function(key, defaultValue) {
            return Number($window.localStorage[key]) || defaultValue;
        },
        getBoolean: function(key, defaultValue) {
            var result = $window.localStorage[key];

            if(result === undefined) {
                return defaultValue;
            }

            return $window.localStorage[key] == 'true' ? true : false;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key, defaultValue) {
            var result = undefined;

            if($window.localStorage[key] === undefined) {
                if(defaultValue === undefined) {
                    return undefined;
                }
                else {
                    result = JSON.parse(defaultValue);
                }
            }
            else {
                result = JSON.parse($window.localStorage[key]);
            }

            return result;
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        }
    };
}

angular.module('omr').factory('localStorageService', ['$window', OmrLocalStorageService]);
