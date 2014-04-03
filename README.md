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
  * you *shouldn't* need to use sudo, [here](https://gist.github.com/isaacs/579814) are good installation options.  
2. clone the repo `git clone git@github.com:CNGL-repo/editor_components.git`  
3. run `$ npm install`
4. run `$ bower install`

5. to use the *autoreload* and *watch changes* functionalities, you'll need ruby and compass.   
  * [install Ruby](https://www.ruby-lang.org/en/installation/), then do `gem install compass`  
  * make sure that your ruby installation's bin/ folder is on your `$PATH`


## Development


## Code Style


## Testing


## TODOs and Notes
currently the Ace editor needs to be installed directly from the ace-builds repo on github
