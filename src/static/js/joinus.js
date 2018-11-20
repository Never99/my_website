;
$(function () {
  // 获取所有数据
  function ajaxGetStories(type) {
    var ajaxUrl = "http://62.234.104.210:3389";
    $.ajax({
      url: `${ajaxUrl}/my_website/story`,
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
          html += `<div data-id=${val.id}>
            <img src="${val.imgUrl}"/>
            <a href="./detail?id=${val.id}" title="${val.title}">${val.title}</a>
            <p>${val.pHtml[0].text}</p>
          </div>`;
        });
        html += `</div>`;
        $(".join_content_box").html(html);
      }
    })
  }

  // tab切换
  $(".joinus_list_header li").click(function () {
    var dataType = $(this).data("type");
    var ind = $(this).index();
    // 本次进入页面点击存贮
    window.sessionStorage.setItem("joinus_list_ind", ind);

    if ($(this).hasClass("active")) {
      return false;
    }
    $(this).addClass("active").siblings().removeClass("active");
    ajaxGetStories(dataType);
  })

  // 判断是否第一次进入页面
  if (sessionStorage.getItem("joinus_list_ind")) {
    var ind = sessionStorage.getItem("joinus_list_ind");
    $(".joinus_list_header li").eq(ind).trigger("click");
  } else {
    // 初始化调用请求
    ajaxGetStories("all");
  }
})