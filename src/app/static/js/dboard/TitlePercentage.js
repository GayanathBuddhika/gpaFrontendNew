function titlePercentage(id,arr,text){
	
	var data=new Array()
	
	
	
	for(i=0;i<arr.length;i++)
	{
		if(arr[i].cat && arr[i].avg1)
		data.push({"title":arr[i].cat, "avg" : arr[i].avg1})
	}
	
	
	
	if(data.length>0){
	var i=0;
	
	var getTitleAvg =data.map(function(obj) {
		var color=["#FF0F00","#FF6600","#FF9E01","#FCD202","#F8FF01","#B0DE09"];
	    var me = Object.assign({}, obj);
	    me.color = color[i];
	    i = (i + 1) % color.length;
	    return me;
	});


	var chart = AmCharts.makeChart(id, {
	    "theme": "light",
	    "type": "serial",   
	    "startDuration": 2,
	    "rotate": text=="Total"?true:false,
	    "dataProvider": getTitleAvg,
	    "valueAxes": [{
	        "position": "left",
	        "axisAlpha":0.1,
	        "title":"Avg"
	    }],
	    "graphs": [{
	    	"balloonText": "[[category]]: <b>[[value]] %</b>",
	        "fillColorsField": "color",
	        "fillAlphas": 1,
	        "lineAlpha": 0.1,
	        "type": "column",
	        "valueField": "avg",
	        "fixedColumnWidth": 17
	    }],
	    "depth3D": 10,
		"angle": 30,
	    "chartCursor": {
	        "categoryBalloonEnabled": false,
	        "cursorAlpha": 0,
	        "zoomable": false
	    },

	    "chartScrollbar": {
	    	"oppositeAxis":false,
	         "scrollbarHeight":2,
	        "offset":10,
	        "backgroundAlpha":0.1,
	        "backgroundColor":"#888888",
	        "selectedBackgroundColor":"#67b7dc",
	        "selectedBackgroundAlpha":1,
	        "dragIconHeight":20,
	        "dragIconWidth":20
	    },
	    "categoryField": "title",
	    
	    "categoryAxis": {
	        "gridPosition": "start",
	        "axisAlpha":0.6,
	        "gridAlpha":0.1,
	        "title": text,
	        "labelsEnabled":text=="Total"?true:false

	    },
	    "columnSpacing": 0,
	  
	    "export": {
	    	"enabled": true
	     }

	}, 0);
	
	
	}
	
	
}