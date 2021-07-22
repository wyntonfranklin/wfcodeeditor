const notifyjs = require("notifyjs");
const notif = new notifyjs('test',{});
let notifier = new AWN({});

module.exports =  {

    success : function(){
        notifier.success("a message",{});
    },

}