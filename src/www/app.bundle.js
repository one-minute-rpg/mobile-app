function MainCtrl() {}

angular.module('omr', ['ionic']).controller('MainCtrl', MainCtrl);
function OmrConfigRoutes($stateProvider, $urlRouterProvider) {

    $stateProvider
        // HOME
        .state('home', {
            url: '/home',
            abstract: true,
            template: '<home></home>'
        })
        .state('home.index', {
            url: '/index',
            template: '<home-index></home-index>'
        })
        .state('home.store', {
            url: '/store',
            template: '<home-store></home-store>'
        })
        // QUEST
        .state('quest', {
            url: '/quest/{questId}',
            template: '<quest></quest>'
        });


    $urlRouterProvider.otherwise('/home/index');
}

angular.module('omr').config(['$stateProvider', '$urlRouterProvider', OmrConfigRoutes]);

angular.module('omr').constant('ENVIRONMENT', {
    RUNNING_ON_CORDOVA: !!window.cordova
});

angular.module('omr').constant('EVENTS', {
    ON_LANGUAGE_CHANGE: 'OMR_ON_LANGUAGE_CHANGE',
    ON_SOUND_STATE_CHANGE: 'OMR_ON_SOUND_STATE_CHANGE',
    ON_REQUEST_SHOW_LOADER: 'ON_REQUEST_SHOW_LOADER',
    ON_REQUEST_HIDE_LOADER: 'ON_REQUEST_HIDE_LOADER',
    ON_PLAY_SOUND: 'ON_PLAY_SOUND',
    ON_PLAY_THEME: 'ON_PLAY_THEME'
});

/**
 * Created by ben-hur on 17/08/2016.
 */
angular.module('omr').constant('SOUNDS', {
    MAIN: 'MAIN'
});

function OmrEventListenerRun($rootScope, EVENTS, soundService, platformService) {

}

angular.module('omr').run(['$rootScope', 'EVENTS', 'soundService', 'platformService', OmrEventListenerRun]);

/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrLoaderService($rootScope, EVENTS) {
    return {
        show: function () {
            $rootScope.$broadcast(EVENTS.ON_REQUEST_SHOW_LOADER);
        },

        hide: function () {
            $rootScope.$broadcast(EVENTS.ON_REQUEST_HIDE_LOADER);
        }
    }
}

angular.module('omr').factory('loaderService', ['$rootScope', 'EVENTS', OmrLoaderService]);

function PlatformService(ENVIRONMENT) {

    return {
        onReady: function (fn) {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("deviceready", fn, false);
            }
            else {
                angular.element(document).ready(fn);
            }
        },
        onPause: function (fn) {
            if(ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("pause", fn, false);
            }
        },
        onResume: function (fn) {
            if(ENVIRONMENT.RUNNING_ON_CORDOVA) {
                document.addEventListener("resume", fn, false);
            }
        }
    };
}

angular.module('omr').factory('platformService', ['ENVIRONMENT', PlatformService]);

/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestService($http, $q, $timeout, translationService, localStorageService) {
    function _getSaveGameKey(questId) {
        return 'SAVE_GAME_QUEST_' + questId;
    }


    return {
        getQuest: function (questId) {
            return $http.get('resources/$quests/' + questId + '/' + questId + '.json')
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

/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrQuestStoreService($q, $timeout, translationService) {

    var $$quests = [
        {
            id: '1ba6fc3409118d229875336a5e518f0d',
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
            }, 1500);

            return d.promise;
        }
    }
}

angular.module('omr').factory('questStoreService', ['$q', '$timeout', 'translationService', OmrQuestStoreService]);

/**
 * Created by ben-hur on 14/08/2016.
 */
function OmrSoundService($rootScope, EVENTS, localStorageService) {
    var SOUND_ENABLED_KEY = 'SOUND_ENABLED_KEY';

    return {
        soundIsEnabled: function () {
            var savedValue = localStorageService.getBoolean(SOUND_ENABLED_KEY);

            if(savedValue === undefined) {
                return true;
            }

            return savedValue;
        },

        setSoundState: function (isEnabled) {
            localStorageService.set(SOUND_ENABLED_KEY, String(isEnabled));
            $rootScope.$broadcast(EVENTS.ON_SOUND_STATE_CHANGE, { isEnabled: isEnabled});
        },

        playSound: function (soundKey) {
            $rootScope.$broadcast(EVENTS.ON_PLAY_SOUND, {
                soundKey: soundKey
            });
        },

        playTheme: function (soundKey) {
            $rootScope.$broadcast(EVENTS.ON_PLAY_THEME, {
                soundKey: soundKey
            });
        }
    }
}

angular.module('omr').factory('soundService', ['$rootScope', 'EVENTS', 'localStorageService', OmrSoundService]);

function OmrSplashScreenService(ENVIRONMENT) {
    return {
        hide: function () {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                navigator.splashscreen.hide();
            }
        },
        show: function() {
            if (ENVIRONMENT.RUNNING_ON_CORDOVA) {
                navigator.splashscreen.show();
            }
        }
    };
}

