/*

    ページ診断用スクリプト

 */

// ballon調整用オブジェクト
var windowObj = {
    width  : window.innerWidth,
    height : window.innerHeight
}

$(function(){

    // タグマネチェッカー
    var scriptObj = {
        $scriptTag : $("script"),
        domain     : document.domain,
        tagCheck : function(){
            var checkFlg = [0,0,0];
            this.$scriptTag.each(function(){
                src = $(this).attr("src");
                if(src != null || src != undefined){
                    if(src.indexOf("googletagmanager.com") >= 0 && checkFlg[0] != 1){
                        console.log("Googleタグマネージャが存在します。");
                        checkFlg[0] = 1;
                    }
                    else if(src.indexOf("yjtag") >= 0 && checkFlg[1] != 1){
                        console.log("Yahoo!タグマネージャが存在します。");
                        checkFlg[1] = 1;
                    }
                    else if(src.indexOf("adobedtm") >= 0 && checkFlg[2] != 1){
                        console.log("Adobeタグマネージャーが存在します。");
                        checkFlg[2] = 1;
                    }
                }
            });
            if(checkFlg.indexOf(1) < 0)console.log("タグマネージャーは存在しませんでした。");
            console.log("タグマネージャのチェックが完了しました。");
        },
        analyticsCheck: function(){
            var checkFlg = [0,0];
            this.$scriptTag.each(function(){
                var src = $(this).attr("src");
                if(src != null || src != undefined){
                    if(src.indexOf("google-analytics.com") >= 0 && checkFlg[0] != 1){
                        console.log("GoogleAnalyticsが設定されています。");
                        checkFlg[0] = 1;
                    }
                    // オブジェクト s が存在すれば
                    else if(typeof s === "object" && checkFlg[1] != 1){
                        console.log("SiteCatalystが設定されています。");
                        checkFlg[1] = 1;
                    }
                }
            });
            if(checkFlg.indexOf(1) < 0)console.log("計測ツールは存在しませんでした。");
            console.log("計測ツールのチェックが完了しました。")
        },
        allCheck : function(){
            this.tagCheck();
            this.analyticsCheck();
        }
    };

    // initメソッド
    function pageCheck(checklistArr){



        console.log("実行されたよー");

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
    }

    // 別ドメインへの遷移が存在しないか確認する。
    function domainCheck($aTag){
        // console.log("chk domain");
        var textBox = [];
        var href = convertAbsUrl($aTag.attr("href"));
        if(href != null || href != undefined){
            // hrefに「javascript: hoghoge;」という設定もここで切る
            if(href != "" && href.indexOf(document.domain) < 0 && href.indexOf("javascript") < 0){
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
                return href.split("#")[1];
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

                // 一旦パラメータ部分を取り出す
                var parmAll = href.split("?")[1];

                // 2つ以上のパラメータがある時に切り取る処理
                if(parmAll.indexOf("&") >= 0){
                    var cutParm = parmAll.split("&");
                    var parmName = [];

                    // パラメータを = を基準に分けて作成する
                    for(var cutLoop = 0; cutLoop < cutParm.length; cutLoop++){
                        parmName[cutLoop] = cutParm[cutLoop].split("=");
                    }

                    // パラメータ名だけを取り出す
                    for(var getNameLoop = 0; getNameLoop < parmName.length; getNameLoop++){
                        if(textBox.indexOf(parmName[getNameLoop][0]) < 0){
                            textBox[textBox.length] = parmName[getNameLoop][0];
                        }
                    }
                    return textBox;
                }
                else{
                    return new Array(parmAll.split("=")[0]);
                }
            }
            else{
                return undefined;
            }
        }
    }

    // ホバーをセットするメソッド
    function setHover($aTag,domain,hash,parm){
        var dObj = {contents:""};
        var hObj = {contents:""};
        var pObj = {contents:""};

        if(domain != undefined){
            var editDomain = "";
            var tmp = domain.split("/");
            for(var i = 0; i < tmp.length; i++){
                editDomain += i == 2 ? '/<span class="other-domain">' + tmp[i] + '</span>' : (i != 0 ? '/' : "") + tmp[i];
             }
            dObj = {
                contents:'<div class="balloon-inner">' +
                         '<p class="balloon-title">ドメインが違う遷移が存在します。</p>' +
                         '<p class="balloon-url">' + editDomain + '</p></div>'
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
            tipSize: 10,
            html:true,
            contents:dObj.contents + hObj.contents + pObj.contents,
            css:{
                backgroundColor:'#fff',
                color:'#111',
                opacity: 1
            }
        });

        // 懸念点があれば、四角の枠を作成する
        if(domain != undefined || hash != undefined || parm != undefined){
            $aTag.css({
                border:"4px solid #FF0A0A"
            });
        }
    }

    chrome.runtime.onMessage.addListener(function(msg,sender,sendResponse){
        pageCheck(msg.checkedlist);
    });
});
