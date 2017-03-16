Vue.component('data-label', {
	props: ['label','message','icon'],
	template: '\
		<div class="media">\
			<div class="media-left">\
		      	<img class="media-object" width="16" height="16" :src="src">\
		  	</div>\
			<div class="media-body">\
				<h4 class="media-heading title"> {{ label }} </h4>\
				<span class="text" v-animate> {{ message != "" ? message : "--" }} </span>\
			</div>\
		</div>\
	',
	data:function(){
		return {
			src:"css/images/icon/"+this.icon+".svg"
		}
	}
})

Vue.directive('animate', {
	componentUpdated: function (el) {
		$(el).parents(".shadow:first").find(".media").addClass('animated lightSpeedIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
		      $(this).removeClass('animated lightSpeedIn');
		});
	}
})

Vue.directive('number', {
	componentUpdated: function (el,b) {
		var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',');
		$(el).animateNumber({ 
			number: b.value,
			numberStep: comma_separator_number_step
		});
	}
})