angular.module('omr').factory('splashScreenService', ['ENVIRONMENT', OmrSplashScreenService]);

function OmrStateService($state, loaderService) {
    return {
        goHomeIndex: function () {
            $state.go('home.index');
        },
        goHomeStore: function() {
            $state.go('home.store');
        },
        goToPlay: function (questId) {
            loaderService.show();
            $state.go('quest', {questId: questId});
        }
    };
}

angular.module('omr').factory('stateService', ['$state', 'loaderService', OmrStateService]);

function OmrLocalStorageService($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        getString: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        getNumber: function(key, defaultValue) {
            return Number($window.localStorage[key]) || defaultValue;
        },
        getBoolean: function(key, defaultValue) {
            var result = $window.localStorage[key];

            if(result === undefined) {
                return defaultValue;
            }

            return $window.localStorage[key] == 'true' ? true : false;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key, defaultValue) {
            var result = undefined;

            if($window.localStorage[key] === undefined) {
                if(defaultValue === undefined) {
                    return undefined;
                }
                else {
                    result = JSON.parse(defaultValue);
                }
            }
            else {
                result = JSON.parse($window.localStorage[key]);
            }

            return result;
        },
        remove: function(key) {
            $window.localStorage.removeItem(key);
        }
    };
}

angular.module('omr').factory('localStorageService', ['$window', OmrLocalStorageService]);

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
        }
    };
}

angular.module('omr').factory('translationService', [
    'TRANSLATION_EN_US',
    'TRANSLATION_PT_BR',
    'AVAILABLE_TRANSLATIONS',
    'localStorageService',
    OmrTranslationService]);

angular.module('omr').constant('AVAILABLE_TRANSLATIONS', {
    "PT_BR": 'Portugues',
    "EN_US": 'English (US)'
});
angular.module('omr').constant('TRANSLATION_EN_US', {
    $NAME: 'EN_US',
    CONFIGURATIONS: 'Configurations',
    LANGUAGE: 'Language',
    SOUND: 'Sound',
    SAVE: 'Save',
    CANCEL: 'Cancel',
    QUEST_STORE: 'Quest Store',
    PLAY: 'Play'
});

angular.module('omr').constant('TRANSLATION_PT_BR', {
    $NAME: 'PT_BR',
    CONFIGURATIONS: 'Configurações',
    LANGUAGE: 'Idioma',
    SOUND: 'Som',
    SAVE: 'Salvar',
    CANCEL: 'Cancelar',
    QUEST_STORE: 'Loja de Aventuras',
    PLAY: 'Jogar'
});

function HomePageController($timeout, platformService, splashScreenService, soundService, SOUNDS) {

}

angular.module('omr').component('home', {
    templateUrl: 'components/pages/home/home.html',
    controller: ['$timeout','platformService', 'splashScreenService', 'soundService', 'SOUNDS', HomePageController]
});

