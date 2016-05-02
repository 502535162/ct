diagnostics.controller('servicesController', function ($scope, $state, localStorageService, $rootScope, restService, 
    $sessionStorage, $window, $stateParams) {
    var loginSuccess = $scope.loginSuccess = localStorageService.get("loginSuccess");

    $scope.isHealthCheckup  = false;
    $scope.selservice       =  $stateParams.servicename;

    $scope.healthcheckups = function(){
        $scope.isHealthCheckup = true;
    }

    $scope.servicesLoad = function(){
        $scope.isHealthCheckup = true;
        $('.list-style-1 li').click(function() {
            $("li.active").removeClass("active");
            $(this).addClass('active');
        });
    }

    $scope.selTabindex = 0;
    $scope.subIndex = 0;
    $scope.disabled = true;
    $scope.islist = false;
    $scope.profiles = [];
    $scope.selProfiles = [];
    $scope.selTests = [];
    $scope.venue = {};
    $scope.items = [{name:'Male'}, {name:'Female'}];

    $scope.nextaccordion = function(previd, nexid){
        if(loginSuccess == null || loginSuccess == false){
            $state.go("login")
        }
        else{
            console.log($scope.pDetails);
            localStorageService.set("pDetails", $scope.pDetails);
            $('#'+previd).collapse('hide');
            $('#'+nexid).collapse('show');
        }
    }
    

    $scope.tabs = [
        { title: 'Basicpackage', islist:false, index1:"acc1", index2:"acc2", index3:"acc3"},
        { title: 'Superpackage', islist:false, index1:"acc4", index2:"acc5", index3:"acc6"},
        { title: 'Womenpackage', islist:false, index1:"acc7", index2:"acc8", index3:"acc9"},
        { title: 'Tests & Profiles', islist:true, index1:"acc10", index2:"acc11", index3:"acc12"},
        { title: 'Weekly Deals', isWdeals: true},
    ];

    $scope.sidelist = [{name:"Doctors"}, {name:"Health Checkup"}, {name:"Reports"}, {name:"Nursing"}, {name:"Physiotheraphy"}, {name:"Contact Us"}];

    $scope.currentTab = $scope.tabs[0];

    for(var i = 0; i < $scope.tabs.length; i++){
        if($scope.tabs[i].title == $scope.selservice){
            $scope.selTabindex = $scope.tabs[i]
            $scope.$apply();
            break;
        }
    }

    $scope.userState = '';
    $scope.checked = true;
    $scope.pDetails = {};
    var selected = null,previous = null;
    // $scope.selServices = JSON.parse(localStorageService.get("selServices"));
    // if($scope.selServices == null)
    //     $scope.selServices = [];

    if(loginSuccess != null)
        $scope.disabled = !loginSuccess;
    

    $scope.selectDetails = function(sCollection, inPerson){
        if(sCollection == ""){
            $scope.pDetails.sCollection = sCollection;
        }
        if(inPerson == ""){
            $scope.pDetails.inPerson    = inPerson;
            $scope.pDetails.isTransport = "";
        }
    }

    $scope.$watch('selTabindex', function(){
        getPackageInfo($scope.tabs[$scope.selTabindex].title, $scope.tabs[$scope.selTabindex].islist);
        $scope.pDetails = {};
    }); 

    $rootScope.$on('$stateChangeSuccess',function(){
        $("html, body").animate({ scrollTop: 0 }, 200);
    })

    $(window).bind('beforeunload', function(event){
        $sessionStorage.empty();
        localStorageService.clearAll();
    });

    $scope.getSelTabindex = function($index, list){
        $scope.selTabindex = $index;
        if($scope.tabs[$index].islist != true){
            localStorageService.set("selServices", $scope.tabs[$index].title);    
        }
        
        getPackageInfo($scope.tabs[$index].title, $scope.tabs[$index].islist);
        $scope.pDetails = {};
    }

    $scope.stateNext = function(){
        localStorageService.set("selServices", JSON.stringify($scope.selServices));
        if(!loginSuccess){
            $state.go('home.login');
        }else{
            var index = ($scope.subIndex == $scope.max) ? 0 : $scope.subIndex + 1;
            $scope.subIndex = index;
        }
    }

    $scope.toggle = function (item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);
        else list.push(item);
    };

    $scope.exists = function (item, list) {
        if(item && item.testname){
            for(var i = 0; i < list.length; i++){
                if(item.testname == list[i].testname)
                    return true;
            }
        }
        return false;
    };

    $scope.beforeRenderStartDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() >= activeDate.valueOf()) $dates[i].selectable = false;
            }
        }
    }

    $scope.beforeRenderEndDate = function($view, $dates, $leftDate, $upDate, $rightDate) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');
            for (var i = 0; i < $dates.length; i++) {
                if ($dates[i].localDateValue() <= activeDate.valueOf()) {
                    $dates[i].selectable = false;            
                }
            }
        }
    }

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
                else
                    $scope.tests = result[0].tests;
            }

            if(flag == true || (packages == undefined || packages == null)){
                if(packages == null || packages == undefined)
                    packages = [];
                restService.getPackageInfo({packagename:packageName}, function(data){
                    console.log(data);
                    if(data.success == true){
                        if(data.tests.length > 0){
                            packages.push({packagename:packageName, tests:data.tests});
                        }
                        $scope.tests = data.tests;
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