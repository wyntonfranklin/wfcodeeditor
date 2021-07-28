
let sideBar = document.getElementById('side-bar');
let tasksBar = document.getElementById('sbl-tasks');
let snippetsBar = document.getElementById('sbl-snippets');
let codeViewBar = document.getElementById('sbl-codeview');
let webViewBar = document.getElementById('sbl-webview');
let bars = [tasksBar, snippetsBar, codeViewBar, webViewBar];
const sideBars = {
    tasks : {
        el : tasksBar,
    },
    snippets : {
        el : snippetsBar,
    },
    codeview : {
        el : codeViewBar,
    },
    webview : {
        el : webViewBar,
    }
}

module.exports =  {

    isBarOpen : function(bar){
        if(sideBars[bar] && sideBars[bar].el.style.display === "block"){
            return true;
        }
        return false;
    },
    showSideBarContainer : function(){
        sideBar.style.display = "block";
    },
    closeSideBarContainer : function(){
        sideBar.style.display = "none";
    },
    isSideBarOpen : function(){
        if(sideBar.style.display === "none"){
            return false;
        }
        return true;
    },
    toggleSideBar : function (callback, bar){
        let currentBar = this.getBarByName(bar);
        let openBar = this.getOpenBars();
        let visibilityStatus = "hidden";
        if(currentBar.style.display === "none"){
            this.closeSideBars();
            currentBar.style.display = "block";
            visibilityStatus = "visible";
            this.showSideBarContainer();
        }else{
            if(currentBar.getAttribute('data-name') === bar){
                this.closeSideBarContainer();
            }
            currentBar.style.display = "none";
            visibilityStatus = "hidden";
        }
        callback(visibilityStatus);
    },
    getBarByName : function(bar){
        return sideBars[bar].el;
    },
    openSideBar : function(callback, bar){
        sideBar.style.display = "block";
        if(bar){
            this.showSideBarLayout(bar);
        }
        if(callback){
            callback();
        }
    },
    closeSideBar : function(){
        sideBar.style.display = "none";
        this.closeSideBars();
    },
    closeSideBars : function(){
        bars.forEach((el)=>{
            this.hideBar(el);
        })
    },
    isAnyBarsOpen : function(){
      bars.forEach((el)=>{
          if(el.style.display === "block"){
              return true;
          }
      })
        return false;
    },
    getOpenBars: function(){
        var openEl = null;
        bars.forEach((el)=>{
            if(el.style.display === "block"){
                console.log(el);
                openEl = el;

            }
        })
        return openEl;
    },
    showSideBarLayout : function(name){
        this.openBar(sideBars[name].el);
    },
    hideSideBarLayout: function(name){
        this.hideBar(sideBars[name].el);
    },
    openBar : function(el){
        this.closeSideBars();
        el.style.display = "block";
    },
    hideBar : function(el){
        el.style.display = "none";
    },
    resizeBars: function(height){
        bars.forEach((el)=>{
            el.style.height = height;
        })
    }



}