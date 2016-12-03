function NetworkService($q, alertService, ENVIRONMENT, translationService) {
    function requestOnline() {
        var result = true;

        if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
            var networkState = navigator.connection.type;

            var onlineStates = [
                Connection.ETHERNET,
                Connection.WIFI,
                Connection.CELL_3G,
                Connection.CELL_4G
            ];

            result = onlineStates.indexOf(networkState) >= 0;
        }

        if(!result) {
            showOfflineMessage();
        }

        return $q.resolve(result);
    }

    function showOfflineMessage() {
        var currentTranslation = translationService.getCurrentTranslations();
        alertService.alert(currentTranslation.INTERNET, currentTranslation.NO_INTERNET_CONNECTION);
    }

    return {
        requestOnline: requestOnline
    };
}

angular.module('omr').factory('networkService', ['$q', 'alertService', 'ENVIRONMENT', 'translationService', NetworkService]);
