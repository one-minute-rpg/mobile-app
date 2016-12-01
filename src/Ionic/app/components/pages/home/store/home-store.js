function HomeStoreController(translationService, stateService, questStoreService, loaderService, $timeout) {
    var self = this;

    self.loadingQuests = false;
    self.query = '';
    self.selectedTab = 'downloaded';

    self.tabs = {
        downloaded: {
            selected: true,
            quests: [],
            onSelect: function() {
                this.quests = [];
                this.load();
            },
            load: function() {
                self.loadingQuests = true;

                $timeout(function(){
                    questStoreService.getDownloadedQuests()
                        .then(function (quests) {
                            self.tabs.downloaded.quests = quests;
                            self.loadingQuests = false;
                        });
                }, 1000);
            },
            search: function(params) {

            }
        },
        store: {
            selected: false,
            quests: [],
            onSelect: function() {
                this.quests = [];
                this.load();
            },
            load: function() {
                this.search({
                    query: '',
                    reset: true
                });
            },
            search: function(params) {
                self.loadingQuests = true;
                if(params.reset) {
                    this.quests = [];
                }

                $timeout(function(){
                    questStoreService.search(params.query)
                        .then(function (quests) {
                            self.tabs.store.quests = quests;
                            self.loadingQuests = false;
                        });
                }, 1000);
            }
        }
    };

    self.goHome = _goHome;
    self.play = _play;
    self.$onInit = _init;
    self.selectTab = _onSelectTab;
    self.search = _search;

    function _search() {
        self.tabs[self.selectedTab].search({
            query: self.query,
            reset: true
        });
    }

    function _goHome() {
        stateService.goHomeIndex();
    };

    function _onSelectTab(tabName) {
        self.selectedTab = tabName;
        self.query = '';

        for(var t in self.tabs) {
            self.tabs[t].selected = false;
        }

        self.tabs[self.selectedTab].selected = true;
        self.tabs[self.selectedTab].onSelect();
    }

    function _play(quest) {
        stateService.goToPlay(quest.id);
    }

    function _init() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();
        self.tabs.downloaded.load();
    }
}

angular.module('omr').component('homeStore', {
    templateUrl: 'components/pages/home/store/home-store.html',
    controller: [
        'translationService', 
        'stateService', 
        'questStoreService', 
        'loaderService', 
        '$timeout',
        HomeStoreController]
});
