const { ipcRenderer } = require('electron')
let Datastore = require('nedb');
let DBPATH = "";
module.exports =  {

  loadTasks : function (path, project, callback){
    let db = {};
    db.tasks = new Datastore(path);
    db.tasks.loadDatabase();
    db.tasks.find({project: project }).sort({ timestamp: -1}).exec(function(err, docs) {
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

}


