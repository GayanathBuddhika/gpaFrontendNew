	function phoneVali(res,th)
	{
		var findFirstNo=parseInt(res.substring(0,1))


		if(findFirstNo==0) {
			var phoneValidate = /[0-9-()+]{10,10}/;
			th.removeAttr("maxlength").attr("maxlength", "10")
		}
		else
		{
			var phoneValidate = /[0-9-()+]{9,9}/;
			th.removeAttr("maxlength").attr("maxlength","9")
		}


		var x=phoneValidate.test(res);
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}	
		
		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}

	function nameVali(res,th)
	{
		var nameValidate=/^[a-zA-Z ]{1,50}$/;
		var x=nameValidate.test(res);
			
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}

		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}

	function emailVali(res,th)
	{
			
		var emailValidate=/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		var x=emailValidate.test(res);
		
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}	
		
		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}
	
	function integerVali(res,th)
	{
		var intValidate=/^\d+$/;
		var x=intValidate.test(res);
			
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}

		if(res.length==0)
			th.next().find('i').removeAttr('class')
			
	}
	
	function usernameVali(res,th)
	{
		var usernameValidate=/^[a-z0-9_-]{4,16}$/;
		var x=usernameValidate.test(res);
			
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}

		if(res.length==0)
			th.next().find('i').removeAttr('class')
			
	}
	
	function passwordVali(res,th)
	{
		var passwordValidate=/^[a-zA-Z0-9_-]{6,18}$/;
		var x=passwordValidate.test(res);
			
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}

		if(res.length==0)
			th.next().find('i').removeAttr('class')
			
	}
	
	function reTypePasswordVali(res,th,repass)
	{
		
		if(res==repass)
		{
			x=true;
		}
		else
		{
			x=false;
		}
			
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}

		if(res.length==0)
			th.next().find('i').removeAttr('class')
			
	}
	
	function nicVali(res,th)
	{
		var nicValidate = /^[0-9]{9}[v|V|x|X]$/;
		var x=nicValidate.test(res);	
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}	
		
		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}
	
	function imageVali(res,th)
	{
		var imageValidate = /^.*\.(jpg|jpeg|png|gif)$/;
		var x=imageValidate.test(res);	
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}	
		
		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}
	
	
	function webVali(res,th)
	{
		var webValidate = /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/;
		var x=webValidate.test(res);	
		if(x)
		{			
			th.next().find('i').removeClass('glyphicon glyphicon-remove').addClass('glyphicon glyphicon-ok')
		}
		else
		{
			th.next().find('i').removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-remove')	
		}	
		
		if(res.length==0)
			th.next().find('i').removeAttr('class')
	}
	
	function checkVali()
	{
		var check=false;
		$('i').each(function()
		{
			var res=$(this).hasClass('glyphicon-remove');
			
			if(res)
			check=true;
		});
		
		return check;
		
	}
	
	
	function removeIcon()
	{
		var check=false;
		$('i').each(function()
		{
			var res=$(this).hasClass('glyphicon-ok') | $(this).hasClass('glyphicon-remove');
			
			if(res)
			$(this).removeClass('glyphicon glyphicon-ok') | $(this).removeClass('glyphicon-remove')
		});
		
		return check;
		
	}
	
	
	
	function ageVali(dateString) 
	{
	    var today = new Date();
	    var birthDate = new Date(dateString);
	    var age = today.getFullYear() - birthDate.getFullYear();
	    var m = today.getMonth() - birthDate.getMonth();
	    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
	    {
	        age--;
	    }
	    
	  
	    if(age>=18)
	    	return true;
	    else
	    	return false;
	}
	
	
	//loader
	$(window).on('load',function() {
		// Animate loader off screen
		$(".se-pre-con").fadeOut("slow");;
	});
	
	
	
	 $(window).keydown(function(event){
		    if( (event.keyCode == 13)) {
		      event.preventDefault();
		      return false;
		    }
		  });
	 
	 
	 $(document).ready(function(){
		 $('input[type=reset]').click(function(){
			 $('#addUser')[0].reset();
		 })
	 })
	
	

