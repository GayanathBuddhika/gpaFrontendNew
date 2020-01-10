
	//slider javascript
/*! rangeslider.js - v2.0.2 | (c) 2015 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js */
! function(a) {
  "use strict";
  "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery)
}(function(a) {
  "use strict";

  function b() {
    var a = document.createElement("input");
    return a.setAttribute("type", "range"), "text" !== a.type
  }

  function c(a, b) {
    var c = Array.prototype.slice.call(arguments, 2);
    return setTimeout(function() {
      return a.apply(null, c)
    }, b)
  }

  function d(a, b) {
    return b = b || 100,
      function() {
        if (!a.debouncing) {
          var c = Array.prototype.slice.apply(arguments);
          a.lastReturnVal = a.apply(window, c), a.debouncing = !0
        }
        return clearTimeout(a.debounceTimeout), a.debounceTimeout = setTimeout(function() {
          a.debouncing = !1
        }, b), a.lastReturnVal
      }
  }

  function e(a) {
    return a && (0 === a.offsetWidth || 0 === a.offsetHeight || a.open === !1)
  }

  function f(a) {
    for (var b = [], c = a.parentNode; e(c);) b.push(c), c = c.parentNode;
    return b
  }

  function g(a, b) {
    function c(a) {
      "undefined" != typeof a.open && (a.open = a.open ? !1 : !0)
    }
    var d = f(a),
      e = d.length,
      g = [],
      h = a[b];
    if (e) {
      for (var i = 0; e > i; i++) g[i] = d[i].style.cssText, d[i].style.display = "block", d[i].style.height = "0", d[i].style.overflow = "hidden", d[i].style.visibility = "hidden", c(d[i]);
      h = a[b];
      for (var j = 0; e > j; j++) d[j].style.cssText = g[j], c(d[j])
    }
    return h
  }

  function h(a, b) {
    var c = parseFloat(a);
    return Number.isNaN(c) ? b : c
  }

  function i(a) {
    return a.charAt(0).toUpperCase() + a.substr(1)
  }

  function j(b, e) {
    if (this.$window = a(window), this.$document = a(document), this.$element = a(b), this.options = a.extend({}, n, e), this.polyfill = this.options.polyfill, this.orientation = this.$element[0].getAttribute("data-orientation") || this.options.orientation, this.onInit = this.options.onInit, this.onSlide = this.options.onSlide, this.onSlideEnd = this.options.onSlideEnd, this.DIMENSION = o.orientation[this.orientation].dimension, this.DIRECTION = o.orientation[this.orientation].direction, this.DIRECTION_STYLE = o.orientation[this.orientation].directionStyle, this.COORDINATE = o.orientation[this.orientation].coordinate, this.polyfill && m) return !1;
    this.identifier = "js-" + k + "-" + l++, this.startEvent = this.options.startEvent.join("." + this.identifier + " ") + "." + this.identifier, this.moveEvent = this.options.moveEvent.join("." + this.identifier + " ") + "." + this.identifier, this.endEvent = this.options.endEvent.join("." + this.identifier + " ") + "." + this.identifier, this.toFixed = (this.step + "").replace(".", "").length - 1, this.$fill = a('<div class="' + this.options.fillClass + '" />'), this.$handle = a('<div class="' + this.options.handleClass + '" />'), this.$range = a('<div class="' + this.options.rangeClass + " " + this.options[this.orientation + "Class"] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle), this.$element.css({
      position: "absolute",
      width: "1px",
      height: "1px",
      overflow: "hidden",
      opacity: "0"
    }), this.handleDown = a.proxy(this.handleDown, this), this.handleMove = a.proxy(this.handleMove, this), this.handleEnd = a.proxy(this.handleEnd, this), this.init();
    var f = this;
    this.$window.on("resize." + this.identifier, d(function() {
      c(function() {
        f.update()
      }, 300)
    }, 20)), this.$document.on(this.startEvent, "#" + this.identifier + ":not(." + this.options.disabledClass + ")", this.handleDown), this.$element.on("change." + this.identifier, function(a, b) {
      if (!b || b.origin !== f.identifier) {
        var c = a.target.value,
          d = f.getPositionFromValue(c);
        f.setPosition(d)
      }
    })
  }
  Number.isNaN = Number.isNaN || function(a) {
    return "number" == typeof a && a !== a
  };
  var k = "rangeslider",
    l = 0,
    m = b(),
    n = {
      polyfill: !0,
      orientation: "horizontal",
      rangeClass: "rangeslider",
      disabledClass: "rangeslider--disabled",
      horizontalClass: "rangeslider--horizontal",
      verticalClass: "rangeslider--vertical",
      fillClass: "rangeslider__fill",
      handleClass: "rangeslider__handle",
      startEvent: ["mousedown", "touchstart", "pointerdown"],
      moveEvent: ["mousemove", "touchmove", "pointermove"],
      endEvent: ["mouseup", "touchend", "pointerup"]
    },
    o = {
      orientation: {
        horizontal: {
          dimension: "width",
          direction: "left",
          directionStyle: "left",
          coordinate: "x"
        },
        vertical: {
          dimension: "height",
          direction: "top",
          directionStyle: "bottom",
          coordinate: "y"
        }
      }
    };
  j.prototype.init = function() {
    this.update(!0, !1), this.$element[0].value = this.value, this.onInit && "function" == typeof this.onInit && this.onInit()
  }, j.prototype.update = function(a, b) {
    a = a || !1, a && (this.min = h(this.$element[0].getAttribute("min"), 0), this.max = h(this.$element[0].getAttribute("max"), 100), this.value = h(this.$element[0].value, this.min + (this.max - this.min) / 2), this.step = h(this.$element[0].getAttribute("step"), 1)), this.handleDimension = g(this.$handle[0], "offset" + i(this.DIMENSION)), this.rangeDimension = g(this.$range[0], "offset" + i(this.DIMENSION)), this.maxHandlePos = this.rangeDimension - this.handleDimension, this.grabPos = this.handleDimension / 2, this.position = this.getPositionFromValue(this.value), this.$element[0].disabled ? this.$range.addClass(this.options.disabledClass) : this.$range.removeClass(this.options.disabledClass), this.setPosition(this.position, b)
  }, j.prototype.handleDown = function(a) {
    if (a.preventDefault(), this.$document.on(this.moveEvent, this.handleMove), this.$document.on(this.endEvent, this.handleEnd), !((" " + a.target.className + " ").replace(/[\n\t]/g, " ").indexOf(this.options.handleClass) > -1)) {
      var b = this.getRelativePosition(a),
        c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
        d = this.getPositionFromNode(this.$handle[0]) - c,
        e = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
      this.setPosition(e), b >= d && b < d + this.handleDimension && (this.grabPos = b - d)
    }
  }, j.prototype.handleMove = function(a) {
    a.preventDefault();
    var b = this.getRelativePosition(a),
      c = "vertical" === this.orientation ? this.maxHandlePos - (b - this.grabPos) : b - this.grabPos;
    this.setPosition(c)
  }, j.prototype.handleEnd = function(a) {
    a.preventDefault(), this.$document.off(this.moveEvent, this.handleMove), this.$document.off(this.endEvent, this.handleEnd), this.$element.trigger("change", {
      origin: this.identifier
    }), this.onSlideEnd && "function" == typeof this.onSlideEnd && this.onSlideEnd(this.position, this.value)
  }, j.prototype.cap = function(a, b, c) {
    return b > a ? b : a > c ? c : a
  }, j.prototype.setPosition = function(a, b) {
    var c, d;
    void 0 === b && (b = !0), c = this.getValueFromPosition(this.cap(a, 0, this.maxHandlePos)), d = this.getPositionFromValue(c), this.$fill[0].style[this.DIMENSION] = d + this.grabPos + "px", this.$handle[0].style[this.DIRECTION_STYLE] = d + "px", this.setValue(c), this.position = d, this.value = c, b && this.onSlide && "function" == typeof this.onSlide && this.onSlide(d, c)
  }, j.prototype.getPositionFromNode = function(a) {
    for (var b = 0; null !== a;) b += a.offsetLeft, a = a.offsetParent;
    return b
  }, j.prototype.getRelativePosition = function(a) {
    var b = i(this.COORDINATE),
      c = this.$range[0].getBoundingClientRect()[this.DIRECTION],
      d = 0;
    return "undefined" != typeof a["page" + b] ? d = a["client" + b] : "undefined" != typeof a.originalEvent["client" + b] ? d = a.originalEvent["client" + b] : a.originalEvent.touches && a.originalEvent.touches[0] && "undefined" != typeof a.originalEvent.touches[0]["client" + b] ? d = a.originalEvent.touches[0]["client" + b] : a.currentPoint && "undefined" != typeof a.currentPoint[this.COORDINATE] && (d = a.currentPoint[this.COORDINATE]), d - c
  }, j.prototype.getPositionFromValue = function(a) {
    var b, c;
    return b = (a - this.min) / (this.max - this.min), c = Number.isNaN(b) ? 0 : b * this.maxHandlePos
  }, j.prototype.getValueFromPosition = function(a) {
    var b, c;
    return b = a / (this.maxHandlePos || 1), c = this.step * Math.round(b * (this.max - this.min) / this.step) + this.min, Number(c.toFixed(this.toFixed))
  }, j.prototype.setValue = function(a) {
    a !== this.value && this.$element.val(a).trigger("input", {
      origin: this.identifier
    })
  }, j.prototype.destroy = function() {
    this.$document.off("." + this.identifier), this.$window.off("." + this.identifier), this.$element.off("." + this.identifier).removeAttr("style").removeData("plugin_" + k), this.$range && this.$range.length && this.$range[0].parentNode.removeChild(this.$range[0])
  }, a.fn[k] = function(b) {
    var c = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
      var d = a(this),
        e = d.data("plugin_" + k);
      e || d.data("plugin_" + k, e = new j(this, b)), "string" == typeof b && e[b].apply(e, c)
    })
  }
});

