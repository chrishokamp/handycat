# Introduction

This is the main repo for the prototype web-based CAT tool developed at CNGL.  

#Build Instructions     

The frontend is build entirely with javascript, using the [Angular](http://angularjs.org/) framework.     

To set up your development environment, it's strongly recommended that you use the development stack consisting of:      

* [bower](http://bower.io/) - for frontend package management
* [grunt](http://gruntjs.com/) - for automating the build and deployment, running tests, and providing the development server (using packages from npm)
* [npm](https://www.npmjs.org/) - for managing the node js dependencies     

## Installation    

1. Install node and npm if you don't already have them.  
  * you *shouldn't* need to use sudo, [the scripts here](https://gist.github.com/isaacs/579814) are good installation options.  
  * if you already have node and npm, don't try to install again without *completely* getting rid of your previous installation.
2. clone the repo `git clone git@github.com:CNGL-repo/editor_components.git`  
3. install grunt `npm install -g grunt`
3. run `$ npm install` from the top directiory(`editor_components/`)
4. run `$ bower install` from the top directory(`editor_components/`)
4. build bootstrap ui -
  ```
  $ cd app/bower_components/angular-ui-bootstrap
  $ npm install
  $ grunt
  ```

5. to use the *autoreload* and *watch changes* functionalities, you'll need ruby and compass.   
  * [install Ruby](https://www.ruby-lang.org/en/installation/), then do `gem install compass`  
  * make sure that your ruby installation's bin/ folder is on your `$PATH`
 

Finally, once you've done all that, you should be able to run `grunt serve`, and fire up a server which watches all of the files in the repo, and automagically reloads whenever you change something. 

## Development

### Code Style
* use *two spaces* to indent javascript

## Running the Servers
* to start the server to the glossary and concordancer endpoints, do:     
    ```
    cd server/
    node web.js
    ```

## Testing


## TODOs and Notes