function QuestPageController($stateParams, $timeout, $location, platformService, loaderService, soundService, SOUNDS, questService, translationService) {
    var self = this;

    self.character = {
    };

    self.currentScene = {
        title: '',
        text: ''
    };

    self.notifications = [];

    self.goHome = _goHome;
    self.TRANSLATIONS = {};
    self.onChoseAction = _onChoseAction;
    self.$onInit = _init;

    var _quest = {};
    var _questSelectedLanguage = 'PT_BR';

    function _init() {
        platformService.onReady(function () {
            self.TRANSLATIONS = translationService.getCurrentTranslations();
            _loadQuest();
        });
    }

    function _loadQuest() {
        questService.getQuest($stateParams.questId)
            .then(function (questData) {
                _quest = questData;
                _loadSavedGame();
                loaderService.hide();
            });
    }

    function _configureSelectedLanguageForQuest() {
        var currentTranslationKey = self.TRANSLATIONS.$NAME;
        var questHasLanguage = _quest.availableLanguages.indexOf(currentTranslationKey) >= 0; 

        if(questHasLanguage) {
            _questSelectedLanguage = currentTranslationKey;
        }
        else {
            _questSelectedLanguage = _quest.availableLanguages[0];
        }
    }

    function _loadSavedGame() {
        var savedGame = questService.getSavedGame(_quest.quest_id);

        if (!!savedGame) {
            self.character = angular.copy(savedGame.character);
            $location.search({ sceneId: savedGame.currentSceneId });

            _loadScene();
        }
        else {
            _createNewGame();
        }
    }

    function _createNewGame() {
        self.character = angular.copy(_quest.character);
        _loadScene();
    }

    /************************
     * SCENE
     ************************/
    function _loadScene() {
        var currentSceneId = $location.search().sceneId || 1;
        var sceneData = _getScene(Number(currentSceneId));
        _bindScene(sceneData);
    }

    function _bindScene(scene) {
        self.currentScene = _formatScene(scene);
    }

    function _formatScene(scene) {
        var formattedScene = {
            scene_id: scene.scene_id,
            title: scene.title[_questSelectedLanguage],
            text: scene.text[_questSelectedLanguage],
            actions: _getActions(scene)
        };

        return formattedScene;
    }

    function _getActions(scene) {
        return scene.actions
            .filter(_filterRequireAttributeAction)
            .filter(_filterRequireItemAction)
            .map(function (act) {
                var formattedAction = angular.copy(act);
                formattedAction.text = act.text[_questSelectedLanguage];
                formattedAction._icon = _getActionIcon(act);
                return formattedAction;
            });
    }

    function _filterRequireAttributeAction(action) {
        if (action.require_attribute_value) {
            for (var attr in action.require_attribute_value) {
                if (self.character.attributes[attr].current < action.require_attribute_value[attr]) {
                    return false;
                }
            }
        }

        return true;
    }

    function _filterRequireItemAction(action) {
        var showAction = true;

        if (action.require_item_ids.length) {
            action.require_item_ids.forEach(function (itemId) {
                var notFound = self.character.itens.filter(function (i) {
                    return i.item_id == itemId && i.quantity > 0;
                }).length == 0;

                if (notFound) {
                    showAction = false;
                }
            });
        }

        return showAction;
    }

    function _getActionIcon(action) {
        if (action.require_item_ids.length) {
            return 'ITEM';
        }
        else if (action.require_attribute_value !== null) {
            return 'STATUS';
        }

        return 'MAP';
    }

    function _getScene(sceneId) {
        var scene = _quest.scenes.filter(function (s) {
            return s.scene_id === sceneId;
        })[0];

        return scene;
    }

    /************************
     * CHARACTER
     ************************/
    function _getCharacterItem(itemId) {
        return self.character.itens.filter(function (item) {
            return item.item_id == itemId;
        })[0];
    }

    function _removeCharacterItem(itemId) {
        self.character.itens = self.character.itens.filter(function (item) {
            return item.item_id != itemId;
        });
    }


    /************************
     * NOTIFICATIONS
     ************************/
    var _lastNotificationTimer = null;

    function _showNotificationsForEvents(events) {
        if(!events || !events.length) return;

        var notifications = events
            .filter(function(e) {
                return !!e.text[_questSelectedLanguage];
            })
            .map(function(e){
                return {
                    type: _getNotificationType(e),
                    text: e.text[_questSelectedLanguage]
                };
            });

        self.notifications= notifications;

        if(_lastNotificationTimer) {
            $timeout.cancel(_lastNotificationTimer);
        }

        _lastNotificationTimer = $timeout(function(){
            self.notifications = [];
        }, 2000);
    }

    function _getNotificationType(event) {
        switch(event.event_type) {
            case 'ADD_ITEM':
            case 'REMOVE_ITEM':
                return 'ITEM';
            case 'CHANGE_ATTRIBUTE':
                return 'STATUS';
            default:
                return 'ALERT';
        };
    }


    /************************
     * ACTIONS
     ************************/
    function _onChoseAction(action) {
        var events = action.events;
        _showNotificationsForEvents(events);

        events.forEach(function (e) {
            if (e.event_type === 'CHANGE_ATTRIBUTE') {
                _eventChangeAttribute(e.attribute, e.value);
            }
            else if (e.event_type === 'ADD_ITEM') {
                _eventAddItem(e.item_id, e.quantity);
            }
            else if (e.event_type === 'REMOVE_ITEM') {
                _eventRemoveItem(e.item_id, e.quantity);
            }
            else if (e.event_type === 'GO_TO_SCENE') {
                _eventGoToScene(e.scene_id);
            }
            else if (e.event_type === 'SAVE_GAME') {
                _eventSaveGame();
            }
        });
    }

    function _eventSaveGame() {
        questService.saveGame(
            _quest.quest_id,
            self.character,
            self.currentScene.scene_id
        );
    }

    function _eventGoToScene(sceneId) {
        $location.search({ sceneId: sceneId });
        _loadScene();
    }

    function _eventChangeAttribute(attribute, value) {
        var refAttribute = self.character.attributes[attribute];
        refAttribute.current += value;

        if (refAttribute.current > refAttribute.max) {
            refAttribute.current = refAttribute.max;
        }
    }

    function _eventAddItem(itemId, quantity) {
        var questItem = _quest.itens.filter(function (item) {
            return item.item_id == itemId;
        })[0];

        var charItem = _getCharacterItem(itemId);

        if (charItem) {
            self.character.itens[
                self.character.itens.indexOf(charItem)
            ].quantity += quantity;
        }
        else {
            self.character.itens.push({
                item_id: questItem.item_id,
                quantity: quantity
            });
        }
    }

    function _eventRemoveItem(itemId, quantity) {
        if (quantity == 0) {
            _removeCharacterItem(itemId);
        }
        else {
            var charItem = _getCharacterItem(itemId);
            if (charItem) {
                charItem.quantity -= quantity;

                if (charItem.quantity <= 0) {
                    _removeCharacterItem(itemId);
                }
                else {
                    self.character.itens[
                        self.character.itens.indexOf(charItem)
                    ] = charItem;
                }
            }
        }
    }


    /************************
     * ROUTE
     ************************/
    function _goHome() {

    }
}

