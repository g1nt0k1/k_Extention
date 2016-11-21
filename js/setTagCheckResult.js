/*
    setTagCheckResult.js
    ver 1.0.1
    Last Update 2016/11/21
 */


var $scriptTag = $("script");



function setTagCheckResult(){
    var tagResultObj = tagCheck();
    var anaReusltObj = analyticsCheck();

    var tagHtml = "";
    var anaHtml = "";
    // tagResultObj Check
    for(var tagProp in tagResultObj){
        if(tagResultObj[tagProp].result){
            tagHtml += tagResultObj[tagProp].title + tagResultObj[tagProp].text;
            tagHtml = "<div class='listWrap'>" + tagHtml + "</div>";
        }
    }



    for(var anaProp in anaReusltObj){
        if(anaReusltObj[anaProp].result){
            anaHtml += anaReusltObj[anaProp].title + anaReusltObj[anaProp].text;
            anaHtml = "<div class='listWrap'>" + anaHtml + "</div>";
        }
    }





    $(tagHtml).prependTo(".pb_content");
    $(anaHtml).prependTo(".pb_content");
}

function tagCheck(){

    var resultObj = {
        gtm : {
            result : false,
            id     : "",
            title  : "<h3 class='tagCheckTitle'>Googleタグマネージャーが設置されています。</h3>",
            text   : "<p class='discription'>GoogleタグマネージャーでKaizenのタグを埋め込む場合は、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206075222'>こちら</a>のヘルプページをご参照ください。</p>"
        },
        ytm : {
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

console.log(resultObj);
    return resultObj;
}

function analyticsCheck(){
    var resultObj = {
        ga : {
            result : false,
            title  : "<h3 class='tagCheckTitle'>Googleアナリティクスが設置されています。</h3>",
            text   : "<p class='discription'>GoogleアナリティクスをKaizenと連携する場合には、<a target='_blank' href='https://support.kaizenplatform.net/hc/ja/articles/206075202'>こちら</a>のヘルプページをご参照ください。</p>"
        },
        sa : {
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
console.log(resultObj);
    return resultObj;
}
