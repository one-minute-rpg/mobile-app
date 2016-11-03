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
