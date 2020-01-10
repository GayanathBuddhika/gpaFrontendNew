function dailyTitleAvg(divId,title,result){

	
	
	
	var dataTitle = new Array(); 


	for(var i=0;i<title.length;i++){
		dataTitle.push(
				{	        
			        "balloon":{
			          "drop":false,
			          "adjustBorderColor":false,
			          "color":"#ffffff"
			        },
			        "bullet": "round",
			        "bulletBorderAlpha": 1,
			        "bulletColor": "#FFFFFF",
			        "bulletSize": 5,
			        "hideBulletsCount": 50,
			        "lineThickness": 2,
			    //    "type": "smoothedLine",
			        "title": title[i].noDuplicateTitle,
			        "useLineColorForBulletBorder": true,
			        "valueField": title[i].noDuplicateTitle,
			        "balloonText": "<span style='font-size:18px;'>[[value]] % "+title[i].noDuplicateTitle+"</span>"
			    })
	}



	var chart = AmCharts.makeChart(divId, {
	    "type": "serial",
	    "theme": "light",
	    "legend": {
	        "useGraphSettings": true
	    },
	    "marginRight": 40,
	    "marginLeft": 40,
	    "autoMarginOffset": 20,
	    "mouseWheelZoomEnabled":false,
	    "dataDateFormat": "YYYY-MM-DD",
	    "valueAxes": [{
	        "id": "v1",
	        "axisAlpha": 0,
	        "position": "left",
	        "ignoreAxisWidth":true,
	        "maximum": 100,
	        "title": "Average"
	    }],
	    "balloon": {
	        "borderThickness": 1,
	        "shadowAlpha": 0
	    },
	    "graphs": dataTitle,
	    "chartScrollbar": {
	        "graph": "g1",
	        "oppositeAxis":false,
	        "offset":30,
	        "scrollbarHeight": 80,
	        "backgroundAlpha": 0,
	        "selectedBackgroundAlpha": 0.1,
	        "selectedBackgroundColor": "#888888",
	        "graphFillAlpha": 0,
	        "graphLineAlpha": 0.5,
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
	    "categoryField": "year",
	    "categoryAxis": {
	    	"parseDates": true,
	        "dashLength": 1,
	        "minorGridEnabled": true,
	        "title":"Date"
	    },
	    "export": {
	        "enabled": true
	    },
	    "dataProvider":JSON.parse(result)
	});

	
	/*chart.addListener("rendered", zoomChart);

	zoomChart();*/

	
}