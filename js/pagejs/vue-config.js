var app;
function createVue(datas){
	var data = datas.data;
	var advs = datas.advs;
	if(typeof data.audiences == "undefined" || data.audiences.length == 0){
		data.audiences = [{adOwner:"",cityName:"",advCompanyId:"",advertiserId:"",cityName:"",content:"",creativeId:"",creativeType:"",creativeUrl:"",demographic:"",gender:"",height:"",inMarket:"",latitude:"",logType:"",longTermInterest:"",longitude:"",province:"",sourceInfo:"",timestamp:"",width:""}];
	}
	data.audiences[0].logType = logTypeToText(data.audiences[0].logType);
	var zoom = localStorage.getItem("zoom") != null ? Number(localStorage.getItem("zoom")) : 3;
	var autoRun = localStorage.getItem("autoRun") != null ? localStorage.getItem("autoRun") == "true" ? true :false : true;
	var timer = localStorage.getItem("timer") != null ? Number(localStorage.getItem("timer")) : 10;
	app = new Vue({
	    el:"#app1",
	    data:{
	        i:0,//当前展示数据的下标
	        show:true,
	        autoRun:autoRun,//是否开启自动刷新
	        zoom:zoom,//缩放比例
	        timer:timer,//刷新频率 单位秒
	        advs:advs,//广告主列表
	        scale:1,//创意缩放比例
	        setupIcon:"css/images/icon/shezhi.svg",
	        data:data.audiences[0],//当前左侧展示数据
	        audiences:data.audiences,
	        reports:$.extend({"impCounter":0,"clickCounter":0,"reachCounter":0,"cvtCounter":0},data.reports[data.audiences[0].advCompanyId]),//曝光点击转化到达数据
	        creativeUrl_img:"",//图片创意地址
	        creativeUrl_product:"",//动态创意地址
	        config:false,//是否显示config
	        clientHeight:(document.compatMode === "CSS1Compat") ? document.documentElement.scrollHeight : document.body.scrollHeight,
	        clientWidth:(document.compatMode === "CSS1Compat") ? document.documentElement.clientWidth : document.body.clientWidth,
	        label:vue_i18n
	    },
	    watch:{
	    	creativeUrl_img:function(){
	    		app.adjustCreative("img");
	    	},
	    	creativeUrl_product:function(){
	    		app.adjustCreative("iframe");
	    	},
	    	data:function(val,oldVal){
	    		val.logType = logTypeToText(val.logType);
	    	},
	    	zoom:function(newValue,oldValue){
	    		localStorage.setItem("zoom",newValue);
	    		app.refreshMap()
	    	},
	    	autoRun:function(newValue,oldVal){
	    		localStorage.setItem("autoRun",newValue);
	    		if(newValue){
	    			$(".lcs_switch").addClass("lcs_on").removeClass("lcs_off");
	    			app.runStart();
	    		}else{
	    			$(".lcs_switch").addClass("lcs_off").removeClass("lcs_on");
	    			app.runStop();
	    		}
	    	},
	    	timer:function(newValue,oldVal){
	    		localStorage.setItem("timer",newValue);
	    		app.runStop();
	    		app.runStart();
	    	}
	    },
	    methods:{
	    	adjustCreative:function(type){
	    		$(".creative "+type).each(function(i,item){
	    			var width = app.data.width;
	    			var height = app.data.height;
	    			var scaleX = 1,scaleY = 1,scale = 1,translateX = 0,translateY = 0;
	    		    if(width > 300){
	    		        scaleX = 300/width;
	    		    }
	    		    if(height > 250){
	    		        scaleY = 250/height;
	    		    }
	    		    scaleX < scaleY ?  scale = scaleX : scale = scaleY;
	    		    if(width < 300){
	    		        translateX = (300/scale - width)/2;
	    		    }
	    		    if(height < 250){
	    		        translateY = (250/scale - height)/2;
	    		    }
	    		    app.scale = scale;
	    		    $(item).css("transform","scale("+scale+","+scale+") translate("+translateX+"px,"+translateY+"px)");
				});
	    	},
	    	updateChoice:function(){
	    		if(app.autoRun){
	    			intervaRefreshData();
	    		}else{
	    			var companyId = $("#choiceAdv").val();
	    			if(companyId == 0){
	    				var data = {
	    					audiences:app.audiences,
	    					reports:app.reports
	    				}
	    			}else{
	    				var data = {
	    	    			audiences:[],
	    	    			reports:app.reports
	    	    		}
	    	    		$.each(app.audiences,function(i,item){
	    	    			if(item.advCompanyId == companyId){
	    	    				data.audiences.push(item);
	    	    			}
	    	    		});
	    			}
	    			app.update(data,0);
	    			app.refreshMap();
	    			if(data.audiences.length == 0){
	    				if(companyId != 0){
	    					app.data.adOwner = $("#choiceAdv")[0].options[$("#choiceAdv")[0].selectedIndex].text;
	    				}else{
	    					app.data.adOwner = "--";
	    				}
	    			}
	    		}
	    	},
	    	runStart:function(){
	    		this.refreshMap();//通过刷新地图来配置刷新状态的参数
	    		//自动刷新数据
	    		autoRefreshData();
	    	},
	    	runStop:function(){
	    		//停止刷新
	    		clearInterval(myInterval);
	    		this.refreshMap();//通过刷新地图来配置停止状态的参数
//	    		//让图表可移动
//	    		myChart.setOption({
//    		    	 geo: {
//    		    		 roam: "move"
//    		    	 }
//	    		});
	    	},
	    	update:function(data,i){
	    		if(data.audiences.length == 0){
	    			console.warn("没有数据");
	    			app.clearData();
	    			return;
	    		}
	    		if(i<0)i=0;
	    		app.i=i;
	    		app.data=data.audiences[i];
		        app.audiences=data.audiences;
		        app.reports=$.extend({"impCounter":0,"clickCounter":0,"reachCounter":0,"cvtCounter":0},data.reports[data.audiences[i].advCompanyId]);
		        app.showCreative();
	    	},
	    	showCreative:function(){
	    		var i = app.i;
            	if(app.data.creativeId.indexOf("image") > -1){
            		app.creativeUrl_img = app.data.creativeUrl;
            		app.creativeUrl_product = "";
            	}else if(app.data.creativeId.indexOf("product") > -1){
            		app.creativeUrl_img = "";
            		app.creativeUrl_product = app.data.creativeUrl;
            	}else{
            		app.creativeUrl_img = "";
            		app.creativeUrl_product = "";
            	}
	        },
	        convertData:function(data,sex) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                	if(data[i].gender == sex && i != app.i){
                		var geoCoord = [];
                        geoCoord.push(data[i].longitude);
                        geoCoord.push(data[i].latitude);
                        geoCoord.push(i);
                        if (geoCoord.length>0) {
                            res.push({
                                name: data[i].cityName,
                                value: geoCoord
                            });
                        }
                	}
                }
                return res;
            },
            clearData:function(){
            	app.audiences = [];
            	$.each(app.data,function(key,value){
            		if(key != "adOwner"){
            			app.data[key] = "";
            		}
            	});
            	app.creativeUrl_img = "";
            	app.creativeUrl_product = "";
            	$.each(app.reports,function(key,value){
            		app.reports[key] = 0;
            	});
            },
            bindClick:function(){
                //绑定事件
	            myChart.on('click', function (params) {
	            	if(app.autoRun)return false;
	                if(params.seriesType=="scatter"){
	                	event.preventDefault()
	                	event.stopPropagation();
	                	//console.log(params);
	                	var i=params.data.value[2];
	                	if(i<0)return;
	                	if(i!=dIdx){
	                		dIdx=i;
	                		app.i=dIdx;
	                		app.data=app.audiences[dIdx];
	                		app.showCreative();
	                		//myChart.clear();
	                		app.refreshMap();//刷新地图坐标
	                	}
	                	
	                	return true;
	                }else{
	                	
	                }
	            });
            },
	        refreshMap:function(){
	        	if(app.audiences.length==0 || app.data.adOwner == ""){
	        		console.warn("最近没有数据");
	        		myChart.clear();
	        		myChart.setOption({
	        			tooltip: {},
        		        geo: {
        		            map: 'china',
        		            roam: true,
        		            itemStyle: {
        		                normal:{
        		                    borderColor: 'rgba(0, 0, 0, 0.2)'
        		                },
        		                emphasis:{
        		                    areaColor: null,
        		                    shadowOffsetX: 0,
        		                    shadowOffsetY: 0,
        		                    shadowBlur: 20,
        		                    borderWidth: 0,
        		                    shadowColor: 'rgba(0, 0, 0, 0.5)'
        		                }
        		            }
        		        }
	        		});
	        		return ;
	        	}
	            if(app.i >= app.audiences.length){
	            	app.i=0;
	            }
	            //设置地图中心点
	            var x=app.data.longitude;
	            var y=app.data.latitude;
	            //可调整中心定位
//	            if(app.data.longitude<121){
//	            	x=121.00;
//	            }
//	            if(app.data.latitude>22){
//	            	y=22.00;
//	            }
	            var center=[x,y];
	    		var normalShow=true;
	            var roam=false;
            	var animation=true;
            	var silent=true;
	            //存在位移bug
	            if(!app.autoRun){
	            	roam="move";
	            	animation=false;
	            	silent=false;
	            }
	            if(app.zoom<2){
	    			normalShow=false;
	            }
	    		var geo={
	    			 map: 'china',
	                 roam: roam,
	                 selectedMode:false,
	                 zoom: app.zoom,
	                 scaleLimit:{
	                	 min:1,
	                	 max:4
	                 },
	   	    		 label:{
	   	             	normal:{
	   	                    show:normalShow
	   	                },
	   	                emphasis:{
	   	                 	show:true
	   	                }
	   	             },
	   	             itemStyle: {
                        normal:{
                        	areaColor: '#e5e5e5',
                            borderColor: 'rgba(0, 0, 0, 0.2)',
                            cursor:"default",
                            borderWidth:1
                        },
                        emphasis:{
                            areaColor: '#fff',
                            borderWidth: 1,
                            cursor:"default",
                            shadowColor: 'rgba(0, 0, 0, 0.2)'
                        }
                    },
                    silent:true
	   	        };
				if(app.zoom>1 && app.autoRun){
					geo.center=center;
				}else if(app.zoom ==1){
					geo.center=[105.38, 36.07];
				}
	            myChart.setOption({
		   	    	tooltip: {
		               	show:false
		            },
		   	    	geo:geo,
//		   	    	graphic:{
//		   	    		elements:[{
//		   	    			type:'polygon',
//		   	    		    cursor:"default"
//		   	    		},
//		   	    		{
//		   	    			type:'polyline',
//		   	    		    cursor:"default"
//		   	    		}
//		   	    		]
//		   	    	},
		   	        series: [
		   	          {
		   	            type: 'map',
		   	            zoom: app.zoom,
		   	            geoIndex: 0,
			   	        itemStyle:{
			                normal:{
			                    areaColor:"#e5e5e5"
			                }  
			            },
		   	            animationDurationUpdate: 1000,
		   	            animationEasingUpdate: 'cubicInOut'
		   	        },
		   	        {
		   	            type: 'scatter',
		   	            coordinateSystem: 'geo',
		   	            zoom: app.zoom,
		   	            data: app.convertData(app.audiences,1),
		   	            symbolSize: 30,
		   	            symbolOffset:[0,-15],
		   	            animation:animation,
		   	            silent:silent,
		   	            symbol:'image://css/images/man_icon2.svg'
		   	        },
		   	        {
		   	            type: 'scatter',
		   	            coordinateSystem: 'geo',
		   	            zoom: app.zoom,
		   	            data: app.convertData(app.audiences,2),
		   	            symbolSize: 30,
		   	            symbolOffset:[0,-15],
		   	            animation:animation,
		   	            silent:silent,
		   	            symbol:'image://css/images/woman_icon2.svg'
		   	        },
		   	        {
		   	        	type: 'scatter',
		   	        	coordinateSystem: 'geo',
		   	        	zoom: app.zoom,
		   	        	data: [{name:app.data.cityName,value:[app.data.longitude,app.data.latitude,-1]}],
		   	        	symbolSize: 60,
		   	        	symbolOffset:[0,-30],
		   	        	animation:animation,
		   	        	silent:silent,
		   	        	symbol:app.data.gender == 1 ? 'image://css/images/man_active.svg' :'image://css/images/woman_active.svg'
		   	        }
		   	        ]
		   	    });
	        },//end refreshMap function
	        mobileConfigToggle:function(){
	        	$("#configmo").show(300);
	        },
	        logout:function(){
	        	$.ajax({
	        		url:"./logout.do",
	        		type:"post",
	        		success:function(data){
	        			if(data){
	        				location.href = location.href.replace("index","login.jsp");
	        			}
	        		},
	        		error:function(e){
	        			console.error(e);
	        		}
	        	});
	        }
	    }
	});
}