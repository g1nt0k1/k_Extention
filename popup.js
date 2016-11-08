document.addEventListener('DOMContentLoaded',function(){
    var pageChecker = document.getElementById("pageChecker");
    pageChecker.addEventListener('click',function(){
        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{hoge:"hogehoge"},function(msg){
                console.log(tabs[0].id);
                console.log("result message:" + msg);
            });
        });
    });
});
