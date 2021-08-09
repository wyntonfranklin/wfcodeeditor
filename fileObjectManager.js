
let openFiles = [];

module.exports =  {

    removeFiles : function(file){
        for( var i = 0; i < openFiles.length; i++){

            if ( openFiles[i][key] === file) {
                openFiles.splice(i, 1);
            }

        }
    },
    fileExists: function(file){
        for( var i = 0; i < openFiles.length; i++){

            if ( openFiles[i]["name"] === file) {
                return true;
            }
        }
        return false;
    },
    addFile : function(object){
        openFiles.push(object);
    },
    getFile : function(filename){
        for( var i = 0; i < openFiles.length; i++){

            if ( openFiles[i]["name"] === filename) {
                return {
                    file : openFiles[i],
                    position: i,
                }
            }
        }
        return null;
    },
    getFiles : function(){
        return openFiles;
    },
    setFiles : function(files){
        openFiles = files;
    },
    updateFiles: function(update, position){
        openFiles[position] = update;
    },
    clearFiles : function(){
        openFiles = [];
    }

}