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

	// register and login event
    $(".rg-btn, .lg-btn").on("click", function() {
    	console.log($(this).attr("name"));
        $.post("/check",{
            "photo" : document.getElementsByClassName('p3')[0].alt,
            "username" : document.getElementById('email').value,
            "password" : document.getElementById('password').value,
			"check"    : $(this).attr("name") // "register" or "login"
        },function(result){
        	console.log(result);
            if (result == "1"){
                alert("Register successfully!");
            } else if (result == "-1"){
                alert("Username has been used!");
            } else if (result == "2"){
            	var add = '/room?username='+encodeURI(document.getElementById('email').value);
            	add += '&photo='+document.getElementsByClassName('p3')[0].alt;
                window.location.href += add;
            } else if (result == "-2") {
            	alert("Check your username and password!")
			}
        });
    });
});

//用于存储图片顺序
var imgArray = ['1', '2', '3', '4', '5'];

//获取箭头
var leftArrow = document.getElementsByClassName('left-arrow')[0];
var rightArrow = document.getElementsByClassName('right-arrow')[0];

//获取用户名
var userName = document.getElementsByClassName('user-name')[0];

//获取登录按钮
var loginButton = document.getElementsByClassName('login-button')[0];

// 获取错误信息栏
var errorMessage = document.getElementsByClassName('error-message')[0];

// 添加左箭头监听事件
leftArrow.addEventListener('click', function () {
    imgArray.unshift(imgArray[imgArray.length - 1]); //把最后的元素放在第一位
    imgArray.pop();
    carouselImg();

});

// 添加右箭头监听事件
rightArrow.addEventListener('click', function () {
    imgArray.push(imgArray[0]); //把第一个元素放在最后
    imgArray.shift();
    carouselImg();

});

// 切换图片
function carouselImg() {
    for (var count = 0; count < imgArray.length; count++) {
        document.getElementsByTagName('img')[count].src = 'src/' + imgArray[count] + '.png';
        document.getElementsByTagName('img')[count].alt = imgArray[count] + '.png';
    };
};