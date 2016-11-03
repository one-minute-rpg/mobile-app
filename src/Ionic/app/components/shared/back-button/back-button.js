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
