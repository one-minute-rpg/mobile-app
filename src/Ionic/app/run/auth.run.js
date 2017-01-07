function OmrAuthRun(accountService, questStoreService) {
    accountService.init()
        .then(function(){
            return questStoreService.getDownloadedQuests();
        })
        .then(function(downloadedQuests){
            downloadedQuests.forEach(function(quest){
                questStoreService.checkForUpdates(quest.quest_id);
            });
        });
}

angular.module('omr').run(['accountService', 'questStoreService', OmrAuthRun]);
