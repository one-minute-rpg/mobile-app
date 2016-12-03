function OmrQuestStoreService($q, $http, $timeout, translationService, API, localStorageService) {

    function _storeQuest(quest) {
        var keyFull = 'QUEST_FULL_' + quest.quest_id;
        localStorageService.setObject(keyFull, quest);

        var keyResume = 'QUEST_RESUME_' + quest.quest_id;
        localStorageService.setObject(keyResume, {
            quest_id: quest.quest_id,
            title: quest.title,
            cover: quest.cover,
            description: quest.description
        });
    }

    function _getDownloadedResumeQuestKeys() {
        var allKeys = localStorageService.getAllKeys();
        var questResumeKeys = [];

        allKeys.forEach(function(k) {
            if(k.indexOf('QUEST_RESUME_') === 0) {
                questResumeKeys.push(k);
            }
        });

        return questResumeKeys;
    }

    return {
        search: function(term, page) {
            return $http.get(API.URL + '/quest/search?q=' + term + '&page=' + page)
                .then(function(response) {
                    return {
                        quests: response.data.quests.map(function(q){
                            return {
                                id: q.quest_id,
                                title: q.title,
                                language: q.language,
                                cover: q.cover
                            }
                        }),
                        noMoreData: response.data.noMoreData
                    };
                });
        },
        
        download: function(questId) {
            return $http.get(API.URL + '/quest/download/' + questId)
                .then(function(result) {
                    _storeQuest(result.data.quest);
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
                    return localStorageService.getObject(key);
                });

                d.resolve(quests);

            } catch (error) {
                d.reject(error);
            }

            return d.promise;
        }
    }
}

angular.module('omr').factory('questStoreService', [
    '$q', 
    '$http',
    '$timeout', 
    'translationService',
    'API',
    'localStorageService',
     OmrQuestStoreService]);
