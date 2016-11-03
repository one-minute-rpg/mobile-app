function OmrSplashScreenService(ENVIRONMENT) {
    return {
        hide: function () {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                navigator.splashscreen.hide();
            }
        },
        show: function() {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                navigator.splashscreen.show();
            }
        }
    };
}

angular.module('omr').factory('splashScreenService', ['ENVIRONMENT', OmrSplashScreenService]);
