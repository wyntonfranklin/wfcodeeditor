const { ipcRenderer } = require('electron')
let Datastore = require('nedb');
let DBPATH = "";
module.exports =  {

    init : function(dbPath){
       DBPATH = dbPath;
    },
    loadDatabases : function (){
      let db = {};
      db.projects = new Datastore(DBPATH +'/projects.db');
      db.settings = new Datastore(DBPATH +'/settings.db');
      db.projects.loadDatabase();
      db.settings.loadDatabase();
      return db;
  },
  getDatabases: function() {
    let db = {};
    db.projects = new Datastore(DBPATH +'/projects.db');
    db.settings = new Datastore(DBPATH +'/settings.db');
    return db;
  },
  reloadDatabase : function(path)  {
    this.loadDatabases(path);
  },
  saveToProjects : function(doc) {
      let db = this.loadDatabases();
      db.projects.insert([doc], function (err, newDocs) {
    });
  },
  saveToSettings : function(query, nDoc, callback){
    let db = this.loadDatabases();
    db.settings.findOne(query,function (err, doc) {
      if(doc === null){
        console.log("is null");
        db.settings.insert([nDoc],function (err, newDocs) {
          console.log(nDoc);
          if(callback !== undefined){
            callback();
          }
        });
      }else{
        console.log(doc);
        db.settings.update(query, nDoc, function (err, newDocs) {
          callback();
        });
      }
    });
  },
  getSetting : function(doc, callback){
    let db = this.loadDatabases();
    return db.settings.findOne(doc,callback);
  },
  getAllProjects : function (query, callback)  {
    let db = this.loadDatabases();
    db.projects.find({}, callback);
  }

}


