const { ipcRenderer } = require('electron')
let Datastore = require('nedb');
let DBPATH = "";
module.exports =  {

  getSnippet : function(path, query, callback){
    let db = {};
    db.snippets = new Datastore(path);
    db.snippets.loadDatabase();
    db.snippets.findOne(query, function (err, doc) {
      callback(doc);
    });
  },
  loadSnippets : function (path, query, callback){
    let db = {};
    db.snippets = new Datastore(path);
    db.snippets.loadDatabase();
    db.snippets.find(query).sort({ timestamp: -1}).exec(function(err, docs) {
        callback(docs);
    });
  },
  saveSnippet : function(doc, path, callback) {
    let db = {};
    db.snippets = new Datastore(path);
    db.snippets.loadDatabase();
    db.snippets.insert([doc], function (err, newDocs) {
      callback(newDocs);
    });
  },
  getSnippetFromElement : function(el){
    let taskObject = JSON.parse(el.getAttribute("data-object"));
    if(taskObject){
      return taskObject;
    }
    return null;
  },
  updateSnippet : function(path, query, update, callback){
    let db = {};
    db.snippets = new Datastore(path);
    db.snippets.loadDatabase();
    db.snippets.update(query, update, {}, function (err, numReplaced) {
        console.log(err);
        console.log(numReplaced);
        callback();
    });
  },
  changeSnippetContent : function(oldObject, name, content){
    return {
      title : name,
      snippet: content,
      file : oldObject.file,
      timestamp: oldObject.timestamp,
      project : oldObject.project,
    }
  },
  removeSnippet : function(path, id, callback){
    let db = {};
    db.snippets = new Datastore(path);
    db.snippets.loadDatabase();
    db.snippets.remove({ _id: id }, {}, function (err, numRemoved) {
      callback();
    });
  }

}


