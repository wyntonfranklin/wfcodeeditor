const { ipcRenderer } = require('electron')
let Datastore = require('nedb');
let DBPATH = "";
module.exports =  {

  getTask : function(path, query, callback){
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.findOne(query, function (err, doc) {
      callback(doc);
    });
  },
  loadTasks : function (path, query, callback){
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.find(query).sort({ timestamp: -1}).exec(function(err, docs) {
        callback(docs);
    });
  },
  saveTasks : function(doc, path, callback) {
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.insert([doc], function (err, newDocs) {
      callback(newDocs);
    });
  },
  getTaskFromElement : function(el){
    let taskObject = JSON.parse(el.getAttribute("data-object"));
    if(taskObject){
      return taskObject;
    }
    return null;
  },
  updateTask : function(path, query, update, callback){
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.update(query, update, {}, function (err, numReplaced) {
        console.log(err);
        console.log(numReplaced);
        callback();
    });
  },
  changeTaskContent : function(oldObject, content){
    return {
      content: content,
      file : oldObject.file,
      timestamp: oldObject.timestamp,
      project : oldObject.project,
    }
  },
  removeTask : function(path, id, callback){
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.remove({ _id: id }, {}, function (err, numRemoved) {
      callback();
    });
  }

}


