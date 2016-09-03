/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestStoreService($q, $timeout, translationService) {

    var $$quests = [
        {
            id: 1,
            title: {
                'PT_BR': 'Feiticeiro da montanha de fogo',
                'EN_US': 'The wizard of the mountain of fire'
            }
        }
    ];

    return {
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
            }, 3000);

            return d.promise;
        }
    }
}

angular.module('omr').factory('questStoreService', ['$q', '$timeout', 'translationService', OmrQuestStoreService]);
