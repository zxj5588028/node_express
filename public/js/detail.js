$(function(){
	$('.comment').click(function(e){console.log(999999999)
		var target = $(this);
		var toId = target.data('tid');//主评论人的id
		var commentId = target.data('cid');//当前评论的id
		//在form表单中新增隐藏域，这样提交的内容，body中就含有这些id字段。
		if($('#toId').length > 0){
			$('#toId').val(toId);
			$('#commentId').val(commentId);
		} else {
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}
	})
})
