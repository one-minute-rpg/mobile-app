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