angular.module('omr').component('quest', {
    templateUrl: 'components/pages/quest/quest.html',
    controller: [
        '$stateParams',
        '$timeout',
        '$location',
        'platformService',
        'loaderService',
        'soundService',
        'SOUNDS',
        'questService',
        'translationService',
        QuestPageController]
});

function ActionBarController($scope, $timeout, platformService, $ionicModal) {
    var self = this;

    self.$onInit = function () {
    };
}


angular.module('omr').component('omrActionBar', {
    templateUrl: 'components/shared/action-bar/action-bar.html',
    controller: ['$scope', '$timeout', 'platformService', '$ionicModal', ActionBarController],
    bindings: {
        settings: '=',
        home: '=',
        audio: '=',
        store: '='
    }
});

/**
 * Created by ben-hur on 21/08/2016.
 */
function OmrBackButtonController($) {
    var self = this;

    self.__onClick = function () {
        if(!!self.onClick) {
            self.onClick();
        }
    }
}

angular.module('omr').component('omrBackButton', {
    templateUrl: 'components/shared/back-button/back-button.html',
    controller: [OmrBackButtonController],
    bindings: {
        onClick: '&'
    }
});

function OmrConfigurationsController($scope, $timeout, soundService, $ionicModal, translationService, splashScreenService, $window, EVENTS) {
    var self = this;

    var $modalScope = $scope;

    $modalScope.onSelectTranslation = function(selectedTranslation) {
        console.log(selectedTranslation);
        $scope.selectedTranslation = selectedTranslation;
    };

    $modalScope.saveConfigurations = function () {
        $timeout(function () {
            translationService.setCurrentTranslation($modalScope.selectedTranslation.value);
            soundService.setSoundState($modalScope.soundIsEnabled);
            splashScreenService.show();

            $window.location.reload();
        }, 300);
    };

    $modalScope.cancel = function () {
        $modalScope.$modal.remove();
    };

    $modalScope.onChangeSoundState = function (soundIsEnabled) {
        $modalScope.soundIsEnabled = soundIsEnabled;
    };

    $scope.$on(EVENTS.ON_SOUND_STATE_CHANGE, function (event, data) {
        self.soundIsEnabled = data.isEnabled;
    });

    $modalScope.$modal = null;

    self.openConfigurations = function () {
        _initModalData();

        $ionicModal.fromTemplateUrl('components/shared/configurations/modal.tpl.html', {
            scope: $modalScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalScope.$modal = modal;
            $modalScope.$modal.show();
        });
    };

    self.$onInit = function () {

    };

    self.$onDestroy = function () {
        if($modalScope.$modal) {
            $modalScope.$modal.remove();
        }
    };

    function _initModalData() {
        $modalScope.TRANSLATIONS = translationService.getCurrentTranslations();
        $modalScope.availableTranslations = [];
        $modalScope.selectedTranslation = null;
        $modalScope.soundIsEnabled = soundService.soundIsEnabled();

        _loadAvailableTranslations();
    }

    function _loadAvailableTranslations() {
        var availableTranslations = translationService.getAvailableTranslations();

        for (var key in availableTranslations) {
            if (availableTranslations.hasOwnProperty(key)) {
                var option = {
                    text: availableTranslations[key],
                    value: key
                };

                $modalScope.availableTranslations.push(option);

                if(key == $modalScope.TRANSLATIONS.$NAME) {
                    $modalScope.selectedTranslation = option;
                }
            }
        }
    }
}


