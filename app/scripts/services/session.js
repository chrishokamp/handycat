angular.module('services')
.factory('session', ['baseUrl', '$http', '$log', function(baseUrl,$http, $log) {
// see http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
// shows how to do authentication with ui-router
    var logUrl = baseUrl + '/logger'

    return {
      // todo - initialize this from login service
      userId: 0,
      sessionId: undefined,
      startSession: function() {
        var self = this;
        // the user is logged in, initialize a new session, and get back the unique session id
        // log the opening of the first segment
        var userData = {
          "userId": this.userId
        }
        $http.post(logUrl + '/start', userData).then(
          function(res) {
            $log.log('SESSION INITIALIZED:');
            $log.log(res.data);
            self.sessionId = res.data.sessionId;
            $log.log('SET SESSION ID: ' + self.sessionId);

            // stat is the action name
            var firstAction = {
              'action': 'begin-segment',
              'segmentId': 0
            };

          }
        )
      },
      logAction: function(logAction) {
        // make sure that sessionId is already set
        if (this.sessionId !== undefined) {
          var date = new Date().getTime();
          var sessionId = this.sessionId;
          $log.log('sessionId: ' + sessionId);

          // TODO: add date
          var sessionData = {
            "userId": this.userId,
            "sessionId": sessionId,
            "timestamp": date
          }
          angular.extend(logAction, sessionData);
          $http.post(logUrl + '/' + sessionId, { "logData": logAction }).then(
            function(res) {
              $log.log('LOG ACTION: ');
              $log.log(res.data);
            }
          )
        }
      }

    }


}]);
