angular
  .module('<%= answers.appName %>')
  .provider('routeCreator', function RoutCreatorProvider() {

    this.createRoutes = function(uiRouterProviders) {
      uiRouterProviders.urlRouterProvider.otherwise('/');
      uiRouterProviders.stateProvider
        .state('home', {
          url: '/',
          templateUrl: '/views/home.html'
        });
    };

    this.$get = ["uiRouterProviders", function routeCreatorFactory() {
      return new RouteCreator(uiRouterProviders, createRoutes);
    }];
  });
