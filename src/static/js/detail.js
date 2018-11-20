;
$(function() {
  var ids = location.search.split("?")[1].split("=")[1];
  ajaxGetStories(ids);

  
  // 获取单个元素的所有数据
  function ajaxGetStories(ids) {
    var ajaxUrl = "http://62.234.104.210:3389/";
    $.ajax({
      url: `${ajaxUrl}my_website/story`,
      type: "post",
      data: {
        ids: ids
      },
      dataType: "json",
      success: function (result) {
        console.log(result)
        var html = `<h2>${result.title}</h2><img src="${result.imgUrl}" />`;
        var pHtml = result.pHtml;
        pHtml.forEach(val => {
          html += `<p>${val.text}</p>`;
        });
        $(".joinus_detail_context").html(html);
      }
    })
  }
})