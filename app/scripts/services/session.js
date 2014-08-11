angular.module('services')
.factory('session', ['loggerUrl', '$http', '$log', function(loggerUrl, $http, $log) {
// see http://stackoverflow.com/questions/22537311/angular-ui-router-login-authentication
// shows how to do authentication with ui-router
    var logUrl = loggerUrl + '/logger';

    return {
      // set to true to show a textarea with the modifications of the XLIFF in real time.
      debugXLIFF: false,

      // Indicates whether or not show the smart buttons. Used for the July 2014 testing.
      showSmartButtons: true,

      // todo - initialize this from login service
      userId: 0,
      sessionId: undefined,
      sessionIdShort: undefined,
      sessionPromise: undefined,
      startSession: function() {
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
      logAction: function(logAction) {
        var self = this;

        var writeLogs = false;
        // make sure that sessionId is already set
        if (writeLogs) {
          self.sessionPromise.then( function(r) {
            if (self.sessionId == undefined)
              $log.error('no id set!');

            var date = new Date().getTime();
            var sessionId = self.sessionId;
            $log.log('sessionId: ' + sessionId);

            // TODO: add date
            var sessionData = {
              "userId": this.userId,
              "sessionId": sessionId,
              "timestamp": date
            };
            angular.extend(logAction, sessionData);
            $http.post(logUrl + '/session/' + sessionId, { "logData": logAction }).then(
              function(res) {
                $log.log('LOG ACTION: ');
                $log.log(res.data);
              }
            )
          });
        }
      },


      // Functions controlling movement through the document
      // order of segments
      activeSegment: 0,
      setActiveSegment: function(segId) {
        this.activeSegment = segId;
      },
      getNextSegment: function() {
        if (SegmentOrder.order.length == 0)
          SegmentOrder.getOrder(Document.segments);
        return SegmentOrder.nextSegment(this.activeSegment);
      },
      focusNextSegment: function() {
        var next = this.getNextSegment();
        this.setSegment(next);
      },
      setSegment: function(segIndex) {
        this.activeSegment = segIndex;
        if (segIndex != -1)
          $rootScope.$broadcast('changeSegment', {currentSegment: this.activeSegment});
        return this.activeSegment;
      },

      // stats
      // stores all the actions performed by the user in order
      log:[],

      updateStat: function(stat, segment, data) {
        var self = this;
        // 'stat' is the action name
        var newAction = {
          'action': stat,
          'segmentId': segment,
          'data': data
        };
        self.log.push(newAction);
        this.logAction(newAction);
        $log.log('update stat');
        $log.log(newAction);
      }

    }


}]);
