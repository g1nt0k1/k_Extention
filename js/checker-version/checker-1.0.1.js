var pageChecker = {};
$(function(){
    pageChecker = {
        $aTag      : $("a"),
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
        domainCheck : function(){
            var textBox = [];
            this.$aTag.each(function(){
                var href = $(this).attr("href");
                if(href != null || href != undefined){

                    // hrefに「javascript: hoghoge;」という設定もここで切る
                    if(href != "" && href.indexOf(this.domain) < 0 && href.indexOf("javascript") < 0){
                        $(this).balloon({
                            position:'bottom right',
                            html:true,
                            contents:
                            '<p>違うドメインへの遷移があります。</p>' +
                            '<p>' + href + '</p>'
                        });
                        if(textBox.indexOf(href) < 0)textBox[textBox.length] = href;
                    }
                }
            });
            if(textBox.length == 0){
                console.log("違うドメインへの遷移はありませんでした。");
            }
            else{
                console.log("違うドメインへの遷移が存在しています。" + textBox);
            }
            console.log("ドメインチェックは完了しました。")
        },
        hashCheck : function(){
            var textBox = [];
            this.$aTag.each(function(){
                var href = $(this).attr("href");
                if(href != null || href != undefined){
                    // ハッシュタグのみの場合もここで切ってしまいます。
                    if(href.match(/\#(?=(\d|\D))/) != null){
                        var tmp = href.split("#")[1];
                        if(textBox.indexOf(tmp) < 0)textBox[textBox.length] = "#" + tmp;
                    }
                }
            });
            if(textBox.length == 0){
                console.log("ハッシュタグはありませんでした。");
            }
            else{
                console.log("ハッシュタグが存在しています。" + textBox);
            }
            console.log("ハッシュタグチェックは完了しました。");
        },
        parmCheck : function(){
            var textBox = [];
            this.$aTag.each(function(){
                var href = $(this).attr("href");
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
                        }
                        else{
                            var tmp = parmAll.split("=")[0];
                            if(textBox.indexOf(tmp) < 0){
                                textBox[textBox.length] = tmp;
                            }
                        }
                    }
                }
            });
            if(textBox.length == 0){
                console.log("パラメータはありませんでした。");
            }
            else{
                console.log("パラメータが付与されているリンクが存在しています。" + textBox);
            }
            console.log("パラメータチェックは完了しました。");
        },
        allCheck : function(){
            this.tagCheck();
            this.analyticsCheck();
            this.domainCheck();
            this.hashCheck();
            this.parmCheck();
        }
    };
});
