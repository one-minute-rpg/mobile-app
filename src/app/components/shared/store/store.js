/**
 * Created by ben-hur on 14/08/2016.
 */
function OmrStoreController(stateService) {
    var self = this;

    self.goStore = function () {
        stateService.goHomeStore();
    }
}


angular.module('omr').component('omrStore', {
    templateUrl: 'components/shared/store/store.html',
    controller: ['stateService', OmrStoreController],
    bindings: {
    }
});
