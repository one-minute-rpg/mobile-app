function HomeStoreController(translationService, stateService, questStoreService, loaderService) {
    var self = this;

    self.goHome = function () {
        stateService.goHomeIndex();
    };

    self.downloadedQuests = [];
    self.loadingQuests = false;

    self.loadQuests = _loadQuests;
    self.play = _play;
    self.$onInit = _init;

    function _play(quest) {
        stateService.goToPlay(quest.id);
    }

    function _loadQuests() {
        self.loadingQuests = true;

        questStoreService.getDownloadedQuests()
            .then(function (quests) {
                self.downloadedQuests = quests;
                self.loadingQuests = false;
            });
    }

    function _init() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();
        self.loadQuests();
    }
}

angular.module('omr').component('homeStore', {
    templateUrl: 'components/pages/home/store/home-store.html',
    controller: ['translationService', 'stateService', 'questStoreService', 'loaderService', HomeStoreController]
});
