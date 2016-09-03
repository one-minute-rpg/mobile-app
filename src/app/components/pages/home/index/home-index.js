function HomeIndexController($timeout, platformService, splashScreenService, soundService, SOUNDS, translationService, stateService) {
    var self = this;

    self.ready = false;

    self.playTest = function () {
        stateService.goToPlay(1);
    };

    self.$onInit = function() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();

        platformService.onReady(function() {
            $timeout(function(){
                self.ready = true;
                soundService.playTheme(SOUNDS.MAIN);

                splashScreenService.hide();
            }, 1000);
        });
    };
}

angular.module('omr').component('homeIndex', {
    templateUrl: 'components/pages/home/index/home-index.html',
    controller: ['$timeout','platformService', 'splashScreenService', 'soundService', 'SOUNDS', 'translationService', 'stateService', HomeIndexController]
});