angular.module('omr').component('omrConfigurations', {
    templateUrl: 'components/shared/configurations/configurations.html',
    controller: [
        '$scope',
        '$timeout',
        'soundService',
        '$ionicModal',
        'translationService',
        'splashScreenService',
        '$window',
        'EVENTS',
        OmrConfigurationsController],
    bindings: {
    }
});

function OmrModalHeaderController() {
    var self = this;

    self.__onClose = function () {
        self.onClose();
    }
}

angular.module('omr').component('omrModalHeader', {
    templateUrl: 'components/shared/modal/modal-header.html',
    controller: [OmrModalHeaderController],
    bindings: {
        title: '=',
        onClose: '&'
    }
});

function OmrModalContentController() {
    var self = this;
}

angular.module('omr').component('omrModalContent', {
    transclude: true,
    templateUrl: 'components/shared/modal/modal-content.html',
    controller: [OmrModalContentController],
    bindings: {

    }
});

/**
 * Created by ben-hur on 15/08/2016.
 */
function OmrLoaderController($scope, EVENTS) {
    var self = this;

    self.show = false;

    self.$onInit = function () {
        $scope.$on(EVENTS.ON_REQUEST_SHOW_LOADER, function () {
            self.show = true;
        });

        $scope.$on(EVENTS.ON_REQUEST_HIDE_LOADER, function () {
            self.show = false;
        });
    };
}


angular.module('omr').component('omrLoader', {
    templateUrl: 'components/shared/loader/loader.html',
    controller: ['$scope', 'EVENTS', OmrLoaderController],
    bindings: {
    }
});

function OmrInlineLoaderController() {

}

angular.module('omr').component('omrInlineLoader', {
    templateUrl: 'components/shared/loader/inline-loader.html',
    controller: [OmrInlineLoaderController],
    bindings: {
        show: '='
    }
});

/**
 * Created by ben-hur on 21/08/2016.
 */
function OmrPageHeaderController($state) {
    var self = this;

    self.__onGoBack = function () {
        if(!!self.goBackHandler) {
            self.goBackHandler();
        }
    }

    self.callCustomAction = function(customAction) {
        if(!!self.customActionHanlder) {
            self.customActionHanlder(customAction);
        }
    }
}

angular.module('omr').component('omrPageHeader', {
    templateUrl: 'components/shared/page-header/page-header.html',
    controller: ['$state', OmrPageHeaderController],
    bindings: {
        title: '<',
        canGoBack: '<',
        goBackHandler: '&?', //avaliable if canGoBack is true
        customActions: '=',
        customActionHanlder: '&?'
    }
});

