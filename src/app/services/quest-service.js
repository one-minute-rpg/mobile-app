/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestService($http, $q, $timeout, translationService) {
    return {
        getQuest: function (questId) {
            return $http.get('resources/$quests/' + questId + '/' + questId + '.json')
                .then(function(questData){
                    return questData.data;
                });
        }
    }
}

angular.module('omr').factory('questService', ['$http', '$q', '$timeout', 'translationService', OmrQuestService]);
