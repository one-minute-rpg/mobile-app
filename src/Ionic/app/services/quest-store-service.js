function OmrQuestStoreService($q, $http, $timeout, translationService, API) {
    var $$quests = [
        {
            id: '1ba6fc3409118d229875336a5e518f0d',
            title: 'The wizard of the mountain of fire',
            language: 'en_us'
        }
    ];

    return {
        search: function(term, page) {
            return $http.get(API.URL + '/quest/search?q=' + term + '&page=' + page)
                .then(function(response) {
                    return {
                        quests: response.data.quests.map(function(q){
                            return {
                                id: q.id,
                                title: q.title,
                                language: q.language,
                                image: q.cover
                            }
                        }),
                        noMoreData: response.data.noMoreData
                    };
                });
        },

        getDownloadedQuests: function () {
            var d = $q.defer();

            //TODO:BHR:MOCK
            $timeout(function () {
                d.resolve($$quests.map(function (q) {
                    return {
                        id: q.id,
                        title: q.title
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
