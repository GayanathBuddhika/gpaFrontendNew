function noOfResponseGraph(divId,data){
	

	var chart = AmCharts.makeChart(divId, {
	    "type": "serial",
	    "theme": "light",
	    "marginRight": 10,
	    "marginLeft": 10,
	    "autoMarginOffset": 10,
	    "mouseWheelZoomEnabled":false,
	    "dataDateFormat": "YYYY-MM-DD",
	    "valueAxes": [{
	        "id": "v1",
	        "axisAlpha": 0,
	        "position": "left",
	        "ignoreAxisWidth":true,
	        "title": "Count"
	    }],
	    "balloon": {
	        "borderThickness": 1,
	        "shadowAlpha": 0
	    },
	    "graphs": [{
	        "id": "g1",
	        "balloon":{
	          "drop":true,
	          "adjustBorderColor":false,
	          "color":"#ffffff"
	        },
	        "bullet": "round",
	        "bulletBorderAlpha": 1,
	        "bulletColor": "#FFFFFF",
	        "bulletSize": 5,
	        "hideBulletsCount": 50,
	        "lineThickness": 2,
	        "title": "red line",
	        "useLineColorForBulletBorder": true,
	        "valueField": "count",
	        "balloonText": "<span style='font-size:18px;'>[[value]]</span>"
	    }],
	    "chartScrollbar": {
	        "graph": "g1",
	        "oppositeAxis":false,
	        "offset":30,
	        "scrollbarHeight": 80,
	        "backgroundAlpha": 0,
	        "selectedBackgroundAlpha": 0.1,
	        "selectedBackgroundColor": "#888888",
	        "graphFillAlpha": 0,
	        "graphLineAlpha": 1,
	        "selectedGraphFillAlpha": 0,
	        "selectedGraphLineAlpha": 1,
	        "autoGridCount":true,
	        "color":"#AAAAAA"
	    },
	    "chartCursor": {
	        "pan": true,
	        "valueLineEnabled": true,
	        "valueLineBalloonEnabled": true,
	        "cursorAlpha":1,
	        "cursorColor":"#258cbb",
	        "limitToGraph":"g1",
	        "valueLineAlpha":0.2,
	        "valueZoomable":true
	    },
	    "valueScrollbar":{
	      "oppositeAxis":false,
	      "offset":50,
	      "scrollbarHeight":10
	    },
	    "categoryField": "dateTime",
	    "categoryAxis": {
	        "parseDates": true,
	        "dashLength": 1,
	        "minorGridEnabled": true,
	        "title":"Date"
	    },
	    "export": {
	        "enabled": true
	    },
	    "dataProvider": JSON.parse(data)
	}); 
}