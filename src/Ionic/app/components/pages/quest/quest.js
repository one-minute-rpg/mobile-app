function QuestPageController($scope, $stateParams, $timeout, $location, platformService, loaderService, soundService, SOUNDS, questService, translationService, $ionicModal, splashScreenService, stateService, $ionicPopup) {
    var self = this;

    self.hero = {
    };

    self.currentScene = {
        title: '',
        text: ''
    };

    self.notifications = [];

    self.goHome = _goHome;
    self.TRANSLATIONS = {};
    self.onChoseAction = _onChoseAction;
    self.openHeroItensModal = _openModalHeroItens;
    self.openHeroStatusModal = _openModalHeroStatus;
    self.$onInit = _init;

    var _quest = {};
    var _questSelectedLanguage = 'pt_br';

    function _init() {
        platformService.onReady(function () {
            self.TRANSLATIONS = translationService.getCurrentTranslations();
            _loadQuest();
            $timeout(function () {
                self.ready = true;
                splashScreenService.hide();
            }, 1000);
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

        if (questHasLanguage) {
            _questSelectedLanguage = currentTranslationKey;
        }
        else {
            _questSelectedLanguage = _quest.availableLanguages[0];
        }

        _questSelectedLanguage = _questSelectedLanguage.toLowerCase();
    }

    function _loadSavedGame() {
        var savedGame = questService.getSavedGame(_quest.quest_id);

        if (!!savedGame) {
            self.hero = angular.copy(savedGame.hero);
            $location.search({ sceneId: savedGame.currentSceneId });

            _loadScene();
        }
        else {
            _createNewGame();
        }
    }

    function _createNewGame() {
        self.hero = angular.copy(_quest.hero);
        _loadScene();
    }

    /************************
     * SCENE
     ************************/
    function _loadScene() {
        var currentSceneId = $location.search().sceneId;

        if (!currentSceneId) {
            currentSceneId = _quest.scenes[0].scene_id;
        }

        var sceneData = _getScene(currentSceneId);
        _bindScene(sceneData);
    }

    function _bindScene(scene) {
        var formattedScene = _formatScene(scene);
        self.currentScene = formattedScene;
    }

    function _formatScene(scene) {
        var formattedScene = {
            scene_id: scene.scene_id,
            title: scene.title[_questSelectedLanguage],
            text: scene.text[_questSelectedLanguage],
            actions: [],
            on_die_events: scene.on_die_events
        };

        if (scene.type === 'DECISION') {
            formattedScene.actions = _getActions(scene);
        }

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
                if (self.hero.attributes[attr] < action.require_attribute_value[attr]) {
                    return false;
                }
            }
        }

        return true;
    }

    function _filterRequireItemAction(action) {
        var showAction = true;

        if (action.require_items.length) {
            action.require_items.forEach(function (requiredItem) {
                var haveItem = !!self.hero.items.find(function(heroItem) {
                    return heroItem.item_id === requiredItem.item_id
                        && heroItem.quantity >= requiredItem.quantity;
                });

                if (!haveItem) {
                    showAction = false;
                }
            });
        }

        return showAction;
    }

    function _getActionIcon(action) {
        if (action.require_items.length) {
            return 'ITEM';
        }
        else if (action.require_attribute_value !== null) {
            return 'STATUS';
        }

        return 'MAP';
    }

    function _getScene(sceneId) {
        var scene = _quest.scenes.find(function (s) {
            return s.scene_id === sceneId;
        });

        return scene;
    }

    /************************
     * hero
     ************************/
    function _getHeroItem(itemId) {
        return self.hero.items.find(function (item) {
            return item.item_id == itemId;
        });
    }

    function _removeheroItem(itemId) {
        self.hero.items = self.hero.items.filter(function (item) {
            return item.item_id != itemId;
        });
    }


    /************************
     * NOTIFICATIONS
     ************************/
    var _lastNotificationTimer = null;
    var _invalidTypesForNotification = ['GAME_OVER', 'VICTORY'];

    function _showNotificationsForEvents(events) {
        if (!events || !events.length) return;

        var notifications = events
            .filter(function (e) {
                var typeIsValid = _invalidTypesForNotification.indexOf(e.type) >= 0;
                var hasText = !!e.text && !!e.text[_questSelectedLanguage];

                return typeIsValid && hasText;
            })
            .map(function (e) {
                return {
                    type: _getNotificationType(e),
                    text: e.text[_questSelectedLanguage]
                };
            });

        self.notifications = notifications;

        if (_lastNotificationTimer) {
            $timeout.cancel(_lastNotificationTimer);
        }

        _lastNotificationTimer = $timeout(function () {
            self.notifications = [];
        }, 2000);
    }

    function _getNotificationType(event) {
        switch (event.type) {
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
        _raiseEvents(events);
    }

    function _raiseEvents(events, isFromDieTrigger) {
        _showNotificationsForEvents(events);

        events.forEach(function (e) {
            if (e.type === 'CHANGE_ATTRIBUTE') {
                _eventChangeAttribute(e.attribute, e.value);
            }
            else if (e.type === 'ADD_ITEM') {
                _eventAddItem(e.item_id, e.quantity);
            }
            else if (e.type === 'REMOVE_ITEM') {
                _eventRemoveItem(e.item_id, e.quantity);
            }
            else if (e.type === 'USE_ITEM') {
                _eventUseItem(e.item_id);
            }
            else if (e.type === 'GO_TO_SCENE') {
                _eventGoToScene(e.scene_id);
            }
            else if (e.type === 'SAVE_GAME') {
                _eventSaveGame();
            }
            else if (e.type === 'GAME_OVER') {
                _eventGameOver(e);
            }
            else if (e.type === 'VICTORY') {
                _eventVictory(e);
            }
        });

        if(self.hero.attributes.health < 1 && !isFromDieTrigger) {
            _raiseEvents(self.currentScene.on_die_events, true);
        }
    }

    function _eventVictory(e) {
        _openModalVictory(e);
    }

    function _eventGameOver(e) {
        _openModalGameOver(e);
    }

    function _eventUseItem(itemId) {
        var hasItem = !!self.hero.items.find(function (item) {
            return item.item_id == itemId && item.quantity > 0;
        });

        if (hasItem) {
            var item = _quest.items.find(function (item) {
                return item.item_id == itemId;
            });

            _raiseEvents(item.events);
        }
    }

    function _eventSaveGame() {
        questService.saveGame(
            _quest.quest_id,
            self.hero,
            self.currentScene.scene_id
        );

        console.log('Game Saved');
    }

    function _eventGoToScene(sceneId) {
        $location.search({ sceneId: sceneId });
        _loadScene();

        console.log('Going to scene ' + sceneId);
    }

    function _eventChangeAttribute(attribute, value) {
        self.hero.attributes[attribute] += value;
        console.log('Changing attribute ' + attribute + ': ' + value);
        console.log(self.hero.attributes);
    }

    function _eventAddItem(itemId, quantity) {
        console.log('Adding item ' + itemId + ': ' + quantity);

        var questItem = _quest.items.find(function (item) {
            return item.item_id == itemId;
        });

        var charItem = _getHeroItem(itemId);

        if (charItem) {
            self.hero.items[
                self.hero.items.indexOf(charItem)
            ].quantity += quantity;
        }
        else {
            self.hero.items.push({
                item_id: questItem.item_id,
                quantity: quantity
            });
        }

        console.log(self.hero.items);
    }

    function _eventRemoveItem(itemId, quantity) {
        console.log('Removing item ' + itemId + ': ' + quantity);

        if (quantity == 0) {
            _removeheroItem(itemId);
        }
        else {
            var charItem = _getHeroItem(itemId);
            if (charItem) {
                charItem.quantity -= quantity;

                if (charItem.quantity <= 0) {
                    _removeheroItem(itemId);
                }
                else {
                    self.hero.items[
                        self.hero.items.indexOf(charItem)
                    ] = charItem;
                }
            }
        }

        console.log(self.hero.items);
    }


    /************************
     * ROUTE
     ************************/
    function _goHome(params) {
        function __done() {
            stateService.goHomeIndex();
            splashScreenService.show();
        }

        if (params && params.needConfirmation) {
            var confirmPopup = $ionicPopup.confirm({
                title: self.TRANSLATIONS.ADVENTURE,
                template: self.TRANSLATIONS.BACK_TO_HOME + '?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    __done();
                }
            });
        }
        else {
            __done();
        }
    }

    /************************
     * VICTORY
     ************************/
    var $modalVictoryScope = $scope;
    $modalVictoryScope.$modal = null;

    $modalVictoryScope.goToHome = function () {
        $modalVictoryScope.$modal.hide();
        $modalVictoryScope.$modal.remove();
        _goHome();
    }

    function _openModalVictory(event) {
        $modalVictoryScope.TRANSLATIONS = self.TRANSLATIONS;
        $modalVictoryScope.text = event.text ? event.text[_questSelectedLanguage] : '';

        $ionicModal.fromTemplateUrl('components/pages/quest/game-victory/game-victory.html', {
            scope: $modalVictoryScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalVictoryScope.$modal = modal;
            $modalVictoryScope.$modal.show();
        });
    }


    /************************
     * GAME OVER
     ************************/
    var $modalGameOverScope = $scope;
    $modalGameOverScope.$modal = null;

    $modalGameOverScope.goToHome = function () {
        $modalGameOverScope.$modal.hide();
        $modalGameOverScope.$modal.remove();
        _goHome();
    }

    $modalGameOverScope.continueFromLastSavePoint = function () {
        console.log('CONTINUE_FROM_LAST_SAVE_POINT');
        $modalGameOverScope.$modal.hide();
        $modalGameOverScope.$modal.remove();
    }

    function _openModalGameOver(event) {
        $modalGameOverScope.TRANSLATIONS = self.TRANSLATIONS;
        $modalGameOverScope.text = event.text ? event.text[_questSelectedLanguage] : '';

        $ionicModal.fromTemplateUrl('components/pages/quest/game-over/game-over.html', {
            scope: $modalGameOverScope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalGameOverScope.$modal = modal;
            $modalGameOverScope.$modal.show();
        });
    }


    /************************
     * HERO ITENS
     ************************/
    var $modalHeroItens = $scope;
    function _openModalHeroItens() {
        $modalHeroItens.TRANSLATIONS = self.TRANSLATIONS;

        var modalItens = self.hero.items.map(function (item) {
            var questItem = _quest.items.find(function (i) {
                return i.item_id == item.item_id;
            });

            var resultItem = angular.extend({}, item, questItem);
            resultItem.name = resultItem.name[_questSelectedLanguage];
            resultItem.description = resultItem.description[_questSelectedLanguage];

            return resultItem;
        });

        $modalHeroItens.itens = modalItens || [];

        $ionicModal.fromTemplateUrl('components/pages/quest/hero-itens/hero-itens.html', {
            scope: $modalHeroItens,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalHeroItens.$modal = modal;
            $modalHeroItens.$modal.show();
            console.log($modalHeroItens.itens);
        });
    }

    $modalHeroItens.selectItem = function (item) {
        console.log(item);

        var popup = {
            title: item.name,
            template: item.description,
            scope: $scope,
            buttons: [
                {
                    text: self.TRANSLATIONS.OK,
                    type: 'button-positive'
                }
            ]
        };

        if(item.type == 'INVENTORY') {
            popup.buttons = [
                {
                    text: self.TRANSLATIONS.NO,
                    type: 'button-default'
                },
                {
                    text: self.TRANSLATIONS.YES,
                    type: 'button-positive',
                    onTap: function (e) {
                        $modalHeroItens.requestUseItem(item);
                    }
                }
            ];

            popup.template = self.TRANSLATIONS.WANT_TO_USE_ITEM + ' <b>' + item.name + '</b>?';
        }

        var myPopup = $ionicPopup.show(popup);
    }

    $modalHeroItens.requestUseItem = function(item) {
        $modalHeroItens.closeModalHeroItens();
        
        $timeout(function(){
            _raiseEvents(item.events);
        }, 300);
    }

    $modalHeroItens.closeModalHeroItens = function () {
        $modalHeroItens.$modal.hide();
    }

    /************************
     * HERO STATUS
     ************************/
    var $modalHeroStatus = $scope;
    function _openModalHeroStatus() {
        $modalHeroStatus.TRANSLATIONS = self.TRANSLATIONS;
        $modalHeroStatus.statusList = [
            {
                "name": self.TRANSLATIONS.HEALTH,
                "value": self.hero.attributes.health,
                "about": self.TRANSLATIONS.ABOUT_HEALTH
            },
            {
                "name": self.TRANSLATIONS.STRENGTH,
                "value": self.hero.attributes.strength,
                "about": self.TRANSLATIONS.ABOUT_STRENGTH
            },
            {
                "name": self.TRANSLATIONS.AGILITY,
                "value": self.hero.attributes.agility,
                "about": self.TRANSLATIONS.ABOUT_AGILITY
            },
            {
                "name": self.TRANSLATIONS.INTELLIGENCE,
                "value": self.hero.attributes.intelligence,
                "about": self.TRANSLATIONS.ABOUT_INTELLIGENCE
            }
        ];

        $modalHeroStatus.onSelectStatus = function(s) {
            var popup = {
                title: s.name,
                template: s.about,
                scope: $scope,
                buttons: [
                    {
                        text: self.TRANSLATIONS.OK,
                        type: 'button-positive'
                    }
                ]
            };

            $ionicPopup.show(popup);
        }

        $ionicModal.fromTemplateUrl('components/pages/quest/hero-status/hero-status.html', {
            scope: $modalHeroStatus,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $modalHeroStatus.$modal = modal;
            $modalHeroStatus.$modal.show();
        });
    }

    $modalHeroStatus.closeModalHeroStatus = function() {
        $modalHeroStatus.$modal.hide();
    }
}

angular.module('omr').component('quest', {
    templateUrl: 'components/pages/quest/quest.html',
    controller: [
        '$scope',
        '$stateParams',
        '$timeout',
        '$location',
        'platformService',
        'loaderService',
        'soundService',
        'SOUNDS',
        'questService',
        'translationService',
        '$ionicModal',
        'splashScreenService',
        'stateService',
        '$ionicPopup',
        QuestPageController]
});
