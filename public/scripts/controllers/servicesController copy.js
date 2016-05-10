diagnostics.controller('servicesController', function ($scope, $state, localStorageService, $rootScope, restService, 
    $sessionStorage, $window, $stateParams, $location) {
    var loginSuccess = $scope.loginSuccess = localStorageService.get("loginSuccess");
    var selCity = localStorageService.get("selCity");
    if($scope.loginSuccess == null)
        $scope.loginSuccess = false

    $scope.isHealthCheckup  = false;
    $scope.selservice       =  $stateParams.servicename;
    $scope.pAlert           = '';
    $scope.Sub_Details      = '';
    $scope.patients         = null;

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
    $scope.selTabindex = 0;
    $scope.subIndex = 0;
    $scope.disabled = true;
    $scope.islist = false;
    $scope.profiles = [];
    $scope.selProfiles = [];
    $scope.selTests = [];
    $scope.venue = {};
    $scope.items = [{name:'Male'}, {name:'Female'}];
    $scope.operations = "";
    $scope.collectionDetails = {};
    $scope.selphyso = [];

    $scope.tabs = [
        { title: 'Basicpackage', islist:false, isphyso:false, isnursing:false, index1:"acc1", index2:"acc2", index3:"acc3"},
        { title: 'Superpackage', islist:false, isphyso:false, isnursing:false, index1:"acc4", index2:"acc5", index3:"acc6"},
        { title: 'Womenpackage', islist:false, isphyso:false, isnursing:false, index1:"acc7", index2:"acc8", index3:"acc9"},        
        { title: 'Tests & Profiles', islist:true, isphyso:false, isnursing:false, index1:"acc10", index2:"acc11", index3:"acc12"},
        { title: 'Physiotherapy', islist:false, isphyso:true, isnursing:false, index1:"acc13", index2:"acc14", index3:"acc15"},
        { title: 'Nursing', islist:false, isphyso:false, isnursing:true, index1:"acc16", index2:"acc17", index3:"acc18"}
    ];

    $scope.sidelist = [{name:"Doctors"}, {name:"Health Checkup"}, {name:"Reports"}, {name:"Nursing"}, {name:"Physiotheraphy"}, {name:"Contact Us"}];

    var enabled = false;

    $scope.navClass = function (page) {
        var currentRoute = $location.path().substring(1) || 'Health Checkup';
        return page === currentRoute ? 'active' : '';
    };

    $scope.paneEnabled = function() {
        if(loginSuccess == null)
            return true;

        return false;
    };

    $scope.paneEnabled1 = function() {
        if($rootScope.enableCDetails == undefined){
            return true;
        }

        $rootScope.$broadcast('nextsibiling');

        return false;
    };

    $scope.paneEnabled2 = function() {
        if($rootScope.enableCForm == undefined){
            return true;
        }

        return false;
    };  

    $scope.checkoutEnabled = function() {
        if(loginSuccess == null || $scope.pDetails)
            return true;

        return false;
    };

    $scope.healthcheckups = function(){
        $scope.operations = "Health Checkup"
        $scope.isHealthCheckup = true;
    }

    $scope.servicesLoad = function(){
        getPatientRec();
        $scope.healthcheckups();
        $('.list-style-1 li').click(function() {
            $("li.selected").removeClass("selected");
            $(this).addClass('selected');
        });

        $scope.getSelTabindex(0, $scope.tabs);
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
    $scope.cDetails = {};
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

    $scope.$watch('cDetails.type', function(value) {
        if(value == 'sCollection')
            $scope.cDetails.isTransport = "";
    });

    $scope.submittopaypal = function(){
        var newForm = jQuery('<form>', {
            'action': 'https://www.paypal.com/cgi-bin/webscr',
            'method': 'post',
            'target': '_top'
        }).append(jQuery('<input>', {
            'name': 'cmd',
            'value': '_s',
            'type': 'hidden'
        })).append(jQuery('<input>', {
            'name': 'hosted_button_id',
            'value': 'D9RCU9ACEN9UL',
            'type': 'hidden'
        })).append(jQuery('<input>', {
            'name': 'submit',
            'border': '0',
            'alt': 'PayPal – The safer, easier way to pay online.',
            'type': 'image',
            'src': 'https://www.paypalobjects.com/en_GB/i/btn/btn_buynowCC_LG.gif'
        })).append(jQuery('<img>', {
            'width': '1',
            'height': '1',
            'border': '0',
            'src': 'https://www.paypalobjects.com/en_GB/i/scr/pixel.gif'
        }));
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

    $scope.SubmitDetails = function(){

        // var data = {patientid:}
    }

    function getPatientRec(){
        userdetails = localStorageService.get("userdetails");
        restService.getPatientRec({token:userdetails.token}, function(data){
            if(data.success == true){
                $scope.patients = data.patients;
                localStorageService.set('patients', JSON.stringify(data.patients));
            }
        })
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
                restService.getPackageInfo({packagename:packageName, city:selCity.name}, function(data){
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
                    restService.getProfilesInfo({city:selCity.name}, function(data){
                        console.log(data);
                        if(data.success == true){
                            $scope.profiles = data.profiles;
                        }
                    });
                }
                if(tests == null){
                    restService.getTestsInfo({city:selCity.name}, function(data){
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