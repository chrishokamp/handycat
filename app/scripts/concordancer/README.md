- a concordancer is a monolingual component which searches for 'real world' usages of a string.

_Components_
- the concordancer service
- calls the API specified in config,
- the alignment service -- returns the aligned portion of two strings, which can be rendered to give the user visual feedback on which parts of the sentences match
 
- inserting into a string 
String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

- TODO:
- can we use $providers with decorators to check if the user has configured a url?
