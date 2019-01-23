;
$(function () {
    // 初始化调用全部方法
    ajaxGetStories('all');
    
  // 判断是否第一次进入页面
  if (sessionStorage.getItem("story_list_ind")) {
    var ind = sessionStorage.getItem("story_list_ind");
    var dataType = sessionStorage.getItem("story_list_type");
    $(".story_list_header li").removeClass("active");
    $(".story_list_header li").eq(ind).addClass("active");
    setTimeout(function() {
      hideDom(dataType);
    }, 200)
  } 
  else {
    // 初始化调用全部方法
    ajaxGetStories('all');
  }

  // 隐藏dom
  function hideDom(dataType) {
    // 默认全隐藏
    $(".list_story>div").css({
      display: 'none'
    })
    
    // 如果是全部数据则显示
    if (dataType == "all") {
      $(".list_story>div").css({
        display: 'block'
      })
    } else {
      $(".list_story>div[data-type='"+dataType+"']").css({
        display: 'block'
      })
    }
  }



  // 获取所有数据
  function ajaxGetStories(type) {
    var ajaxUrl = "http://62.234.104.210:3389";
    $.ajax({
      url: `${ajaxUrl}/my_website/story/list`,
      type: "post",
      data: {
        type: type
      },
      // dataType: 'jsonp',
      // crossDomain: true,
      success: function (result) {
        var getDatas = result.data;
        var html = `<div class="list_story">`;
        getDatas.forEach(val => {
          html += `<div data-id=${val.id} data-type=${val.type}>
            <img src="${val.imgUrl}"/>
            <a href="./detail?id=${val.id}" title="${val.title}">${val.title}</a>
            <p title="${val.philosophy}">${val.philosophy}</p>
          </div>`;
        });
        html += `</div>`;
        $(".join_content_box").html(html);
      }
    })
  }

  // tab切换
  $(".story_list_header li").click(function () {
    var dataType = $(this).data("type");
    var ind = $(this).index();

    if ($(this).hasClass("active")) {
      return false;
    }
    $(this).addClass("active").siblings().removeClass("active");

    // 本次进入页面点击存贮
    window.sessionStorage.setItem("story_list_ind", ind);
    window.sessionStorage.setItem("story_list_type", dataType);
    hideDom(dataType);
  })
})
