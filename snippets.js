

module.exports = {
  getSnippets: (type) => {
    var sdata = null;
    if(type == "PHP"){
      sdata = require("./snippets/php");
    }else if(type == "SQL"){
      sdata = require("./snippets/sql");
    }else if(type == "HTML"){
      sdata = require("./snippets/html");
    }else if(type == "JAVASCRIPT"){
      sdata = require("./snippets/javascript");
    }else if(type == "PYTHON"){
      sdata = require("./snippets/python");
    }else if(type == "JAVA"){
      sdata = require("./snippets/java");
    }
    snippets = JSON.parse(JSON.stringify(sdata));
    return snippets;
  }

}
