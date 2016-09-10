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
        var currentTranslationKey = self.TRANSLATIONS.$NAME;
        var formattedScene = {
            scene_id: scene.scene_id,
            title: scene.title[currentTranslationKey],
            text: scene.text[currentTranslationKey],
            actions: _getActions(scene)
        };

        return formattedScene;
    }

    function _getActions(scene) {
        var currentTranslationKey = self.TRANSLATIONS.$NAME;
        return scene.actions
            .filter(_filterRequireAttributeAction)
            .filter(_filterRequireItemAction)
            .map(function (act) {
                var formattedAction = angular.copy(act);
                formattedAction.text = act.text[currentTranslationKey];
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
    function _showNotificationsForEvents(events) {
        if(!events || !events.length) return;

        var currentTranslationKey = self.TRANSLATIONS.$NAME;

        var notifications = events
            .filter(function(e) {
                return !!e.text[currentTranslationKey];
            })
            .map(function(e){
                return {
                    type: _getNotificationType(e),
                    text: e.text[currentTranslationKey]
                };
            });

        self.notifications= notifications;

        $timeout(function(){
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
