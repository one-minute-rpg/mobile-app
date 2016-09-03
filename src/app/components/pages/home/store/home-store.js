function HomeStoreController(translationService, stateService, questStoreService, loaderService) {
    var self = this;

    self.goHome = function () {
        stateService.goHomeIndex();
    };

    self.downloadedQuests = [];
    self.loadingQuests = false;

    self.loadQuests = function () {
        self.loadingQuests = true;

        questStoreService.getDownloadedQuests()
            .then(function (quests) {
                self.downloadedQuests = quests;
                self.loadingQuests = false;
            });
    };

    self.$onInit = function () {
        self.TRANSLATIONS = translationService.getCurrentTranslations();

        self.loadQuests();
    };
}

angular.module('omr').component('homeStore', {
    templateUrl: 'components/pages/home/store/home-store.html',
    controller: ['translationService', 'stateService', 'questStoreService', 'loaderService', HomeStoreController]
});
