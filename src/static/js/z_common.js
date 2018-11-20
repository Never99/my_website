;
$(function () {
  // Tab显示高亮
  if ($("#home").length == 1) {
    $(".list_a a").eq(0).addClass("active");
  } else if ($("#about").length == 1) {
    $(".list_a a").eq(1).addClass("active");
  } else if ($("#joinus").length == 1) {
    $(".list_a a").eq(2).addClass("active");
  } else if ($('#newscenter').length == 1) {
    $(".list_a a").eq(3).addClass("active");
  }else if ($('#research').length == 1) {
    $(".list_a a").eq(4).addClass("active");
  }

  $(".head_logo").click(function() {
    window.location.href = '/';
  })

  // 切换页面
  $(".list_a a").click(function (e) {
    e.preventDefault();
    window.sessionStorage.removeItem("joinus_list_ind");
    var hrefs = $(this).data("href");
    $(".content_wrapper").removeClass("content_wrapper_menu");
    $(".footer").removeClass("footer_menu");
    // $(this).addClass("active").siblings().removeClass("active");
    window.location.href = hrefs;
  })

  // 移动端点击事件
  $(".head_menu").click(function () {
    $(this).toggleClass("menu_close");
    $(".content_wrapper").toggleClass("content_wrapper_menu");
    $(".list_a").toggleClass("list_a_menu");
    $(".footer").toggleClass("footer_menu");
  })

   // 判断是否为移动端  (false为移动端)
   function isMobile(){  
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");  
    var flag = true;  
    for (var v = 0; v < Agents.length; v++) {  
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }  
    }  
    return flag;  
  }

  if(window.history && window.history.pushState && !isMobile()) {
    $(window).on('popstate', function() {
      var hashLocation = location.hash;
      var hashSplit = hashLocation.split("#!/");
      var hashName = hashSplit[1];
      if(hashName !== '') {
        var hash = window.location.hash;
        if(hash === '') {
          window.location.reload()
        }
      }
    });
    window.history.pushState('forward', null, '');
  }
  
})
