function OmrTranslationService(TRANSLATION_EN_US, TRANSLATION_PT_BR, AVAILABLE_TRANSLATIONS, localStorageService) {
    var CURRENT_TRANSLATION_KEY = 'CURRENT_TRANSLATION_KEY';

    var _allTranslations = [
        TRANSLATION_EN_US,
        TRANSLATION_PT_BR
    ];

    return {
        getCurrentTranslations: function () {
            var key = localStorageService.getString(CURRENT_TRANSLATION_KEY) || TRANSLATION_PT_BR.$NAME;

            return _allTranslations.filter(function (t) {
                return t.$NAME === key;
            })[0];
        },

        setCurrentTranslation: function (translationKey) {
            var selectedTranslation = _allTranslations.filter(function (t) {
                return t.$NAME === translationKey;
            })[0];

            localStorageService.set(CURRENT_TRANSLATION_KEY, selectedTranslation.$NAME);
        },

        getAvailableTranslations: function() {
            return AVAILABLE_TRANSLATIONS;
        },

        getLocalizedText: function(code) {
            return this.getCurrentTranslations()[code];
        }
    };
}

angular.module('omr').factory('translationService', [
    'TRANSLATION_EN_US',
    'TRANSLATION_PT_BR',
    'AVAILABLE_TRANSLATIONS',
    'localStorageService',
    OmrTranslationService]);
