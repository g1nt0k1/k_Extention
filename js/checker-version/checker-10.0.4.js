/*

    ページ診断用スクリプト

 */

// popup作成するためのオブジェクト
var infoBoxObj = {
    domain : [],
    hash   : [],
    parm   : []
};

// popupに載せるヘルプページに

$(function(){

    // initメソッド
    function pageCheck(checklistArr){

        console.log("実行されたよー");

        // 何をチェックするのかをオブジェクト取得
        // bool型です
        var listObj = {
            domain : checklistArr[0],
            hash   : checklistArr[1],
            parm   : checklistArr[2]
        }

        var $aTag = $("a");
        $aTag.each(function(){
            $a = $(this);
            var d = listObj.domain ? domainCheck($a) : undefined;
            var h = listObj.hash   ? hashCheck($a)   : undefined;
            var p = listObj.parm   ? parmCheck($a)   : undefined;
            setHover($a,d,h,p);
        });

        setPopup(listObj);
    }

    // ホバーをセットするメソッド
    function setHover($aTag,url,hash,parm){
        var uObj = {contents:""};
        var hObj = {contents:""};
        var pObj = {contents:""};

        if(url != undefined){
            var editUrl = "";
            var tmp = url.split("/");

            // ドメイン部分を強調表示するために切り取る
            for(var i = 0; i < tmp.length; i++){
                editUrl += i == 2 ? '/<span class="balloon-domain">' + tmp[i] + '</span>' : (i != 0 ? '/' : "") + tmp[i];
             }
            uObj = {
                contents:'<div class="balloon-inner">' +
                         '<p class="balloon-title">ドメインが違う遷移が存在します。</p>' +
                         '<p class="balloon-url">' + editUrl + '</p></div>'
            }
        }

        if(hash != undefined){
            hObj = {
                contents:'<div class="balloon-inner">' +
                         '<p class="balloon-title">ハッシュが存在します。</p>' +
                         '<p class="balloon-hash">' + hash + '</p></div>'
            }
        }

        if(parm != undefined){
            var tmp = '';
            for(var i = 0; i < parm.length; i++){
                tmp += '<p class="balloon-parm-name">・' + parm[i] + '</p>';
            }
            pObj = {
                contents:'<div class="balloon-inner">' +
                         '<p class="balloon-title">パラメータが存在します。</p>' + tmp + '</div>'
            }
        }

        // 被らないようにするための処理
        var top_or_bottom  = "";
        var left_or_right  = "";
        var bodyWidth      = $("body").width();
        var bodyHeight     = $("body").height();
        var aPosition = {
            left     : $aTag.offset().left,
            wCenter  : $aTag.offset().left + $aTag.width() / 2,
            rigth    : this.left + $aTag.width(),
            top      : $aTag.offset().top,
            hCenter  : $aTag.offset().top + $aTag.height() / 2
        }

        // Top or Bottom
        if(bodyHeight - 200 <= aPosition.top){
            top_or_bottom = "top"
        }
        else{
            top_or_bottom = "bottom"
        }

        // Left or Right or Center
        if(0 <= aPosition.wCenter && aPosition.wCenter <= 100){
            left_or_right = " right";
        }
        else if(bodyWidth - 100 <= aPosition.hCenter && aPosition.hCenter <= bodyWidth){
            left_or_right = " left"
        }
        else{
            left_or_right = ""; //真ん中に出力されてもOK
        }

        //ホバーした時のアニメーション設定
        // $aTag.balloon({
        //     classname:"balloon",
        //     position:top_or_bottom + left_or_right,
        //     tipSize: 16,
        //     html:true,
        //     contents:uObj.contents + hObj.contents + pObj.contents,
        //     css:{
        //         backgroundColor:'#fff',
        //         color:'#111',
        //         opacity: 1
        //     }
        // });

        // 懸念点があれば、四角の枠を作成する
        // 一番最初に当てはまった色に選択される
        var borderColor = "#4CAF50";
        if(url != undefined){
            borderColor = "#f44336";
        }
        else if(hash != undefined){
            borderColor = "#2196F3";
        }
        else if(parm != undefined){
            borderColor = "#4CAF50";
        }



        if(url != undefined || hash != undefined || parm != undefined){

            // タグ上にホバーを作成する
            var $aParent = $aTag.parent();

            var $ex_wrap = $("<div id='k_ex_border_wrap'></div>").appendTo("body");
            var $ex_div  = $("<div class='ex_border_'></div>").appendTo("#k_ex_border_wrap");

            aObj = {
                width  : $aTag.width() + 12,
                height : $aTag.height() + 12,
                top    : $aTag.offset().top - 6,
                left   : $aTag.offset().left - 6
            };

            $ex_div.css({
                width    : aObj.width,
                height   : aObj.height,
                top      : aObj.top,
                left     : aObj.left,
                border   : "4px solid " + borderColor,
                position : "absolute"
            });

            $ex_div.balloon({
                classname:"balloon",
                position:top_or_bottom + left_or_right,
                tipSize: 16,
                html:true,
                contents:uObj.contents + hObj.contents + pObj.contents,
                css:{
                    backgroundColor:'#fff',
                    color:'#111',
                    opacity: 1
                }
            });
        }
    }

    // 別ドメインへの遷移が存在しないか確認する。
    function domainCheck($aTag){
        // console.log("chk domain");
        var textBox = [];
        var href = convertAbsUrl($aTag.attr("href"));
        if(href != null || href != undefined){
            // hrefに「javascript: hoghoge;」という設定もここで切る
            if(href != "" && href.indexOf(document.domain) < 0 && href.indexOf("javascript") < 0){

                // Popup用にドメイン取得
                var domain = href.split("/")[2];
                if(infoBoxObj.domain.indexOf(domain) < 0){
                    infoBoxObj.domain[infoBoxObj.domain.length] = domain;
                }
                return href;
            }
        }

        // jQueryのhrefを相対パスから絶対パスに変換する。
        function convertAbsUrl( src ){
            return $("<a>").attr("href", src).get(0).href;
        }

        return undefined;
    }

    // ハッシュの存在を確認するための関数
    function hashCheck($aTag){
        // console.log("chk hash");
        var textBox = [];
        var href = $aTag.attr("href");
        if(href != null || href != undefined){
            // ハッシュタグのみの場合もここで切ってしまいます。
            if(href.match(/\#(?=(\d|\D))/) != null){
                var hash = "#" + href.split("#")[1]
                if(infoBoxObj.hash.indexOf(hash) < 0){
                    infoBoxObj.hash[infoBoxObj.hash.length] = hash;
                }
                return hash;
            }
        }
        return undefined;
    }

    // パラメータの有無を確認するメソッド
    function parmCheck($aTag){
        // console.log("chk parm");
        var textBox = [];
        var href = $aTag.attr("href");
        if(href != null || href != undefined){
            if(href.indexOf("?") > -1){

                // 一旦パラメータ部分のみ切り出す
                var parmAll = href.split("?")[1];

                // パラメータが二つ以上の場合
                if(parmAll.indexOf("&") > -1){
                    var cutParm = parmAll.split("&");
                    var parmName = [];

                    // パラメータを = を基準に分けて作成する
                    for(var cutLoop = 0; cutLoop < cutParm.length; cutLoop++){
                        parmName[cutLoop] = cutParm[cutLoop].split("=");
                    }

                    // パラメータ名だけを取り出す
                    for(var getNameLoop = 0; getNameLoop < parmName.length; getNameLoop++){
                        textBox[textBox.length] = parmName[getNameLoop][0];

                        // ページ内にある全てのパラメータを取得する
                        if(infoBoxObj.parm.indexOf(parmName[getNameLoop][0]) < 0){
                            infoBoxObj.parm[infoBoxObj.parm.length] = parmName[getNameLoop][0];
                        }
                    }
                    return textBox;
                }
                else{
                    var cutParm = parmAll.split("=")[0];
                    if(infoBoxObj.parm.indexOf(cutParm) < 0){
                        infoBoxObj.parm[infoBoxObj.parm.length] = cutParm;
                    }
                    return new Array(cutParm);
                }
            }
            else{
                return undefined;
            }
        }
    }

    chrome.runtime.onMessage.addListener(function(msg,sender,sendResponse){
        pageCheck(msg.checkedlist);
    });
});
