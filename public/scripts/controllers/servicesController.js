diagnostics.controller('servicesController', function ($scope, $state, localStorageService, $rootScope, restService, 
    $sessionStorage, $window, $stateParams, $location) {
    var loginSuccess = $scope.loginSuccess = localStorageService.get("loginSuccess");
    var selCity = localStorageService.get("selCity");
    if(selCity.name == 'Hyderabad'){
        $scope.citytransport = true;
    }

    if($scope.loginSuccess == null)
        $scope.loginSuccess = false

    $scope.isHealthCheckup  = false;
    $scope.selservice       =  localStorageService.get("selService");
    $scope.pAlert           = '';
    $scope.Sub_Details      = '';
    $scope.selPhyso         = [];
    $scope.sDetails         = {};
    $scope.packagePrice     = 0;
    $scope.gTotal           = 0;


    $scope.today = function () {
        $scope.dt = new Date();
    };
    $scope.mindate = new Date();
    $scope.dateformat="MM/dd/yyyy";
    $scope.today();
    $scope.showcalendar = function ($event) {
        $scope.showdp = true;
    };
    $scope.showdp = false;

    var enabled = false;

    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'Health Checkup';
        return page === currentRoute ? 'active' : '';
    };

    $scope.paneEnabled = function() {
        if(loginSuccess == null || loginSuccess == false)
            return true;

        return false;
    };

    $scope.paneEnabled1 = function() {
        if($rootScope.enableCDetails == undefined){
            return true;
        }

        return false;
    };

    $scope.paneEnabled2 = function() {
        if($rootScope.enableCForm == undefined){
            return true;
        }
        $rootScope.$broadcast('nextsibiling')
        return false;
    };

    $scope.paneConfirm = function() {
        if($rootScope.enableCnfForm == undefined){
            return true;
        }

        return false;
    };

    $scope.checkoutEnabled = function() {
        if(loginSuccess == null || pDetails)
            return true;

        return false;
    };

    $scope.healthcheckups = function(){
        $scope.operations = "Health Checkup"
        $scope.isHealthCheckup = true;
    }

    $scope.servicesLoad = function(){
        $scope.healthcheckups();
        $('.list-style-1 li').click(function() {
            $("li.selected").removeClass("selected");
            $(this).addClass('selected');
        });

        for(var i = 0; i < $scope.tabs.length; i++){
            if($scope.tabs[i].title == $scope.selservice){
                $scope.selTabindex = i;
                break;
            }
        }

        $scope.getSelTabindex($scope.selTabindex, $scope.tabs);
    }

    $scope.testtoggle = function(event){
        
        if($(event.currentTarget).children().hasClass('fa-minus')) {
            $(event.currentTarget).children().removeClass('fa-minus');
        } else {
            $(event.currentTarget).children().addClass('fa-minus');
            console.log($(event.currentTarget)[0].innerText);
            var test = $scope.tests.filter(function(el){
                return el.Test_name == $(event.currentTarget)[0].innerText
            });
            $scope.sub_details = test[0].Sub_Details.split(',');
        }
    }

    $scope.$on('$viewContentLoaded', function(){
        //Here your view content is fully loaded !!
        setTimeout(function()
        { 
            var nowDate = new Date();
            var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
            $('#sample0').datetimepicker({
                format: 'dd/MM/yyyy hh:mm:ss',
                startDate: today 
            });

            $('#inPer0').datetimepicker({
                format: 'dd/MM/yyyy hh:mm:ss',
                startDate: today 
            });
        }, 100);
    });

    $scope.$watch('pDetails.isTransport', function(){
        if($scope.pDetails.isTransport == true){
            $scope.gTotal = $scope.gTotal + 20;
        }
        else if($scope.pDetails.isTransport == false && $scope.gTotal > $scope.packagePrice){
            $scope.gTotal = $scope.gTotal - 20;   
        }
    })

    $scope.selTabindex = -1;
    $scope.subIndex = 0;
    $scope.disabled = true;
    $scope.islist = false;
    $scope.profiles = [];
    $scope.selProfiles = [];
    $scope.selTests = [];
    $scope.items = [{name:'Male'}, {name:'Female'}];
    $scope.operations = "";

    $scope.tabs = [
        { title: 'Basicpackage', islist:false, isphyso:false, isnursing:false, index1:"acc1", index2:"acc2", index3:"acc3"},
        { title: 'Superpackage', islist:false, isphyso:false, isnursing:false, index1:"acc4", index2:"acc5", index3:"acc6"},
        { title: 'Womenpackage', islist:false, isphyso:false, isnursing:false, index1:"acc7", index2:"acc8", index3:"acc9"},        
        { title: 'Tests & Profiles', islist:true, isphyso:false, isnursing:false, index1:"acc10", index2:"acc11", index3:"acc12"},
        { title: 'Physiotherapy', islist:false, isphyso:true, isnursing:false, index1:"acc13", index2:"acc14", index3:"acc15"},
        { title: 'Nursing', islist:false, isphyso:false, isnursing:true, index1:"acc16", index2:"acc17", index3:"acc18"}
    ];

    $scope.sidelist = [{name:"Doctors"}, {name:"Health Checkup"}, {name:"Reports"}, {name:"Nursing"}, {name:"Physiotheraphy"}, {name:"Contact Us"}];

    // $scope.currentTab = $scope.tabs[0];    

    $scope.userState = '';
    $scope.checked = true;
    $scope.cDetails = {};
    $scope.pDetails = {};
    var selected = null,previous = null;

    if(loginSuccess != null)
        $scope.disabled = !loginSuccess;

    $rootScope.$on('$stateChangeSuccess',function(){
        $("html, body").animate({ scrollTop: 0 }, 200);
    })

    $(window).bind('beforeunload', function(event){
        $sessionStorage.empty();
    });

    $scope.getSelTabindex = function($index, list){

        var nowDate = new Date();
        var today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0, 0);
        $('#sample'+$index).datetimepicker({
            format: 'dd/MM/yyyy hh:mm:ss',
            startDate: today 
        });

        $('#inPer'+$index).datetimepicker({
            format: 'dd/MM/yyyy hh:mm:ss',
            startDate: today 
        });

        $scope.selTabindex = $index;
        if($scope.tabs[$index].islist != true){
            localStorageService.set("selServices", $scope.tabs[$index].title);    
        }
        
        getPackageInfo($scope.tabs[$index].title, $scope.tabs[$index].islist);
        $scope.pDetails = {};
    }

    $scope.exists = function (item, list) {
        if(item && item.testname){
            for(var i = 0; i < list.length; i++){
                if(item.testname == list[i].testname)
                    return true;
            }
        }
        return false;
    };

    $scope.$watch('pDetails.type', function(value) {
        if(value == 'sCollection')
            $scope.pDetails.isTransport = "";
    });

    $scope.submittopaypal = function(){
        var details = {service_id:localStorageService.get('service_id'), pat_id:localStorageService.get('pat_id'),
                        packageid:$scope.selTabindex, total_cost:$scope.gTotal};
        restService.createsalesRec(details, function(data){
            if(data.success == true)
            {
                redirectpaypal()
            }
        });
    }

    function redirectpaypal(){
        var newForm = jQuery('<form>', {
                    'action': 'https://www.paypal.com/cgi-bin/webscr',
                    'method': 'post',
                    'target': '_top'
                }).append(jQuery('<input>', {
                    'name': 'cmd',
                    'value': '_xclick',
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'business',
                    'value': 'sales@checkthat.in',
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'item_name',
                    'value': $scope.tabs[$scope.selTabindex].title,
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'currency_code',
                    'value': 'USD',
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'return',
                    'value': "http://checkthat.co/paypaltranscation",
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'amount',
                    'value': $scope.gTotal,
                    //'value': 1,
                    'type': 'hidden'
                })).append(jQuery('<input>', {
                    'name': 'submit',
                    'border': '0',
                    'alt': "Make payments with PayPal - it's fast, free and secure!",
                    'type': 'image',
                    'src': 'https://www.paypal.com/en_US/i/btn/x-click-but01.gif'
                }))

                newForm.submit();
    }

    $scope.selectTestandprofiles = function(type){
        $scope.isProfile = false
        $scope.isProfile = false

        if(type == 'profiles'){
            $scope.isProfile = true
        }
        else if(type == 'tests'){
            $scope.isTest = true
        }
    }

    $scope.check = function(value, checked) {
        var idx = $scope.selphyso.indexOf(value);
        if (idx >= 0 && !checked) {
            $scope.selphyso.splice(idx, 1);
        }
        if (idx < 0 && checked) {
            $scope.selphyso.push(value);
        }
    };

    function getPackageInfo(packageName, isList){
        var flag = false;
        if(isList == false){
            var packages = $sessionStorage.get("packages");
            if(packages != null){
                var result = packages.filter(function (package){
                    return package.packagename === packageName;
                })
                if(result.length == 0)
                    flag = true;
                else{
                    $scope.tests = result[0].tests;
                    $scope.gTotal = $scope.packagePrice = result[0].tests[0].Package_Price;
                }
            }

            if(flag == true || (packages == undefined || packages == null)){
                if(packages == null || packages == undefined)
                    packages = [];
                restService.getPackageInfo({packagename:packageName, city:selCity.name}, function(data){
                    console.log(data);
                    if(data.success == true){
                        if(data.tests.length > 0){
                            packages.push({packagename:packageName, tests:data.tests});
                        }
                        $scope.tests = data.tests;
                        $scope.gTotal = $scope.packagePrice = parseInt(data.tests[0].Package_Price);
                        $sessionStorage.put("packages", packages);
                    }
                });
            }
        }
        else{
            var profiles = $sessionStorage.get("profiles");
            var tests = $sessionStorage.get("Individualtests");
            if(profiles != null){
                $scope.profiles = result[0].profiles;
            }
            if(tests != null){
                $scope.indtests = result[0].Individualtests;
            }

            if(profiles == null || tests == null){
                if(profiles == null){
                    restService.getProfilesInfo(function(data){
                        console.log(data);
                        if(data.success == true){
                            $scope.profiles = data.profiles;
                        }
                    });
                }
                if(tests == null){
                    restService.getTestsInfo(function(data){
                        console.log(data);
                        if(data.success == true){
                            $scope.indtests = data.tests;
                        }
                    });
                }
            }
        }
    }
});
