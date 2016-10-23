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
