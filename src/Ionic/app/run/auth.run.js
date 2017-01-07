function OmrAuthRun(accountService) {
    accountService.init();
}

angular.module('omr').run(['accountService', OmrAuthRun]);
