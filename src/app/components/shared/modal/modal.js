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
