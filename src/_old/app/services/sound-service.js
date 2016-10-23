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
