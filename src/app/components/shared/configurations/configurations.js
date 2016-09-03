function OmrConfigurationsController($scope, $timeout, soundService, $ionicModal, translationService, splashScreenService, $window, EVENTS) {
    var self = this;

    var $modalScope = $scope;

    $modalScope.onSelectTranslation = function(selectedTranslation) {
        console.log(selectedTranslation);
        $scope.selectedTranslation = selectedTranslation;
    };

    $modalScope.saveConfigurations = function () {
        $timeout(function () {
            translationService.setCurrentTranslation($modalScope.selectedTranslation.value);
            soundService.setSoundState($modalScope.soundIsEnabled);
            splashScreenService.show();

            $window.location.reload();
        }, 300);
    };

    $modalScope.cancel = function () {
        $modalScope.$modal.remove();
    };

    $modalScope.onChangeSoundState = function (soundIsEnabled) {
        $modalScope.soundIsEnabled = soundIsEnabled;
    };

    $scope.$on(EVENTS.ON_SOUND_STATE_CHANGE, function (event, data) {
        self.soundIsEnabled = data.isEnabled;
    });

    $modalScope.$modal = null;

    self.openConfigurations = function () {
        _initModalData();

        $ionicModal.fromTemplateUrl('components/shared/configurations/modal.tpl.html', {
            scope: $modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalScope.$modal = modal;
            $modalScope.$modal.show();
        });
    };

    self.$onInit = function () {

    };

    self.$onDestroy = function () {
        if($modalScope.$modal) {
            $modalScope.$modal.remove();
        }
    };

    function _initModalData() {
        $modalScope.TRANSLATIONS = translationService.getCurrentTranslations();
        $modalScope.availableTranslations = [];
        $modalScope.selectedTranslation = null;
        $modalScope.soundIsEnabled = soundService.soundIsEnabled();

        _loadAvailableTranslations();
    }

    function _loadAvailableTranslations() {
        var availableTranslations = translationService.getAvailableTranslations();

        for (var key in availableTranslations) {
            if (availableTranslations.hasOwnProperty(key)) {
                var option = {
                    text: availableTranslations[key],
                    value: key
                };

                $modalScope.availableTranslations.push(option);

                if(key == $modalScope.TRANSLATIONS.$NAME) {
                    $modalScope.selectedTranslation = option;
                }
            }
        }
    }
}


angular.module('omr').component('omrConfigurations', {
    templateUrl: 'components/shared/configurations/configurations.html',
    controller: [
        '$scope',
        '$timeout',
        'soundService',
        '$ionicModal',
        'translationService',
        'splashScreenService',
        '$window',
        'EVENTS',
        OmrConfigurationsController],
    bindings: {
    }
});
