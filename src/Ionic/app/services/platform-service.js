function PlatformService(ENVIRONMENT) {

    return {
        onReady: function (fn) {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("deviceready", fn, false);
            }
            else {
                angular.element(document).ready(fn);
            }
        },
        onPause: function (fn) {
            if(ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("pause", fn, false);
            }
        },
        onResume: function (fn) {
            if(ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("resume", fn, false);
            }
        }
    };
}

angular.module('omr').factory('platformService', ['ENVIRONMENT', PlatformService]);
