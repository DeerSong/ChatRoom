$(function() {
	// config of password
	$("input[type='password'][data-eye]").each(function(i) {
		var $this = $(this);

		$this.wrap($("<div/>", {
			style: 'position:relative'
		}));
		$this.css({
			paddingRight: 60
		});
		$this.after($("<div/>", {
			html: 'Show',
			class: 'btn btn-primary btn-sm',
			id: 'passeye-toggle-'+i,
			style: 'position:absolute;right:10px;top:50%;transform:translate(0,-50%);-webkit-transform:translate(0,-50%);-o-transform:translate(0,-50%);padding: 2px 7px;font-size:12px;cursor:pointer;'
		}));
		$this.after($("<input/>", {
			type: 'hidden',
			id: 'passeye-' + i
		}));
		$this.on("keyup paste", function() {
			$("#passeye-"+i).val($(this).val());
		});
		$("#passeye-toggle-"+i).on("click", function() {
			if($this.hasClass("show")) {
				$this.attr('type', 'password');
				$this.removeClass("show");
				$(this).removeClass("btn-outline-primary");
			}else{
				$this.attr('type', 'text');
				$this.val($("#passeye-"+i).val());
				$this.addClass("show");
				$(this).addClass("btn-outline-primary");
			}
		});
	});

	// config of register button
    $(".rg-btn, .lg-btn").on("click", function() {
    	console.log($(this).attr("name"));
        $.post("/check",{
            "username" : document.getElementById('email').value,
            "password" : document.getElementById('password').value,
			"check"    : $(this).attr("name")
        },function(result){
            if (result == "1"){
                alert("Register successfully!");
            } else if (result == "-1"){
                alert("Username has been used!");
            } else if (result == "2"){
                alert("Login successfully!");
            } else if (result == "-2") {
            	alert("Wrong password!")
			}
        });
    });

    // config of login button
    // $(".lg-btn").on("click", function() {
    //     $.post("/check",{
    //         "username" : document.getElementById('email').value,
    //         "password" : document.getElementById('password').value
    //     },function(result){
    //         if(result == "1"){
    //             alert("登陆成功");
    //         }else if(result == "-2"){
    //             alert("没有这个注册用户");
    //         }else if(result == "-1"){
    //             alert("密码不正确");
    //         }
    //     });
    // });
});