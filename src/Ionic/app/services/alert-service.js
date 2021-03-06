function AlertService($q, $ionicPopup, translationService) {
    
    function alert(title, message, onClose) {
        var currentTranslation = translationService.getCurrentTranslations();

        var popup = {
            title: title,
            template: message,
            buttons: [
                {
                    text: currentTranslation.OK,
                    type: 'button-positive',
                    onTap: onClose
                }
            ]
        };

        $ionicPopup.show(popup);
    }

    function confirm(title, message) {
        var currentTranslation = translationService.getCurrentTranslations();

        var confirmPopup = $ionicPopup.confirm({
            title: title,
            template: message,
            cancelText: currentTranslation.NO,
            okText: currentTranslation.YES
        });

        return confirmPopup;
    }

    function custom(options) {
        /*
            var popup = {
                title: item.name,
                template: item.description,
                scope: $scope,
                buttons: [
                    {
                        text: self.TRANSLATIONS.OK,
                        type: 'button-positive',
                        onTap: function(e) {
                            
                        }
                    }
                ]
            };
         */

        $ionicPopup.show(options);
    }

    return {
        alert: alert,
        confirm: confirm,
        custom: custom
    };
}

angular.module('omr').factory('alertService', ['$q', '$ionicPopup', 'translationService', AlertService]);