//custom slider javascript
$(function() {

var index=0;

  
var avg=0;
var val=0
    
    
//  var output = document.querySelectorAll('output')[0];

var arrOfAvg=[0,0,0,0,0,0];
var sumOfAvg=0;

var guageValue=[
	{"gaugeIndex":0,"title":"","value":"","color":""},
	{"gaugeIndex":1,"title":"","value":"","color":""},
	{"gaugeIndex":2,"title":"","value":"","color":""},
	{"gaugeIndex":3,"title":"","value":"","color":""},
	{"gaugeIndex":4,"title":"","value":"","color":""},
	{"gaugeIndex":5,"title":"","value":"","color":""}
	]





  $(document).on('input', 'input[type="range"]', function(e) {
      
      //Get the index of slider
    //  console.log($(this).closest(".xx").find('input[type="range"]').index(this))
    var getIndex=$(this).closest(".get-gauge").find('input[type="range"]').index(this);
  
      
    var output = document.querySelectorAll('output')[getIndex]; 
    output.innerHTML = e.currentTarget.value;
    
    countSlider=output.innerHTML;
    
	
	
    var max=$(this).attr("max");
    
   // max==100? val=Math.round(countSlider/6): val=8-Math.round((countSlider-100)/12)
    		
    max==100? val=6: val=12   
 
	if(countSlider>100)
		avg=16.67-((countSlider-100)/6).toFixed(2)
	else
		avg=(countSlider/6).toFixed(2)
		
	var getTitle=$(this).parent().closest("div").prev().html();
	var newJson={"gaugeIndex":getIndex,"title":getTitle,"value":avg,"color":countSlider>=175?"#ED5153":countSlider>=150?"#FBB03B":countSlider>=125?"#1b789b":countSlider>=100?"#05C085":countSlider>=75?"#05C085":countSlider>=50?"#1b789b":countSlider>=25?"#FBB03B":"#ED5153"}
	

	
	guageValue=updateJSON(guageValue,newJson)
	

    		
    arrOfAvg[getIndex]=parseFloat(avg)
    
    sumOfAvg = arrOfAvg.reduce(function(pv, cv) { return pv + cv; }, 0);    
	sumOfAvg=sumOfAvg.toFixed(0)
         
	
	/*var chart=AmCharts.makeChart("chartdiv", {
		  "type": "pie",
		  "theme": "light",
		"dataProvider":guageValue,
		  "allLabels": [{
		    "text": sumOfAvg,
		    "align": "center",
		    "size":24,
		    "bold": true,
		    "y": 190
		  }],
		  "startDuration":0,
		  "titleField": "title",
		  "valueField": "value",
		  "colorField":"color", 
		  "labelRadius": 5,
		  "radius": "25%",
		  "innerRadius": "30%",
		  "labelText": "[[title]]",
		  "fontSize":12
		});
   */
  /*  
    chart.arrows[0].setValue(parseInt(sumOfAvg));
    chart.axes[0].setTopText(parseInt(sumOfAvg) + "%");
    // adjust darker band to new value
    if(sumOfAvg>=100)
    	chart.axes[0].bands[1].setEndValue(100);
    else
    	 chart.axes[0].bands[1].setEndValue(parseInt(sumOfAvg));*/
    
    
    
	/*var cls=$(this).attr('class');
	
	
	if(e.currentTarget.value>175)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="very_bad_r")
			$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","very_bad_r").attr("src","https://www.smileysapp.com/gif-emoji/thumbs-down.gif").removeAttr("style").fadeIn(200)

			
		$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#ED5153',
			transition : 'background 0.5s ease-in'
		});
		
		changeFeedbackBgColor(cls,"ED5153")
		
	}
	else if(e.currentTarget.value>150)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="normal_r")	
			$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","normal_r").attr("src","https://www.smileysapp.com/gif-emoji/facepalm.gif").removeAttr("style")
	
		$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#FBB03B',
			transition : 'background 0.5s ease-in'
		});		
		
		changeFeedbackBgColor(cls,"FBB03B")
	}
	else if(e.currentTarget.value>125)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="nice_r")
			$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","nice_r").attr("src","https://www.smileysapp.com/gif-emoji/thumbs-up.gif").removeAttr("style")
			
		$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#1b789b',
			transition : 'background 0.5s ease-in'
		});		
		changeFeedbackBgColor(cls,"1b789b")
		
	}
	
	else if(e.currentTarget.value>100){
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="awesome_r")
			$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","awesome_r").attr("src","https://www.smileysapp.com/gif-emoji/clapping.gif").removeAttr("style")
	}
	
	else if(e.currentTarget.value==100)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="healthy")
		$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","healthy").attr("src","https://www.smileysapp.com/gif-emoji/angel.gif").removeAttr("style")
		
		$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#05C085',
			transition : 'background 0.5s ease-in'
		});	
		
		changeFeedbackBgColor(cls,"05C085")
	}

	
	else if(e.currentTarget.value>=75)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="awesome")
		$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","awesome").attr("src","https://www.smileysapp.com/gif-emoji/clapping.gif").removeAttr("style")
		
		$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#05C085',
			transition : 'background 0.5s ease-in'
		});		
		
		changeFeedbackBgColor(cls,"05C085")
	}
	
	else if(e.currentTarget.value>=50)
	{
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="nice")
		$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","nice").attr("src","https://www.smileysapp.com/gif-emoji/thumbs-up.gif").removeAttr("style")
		$("#gaugeEmogi img").show()
		$("#gaugeEmogi img").not("#nice").hide()
		
		
			$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#1b789b',
			transition : 'background 0.5s ease-in'
		});	
		
		changeFeedbackBgColor(cls,"1b789b")
	}
	
	else if(e.currentTarget.value>=25)
	{	
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="normal")	
				$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","normal").attr("src","https://www.smileysapp.com/gif-emoji/facepalm.gif").removeAttr("style")
		
			
		
			
		
		
		$("#very_bad").fadeOut(200,function(){
				$(this).hide()
				$("#gaugeEmogi img").show()
				$("#gaugeEmogi img").not("#normal").hide()
			});
	
		
			$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#FBB03B',
			transition : 'background 0.5s ease-in'
		});		
		
		changeFeedbackBgColor(cls,"FBB03B")
	}
	
	else if(e.currentTarget.value>=0)
	{				
		if($(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id")!="very_bad")
		$(this).closest('tr').find("td:nth-child(1)").find("#gaugeEmogi").find("img").attr("id","very_bad").attr("src","https://www.smileysapp.com/gif-emoji/thumbs-down.gif").removeAttr("style").fadeIn(200)

			$('.'+cls).next().find('.rangeslider__fill').css({
			background:'#ED5153',
			transition : 'background 0.5s ease-in'
		});		
		
		changeFeedbackBgColor(cls,"ED5153")
	}*/
	
	
	
	
	
	
	

  });

  $('input[type=range]').rangeslider({
    polyfill: false
  });
  
  
});

