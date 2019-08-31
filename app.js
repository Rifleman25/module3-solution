(function  () {
   'use strict'; 

    angular.module('MenuSearch', [])
    .controller('MenuSearchController', MenuSearchController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItemDescription', FoundItemDescription)
    .directive('foundItem', FoundItem)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com/menu_items.json");

    function FoundItem() {
        var ddo = {
            restrict: "E",
            templateUrl: 'foundItem.html'
          };
        
          return ddo;
    }

    function FoundItemDescription() {
        var ddo = {
          template: '{{ item.name }}'
        };
      
        return ddo;
    }

    MenuSearchController.$inject = ['MenuSearchService'];
    function MenuSearchController (MenuSearchService) {
        var menu = this;
        this.onSearch = function () {
            var promise = MenuSearchService.onSearch();

            promise.then(function (response) {
                menu.foundItems = response.data.menu_items;
                menu.foundItems.splice(50, 200);
                console.log(response.data.menu_items);
            })
            .catch(function (error) {
                console.log("Something went terribly wrong.");
            });
        }

        this.onRemoveMenuItem = function (index) {
            MenuSearchService.onRemoveMenuItem(index);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService ($http, ApiBasePath) {
        var foundItems = [];

        this.onSearch = function (searchText) {
            var response = $http({
                method: "GET",
                url: ApiBasePath
            });

            return response;
        }

        this.onRemoveMenuItem = function (index) {
            foundItems.splice(index, 1);
        }
    }
}) ();