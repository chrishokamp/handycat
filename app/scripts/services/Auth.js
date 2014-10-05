'use strict';

angular.module('services')
  .factory('Auth', ['$location', '$rootScope', 'Session', 'User', '$cookieStore', '$http', 'Base64',
   function Auth($location, $rootScope, Session, User, $cookieStore, $http, Base64) {
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    // initialize to whatever is in the cookie, if anything
//    $http.defaults.headers.common['Authorization'] = 'Basic ' + $cookieStore.get('authdata');

    return {

      login: function(provider, user, callback) {
        var cb = callback || angular.noop;
        Session.save({
          provider: provider,
          email: user.email,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err.data);
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;
        Session.delete(function(res) {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      createUser: function(userinfo, callback) {
        var cb = callback || angular.noop;
        User.save(userinfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },

      currentUser: function() {
        Session.get(function(user) {
          $rootScope.currentUser = user;
        });
      },

      changePassword: function(email, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;
        User.update({
          email: email,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
            console.log('password changed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      },

      removeUser: function(email, password, callback) {
        var cb = callback || angular.noop;
        User.delete({
          email: email,
          password: password
        }, function(user) {
            console.log(user + 'removed');
            return cb();
        }, function(err) {
            return cb(err.data);
        });
      },

    // for http basic authentication - used by the Tausdata API
    // TODO:
    // 1- get credentials on server
    // 2- when the user wants TM stuff, get their TAUS credentials, and send
    // - Question: should the TM be mediated by the server or not?
    // - Answer: yes, because we want a consistent API to all TMs, no matter where they are
    setCredentials: function (username, password) {
      // WORKING - post credentials to '/users/tausdata'
      var encoded = Base64.encode(username + ':' + password);
      $http.defaults.headers.common.Authorization = 'Basic ' + encoded;
      $cookieStore.put('authdata', encoded);
    },
    clearCredentials: function () {
      document.execCommand("ClearAuthenticationCache");
      $cookieStore.remove('authdata');
      $http.defaults.headers.common.Authorization = 'Basic ';
    }



    };
  }])