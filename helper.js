const fs = require("fs")
var path = require('path');

module.exports = {
  removeFromArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {

        arr.splice(i, 1);
      }

    }
  },
  exitsInArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {
        return true;
      }
    }
    return false;
  },
  modesObject : ()=> {
    return {
      php : "php",
      js: "javascript",
      java : "java",
      py : "python",
      txt : "text",
      md : "markdown",
      cs : "csharp",
      cpp : "cpp",
      html : "html",
      json : "json",
      sql : "sql",
      xml : "xml",
      yaml : "yaml"
    }
  },
  addElementClass : (doc, cname) => {
      doc.className += " " + cname
  },
  removeElementClass : (doc, cname) => {
    doc.classList.remove(cname);
  },
  getDirectoryName: (directoryPath) => {
    return path.basename(directoryPath);
  }

}
