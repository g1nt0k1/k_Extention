function setPopBox(){
    if($(".popBox").length < 1){
        var popbox = '<div class="popBox">'
                        + '<div class="pb_header clearfix">'
                            + '<h1 class="pb_title tb_center f_black">ページ情報一覧</h1>'
                            + '<p class="pb_close_btn tb_center">X</p>'
                            + '<div class="pos_slide_wrap tb_center">'
                                + '<p class="pb_leftBtn">L</p>'
                                + '<p class="pb_rightBtn">R</p>'
                            + '</div>'
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
        var result = $(popbox).appendTo($("body"));
        setPopBoxFunc(result);
        return true;
    }
    return false;
}

function setPopBoxFunc(boxObj){
    $(".pb_close_btn").on({
        click : function(){
            $(".pb_content").toggleClass('pb_content_dis');
            if($(".pb_content").hasClass('pb_content_dis')){
                $(".pb_content").stop(true).animate({
                    height:'0px'
                },500,function(){
                    $(".pb_header").css({'border-bottom':'1px solid #78909C'});
                });
                $(".pb_close_btn").text('O');
            }
            else{
                $(".pb_header").css({'border-bottom':'none'});
                $(".pb_content").stop(true).animate({
                    height:'292px'
                },500);
                $(".pb_close_btn").text('X');
            }
        }
    });

    $(".pb_leftBtn").on({
        click : function(){
            $(".popBox").css({
                top  : "10px",
                left : "10px"
            })
        }
    });

    $(".pb_rightBtn").on({
        click : function(){
            $(".popBox").css({
                top  : "10px",
                left : $(window).width() - $(".popBox").width() - 10 + "px"
            })
        }
    });
}
