function DoughnutDataAdd(id,data,text){		
	
			var indi=data.indi;
			var diff=data.val;
			var avg=data.avg;
	
			
			var smallDoughnutData = [
				{value:avg,color: avg>=75?"#05c085":avg>=50?"#2194af":avg>=25?"#f7b82a":"#ed3436"},
				{value:100-avg,color:"#dce0df"}
			];

			$("#"+id).doughnutit({
				dnData: smallDoughnutData,
			    dnSize: 130,
			    dnInnerCutout: 60,
			    dnAnimation: true,
				dnAnimationSteps: 60,
				dnAnimationEasing: 'linear',
				dnStroke: true,
				dnShowText: true,
				dnFontSize: '24px',
				dnFontOffset: 18,
				//dnFontColor: "#819596",
				dnFontColor: "Black",
				dnText: avg +"%",
				dnStartAngle: 90,
				dnFontStyle: 'bold',
				dnCounterClockwise: false,
				/*dnRightCanvas: {
					rcRadius: 5,
					rcPreMargin: 20,
					rcMargin: 20,
					rcHeight: 40,
					rcOffset: 5,
					rcLineWidth: 85,
					rcSphereColor: '#819596',
					rcSphereStroke: '#819596',				
					rcTop:{
						rcTopLineColor: '#819596',
						rcTopDashLine: 0,
						rcTopFontSize: '13px',
						rcStrokeWidth: 1,
	
						rcTopPreMargin: 20,
			        	rcTopMargin: 20,
			        	rcTopHeight: 40,
			        	rcTopLineWidth: 85,
	
						rctAbove: {						
							rctText: 'AVERAGE',
							rctOffset: 2,
							rctImageOffsetRight: 5,
							rctImageOffsetBottom: 0,
							rctFontColor: "#229596",
							rctFontStyle: 'bold',
						 //rctImage: '/pulseBeatMaster/static/img/downUp/a.png',
						},
						rctBelow: {
							rctText: avg,
							rctFontSize: '35px',
							rctFontStyle: 'bold',
							rctOffset: 2,
							rctImageOffsetRight: 5,
							rctImageOffsetBottom: 0,
							rctFontColor: "red",
							// rctImage: '/pulseBeatMaster/static/img/downUp/a.png'
						}		        	
					},
					rcBottom:{					
						rcBottomDashLine: 0,
						rcBottomFontSize: '15px',
						rcBottomLineColor: '#819596',
						rcStrokeWidth: 1,
	
						rcBottomPreMargin: 20,
			        	rcBottomMargin: 20,
			        	rcBottomHeight: 30,
			        	rcBottomLineWidth: 85,
	
						rcbAbove: {
							// rcbImage: 'calendar.png',
							rcbImageOffsetBottom: 0,
							rcbImageOffsetRight: 5,
							rcbText: text=="Total"?"Survey":'Indicator',
							rcbFontSize: '13px',
							rcbOffset: 2
						},
						rcbBelow: {
							rcbImage: 'calendar.png',
							rcbImageOffsetRight: 5,
							rcbImageOffsetBottom: 0,
							rcbText: text=="Total"?"Live processing": indi=="down"?diff+" %":diff+" %",
							rcbOffset: 5,
							rcbFontColor:  indi=="down"?"red":"green",
						}		        	
					}
				}*/
			});// End Doughnut
			
		}

