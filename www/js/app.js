// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//sim instalei! acho que sim

angular.module('starter', ['ionic', 'ngCordova']) //isso??

.run([
    '$q',
    '$ionicPlatform',
    '$rootScope', 
    '$cordovaInAppBrowser',
function(
    $q,
    $ionicPlatform,
    $rootScope,
    $cordovaInAppBrowser
) {
  
    $ionicPlatform.ready(function() {
       
       if(window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }

        if(window.StatusBar) {
            StatusBar.styleDefault();
        }

    });

    var findByPhoneNumber = function (phoneNumber) {
        
        var deferred = $q.defer();

        var onSuccess = function(contacts) {        
            
            deferred.resolve(contacts);
        };     

        var onError = function (contactError) {
            
            deferred.reject(contactError);
        };  

        var options      = new ContactFindOptions();
        options.filter   = phoneNumber;
        options.multiple = true;
        // options.desiredFields = [navigator.contacts.fieldType.id];
        options.hasPhoneNumber = true;
        var fields       = [navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name];
        navigator.contacts.find(fields, onSuccess, onError, options);

        return deferred.promise;

    };

    $rootScope.onClickCreate = function () {

        var onSuccess = function (contact) {
            alert("Save Success");
        };

        var onError = function (contactError) {
            alert("Error = " + contactError.code);
        };

        // create a new contact object
        var contact = navigator.contacts.create();
        contact.displayName = "Jefferson";
        contact.nickname = "Jeh";            // specify both to support all devices

        // populate some fields
        var name = new ContactName();
        name.givenName = "Jefferson";
        name.familyName = "Santos";
        contact.name = name;

        var phoneNumbers = [];
        phoneNumbers[0] = new ContactField('work', '4599-9999', false);
        phoneNumbers[1] = new ContactField('mobile', '99999-9999', true); // preferred number
        phoneNumbers[2] = new ContactField('home', '9999-9999', false);
        contact.phoneNumbers = phoneNumbers;

        // save to device
        contact.save(onSuccess, onError);

    }
    
    $rootScope.onClickFind = function (phoneNumber) {
            

        findByPhoneNumber(phoneNumber).then(function(contacts) {
            
            alert('Found ' + contacts.length + ' contacts.');

        }, function(err) {
            $log.error('## Error: ', err);
        });

    }

    $rootScope.onClickRedirect = function (phoneNumber) {

        findByPhoneNumber(phoneNumber).then(function(contacts) {
            
            alert('Found ' + contacts.length + ' contacts.');

            // Found contact 
            if (contacts.length > 0) {


                if (ionic.Platform.isIOS()) {

                    var abId = 0;
                    abId = contacts[0].id;
                    var link = 'whatsapp://send?abid=' + abId + '&text=Test';

                    $cordovaInAppBrowser.open(link, '_system'); 

                } else {

                    cordova.plugins.Whatsapp.send(phoneNumber);   

                }

            }

        }, function(err) {
            $log.error('## Error: ', err);
        });

    }

  
}])

