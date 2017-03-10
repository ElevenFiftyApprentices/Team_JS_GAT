(function () {
  'use strict';

  describe('Shoppinglists Route Tests', function () {
    // Initialize global variables
    var $scope,
      ShoppinglistsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ShoppinglistsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ShoppinglistsService = _ShoppinglistsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('shoppinglists');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/shoppinglists');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ShoppinglistsController,
          mockShoppinglist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('shoppinglists.view');
          $templateCache.put('modules/shoppinglists/client/views/view-shoppinglist.client.view.html', '');

          // create mock Shoppinglist
          mockShoppinglist = new ShoppinglistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Shoppinglist Name'
          });

          // Initialize Controller
          ShoppinglistsController = $controller('ShoppinglistsController as vm', {
            $scope: $scope,
            shoppinglistResolve: mockShoppinglist
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:shoppinglistId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.shoppinglistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            shoppinglistId: 1
          })).toEqual('/shoppinglists/1');
        }));

        it('should attach an Shoppinglist to the controller scope', function () {
          expect($scope.vm.shoppinglist._id).toBe(mockShoppinglist._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/shoppinglists/client/views/view-shoppinglist.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ShoppinglistsController,
          mockShoppinglist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('shoppinglists.create');
          $templateCache.put('modules/shoppinglists/client/views/form-shoppinglist.client.view.html', '');

          // create mock Shoppinglist
          mockShoppinglist = new ShoppinglistsService();

          // Initialize Controller
          ShoppinglistsController = $controller('ShoppinglistsController as vm', {
            $scope: $scope,
            shoppinglistResolve: mockShoppinglist
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.shoppinglistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/shoppinglists/create');
        }));

        it('should attach an Shoppinglist to the controller scope', function () {
          expect($scope.vm.shoppinglist._id).toBe(mockShoppinglist._id);
          expect($scope.vm.shoppinglist._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/shoppinglists/client/views/form-shoppinglist.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ShoppinglistsController,
          mockShoppinglist;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('shoppinglists.edit');
          $templateCache.put('modules/shoppinglists/client/views/form-shoppinglist.client.view.html', '');

          // create mock Shoppinglist
          mockShoppinglist = new ShoppinglistsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Shoppinglist Name'
          });

          // Initialize Controller
          ShoppinglistsController = $controller('ShoppinglistsController as vm', {
            $scope: $scope,
            shoppinglistResolve: mockShoppinglist
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:shoppinglistId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.shoppinglistResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            shoppinglistId: 1
          })).toEqual('/shoppinglists/1/edit');
        }));

        it('should attach an Shoppinglist to the controller scope', function () {
          expect($scope.vm.shoppinglist._id).toBe(mockShoppinglist._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/shoppinglists/client/views/form-shoppinglist.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
