function setElementCheckResult(listObj){
    var popbox = '<div class="popBox">'
                    + '<div class="pb_header clearfix">'
                        + '<h1 class="pb_title tb_center f_black">ページ情報一覧</h1>'
                        + '<p  class="pb_close tb_center"><a class="f_black" aria-hidden="true">X</a></p>'
                    + '</div>'
                    + '<div class="pb_content">'
                            + '<div class="listdomain contentWrap">'
                                + '<h2 class="listTitle f_black">ページ内に含まれている別ドメイン</h2>'
                            + '</div>'
                            + '<div class="listhash contentWrap">'
                                + '<h2 class="listTitle f_black">ページ内に含まれているハッシュ</h2>'
                            + '</div>'
                            + '<div class="listparm contentWrap">'
                                + '<h2 class="listTitle f_black">ページ内に含まれているパラメータ</h2>'
                            + '</div>'
                    + '</div>'
              + '</div>';

    // 先に箱を用意する
    $(popbox).appendTo($("body"));

    for(var prop in infoBoxObj){

        // 引数のlistObjとinfoBoxObjの要素名は完全に対応している。
        var li_html = listObj[prop] ? makeResultList(infoBoxObj[prop],prop) : "<ul><li>計測しておりません</li></ul>";
        $(li_html).appendTo($(".list" + prop));
    }

    // Listを作成する内部関数
    function makeResultList(arr,listName){
        var html = "<ul>";
        var disc = "";
        if(arr.length > 0){
            for(var i = 0; i < arr.length; i++){
                html += "<li class='f_black'>" + arr[i] + "</li>";
            }
            disc = makeDiscription(listName);
        }
        else{
            html += "<li class='f_black'>存在しませんでした。</li>";
        }

        return html + "</ul>" + disc;
    }

    function makeDiscription(listName){
        var infoDiscription = "";
        if(listName == "domain"){
            infoDiscription = '<p class="discription f_black">計測したいゴールが「テスト対象ページ」のドメインと違う場合、' +
                              'outboundの設定が必要になります。ヘルプページは<a href="https://support.kaizenplatform.net/hc/ja/articles/206069942" target="_blank">こちら</a></p>';
        }
        else if(listName == "hash"){
            infoDiscription = '<p class="discription f_black">JavaScriptにて動的に制御されている場合、Kaizenでは編集できない場合があります。仕様を確認してください。<br>' +
                              'また、URLにハッシュが付いているページをテスト対象にすることはできません。ご注意ください。</p>';
        }
        else if(listName == "parm"){
            infoDiscription = '<p class="discription f_black">遷移にパラメータが含まれている時、パラメータを固定化するとテスト対象ページに不具合が発生する場合があります。ご注意ください。</p>';
        }
        return infoDiscription;
    }
}