function OmrSoundController($scope, soundService, EVENTS, loaderService, $timeout, SOUNDS, platformService) {
    var self = this;
    var _$songs = {};
    var _$currentTheme = null;

    self.soundIsEnabled = true;

    self.toggleSound = function () {
        self.soundIsEnabled = !self.soundIsEnabled;
        soundService.setSoundState(self.soundIsEnabled);
    };

    self.$onInit = function () {
        _loadAudiosToCache();
        self.soundIsEnabled = soundService.soundIsEnabled();

        $scope.$on(EVENTS.ON_SOUND_STATE_CHANGE, function (event, data) {
            _onSoundStateChange(data);
        });

        $scope.$on(EVENTS.ON_PLAY_SOUND, function (event, data) {
            _onPlaySong(data);
        });

        $scope.$on(EVENTS.ON_PLAY_THEME, function (event, data) {
            _onPlayTheme(data);
        });

        platformService.onPause(function () {
            _pauseAllSongs();
        });

        platformService.onResume(function () {
            if(_$currentTheme) {
                _play(_$currentTheme);
            }
        });
    };

    /**
     * PRIVATE SECTION
     * */

    function _loadAudiosToCache() {
        for(var k in SOUNDS) {
            _$songs[SOUNDS.MAIN] = document.getElementById('omr-sound-' + k.toLowerCase());
        }
    }

    function _onPlayTheme(data) {
        if(_$currentTheme && _$currentTheme.stop) {
            _$currentTheme.stop();
        }

        _$currentTheme = _getAudioElement(data.soundKey);

        _play(_$currentTheme);
    }

    function _onPlaySong(data) {
        var $audio = _getAudioElement(data.soundKey);
        _play($audio);
    }

    function _play($audio) {
        if(self.soundIsEnabled) {
            $audio.play();
        }
    }

    function _playCurrentThemeSound() {
        if(!_$currentTheme) {
            _$currentTheme = _getAudioElement(SOUNDS.MAIN);
        }

        _$currentTheme.play();
    }

    function _onSoundStateChange(data) {
        self.soundIsEnabled = data.isEnabled;

        if(self.soundIsEnabled) {
            _playCurrentThemeSound();
        }
        else {
            _pauseAllSongs();
        }
    }

    function _pauseAllSongs() {
        for(s in _$songs) {
            _$songs[s].pause();
        }
    }

    function _getAudioElement(soundKey) {
        return _$songs[soundKey];
    }
}


angular.module('omr').component('omrSound', {
    templateUrl: 'components/shared/sound/sound.html',
    controller: ['$scope', 'soundService', 'EVENTS', 'loaderService', '$timeout', 'SOUNDS', 'platformService', OmrSoundController],
    bindings: {
    }
});

function HomeIndexController($timeout, platformService, splashScreenService, soundService, SOUNDS, translationService, stateService) {
    var self = this;

    self.ready = false;

    self.playTest = function () {
        stateService.goHomeStore();
    };

    self.$onInit = function() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();

        platformService.onReady(function() {
            $timeout(function(){
                self.ready = true;
                soundService.playTheme(SOUNDS.MAIN);

                splashScreenService.hide();
            }, 1000);
        });
    };
}

angular.module('omr').component('homeIndex', {
    templateUrl: 'components/pages/home/index/home-index.html',
    controller: ['$timeout','platformService', 'splashScreenService', 'soundService', 'SOUNDS', 'translationService', 'stateService', HomeIndexController]
});

function HomeStoreController(translationService, stateService, questStoreService, loaderService) {
    var self = this;

    self.goHome = function () {
        stateService.goHomeIndex();
    };

    self.downloadedQuests = [];
    self.loadingQuests = false;

    self.loadQuests = _loadQuests;
    self.play = _play;
    self.$onInit = _init;

    function _play(quest) {
        stateService.goToPlay(quest.id);
    }

    function _loadQuests() {
        self.loadingQuests = true;

        questStoreService.getDownloadedQuests()
            .then(function (quests) {
                self.downloadedQuests = quests;
                self.loadingQuests = false;
            });
    }

    function _init() {
        self.TRANSLATIONS = translationService.getCurrentTranslations();
        self.loadQuests();
    }
}

angular.module('omr').component('homeStore', {
    templateUrl: 'components/pages/home/store/home-store.html',
    controller: ['translationService', 'stateService', 'questStoreService', 'loaderService', HomeStoreController]
});
