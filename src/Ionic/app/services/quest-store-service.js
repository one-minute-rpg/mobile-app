/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestStoreService($q, $http, $timeout, translationService, API) {

    var $$quests = [
        {
            id: '1ba6fc3409118d229875336a5e518f0d',
            title: {
                'pt_br': 'Feiticeiro da montanha de fogo',
                'pt_br': 'The wizard of the mountain of fire'
            }
        }
    ];

    return {
        search: function(term) {
            var currentTranslation = translationService.getCurrentTranslations();
            return $http.get(API.URL + '/quest/search?q=' + term)
                .then(function(response) {
                    return response.data.map(function(q){
                        return {
                            id: q.id,
                            title: q.title[currentTranslation.$NAME],
                            image: q.image
                        }
                    });
                });
        },

        getDownloadedQuests: function () {
            var d = $q.defer();
            var currentTranslation = translationService.getCurrentTranslations();

            //TODO:BHR:MOCK
            $timeout(function () {
                d.resolve($$quests.map(function (q) {
                    return {
                        id: q.id,
                        title: q.title[currentTranslation.$NAME]
                    };
                }));
            }, 1500);

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
     OmrQuestStoreService]);
