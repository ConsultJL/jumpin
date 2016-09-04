function loadComments(postId) {
  $.ajax({url: "/ajax/comments?postid="+postId, success: function(result){
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];

    var returnHtml = '';
    $.each(result, function (index, value) {
      var date = new Date(value.createdAt);
      var formattedDate = date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
      returnHtml = returnHtml + '\
        <li class="media"> \
          <div class="media-left"> \
            <a href=""> \
            <img style="width: 50px;" src="';
      returnHtml = returnHtml + value["User.profilePic"];
      returnHtml = returnHtml + '" class="media-object"> \
            </a> \
            </div> \
            <div class="media-body"> \
            <div class="pull-right dropdown" data-show-hover="li"> \
          </div> \
          <a href="" class="comment-author pull-left">';
      returnHtml = returnHtml + value["User.firstName"] + ' ' + value["User.lastName"];
      returnHtml = returnHtml + '</a><span>';
      returnHtml = returnHtml + value.text;
      returnHtml = returnHtml + '</span><div class="comment-date">';
      returnHtml = returnHtml + formattedDate;
      returnHtml = returnHtml + '</div></div></li>';
      $("#ul_comments_"+postId).html(returnHtml);
    });
  }});
}

function postComment(postId) {
  var postText = $("#reply_to_comment"+postId).val();
  var postData = {text:postText, postid:postId};
  $.ajax({
    url: "/ajax/add_comment",
    type: "POST",
    data: postData,
    success: function(result) {
      loadComments(postId);
      $("#reply_to_comment"+postId).val('');
    }
  });
}

function showHideProfileEdit() {
  if($("#displayProfile").css('display') == 'none') {
    $("#displayProfile").show();
    $("#editProfile").hide();
  } else {
    $("#displayProfile").hide();
    $("#editProfile").show();
  }
}

function loadTeamMembers() {
  $.ajax({url: "/ajax/get_team", success: function(result) {
    var returnHtml = "";
    $.each(result, function (index, value) {
      returnHtml += '<li>';
      returnHtml += '<a href="#">';
      returnHtml += '<img src="';
      returnHtml += value.profilePic;
      returnHtml += '" alt="people" style="width: 110px; height: 110px;">';
      returnHtml += '</a>';
      returnHtml += '</li>';
    });
    $("#teamMembers").html(returnHtml);
  }});

}
