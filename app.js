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
            template: '<li>' +
                '<found-item-description></found-item-description>' +
                '<button ng-click="search.onRemoveMenuItem($index);">Don' + 't want this one!</button>' +
            '</li>'
          };
        
          return ddo;
    }

    function FoundItemDescription() {
        var ddo = {
          template: ' ({{ item.short_name }}) - {{ item.name }}, {{ item.description }}'
        };
      
        return ddo;
    }

    MenuSearchController.$inject = ['MenuSearchService'];
    function MenuSearchController (MenuSearchService) {
        var menu = this;

        menu.found = true;

        menu.foundItems = MenuSearchService.getFoundItems();

        this.onSearch = function () {

            if (menu.serachText == undefined || menu.serachText == '') {
                menu.found = false;
                menu.foundItems = [];
                return;
            }

            var promise = MenuSearchService.onSearch();

            promise.then(function (response) {
                menu.foundItems = MenuSearchService.onFilter(response.data.menu_items, menu.serachText);

                if (menu.foundItems.length == 0)
                    menu.found = false;
                else menu.found = true;
            })
            .catch( function (error) {
                menu.found = false;
            });
        }

        this.onRemoveMenuItem = function (index) {
            MenuSearchService.onRemoveMenuItem(index);
            if (MenuSearchService.getFoundItems().length == 0)
                menu.found = false;
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService ($http, ApiBasePath) {
        var foundItems = [];

        this.onSearch = function () {
            var response = $http({
                method: "GET",
                url: ApiBasePath
            });

            return response;
        }

        this.onFilter = function (menu, searchText) {
            foundItems = [];
            for (var i = 0; i < menu.length; i ++) {
                if (menu[i].description && menu[i].description.toLowerCase().search(searchText.toLowerCase()) !== - 1) {
                    foundItems.push(menu[i]);
                }
                else if (menu[i].name && menu[i].name.toLowerCase().search(searchText.toLowerCase()) !== - 1) {
                    foundItems.push(menu[i]);
                }
                else if (menu[i].short_name && menu[i].short_name.toLowerCase().search(searchText.toLowerCase()) !== - 1) {
                    foundItems.push(menu[i]);
                }
            }
            return foundItems;
        }

        this.onRemoveMenuItem = function (index) {
            foundItems.splice(index, 1);
        }

        this.getFoundItems = function () {
            return foundItems;
        }
    }
}) ();