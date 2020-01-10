
	$(document).on('input', '#sliderRanger', function() {
var lips = document.getElementById('lips');

 var sliderVal = $(this).val(),
        rotateDegree =  180+1*(sliderVal * 1.8);
    lips.style.webkitTransform = "rotateX(" + rotateDegree + "deg)";
    lips.style.transform = "rotateX(" + rotateDegree+ "deg)";



    //$('#slider_value').html( $(this).val() );
});

