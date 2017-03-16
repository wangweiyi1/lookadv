String.prototype.replaceAll=function(str,rep){
    return this.split(str).join(rep);
};
function toast(message,type,callback){
	if(type && type=="info"){type="notice"};
	$().toastmessage('showToast', {
        text     : message,
        sticky   : false,
        position : 'top-right',
        type     : type,// notice, warning, error, success
        close    : null
    });
}
var myChart;//地图对象
var dataTimer=20000;//数据更新频率
var curData;//当前数据
var dIdx=0;//当前展示数据的索引
var curI=0;//当前自动刷新的索引
var myInterval;

function intervaRefreshData(){
	try{
		if(!myChart)return;
		if(!curData)return;
		var companyId = $("#choiceAdv").val();
		curI++;
		if(curI>=curData.audiences.length){
			curI=0;
		}
		if(companyId == 0){
			var data = curData;
		}else{
			var data = {
    			audiences:[],
    			reports:curData.reports
    		}
    		$.each(curData.audiences,function(i,item){
    			if(item.advCompanyId == companyId){
    				data.audiences.push(item);
    			}
    		});
    		curI = 0;
		}
		app.update(data,curI);//创建vue对象
		app.refreshMap();
		if(data.audiences.length == 0){
			if(companyId != 0){
				app.data.adOwner = $("#choiceAdv")[0].options[$("#choiceAdv")[0].selectedIndex].text;
			}else{
				app.data.adOwner = "--";
			}
		}
	}catch(e){
		console.error(e);
	}
}
//自动进行数据刷新
function autoRefreshData(){
	if(app.autoRun){
		myInterval=setInterval(intervaRefreshData, app.timer * 1000);
	}
}
function sequenceData(data){
	var newAudiences = [];
	for(var i=0;i<data.audiences.length;i++){
		if(data.audiences[i].width == 300 && data.audiences[i].height == 250){
			newAudiences.unshift(data.audiences[i]);
		}else{
			newAudiences.push(data.audiences[i]);
		}
	}
	data.audiences = newAudiences;
	return data;
}
//初始化方法
function init(data){
	//1男 2女
	if(data.data.audiences.length == 0){
		console.warn("没有数据");
	}
	curData=sequenceData(data.data);
	$("#app1").show();
	createVue(data);//创建vue对象
	app.showCreative();//显示创意
    myChart = echarts.init(document.getElementById('mapChart'));
	app.refreshMap();//刷新地图坐标
	app.bindClick();//绑定事件
	autoRefreshData();//自动刷新数据
	var interval = setInterval(function(){
		getData();
    },dataTimer);
	addOverallEvent();//绑定全局事件
}
function addOverallEvent(){
	//增加监听空格事件
	$(document).keypress(function (e) {
        if (e.keyCode ==  32){//空格
        	app.autoRun=!app.autoRun;
        	if(app.autoRun){
    			toast(app.label.openAutoRefresh);
        	}else{
        		toast(app.label.closeAutoRefresh);
        	}
        }
    });
	$(document).click(function(e){
		var element = $(e.target);
		if(!$(element).hasClass("config-container") && $(element).parents(".config-container").length == 0 
				&& !$(element).hasClass("config-icon") && $(element).parents(".config-icon").length == 0){
			app.config = false;
		}
		if(!$(element).hasClass("mobile-config") && $(element).parents(".mobile-config").length == 0 
				&& !$(element).hasClass("config-icon") && $(element).parents(".config-icon").length == 0){
			$("#configmo").hide(300);
		}
	});
	//用于使chart自适应高度和宽度
	window.onresize = function () {
	    //重置容器高宽
		app.clientHeight = (document.compatMode === "CSS1Compat") ? document.documentElement.clientHeight : document.body.clientHeight;
		app.clientWidth = (document.compatMode === "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth;
	    if(app.clientWidth >= 800){
	    	$("#mapChart").height(app.clientHeight);
    	    if(myChart)myChart.resize();
	    }
	};
}
function getData(){
	// var data = {};
	// data.num = 100;
	// var advId = $("#choiceAdv").val();
	// if(advId != 0){
	// 	data.companyId = advId;
	// }
	// $.ajax({
	// 	url:"./getMessageData.json",
	// 	dataType:"json",
	// 	data:data,
	// 	type:"post",
	// 	success:function(data){//1男 2女
	// 		if(data.audiences.length == 0){
	// 			return;
	// 		}
	// 		curI=-1;
	// 		curData=sequenceData(data);
	// 	},
	// 	error:function(e){
	// 		console.error(e);
	// 	}
	// });
}
