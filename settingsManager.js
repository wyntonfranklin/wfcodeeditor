const Store = require('electron-store');
const settings = new Store();

module.exports =  {

    get : function(name, option){
        return (settings.get(name)) ? settings.get(name) : option;
    },
    set : function(name, value){
        settings.set(name, value);
    }

}