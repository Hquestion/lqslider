(function($){
    var defaultSettings = {
        speed: 400,            //动画时间,单位：ms
        interval: 5,           //幻灯片切换间隔,单位：s
        effect: "fade",         //幻灯片切换效果 fade: 淡入淡出, scroll: 滚动
        showThumb: true,        //是否展示缩略图
        controllable: false,   //是否支持手动点击
        nodeName: "li",         //幻灯片节点名称
        startIndex: 3,           //滚动开始的下标
        sliderSelector: ".slider"
    };

    $.fn.lqslider = function(param){
        var setting = $.extend(defaultSettings, param);
        var $p = $(this);
        var $posterWall = $p.find(setting.sliderSelector);
        var length = $posterWall.find(setting.nodeName).length;
        var currentIndex = setting.startIndex;
        $p.css({
            position: "relative",
            overflow: "hidden"
        });
        $posterWall.css({
            position: "absolute",
            width: "100%",
            height: $p.height() + "px"
        });
        $posterWall.find(setting.nodeName).css({
            position: "absolute",
            width: "100%",
            height: "100%"
        });
        if(setting.effect === "fade"){
            $posterWall.find(setting.nodeName).css({
                display: "none"
            });
        }
        $posterWall.find(setting.nodeName + " img").css({
            width: "100%",
            height: "100%"
        });
        if(setting.showThumb){
            var $thumb = $("<div class='thumb'></div>").appendTo($p);
            $thumb.css({
                position: "absolute",
                left: ($posterWall.width() * 0.2) / 2 + "px",
                bottom: "0",
                width: "80%",
                height: "120px"
            });
            var $list = $("<ul></ul>").appendTo($thumb);
            $list.css({
                "list-style": "none",
                "height": "120px",
                width: "100%",
                "margin": "0 auto"
            });
            $posterWall.find(setting.nodeName).each(function(index, item){
                var $li = $("<li>").appendTo($list);
                $li.css({
                    display: "inline-block",
                    "list-style": "none",
                    float: "left",
                    "width": 1 / length * 100 + "%",
                    height: "120px"
                });
                var $img = $("<img>").attr("src", $(item).find("img").attr("src")).appendTo($li);
                $img.css({
                    width: "100%",
                    height: "100%"
                });
                $li.bind("click", function(){
                    goToIndex(index);
                })
            });
            var $thumb_border = $("<div class='thumb_border'>").appendTo($thumb);
            $thumb_border.css({
                position: "absolute",
                top: 0,
                left: "-4px",
                width: 1 / length * 100 + "%",
                height: "112px",
                background: "rgba(0,0,0,0.6)",
                border: "4px solid #ffbf00"
            })
        }
        $(window).on("resize", function(){
            $thumb.css({
                left: ($posterWall.width() * 0.2) / 2 + "px"
            });
            goToIndex(currentIndex);
        });
        goToIndex(currentIndex);
        clearInterval(this.lqsliderIntervalId);
        this.lqsliderIntervalId = setInterval(function(){
            goToIndex(currentIndex);
        }, setting.interval * 1000);

        function goToIndex(index){
//            currentIndex = index;
            switch (setting.effect){
                case "fade":
                    $posterWall.find(setting.nodeName).fadeOut(setting.speed);
                    $posterWall.find(setting.nodeName + ":eq(" + index+")").fadeIn(setting.speed);
                    break;
                case "scroll":
                    var $posterWidth = $posterWall.width();
                    $posterWall.find("li:eq(" + index+")").stop(false, true).animate({
                        top: 0,
                        left: 0
                    }, setting.speed);
                    for(var i = index - 1; i >= 0; i--){
                        var LOffsetY = 0;
                        var LOffsetX = (i - index) * $posterWidth;
                        $posterWall.find("li:eq(" + i+")").stop(false, true).animate({
                            top: LOffsetY + "px",
                            left: LOffsetX + "px"
                        },setting.speed);
                    }
                    for(var j = index + 1; j < length; j++){
                        var ROffsetY = 0;
                        var ROffsetX = (j - index) * $posterWidth;
                        $posterWall.find("li:eq(" + j +")").stop(false, true).animate({
                            top: ROffsetY + "px",
                            left: ROffsetX + "px"
                        },setting.speed);
                    }
                    break;
                default:
                    return;
            }
            if(setting.showThumb){
                goToThumb(index);
            }
            if(currentIndex >= length - 1){
                currentIndex = 0;
            }else{
                currentIndex ++;
            }
        }

        function goToThumb(index){
            var $thumb = $(".thumb_border");
            var thumb_width = $thumb.width();
            if(index === 0){
                $thumb.stop(false, true).animate({
                    left: "-4px"
                }, setting.speed);
            }else{
                $thumb.stop(false, true).animate({
                    left: index * thumb_width - 4 + "px"
                }, setting.speed);
            }
        }
    };
})(jQuery);
