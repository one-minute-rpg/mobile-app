/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestService($http, $q, $timeout, translationService, localStorageService) {
    function _getSaveGameKey(questId) {
        return 'SAVE_GAME_QUEST_' + questId;
    }


    return {
        getQuest: function (questId) {
            return $http.get('resources/$quests/' + questId + '/quest.json')
                .then(function(questData){
                    return questData.data;
                });
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
        }
    }
}

angular.module('omr').factory('questService', ['$http', '$q', '$timeout', 'translationService', 'localStorageService', OmrQuestService]);
