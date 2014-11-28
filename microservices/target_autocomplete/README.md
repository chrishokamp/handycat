### This is a trie-based autocomplete using the node-autocomplete library

First, run `npm install` from the autocomplete directory to install the dependencies.     
        
- To run the autocomplete server, do:     
`node autocomplete.js`       
if you are doing some development, and you want the server to restart every time you change something, do:      
`supervisor autocomplete.js`        
      
To run the tests with autoreload, do:      
jasmine-node --color --verbose --captureExceptions --autotest test/ --watch .
