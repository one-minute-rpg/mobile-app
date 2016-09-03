function QuestPageController($timeout, platformService, loaderService, soundService, SOUNDS) {
    var self = this;

    self.goHome = _goHome;


    self.$onInit = _init;

    function _init() {
        platformService.onReady(function () {
            loaderService.hide();
        });
    }

    function _goHome() {

    }
}

angular.module('omr').component('quest', {
    templateUrl: 'components/pages/quest/quest.html',
    controller: ['$timeout','platformService', 'loaderService', 'soundService', 'SOUNDS', QuestPageController]
});