//when slider changes, hide start message
$("input").on("change", function() {
  $("small").fadeOut("slow");
})






/*$(document).on('input', 'input[type="range"]', function(e) {
	
	//get index of slider
	var getIndex=$(this).closest(".get-gauge").find('input[type="range"]').index(this);
	  
    var output = document.querySelectorAll('output')[getIndex]; 
    output.innerHTML = e.currentTarget.value;
    
    //get count of slider
    var count =  output.innerHTML;
    
    //get title
	var getTitle=$(this).parent().closest("div").prev().html();
	var newJson={"gaugeIndex":getIndex,"title":getTitle,"value":count}
	
	//console.log("newJson "+JSON.stringify(newJson))
	
	guageValue=updateJSON(guageValue,newJson)
	console.log("Get Index "+JSON.stringify(guageValue))
	
	
})
*/

function changeFeedbackBgColor(cls,color){
	if(cls=="a"){$(".a-ac").css("background","#"+color)}
	else if(cls=="b"){$(".b-ac").css("background","#"+color)}
	else if(cls=="c"){$(".c-ac").css("background","#"+color)}
	else if(cls=="d"){$(".d-ac").css("background","#"+color)}
	else if(cls=="e"){$(".e-ac").css("background","#"+color)}
	else if(cls=="f"){$(".f-ac").css("background","#"+color)}
}


