function OmrConfigRoutes($stateProvider, $urlRouterProvider) {

    $stateProvider
        // HOME
        .state('home', {
            url: '/home',
            abstract: true,
            template: '<home></home>'
        })
        .state('home.index', {
            url: '/index',
            template: '<home-index></home-index>'
        })
        .state('home.store', {
            url: '/store',
            template: '<home-store></home-store>'
        })
        // QUEST
        .state('quest', {
            url: '/quest/{questId}',
            template: '<quest></quest>'
        });


    $urlRouterProvider.otherwise('/home/index');
}

angular.module('omr').config(['$stateProvider', '$urlRouterProvider', OmrConfigRoutes]);
