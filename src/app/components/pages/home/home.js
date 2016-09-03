function HomePageController($timeout, platformService, splashScreenService, soundService, SOUNDS) {

}

angular.module('omr').component('home', {
    templateUrl: 'components/pages/home/home.html',
    controller: ['$timeout','platformService', 'splashScreenService', 'soundService', 'SOUNDS', HomePageController]
});
