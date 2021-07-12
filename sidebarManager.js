
let sideBar = document.getElementById('side-bar');
let tasksBar = document.getElementById('sbl-tasks');
let snippetsBar = document.getElementById('sbl-snippets');
let bars = [tasksBar, snippetsBar];

module.exports =  {

    toggleSideBar : function (callback, bar){
        if(sideBar.style.display === "none"){
            if(bar){
                this.showSideBarLayout(bar);
            }
            this.openSideBar(callback);
        }else{
            let openBar = this.getOpenBars();
            if(openBar && openBar.getAttribute("data-name") !== bar){
                this.closeSideBars();
                this.showSideBarLayout(bar);
            }else{
                this.closeSideBar();
            }
        }
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
        if(name === 'tasks'){
            this.openBar(tasksBar);
        }else if(name === 'snippets'){
            this.openBar(snippetsBar);
        }
    },
    hideSideBarLayout: function(name){
        if(name === 'tasks'){
            this.hideBar(tasksBar);
        }else if(name === 'snippets'){
            this.hideBar(snippetsBar);
        }
    },
    openBar : function(el){
        el.style.display = "block";
    },
    hideBar : function(el){
        el.style.display = "none";
    }



}