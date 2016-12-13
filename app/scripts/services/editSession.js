// This service should only be for logging -- anything specific to editing a particular XLIFF should be on the EditArea/ContentArea Controllers

angular.module('services')
.factory('editSession', ['loggerURL', 'SegmentOrder', '$http', '$rootScope', '$log',
    function(loggerURL, SegmentOrder, $http, $rootScope, $log) {
// see http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
// shows how to do authentication with ui-router
      var logUrl = loggerURL;

      return {

        // TODO: this function was previously called from the XliffParser
        // TODO: we want to be able to replay every action taken by the user
        startSession: function() {

          this.userId= 0;
          this.sessionId= undefined;
          this.sessionIdShort= undefined;
          this.sessionPromise= undefined;
          // TODO: initialize the current segment from the server
          this.setSegment(0);
          var self = this;
          // the user is logged in, initialize a new session, and get back the unique session id
          // log the opening of the first segment
          var userData = {
            "userId": this.userId
          };
          self.sessionPromise = $http.post(logUrl + '/start', userData).then(
            function(res) {
              $log.log('SESSION INITIALIZED:');
              $log.log(res.data);
              self.sessionId = res.data.sessionId;
              self.sessionIdShort = self.sessionId.substring(16, 24);
              $log.log('SET SESSION ID: ' + self.sessionId);

              // stat is the action name
              var firstAction = {
                'action': 'begin-segment',
                'segmentId': 0
              };

            }
          )
        },
        // Functions controlling movement through the document
        // TODO: handle these completely within segmentOrder, no need for editSession here
        // order of segments
        focusNextSegment: function(currentSegment, segments) {
          var next = SegmentOrder.nextSegment(currentSegment, segments);
          this.setSegment(next);
        },
        setSegment: function(segIndex) {
          // TODO: if there are no more segments, we need to do something different!
          // TODO: if the segment is the same as the current one, we should do nothing!
          // TODO: only change when the segment is different
          $log.log('EditSession - trying to set next segment as: ' + segIndex);
          if (segIndex != -1)
            $log.log('editSession: $broadcasting changeSegment - next segment is: ' + segIndex);
            $rootScope.$broadcast('changeSegment', {currentSegment: segIndex});
          return segIndex;
        },

        // stats
        // stores all the logged actions in order
        // use decorators in a separate module to allow transparent logging on components
        log:[],

        updateStat: function(data) {
          var self = this;
          // 'stat' is the action name
          var newAction = data;
          self.log.push(newAction);
          $http.post(logUrl, {"logAction": newAction}).then(
            function(res) {
              $log.log('Log server response: ' + res.data);
            }
          )
        }
      }

    }]);
