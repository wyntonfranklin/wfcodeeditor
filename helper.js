const fs = require("fs")
var path = require('path');

module.exports = {
  removeFromObjectArray: (arr, key, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i][key] === value) {
        arr.splice(i, 1);
      }

    }
  },
  removeFromArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {

        arr.splice(i, 1);
      }

    }
  },
  exitsInObjectArray : (arr, key, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i][key] === value) {
        return true;
      }
    }
    return false;
  },
  getObjectFromArrayByKey : (arr, key, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i][key] === value) {
        return arr[i];
      }
    }
    return null;
  },
  exitsInArray : (arr, value) => {
    for( var i = 0; i < arr.length; i++){

      if ( arr[i] === value) {
        return true;
      }
    }
    return false;
  },
  extensionsObject : () => {
    return {
      php : {
        type : "code",
        ace: "php",
        icon: "php",
      },
      js: {
        type : "code",
        ace: "javascript",
        icon: "javascript",
      },
      java : {
        type : "code",
        ace: "java",
        icon : "java"
      },
      py : {
        type : "code",
        ace: "python",
        icon : "python",
      },
      txt : {
        type : "code",
        ace: "text",
        icon : "text"
      },
      md : {
        type : "code",
        ace: "markdown",
        icon : "markdown"
      },
      cs :
        {
          type : "code",
          ace: "csharp",
          icon : "csharp",
        },
      cpp : {
        type : "code",
        ace: "cpp",
      },
      html : {
        type : "code",
        ace: "html",
      },
      json : {
        type : "code",
        ace: "json",
      },
      sql : {
        type : "code",
        ace: "sql",
      },
      xml : {
        type : "code",
        ace: "xml",
      },
      yaml : {
        type : "code",
        ace: "yaml",
      },
      png : {
        type : "picture",
        icon : "picture"
      },
      jpeg : {
        type : "picture",
        icon : "picture"
      },
      jpg : {
        type : "picture",
        icon : "picture"
      },
      css : {
        type : "code",
        ace: "css",
        icon : "css",
      }
    }
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
      yaml : "yaml",
      html : "html",
      png : "picture",
      jpeg : "picture",
      jpg : "picture",
      css : "css"
    }
  },
  acceptedFileTypes : () => {
    return {
      php : "code",
      js: "code",
      java : "code",
      py : "code",
      txt : "code",
      md : "code",
      cs : "code",
      cpp : "code",
      html : "code",
      json : "code",
      sql : "code",
      xml : "code",
      yaml : "code",
      css : "code",
      png : "image",
      jpeg : "image",
      jpg : "image",
      gif : "image",
    }
  },
  addElementClass : (doc, cname) => {
      doc.className += " " + cname
  },
  removeElementClass : (doc, cname) => {
    doc.classList.remove(cname);
  },
  getDirectoryName: (directoryPath) => {
    if(directoryPath){
      return path.basename(directoryPath);
    }
    return "";
  }

}
