document.addEventListener('DOMContentLoaded',function(){
    var pageChecker = document.getElementById("pageChecker");

    pageChecker.addEventListener('click',function(){
        var checklist  = document.checklist.elements;
        var checkedArr = [];
        for(var i = 0; i < checklist.length; i++)checkedArr[i] = checklist[i].checked;

        chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{checkedlist:checkedArr},function(msg){
                console.log("Exective pageCheck");
            });
        });
    });
});
