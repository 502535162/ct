angular.module('angular-accordion', [])
    .directive('angularAccordion', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-container"></div>',
            controller: ['$scope', '$rootScope', function($scope, $rootScope) {
                var panes = [];

                this.expandPane = function(paneToExpand) {
                    angular.forEach(panes, function(iteratedPane) {
                        if(paneToExpand !== iteratedPane) {
                            iteratedPane.expanded = false;
                        }
                    });
                };                

                this.addPane = function(pane) {
                    panes.push(pane);
                };

                $scope.$on('expand-pane', function(event){
                    console.log("expand pane")
                })
            }],
            scope: {}
        };
    })
    .directive('pane', function() {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-pane"></div>'
        };
    })
    .directive('paneHeader', ['$window', 'Debounce', 'localStorageService', function($window, Debounce, localStorageService) {
        return {
            restrict: 'EA',
            require: '^angularAccordion',
            transclude: true,
            replace: true,
            link: function(scope, iElement, iAttrs, controller) {
                scope.expanded = false;
                scope.passOnExpand = iAttrs.passOnExpand;
                scope.disabled = iAttrs.disabled;
                controller.addPane(scope);

                $(iElement).append("<i class='pull-right fa fa-chevron-up'></i>")

                // TODO: figure out how to trigger this without interpolation in the template
                iAttrs.$observe('disabled', function(value) {
                    // attributes always get passed as strings
                    if(value === 'true') {
                        scope.disabled = true;
                    } else {
                        scope.disabled = false;
                    }
                });

                var computed = function(rawDomElement, property) {
                    var computedValueAsString = $window.getComputedStyle(rawDomElement).getPropertyValue(property).replace('px', '');
                    return parseFloat(computedValueAsString);
                };

                var computeExpandedPaneHeight = function() {
                    var parentContainer = iElement.parent().parent()[0];
                    var header = iElement[0];
                    var paneWrapper = iElement.parent()[0];
                    var contentPane = iElement.next()[0];
                    var headerCount = iElement.parent().parent().children().length;

                    var containerHeight = computed(parentContainer, 'height');
                    var headersHeight = ((computed(header, 'height') + computed(header, 'padding-top') + computed(header, 'padding-bottom') +
                        computed(header, 'margin-top') + computed(header, 'margin-bottom') + computed(header, 'border-top') + computed(header, 'border-bottom') +
                        computed(paneWrapper, 'padding-top') + computed(paneWrapper, 'padding-bottom') + computed(paneWrapper, 'margin-top') +
                        computed(paneWrapper, 'margin-bottom') + computed(paneWrapper, 'border-top') + computed(paneWrapper, 'border-bottom')) * headerCount) +
                        (computed(contentPane, 'padding-top') + computed(contentPane, 'padding-bottom') + computed(contentPane, 'margin-top') +
                            computed(contentPane, 'margin-bottom') + computed(contentPane, 'border-top') + computed(contentPane, 'border-bottom'));

                    return containerHeight - headersHeight;
                }

                scope.toggle = function() {
                    if(!scope.disabled) {
                        scope.expanded = !scope.expanded;

                        if(scope.expanded) {
                            // iElement.next().css('height', computeExpandedPaneHeight() + 'px');
                            if($(iElement).offsetParent().find("i").hasClass("fa-chevron-down")){
                                // $(iElement).offsetParent().find("i").removeClass("fa-chevron-down").addClass("fa-chevron-up")
                                // $(iElement).children("i").removeClass("fa-chevron-up")
                                // $(iElement).children("i").addClass("fa-chevron-down")
                            }
                            // $(iElement).append("class='pull-right fa fa-chevron-down'")
                            scope.$emit('angular-accordion-expand', scope.passOnExpand);
                        }

                        controller.expandPane(scope);
                    }
                };

                angular.element($window).bind('resize', Debounce.debounce(function() {
                    // must apply since the browser resize event is not seen by the digest process
                    scope.$apply(function() {
                        // iElement.next().css('height', computeExpandedPaneHeight() + 'px');
                    });
                }, 50));

                scope.$on('expand', function(event, eventArguments) {
                    if(eventArguments === scope.passOnExpand) {
                        // only toggle if we are loading a deeplinked route
                        if(!scope.expanded) {
                            scope.toggle();
                        }
                    }
                });
            },
            template: '<div ng-transclude class="angular-accordion-header" ng-click="toggle()" ' +
                'ng-class="{ angularaccordionheaderselected: expanded, angulardisabledpane: disabled }"></div>'
        };
    }])
    .directive('paneContent', function() {
        return {
            restrict: 'EA',
            require: '^paneHeader',
            transclude: true,
            replace: true,
            template: '<div ng-transclude class="angular-accordion-pane-content" ng-show="expanded"></div>',
            controller: ['$scope', '$rootScope', '$state', 'localStorageService', 'restService', function($scope, $rootScope, $state,
                localStorageService, restService) {
                $scope.toggle();
                $scope.nextaccordion = function(){
                    var loginSuccess = $scope.loginSuccess = localStorageService.get("loginSuccess");
                    if(loginSuccess == null || loginSuccess == false)
                        $state.go("login");

                    else{
                        $scope.$$nextSibling.toggle();
                    }
                }

                $scope.nextaccordion1 = function(){
                    if(validatePatientDetails() == true){
                        $scope.$$nextSibling.toggle();
                        restService.createPatientRec($scope.pDetails, function(data){
                            if(data.success == true){
                                localStorageService.set('pat_id', data.pat_id);
                                $scope.$$nextSibling.toggle();
                            }
                        });
                    }                    
                }

                $scope.existingDetails = function(){
                    $rootScope.enableCDetails = true;
                    $scope.$$nextSibling.toggle();
                }

                $scope.physoCheckout = function(){
                    $rootScope.enableCnfForm = true;
                    $scope.$$nextSibling.toggle();
                    restService.createPatientRec($scope.pDetails, function(data){
                        if(data.success == true){                            
                            $scope.$$nextSibling.toggle();
                        }
                    });
                }

                $scope.nextaccordion2 = function(){
                    if(validateCollectionDetails() == true){
                        $scope.pDetails.total_cost = $scope.gTotal;
                        $scope.pDetails.packageid  = $scope.selTabindex;
                        $scope.pDetails.pat_id     = localStorageService.get('pat_id');
                        $scope.$$nextSibling.toggle();
                        restService.createServiceRec($scope.pDetails, function(data){
                            if(data.success == true){
                                localStorageService.set('service_id', data.service_id);
                                $scope.$$nextSibling.toggle();
                            }
                        });
                    }
                }

                $scope.$on('nextsibiling', function(){
                    if($scope.$$nextsibiling != null && $scope.$$nextsibiling.toggle != undefined)
                        $scope.$$nextSibling.toggle();   
                })

                function validatePatientDetails(){
                    $scope.pAlert = "";
                    if($scope.pDetails.firstname == undefined){
                        $scope.pAlert = "Please Enter First Name"
                        return false;
                    }

                    if($scope.pDetails.lastname == undefined){
                        $scope.pAlert = "Please Enter Last Name"
                        return false;
                    }

                    if($scope.pDetails.age == undefined){
                        $scope.pAlert = "Please Enter Age"
                        return false;
                    }
                    else if($scope.pDetails.age){
                        var age = /^1[0-9][0-9]$|^[1-9][0-9]$|^[0-9]$/
                        if($scope.pDetails.age.match(age)){

                        }
                        else{
                            $scope.pDetails.age = "";
                            $scope.pAlert = "Please Enter Valid Age"
                            return false;
                        }
                    }

                    if($scope.pDetails.mobile == undefined){
                        $scope.pAlert = "Please Enter Mobile Number"
                        return false;
                    }
                    else if($scope.pDetails.mobile){
                        var phoneno = /^\d{10}$/; 
                        if($scope.pDetails.mobile.match(phoneno)){

                        }
                        else{
                            $scope.pDetails.mobile = "";
                            $scope.pAlert = "Please Enter Valid Mobile Number"
                            return false;
                        }
                    }

                    $rootScope.enableCDetails = true;
                    return true;
                }

                function validateCollectionDetails(){
                    if($scope.pDetails.venue == undefined){
                        $scope.pAlert = "Please Select either Sample Collection or In Person"
                        return false;
                    }

                    if($scope.pDetails.venue == 'sCollection' || $scope.pDetails.isTransport == true){
                        if($scope.pDetails.pAddress1 == undefined){
                            $scope.pAlert = "Please Enter Valid Address"
                            return false;
                        }

                        if($scope.pDetails.pCity == undefined){
                            $scope.pAlert = "Please Enter Valid City"
                            return false;
                        }

                        if($scope.pDetails.pState == undefined){
                            $scope.pAlert = "Please Enter Valid State"
                            return false;
                        }

                        if($scope.pDetails.pZipcode == undefined){
                            $scope.pAlert = "Please Enter Valid Zipcode"
                            return false;
                        }
                        else if($scope.pDetails.pZipcode){
                            if(isNaN($scope.pDetails.pZipcode)){
                                $scope.pDetails.pZipcode = "";
                                $scope.pAlert = "Please Enter Valid Zipcode"
                                return false;
                            }
                        }
                        
                        $scope.pDetails.dt = $('#dt').val();
                        if($scope.pDetails.dt == undefined){
                            $scope.pAlert = "Please Enter Valid Date and Time"
                            return false;
                        }
                    }

                    localStorageService.set("Collection Details", $scope.cDetails);
                    $rootScope.enableCForm = true;
                    return true;
                }
            }]
        };
    })
    .service('Debounce', function() {
        var self = this;

        // debounce() method is slightly modified version of:
        // Underscore.js 1.4.4
        // http://underscorejs.org
        // (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
        // Underscore may be freely distributed under the MIT license.
        self.debounce = function(func, wait, immediate) {
            var timeout,
                result;

            return function() {
                var context = this,
                    args = arguments,
                    callNow = immediate && !timeout;

                var later = function() {
                    timeout = null;

                    if (!immediate) {
                        result = func.apply(context, args);
                    }
                };

                clearTimeout(timeout);
                timeout = setTimeout(later, wait);

                if (callNow) {
                    result = func.apply(context, args);
                }

                return result;
            };
        };

        return self;
    });