function updateJSON(guageValue, newJson) {
	return guageValue.map(function(item) {
	  return (item.gaugeIndex === newJson.gaugeIndex) ? newJson : item;
	});
	}

/*var chart = AmCharts.makeChart("chartdiv", {
		  "theme": "light",
		  "type": "gauge",
		  "axes": [{
		    "topTextFontSize": 20,
		    "topTextYOffset": 70,
		    "axisColor": "#31d6ea",
		    "axisThickness": 1,
		    "endValue": 100,
		    "gridInside": false,
		    "inside": false,
		    "radius": "50%",
		    "valueInterval": 20,
		    "tickColor": "#67b7dc",
		    "startAngle": -145,
		    "endAngle": 145,
		    "unit": "%",
		    "bandOutlineAlpha": 0,
		    "bands": [{
		      "color": "#ff6e00",
		      "endValue": 100,
		      "innerRadius": "105%",
		      "radius": "170%",
		      "gradientRatio": [0.9, 0,1],
		      "startValue": 0
		    }, {
		      "color": "#3cd3a3",
		      "endValue": 0,
		      "innerRadius": "105%",
		      "radius": "170%",
		      "gradientRatio": [0.0, 0, -0.5],
		      "startValue": 0
		    }]
		  }],
		  "arrows": [{
		    "alpha": 1,
		    "innerRadius": "45%",
		    "nailRadius": 0,
		    "radius": "160%"
		  }]
		});*/

/*setInterval(randomValue, 2000);

// set random value
function randomValue() {
  var value = Math.round(Math.random() * 100);
  chart.arrows[0].setValue(value);
  chart.axes[0].setTopText(value + " %");
  // adjust darker band to new value
  chart.axes[0].bands[1].setEndValue(value);
}*/








