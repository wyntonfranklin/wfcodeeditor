const { ipcRenderer } = require('electron')
let Datastore = require('nedb');
let DBPATH = "";
module.exports =  {

  getProject : function(path, query, callback){
    let db = {};
    db.projects = new Datastore(path);
    db.projects.loadDatabase();
    db.projects.findOne(query, function (err, doc) {
      callback(doc);
    });
  },
  loadProjects : function (path, query, callback){
    let db = {};
    db.projects = new Datastore(path);
    db.projects.loadDatabase();
    db.projects.find(query).sort({ timestamp: -1}).exec(function(err, docs) {
        callback(docs);
    });
  },
  saveProject : function(doc, path, callback) {
    let db = {};
    db.projects = new Datastore(path);
    db.projects.loadDatabase();
    db.projects.insert([doc], function (err, newDocs) {
      callback(newDocs);
    });
  },
  getProjectFromElement : function(el){
    let taskObject = JSON.parse(el.getAttribute("data-object"));
    if(taskObject){
      return taskObject;
    }
    return null;
  },
  updateProject : function(path, query, update, callback){
    let db = {};
    db.projects = new Datastore(path);
    db.projects.loadDatabase();
    db.projects.update(query, update, { upsert: true }, function (err, numReplaced) {
        console.log(err);
        console.log(numReplaced);
        if(callback){
          callback();
        }
    });
  },
  changeProjectContent : function(oldObject, name, content){
    return {
      title : name,
      Project: content,
      timestamp: oldObject.timestamp,
      project : oldObject.project,
      file : oldObject.file,
    }
  },
  removeProject : function(path, id, callback){
    let db = {};
    db.projects = new Datastore(path);
    db.projects.loadDatabase();
    db.projects.remove({ _id: id }, {}, function (err, numRemoved) {
      callback();
    });
  }

}


