/*
    setTagCheckResult.js
    ver 1.0.1
    Last Update 2016/11/21
 */


var $scriptTag = $("script");

function setTagCheckResult(){
    var ResultObj = {
        tag : {
            result : tagCheck(),
            html   : ""
        },
        analytics : {
            result : analyticsCheck(),
            html   : ""
        }
    };

    var collectHtml = "";

    for(var prop in ResultObj){
        ResultObj[prop].html = makeDiscription(ResultObj[prop].result);
        collectHtml += ResultObj[prop].html;
    }
    $(collectHtml).prependTo(".pb_content");
}

// 結果を表示するためのタグ生成
function makeDiscription(Obj){

    var listTitle    = "";
    var htmlContents = "";

    for(var prop in Obj){
        if(Obj[prop].result){
            htmlContents += "<div class='listWrap'>" + Obj[prop].title + Obj[prop].text + '</div>';
        }
    }
    if(htmlContents == ""){
        htmlContents = "<div class='listWrap'><p class='discription'>設置されていませんでした。</p></div>";
    }

    switch(Obj.type){
        case "tag":
            listTitle = "<h2 class='listTitle'>タグマネージャ設置確認</h2>";
            break;
        case "analytics":
            listTitle = "<h2 class='listTitle'>アナリティクス設置確認</h2>";
            break;
    }

    return "<div class='contentWrap'>" + listTitle + htmlContents + "</div>";
}

function tagCheck(){

    var resultObj = {
        type : "tag",
        gtm  : {
            result : false,
            id     : "",
            title  : "<h3 class='tagCheckTitle'>Googleタグマネージャーが設置されています。</h3>",
            text   : "<p class='discription'>GoogleタグマネージャーでKaizenのタグを埋め込む場合は、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206075222'>こちら</a>のヘルプページをご参照ください。</p>"
        },
        ytm  : {
            result : false,
            title  : "<h3 class='tagCheckTitle'>Yahoo!タグマネージャーが設置されています。</h3>",
            text   : "<p class='discription'>Yahoo!タグマネージャーでKaizenのタグを埋め込む場合は、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206227541'>こちら</a>のヘルプページをご参照ください。</p>"
        },
    };

    $scriptTag.each(function(){
        src = $(this).attr("src");
        if(src != null || src != undefined){
            if(src.indexOf("googletagmanager.com") > -1 && !resultObj.gtm.result){
                var cutSrc = src.split("?")[1];
                resultObj.gtm.id     = cutSrc.split("-")[1];
                resultObj.gtm.text += "<p class='discription'>タグマネージャーID: " + resultObj.gtm.id + "</p>";
                resultObj.gtm.result = true;
            }
            else if(src.indexOf("yjtag") > -1 && !resultObj.ytm){
                resultObj.ytm.result = true;
            }
        }
    });
    return resultObj;
}

function analyticsCheck(){
    var resultObj = {
        type : "analytics",
        ga   : {
            result : false,
            title  : "<h3 class='tagCheckTitle'>Googleアナリティクスが設置されています。</h3>",
            text   : "<p class='discription'>GoogleアナリティクスをKaizenと連携する場合には、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206075202'>こちら</a>のヘルプページをご参照ください。</p>"
        },
        sa   : {
            result : false,
            title  : "<h3 class='tagCheckTitle'>AdobeAnalytics(旧 SiteCatalyst)が設置されています。</h3>",
            text   : "<p class='discription'>AdobeAnalyticsをKaizenと連携する場合には、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206227501'>こちら</a>のヘルプページをご参照ください。</p>"
        }
    };
    $scriptTag.each(function(){
        var src = $(this).attr("src");
        if(src != null || src != undefined){
            if(src.indexOf("google-analytics.com") > -1 && !resultObj.ga.result){
                resultObj.ga.result = true;
            }
            // オブジェクト s が存在すれば
            else if(src.indexOf('s_code') > -1 && !resultObj.sa.result){
                resultObj.sa.result = true;
            }
        }
    });
    return resultObj;
}
