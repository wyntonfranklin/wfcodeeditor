

module.exports = {
  getSnippets: (type) => {
    var sdata = null;
    if(type == "PHP"){
      sdata = require("./snippets/php");
    }else if(type == "SQL"){
      sdata = require("./snippets/sql");
    }
    snippets = JSON.parse(JSON.stringify(sdata));
    return snippets;
  }

}
