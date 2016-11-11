/*

    ページ診断用スクリプト

 */

// ballon調整用オブジェクト
var windowObj = {
    width  : window.innerWidth,
    height : window.innerHeight
}

// popup作成するためのオブジェクト
var infoBoxObj = {
    domain : [],
    hash   : [],
    parm   : []
};

$(function(){

    // initメソッド
    function pageCheck(checklistArr){

        console.log("実行されたよー");

        // 何をチェックするのか
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

    function setPopup(listObj){
        var popbox = '<div class="popBox">'
                        + '<div class="pb_header clearfix">'
                            + '<h1 class="pb_title">ページ情報一覧</h1>'
                            + '<i class="pb_close fa fa-2x fa-window-close" aria-hidden="true"></i>'
                        + '</div>'
                        + '<div class="pb_content">'
                                + '<div class="listdomain">'
                                    + '<h2>ページ内に含まれている別ドメイン</h2>'
                                + '</div>'
                                + '<div class="listhash">'
                                    + '<h2>ページ内に含まれているハッシュ</h2>'
                                + '</div>'
                                + '<div class="listparm">'
                                    + '<h2>ページ内に含まれているパラメータ</h2>'
                                + '</div>'
                        + '</div>'
                  + '</div>';

        // 先に箱を用意する
        $(popbox).prependTo($("body"));

        for(var prop in infoBoxObj){

            // 引数のlistObjとinfoBoxObjの要素名は完全に対応している。
            var li_html = listObj[prop] ? makeInfoList(infoBoxObj[prop]) : "<ul><li>計測しておりません</li></ul>";
            $(li_html).appendTo($(".list" + prop));
        }

        // Listを作成する内部関数
        function makeInfoList(arr){
            var html = "<ul>";
            if(arr[0] != ""){
                for(var i = 0; i < arr.length; i++){
                    html += "<li>" + arr[i] + "</li>";
                }
            }
            else{
                html += "<li>存在しませんでした。</li>";
            }

            return "<p>" + arr.length + "</p>"　+ html + "</ul>";
        }
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
                         '<p class="balloon-hash">#' + hash + '</p></div>'
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
        var balloonPosi  = "";
        // var tagPosi = ($aTag.offset().left) + ($aTag.width() / 2);
        // var centerPosi   = windowObj.width / 2;
        // var diffrence    = centerPosi * 0.1;
        //
        // if(0 <= tagPosi && tagPosi < (centerPosi - diffrence)){
        //     balloonPosi = " right";
        // }
        // else if((centerPosi - diffrence) < tagPosi && tagPosi < (centerPosi + diffrence)){
        //     balloonPosi = "";
        // }
        // else{
        //     balloonPosi = " left"
        // }

        //ホバーした時のアニメーション設定
        $aTag.balloon({
            classname:"balloon",
            position:'bottom' + balloonPosi,
            tipSize: 0,
            html:true,
            contents:uObj.contents + hObj.contents + pObj.contents,
            css:{
                backgroundColor:'#fff',
                color:'#111',
                opacity: 1
            }
        });

        // // 懸念点があれば、四角の枠を作成する
        // var cssObj = {};
        // var borderColor = "";
        // if(url != undefined){
        //     borderColor = "#f44336";
        // }
        //
        // if(hash != undefined){
        //     borderColor = "#2196F3";
        // }
        //
        // if(parm != undefined){
        //     borderColor = "#4CAF50";
        // }



        if(url != undefined || hash != undefined || parm != undefined){

            $aTag.css({
                border:"4px solid " + borderColor
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
                var hash = href.split("#")[1]
                if(infoBoxObj.hash.indexOf(hash) < 0){
                    infoBoxObj.hash[infoBoxObj.hash.length] = hash
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
            if(href.indexOf("?") != -1){

                // 一旦パラメータ部分のみ切り出す
                var parmAll = href.split("?")[1];

                // パラメータが二つ以上の場合
                if(parmAll.indexOf("&") >= 0){
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
