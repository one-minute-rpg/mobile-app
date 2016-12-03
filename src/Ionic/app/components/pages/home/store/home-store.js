function HomeStoreController($rootScope, translationService, stateService, questStoreService, loaderService, $timeout, networkService, alertService) {
    var self = this;
    var currentListPage = -1;

    self.query = '';
    self.selectedTab = 'downloaded';
    self.loading = false;

    self.tabs = {
        downloaded: {
            selected: true,
            quests: [],
            noMoreDataToLoad: false,
            search: function (params) {
                var _this = this;
                questStoreService.getDownloadedQuests()
                    .then(function (quests) {
                        _this.quests = quests;
                        _this.noMoreDataToLoad = true;
                        self.loading = false;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    });
            }
        },
        store: {
            selected: false,
            quests: [],
            noMoreDataToLoad: false,
            search: function (params) {
                var _this = this;

                function $search() {
                    var page = params.page || 0;
                    if (page === 0) {
                        _this.noMoreDataToLoad = false;
                    }

                    questStoreService.search(params.query, page)
                        .then(function (result) {
                            self.loading = false;
                            $rootScope.$broadcast('scroll.infiniteScrollComplete');
                            _this.quests = _this.quests.concat(result.quests);
                            _this.noMoreDataToLoad = result.noMoreData;

                            if (result.quests.length === 0 && page === 0) {
                                alertService.alert(self.TRANSLATIONS.SEARCH, self.TRANSLATIONS.NO_RESULTS_FOUND);
                            }
                        })
                        .catch(function (err) {
                            self.loading = false;
                            alertService.alert('Ops =(', self.TRANSLATIONS.ERROR_TO_FIND_QUESTS);
                        });
                };

                networkService.requestOnline()
                    .then(function (isOnline) {
                        if (isOnline) {
                            if (params.reset) {
                                _this.quests = [];
                                currentListPage = 0;
                            }

                            $search();
                        }
                    });
            }
        }
    };

    self.goHome = _goHome;
    self.play = _play;
    self.$onInit = _init;
    self.selectTab = _onSelectTab;
    self.search = _search;
    self.nextPage = _nextPage;

    function _search() {
        self.loading = true;

        self.tabs[self.selectedTab].search({
            query: self.query,
            reset: true
        });
    }

    function _nextPage() {
        var tab = self.tabs[self.selectedTab];
        if (tab.noMoreDataToLoad) return;

        self.loading = true;

        tab.search({
            query: self.query,
            page: ++currentListPage
        });
    }

    function _goHome() {
        stateService.goHomeIndex();
    };

    function _onSelectTab(tabName) {
        if (self.selectedTab === tabName) return;

        self.selectedTab = tabName;
        self.query = '';
        _clearTabs();

        var tab = self.tabs[tabName];
        tab.selected = true;
        
        if(tabName === 'downloaded') {
            _nextPage();
        }
    }

    function _clearTabs() {
        currentListPage = -1;

        for (var t in self.tabs) {
            var tab = self.tabs[t];
            tab.selected = false;
            tab.quests = [];
            tab.noMoreDataToLoad = false;
        }
    }

    function _play(quest) {
        stateService.goToPlay(quest.id);
    }

    function _init() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();
        self.tabs.downloaded.search();
    }
}

angular.module('omr').component('homeStore', {
    templateUrl: 'components/pages/home/store/home-store.html',
    controller: [
        '$rootScope',
        'translationService',
        'stateService',
        'questStoreService',
        'loaderService',
        '$timeout',
        'networkService',
        'alertService',
        HomeStoreController]
});
