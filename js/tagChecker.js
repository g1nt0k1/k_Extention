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
