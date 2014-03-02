// this service uses wikipedia as a concordance server
// a sample query
// http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch="indubitably"&srprop=snippet

angular.module('services').factory('Wikipedia', ['$http', '$rootScope', '$log', function($http, $rootScope, $log) {

  // working - markup the <span class='searchmatch'> tags in the ui
  //var baseUrl = 'http://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srprop=snippet';

// TODO: set this url dynamically, because we dont know where we're getting deployed from
  var baseUrl = 'http://localhost:5000/wikipedia';
  return {
    concordances: {},
    // TODO: reset currentQuery when user moves to a new segment?
    currentQuery: [],
    getConcordances: function(query) {
      var self = this;
      $http.get(baseUrl, {
        params: {
          srsearch: query,
          origin: 'http://0.0.0.0:9000'
        }
      })
      .success(function(res) {
        $log.log('results for: ' + query);
        $log.log(res);

        var snippets = res;
        self.concordances['query'] = snippets;
        self.currentQuery = self.concordances['query'];
        $rootScope.$broadcast('concordancer-updated');

      })
      .error(function(err) {
          $log.log('Error in concordancer: ' + err.message);
      })
    }
  }

}]);

// sample response
//{
//  query-continue: {
//  search: {
//  sroffset: 10
//}-
//}-
//  query: {
//  searchinfo: {
//  totalhits: 126
//  }-
//  search: [10]
//  0:  {
//    ns: 0
//    title: "Carl Sandburg"
//    snippet: "two for his poetry and one for his biography of Abraham Lincoln . H. L. Mencken called Sandburg "<span class='searchmatch'>indubitably</span> an American in every pulse-beat". <b>...</b> "
//  }-
//  1:  {
//    ns: 0
//    title: "Praxiteles"
//    snippet: "While no <span class='searchmatch'>indubitably</span> attributable sculpture by Praxiteles is extant, numerous copies of his works have survived; several author s, <b>...</b> "
//  }-
//  2:  {
//    ns: 0
//    title: "Mr. F"
//    snippet: "Michael Bluth sneaks out of work to see a film, "Love <span class='searchmatch'>Indubitably</span>," with Rita , his English girlfriend. Afterwards, they come upon a toy <b>...</b> "
//  }-
//  3:  {
//    ns: 0
//    title: "Crispy Critters"
//    snippet: "Together, these puppets spoke the cereal's tagline of "it's <span class='searchmatch'>indubitably</span> delicious." "The original commercials in the 1960s featured Linus <b>...</b> "
//  }-
//-
//}