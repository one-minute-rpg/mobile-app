function QuestPageController($stateParams, $timeout, $location, platformService, loaderService, soundService, SOUNDS, questService, translationService) {
    var self = this;

    self.character = {
    }

    self.currentScene = {
        title: '',
        text: ''
    }

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
            .then(function(questData) {
                _quest = questData;
                _loadCharacter();
                _loadScene();
                loaderService.hide();
            });
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
        var currentTranslationKey = self.TRANSLATIONS.$NAME;
        self.currentScene = _formatScene(scene);
    }

    function _formatScene(scene) {
        var currentTranslationKey = self.TRANSLATIONS.$NAME;
        var formattedScene = {
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
            .map(function(act) {
                var formattedAction = angular.copy(act);
                formattedAction.text = act.text[currentTranslationKey];
                formattedAction._icon = _getActionIcon(act);
                return formattedAction;
            });
    }

    function _filterRequireAttributeAction(action) {
        if(action.require_attribute_value) {
            for (var attr in action.require_attribute_value) {
                if(self.character.attributes[attr].current < action.require_attribute_value[attr]) {
                    return false;
                }
            }
        }

        return true;
    }

    function _filterRequireItemAction(action) {
        var showAction = true;

        if(action.require_item_ids.length) {
            action.require_item_ids.forEach(function(itemId) {
                var notFound = self.character.itens.filter(function(i){
                    return i.item_id == itemId && i.quantity > 0;
                }).length == 0;

                if(notFound) {
                    showAction = false;
                }
            });
        }

        return showAction;
    }

    function _getActionIcon(action) {
        if(action.require_item_ids.length) {
            return 'ITEM';
        }

        return 'MAP';
    }

    function _getScene(sceneId) {
        var scene = _quest.scenes.filter(function(s) {
            return s.scene_id === sceneId;
        })[0];

        return scene;
    }

    /************************
     * CHARACTER
     ************************/

    function _loadCharacter() {
        self.character = angular.copy(_quest.character);
    }




    /************************
     * ACTIONS
     ************************/

    function _onChoseAction(action) {
        var events = action.events;

        events.forEach(function(e) {
            if(e.event_type === 'CHANGE_ATTRIBUTE') {
                _changeAttribute(e.attribute, e.value);
            }
            else if(e.event_type === 'GO_TO_SCENE') {
                _goToScene(e.scene_id);
            }
        });
    }

    function _goToScene(sceneId) {
        $location.search({sceneId: sceneId});
        _loadScene();
    }

    function _changeAttribute(attribute, value) {
        self.character.attributes[attribute].current += value;

        if(self.character.attributes[attribute].current > self.character.attributes[attribute].max) {
            self.character.attributes[attribute].current = self.character.attributes[attribute].max;
        }
    }

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
