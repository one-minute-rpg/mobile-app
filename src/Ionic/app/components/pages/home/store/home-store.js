function HomeStoreController($rootScope, $scope, translationService, stateService, questStoreService, loaderService, $timeout, networkService, alertService, $ionicModal, questService, accountService) {
    var self = this;
    var currentListPage = -1;

    self.query = '';
    self.selectedTab = 'downloaded';
    self.loading = false;

    self.downloadedQuests = [];

    self.tabs = {
        downloaded: {
            selected: true,
            noMoreDataToLoad: true,
            search: function (params) {
                var _this = this;
                _reloadDownloadedQuests()
                    .then(function() {
                        _this.noMoreDataToLoad = true;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    })
                    .catch(function (err) {
                        alertService.alert('Ops =(', self.TRANSLATIONS.ERROR_TO_FIND_QUESTS);
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

                            if (result.quests.length === 0 && page === 0) {
                                alertService.alert(self.TRANSLATIONS.SEARCH, self.TRANSLATIONS.NO_RESULTS_FOUND);
                            }
                            else {
                                var downloadedQuestIds = self.downloadedQuests.map(function(q) {
                                    return q.quest_id;
                                });

                                result.quests.forEach(function(q) {
                                    q.downloaded = downloadedQuestIds.indexOf(q.quest_id) >= 0;
                                });

                                _this.quests = _this.quests.concat(result.quests);
                                _this.noMoreDataToLoad = result.noMoreData;
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
    self.download = _download;
    self.openOptions = _openOptions;

    function _reloadLikeState(quest) {
        quest.__isLiked = questStoreService.isLiked(quest.quest_id);
        quest.__likeIcon = quest.__isLiked ? 'fa-thumbs-up' : null
    }

    function _openOptions(quest, preserv) {
        if ($scope.modal && !preserv) {
            $scope.modal.remove();
        };

        var hasSaveGame = !!questService.getSavedGame(quest.quest_id);
        _reloadLikeState(quest);

        var downloadedOptions = [];

        var playQuest = function() {
            $scope.modal.hide();
            _play(quest);
        }

        if(quest.downloaded) {
            downloadedOptions = downloadedOptions.concat([
                {
                    text: self.TRANSLATIONS.START,
                    onSelect: function() {
                        if(hasSaveGame) {
                            alertService.confirm(self.TRANSLATIONS.REMOVE, self.TRANSLATIONS.WANT_TO_REMOVE_CURRENT_SAVE_GAME_AND_RESTART)
                                .then(function(res) {
                                    if(res) {
                                        questService.removeSavedGame(quest.quest_id)
                                        playQuest();
                                    }
                                });
                        }
                        else {
                            playQuest();
                        }
                    }
                },
                {
                    text: self.TRANSLATIONS.CONTINUE,
                    onSelect: function() {
                        playQuest();
                    },
                    hide: !hasSaveGame
                },
                {
                    text: self.TRANSLATIONS.LIKE,
                    onSelect: function() {
                        _like(quest);
                    },
                    icon: quest.__likeIcon
                }
            ]);
        }

        var options = {
            downloaded: downloadedOptions.concat([
                {
                    text: self.TRANSLATIONS.REMOVE,
                    onSelect: function() {
                        alertService.confirm(self.TRANSLATIONS.REMOVE, self.TRANSLATIONS.WANT_TO_REMOVE_QUEST)
                            .then(function(res) {
                                if(res) {
                                    $scope.modal.hide();
                                    questStoreService.removeFromDownloaded(quest.quest_id)
                                        .then(function() {
                                            _reloadDownloadedQuests();
                                        });
                                }
                            });
                    }
                }
            ]),
            store: [
                {
                    text: self.TRANSLATIONS.DOWNLOAD,
                    onSelect: function() {
                        $scope.modal.hide();
                        _download(quest);
                    },
                    hide: quest.downloaded
                }
            ].concat(downloadedOptions)
        };

        $scope.questOptionsModal = {
            TRANSLATIONS: self.TRANSLATIONS,
            title: quest.title,
            quest: quest,
            onClose: function() {
                $scope.modal.hide();
            },
            options: options[self.selectedTab]
        };

        if(preserv) return;
        
        $ionicModal.fromTemplateUrl('components/pages/home/store/quest-options/quest-options.html', {
            scope: $scope,
            animation: 'slide-in-right'
        }).then(function (modal) {
            $scope.modal = modal;
            $scope.modal.show();
        });
    }

    function _reloadDownloadedQuests() {
        return questStoreService.getDownloadedQuests()
            .then(function (quests) {
                quests.forEach(function(q) {
                    q.downloaded = true;
                    _reloadLikeState(q);
                });

                self.downloadedQuests = quests;
                self.loading = false;
            })
            .catch(function (err) {
                alertService.alert('Ops =(', self.TRANSLATIONS.ERROR_TO_FIND_QUESTS);
            });
    }

    function _download(quest) {
        loaderService.show();

        questStoreService.download(quest.quest_id)
            .then(function (res) {
                return _reloadDownloadedQuests();
            })
            .then(function() {
                quest.downloaded = true;
                loaderService.hide();
            })
            .catch(function (err) {
                loaderService.hide();
                alertService.alert('Ops =(', translationService.getLocalizedText(err.data.code));
            });
    }

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

        if (tabName === 'downloaded') {
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
        stateService.goToPlay(quest.quest_id);
    }

    function _like(quest) {
        accountService.getLoggedUser()
            .then(function(loggedUser) {
                if(!loggedUser) {
                    alertService.alert('Ops =(', self.TRANSLATIONS.YOU_MUST_BE_LOGGED_TO_DO_THIS);
                    return false;
                }
                else {
                    return questStoreService.like(quest.quest_id);
                }
            })
            .then(function(res) {
                if(res) {
                    _reloadLikeState(quest);
                    _openOptions(quest, true);
                }
            })
            .catch(function(err){
                alertService.alert('Ops =(', self.TRANSLATIONS.ERR_INTERNAL);
            });
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
        '$scope',
        'translationService',
        'stateService',
        'questStoreService',
        'loaderService',
        '$timeout',
        'networkService',
        'alertService',
        '$ionicModal',
        'questService',
        'accountService',
        HomeStoreController]
});
