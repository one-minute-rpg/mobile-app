function OmrQuestService($http, $q, $timeout, translationService, localStorageService) {
    function _getSaveGameKey(questId) {
        return 'SAVE_GAME_QUEST_' + questId;
    }

    return {
        getQuest: function (questId) {
            var d = $q.defer();

            try {
                var keyFull = 'QUEST_FULL_' + questId;
                var quest = localStorageService.getObject(keyFull);
                d.resolve(quest);
            } catch (error) {
                d.reject(error);
            }

            return d.promise;
        },

        saveGame: function(questId, character, currentSceneId) {
            var key = _getSaveGameKey(questId);

            localStorageService.setObject(key, {
                questId: questId,
                character: character,
                currentSceneId: currentSceneId
            });
        },

        getSavedGame: function(questId) {
            var key = _getSaveGameKey(questId);
            return localStorageService.getObject(key);
        },

        removeSavedGame: function(questId) {
            var key = _getSaveGameKey(questId);
            localStorageService.remove(key);
        }
    }
}

angular.module('omr').factory('questService', ['$http', '$q', '$timeout', 'translationService', 'localStorageService', OmrQuestService]);
