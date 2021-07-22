const notifyjs = require("notifyjs");
const notif = new notifyjs('test',{});
let notifier = new AWN({});

module.exports =  {

    success : function(message){
        notifier.success(message,{
            labels : {success: "Nice!"},
        });
    },
    error: function(message){
        notifier.alert(message, {
            labels : {alert: "Hold On!"},
        });
    },
    info : function (message){
        notifier.info(message,{
            labels : {info: "Hey there!"},
        });
    }

}