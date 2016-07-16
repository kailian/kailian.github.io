---
layout: post
category : web
title: 'angular nganimate'
tagline: ""
tags : [web, angular]
---

### Angular动画

使用directives回调或者添加css的方式给ng标签添加动画效果。

支持ngAnimate的标签`ngRepeat`、`ngInclude`、`ngSwitch`、`ngView`、`ngShow`和`ngHide`。

具体可参考文档或代码注释对应标签的`Animations`部分

<!--break-->

### 三种方式添加动画效果

- CSS3 Transitions

- CSS3 Animations

- Javascript

### 使用js的动画

	//you can inject stuff!
	myModule.animation('cool-animation', ['$rootScope', function($rootScope) {
	  return { 
	    setup : function(element) {
	      //this is called before the animation
	      jQuery(element).css({
	        'border-width':0
	      }); 
	    },
	    start : function(element, done, memo) {
	      //this is where the animation is expected to be run
	      jQuery(element).animate({
	        'border-width':20
	      }, function() {
	        //call done to close when the animation is complete
	        done(); 
	      });
	    },
	    cancel : function(element, done) {
	      //this is called when another animation is started
	      //whilst the previous animation is still chugging away
	    }   
	  };
	}]);

### Animating ngRepeat	

当Angular往repeat list里面加入一个元素的时候，`.ng-enter` 和 `.ng-enter-active`CSS类会被自动赋予给该元素。

`enter`:新增、`leave`:移除、`move`:移动位置 

三种不同的情况下，该元素的类变化情况：

事件     | 初始类     |终结类            |触发指令
---------|------------|------------------|---------------------------------
enter    | .ng-enter  | .ng-enter-active | ngRepeat、ngInclude、ngIf、ngView
leave    | .ng-leave  | .ng-leave-active | ngRepeat、ngInclude、ngIf、ngView
move     | .ng-move   | .ng-move-active  | ngRepeat

代码示例：

	<div data-ng-repeat-"item in items" data-ng-animate-"'custom'">
	  <span ng-bind-"item"></span>
	</div>

	.custom-enter,
	.custom-leave,
	.custom-move {
	  -webkit-transition: 1s linear all;
	  -moz-transition: 1s linear all;
	  -o-transition: 1s linear all;
	  transition: 1s linear all;
	  position:relative;
	}

	.custom-enter {
	  left:-10px;
	  opacity:0;
	}
	.custom-enter.custom-enter-active {
	  left:0;
	  opacity:1;
	}

	.custom-leave {
	  left:0;
	  opacity:1;
	}
	.custom-leave.custom-leave-active {
	  left:-10px;
	  opacity:0;
	}

	.custom-move {
	  opacity:0.5;
	}
	.custom-move.custom-move-active {
	  opacity:1;
	}

### Animating ngShow & ngHide

事件            |起始类         |结束类	               |触发指令
----------------|---------------|----------------------|--------------
隐藏element     |.ng-hide-add   |.ng-hide-add-active   |ngShow, ngHide
显示element     |.ng-hide-remove|.ng-hide-remove-active|ngShow, ngHide
element添加class|.CLASS-add     |.CLASS-add-active     |ngClass
element移除class|.CLASS-remove  |.CLASS-remove-active  |ngClass

### Animating ngInclude & ngSwitch ngView

enter新的内容呈现，leave旧的内容消失。

	<div data-ng-switch="wave" data-ng-animate="'wave'">
	  <div ng-switch-when="one">...</div>
	  <div ng-switch-when="two">...</div>
	  <div ng-switch-when="three">...</div>
	</div>

	.wave-enter, .wave-leave {
	  -webkit-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
	  -moz-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
	  -o-transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
	  transition:all cubic-bezier(0.250, 0.460, 0.450, 0.940) 0.5s;
	}

	.wave-enter {
	  position:absolute;
	  left:100%;
	}

	.wave-enter-active {
	  left:0;
	}

	.wave-leave {
	  position:absolute;
	  left:0;
	}

	.wave-leave-active {
	  left:-100%;
	}

### directive中使用动画

directive

	myModule.directive('myCustomDirective',
	  ['$animator', function($animator) {
	    return {
	      link : function($scope, element, attrs) {
	        //the attrs object is where the ngAnimate attribute is defined
	        var animator = $animator($scope, attrs);

	        //injects the element into the DOM then animates
	        animator.enter(element, parent); 

	        //animates then removes the element from the DOM
	        animator.leave(element); 

	        //moves it around in the DOM then animates
	        animator.move(element, parent, sibling);  

	        //sets CSS display=block then animates
	        animator.show(element);  

	        //animates then sets CSS display=none
	        animator.hide(element);  

	        //animates a custom animation referenced in the ngAnimate attr
	        //by the event name (so ngAnimate="{custom:'animation'}")
	        animator.animate('custom', element);
	      }
	    };
	}]);

html

	<div data-my-custom-directive
     data-ng-animate="{enter: 'enter-animation',
                       leave: 'leave-animation',
                       move: 'move-animation',
                       show: 'show-animation',
                       hide: 'hide-animation',
                       custom: 'custom-animation'}"></div>

css

    .enter-animation, .leave-animation,
	.move-animation, .show-animation,
	.hide-animation {
	  -webkit-transition:all linear 1s;
	  -moz-transition:all linear 1s;
	  -o-transition:all linear 1s;
	  transition:all linear 1s;
	}

	.enter-animation { }
	.enter-animation.enter-animation-active { }

	.leave-animation { }
	.leave-animation.leave-animation-active { }

	.move-animation { }
	.move-animation.move-animation-active { }

	.show-animation { }
	.show-animation.show-animation-active { }

	.hide-animation { }
	.hide-animation.hide-animation-active { }

	.custom-animation { }
	.custom-animation.custom-animation-active { }

animation

	myModule.animation('enter-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});
	myModule.animation('leave-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});
	myModule.animation('move-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});
	myModule.animation('show-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});
	myModule.animation('hide-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});
	myModule.animation('custom-animation', function() {
	  return {
	    setup : function(element) { ... },
	    start : function(element, done) { ... },
	    cancel : function(element, done) { ... }
	  };
	});


### 一些动画示例

[http://www.nganimate.org/](http://www.nganimate.org/)

[http://yearofmoo-articles.github.io/angularjs-animation-article/app/#/ng-repeat](http://yearofmoo-articles.github.io/angularjs-animation-article/app/#/ng-repeat)