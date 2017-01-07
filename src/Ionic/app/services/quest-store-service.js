function OmrQuestStoreService($q, $http, $timeout, translationService, API, accountStorageService, networkService) {

    function _storeQuest(quest) {
        var keyFull = 'QUEST_FULL_' + quest.quest_id;
        accountStorageService.setObject(keyFull, quest);

        var keyResume = 'QUEST_RESUME_' + quest.quest_id;
        accountStorageService.setObject(keyResume, {
            quest_id: quest.quest_id,
            title: quest.title,
            cover: quest.cover,
            description: quest.description,
            version: quest.version
        });
    }

    function _getDownloadedResumeQuestKeys() {
        var allKeys = accountStorageService.getAllKeys();
        var questResumeKeys = [];

        allKeys.forEach(function(k) {
            if(k.indexOf('QUEST_RESUME_') >= 0) {
                questResumeKeys.push(k);
            }
        });

        return questResumeKeys;
    }


    return {
        search: function(term, page) {
            return networkService.requestOnline()
                .then(function(isOnline) {
                    if(isOnline) {
                        return $http.get(API.URL + '/quest/search?q=' + term + '&page=' + page);
                    }

                    return null;
                })
                .then(function(response) {
                    if(response === null) {
                        return {
                            quests: [],
                            noMoreData: true
                        }
                    }

                    return {
                        quests: response.data.quests.map(function(q){
                            return {
                                quest_id: q.quest_id,
                                title: q.title,
                                language: q.language,
                                cover: q.cover,
                                description: q.description,
                                likes: q.likes
                            }
                        }),
                        noMoreData: response.data.noMoreData
                    };
                });
        },
        
        download: function(questId) {
            return networkService.requestOnline()
                .then(function() {
                    return $http.get(API.URL + '/quest/download/' + questId)
                })
                .then(function(result) {
                    return _storeQuest(result.data.quest);
                })
                .catch(function(err) {
                    throw err;
                });
        },

        getDownloadedQuests: function () {
            var d = $q.defer();

            try {
                var resumeKeys = _getDownloadedResumeQuestKeys();
                var quests = [];
            
                quests = resumeKeys.map(function(key) {
                    return accountStorageService.getObject(key);
                });

                d.resolve(quests);

            } catch (error) {
                d.reject(error);
            }

            return d.promise;
        },

        removeFromDownloaded: function(questId) {
            return $q.resolve((function(){
                var keyFull = 'QUEST_FULL_' + questId;
                var keyResume = 'QUEST_RESUME_' + questId;

                accountStorageService.remove(keyFull);
                accountStorageService.remove(keyResume);
            })());
        },

        like: function(questId) {
            var d = $q.defer();

            networkService.requestOnline()
                .then(function() {
                    return  $http.post(API.URL + '/account-quest/like', {questId: questId});
                })
                .then(function(res) {
                    var key = 'QUEST_LIKED_' + questId;
                    var isLiked = !!accountStorageService.getBoolean(key, false);

                    if(isLiked) {
                        accountStorageService.remove(key);
                    }
                    else {
                        accountStorageService.set(key, true);
                    }
                })
                .then(function() {
                    d.resolve(true);
                })
                .catch(function(err) {
                    d.reject(err.data.code);
                });

            return d.promise;
        },

        isLiked: function(questId) {
             var key = 'QUEST_LIKED_' + questId;
             var isLiked = accountStorageService.getBoolean(key, false);
             return isLiked;
        },

        checkForUpdates: function(questId) {
            var self = this;

            networkService.requestOnline({ silent: true })
                .then(function() {
                    return $http.get(API.URL + '/quest/resume/' + questId);
                })
                .then(function(res){
                    var questResume = res.data;
                    var savedResume = accountStorageService.getObject('QUEST_RESUME_' + questId);

                    if(savedResume.version < questResume.version) {
                        return self.download(questId);
                    };
                });
        }
    }
}

angular.module('omr').factory('questStoreService', [
    '$q', 
    '$http',
    '$timeout', 
    'translationService',
    'API',
    'accountStorageService',
    'networkService',
     OmrQuestStoreService]);
