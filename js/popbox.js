function setPopbox(){
    if($(".popBox").length > 0){
        var popbox = '<div class="popBox">'
                        + '<div class="pb_header clearfix">'
                            + '<h1 class="pb_title tb_center f_black">ページ情報一覧</h1>'
                            + '<p  class="pb_close tb_center"><a class="pb_close_btn f_black" aria-hidden="true">X</a></p>'
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
    }
}

$(".pb_close_btn").on({
    click : function(){
        $(".popBox").hide();
    }
})
