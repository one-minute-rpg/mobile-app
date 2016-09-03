/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrLoaderService($rootScope, EVENTS) {
    return {
        show: function () {
            $rootScope.$broadcast(EVENTS.ON_REQUEST_SHOW_LOADER);
        },

        hide: function () {
            $rootScope.$broadcast(EVENTS.ON_REQUEST_HIDE_LOADER);
        }
    }
}

angular.module('omr').factory('loaderService', ['$rootScope', 'EVENTS', OmrLoaderService]);
