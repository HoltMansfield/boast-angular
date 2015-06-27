'use strict';

angular
   // create the first module for the application
  .module('<%= answers.appName %>',[
    'ui.router'
  ])
  // configure the application
  .config(function($stateProvider, $urlRouterProvider, routeCreatorProvider) {
  // Create UI.Router routes
  routeCreatorProvider.createRoutes({
    stateProvider: $stateProvider,
    urlRouterProvider: $urlRouterProvider
  });
});
