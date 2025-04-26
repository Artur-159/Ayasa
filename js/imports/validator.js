function validateInputs(form){
	var inputs = form.querySelectorAll('[data-validation]');
	var valid = [];
	var radioCheck = false;
	var checkboxCheck = false;
	inputs.forEach(function(i,j){
		if(i.getAttribute('type')){
			var checkAttr = i.getAttribute('data-validation');
		}else{
			var checkAttr = i.tagName;
		}
		
		switch(checkAttr){
			case 'radio':
				if(!radioCheck){
					if(!i.checked){
						// i.parentNode.classList.add("error");
						radioCheck = false;
					}else{
						// i.parentNode.classList.remove("error");
						radioCheck = true;
					}
				}
			break;
			case 'checkbox':
				if(!checkboxCheck){
					if(!i.checked){
						i.parentNode.classList.add("error");
						checkboxCheck = false;
					}else{
						i.parentNode.classList.remove("error");
						checkboxCheck = true;
					}
				}
				
			break;
			case 'required':
			    var _thisVal = i.value;
				if(i.getAttribute('data-name') == 'name'){
					if(!isNaN(i.value)){
						_thisVal = '';
					}
				}
				if(_thisVal==''){
					i.parentNode.classList.add("error");
					valid.push(i.getAttribute('name'));
				}else{
					i.parentNode.classList.remove("error");
				}
				if(i.getAttribute('type') == 'checkbox') {
					if(!checkboxCheck){
						if(!i.checked){
							i.parentNode.classList.add("error");
							valid.push(i.getAttribute('name'));
							checkboxCheck = false;
						}else{
							i.parentNode.classList.remove("error");
							checkboxCheck = true;
						}
					}
				}
			break;
			case 'tel':
				if(i.value=='' || isNaN(i.value)){
					i.parentNode.classList.add("error");
					valid.push(i.getAttribute('name'));
				}else{
					i.parentNode.classList.remove("error");
				}
			break;
			case 'email':
				var regEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
				if(i.value=='' || !regEmail.test(i.value)){
					i.parentNode.classList.add("error");
					valid.push(i.getAttribute('name'));
				}else{
					i.parentNode.classList.remove("error");
				}
			break;
			case 'select':
				if(i[select.selectedIndex].value==''){
					i.parentNode.classList.add("error");
					valid.push(i.getAttribute('name'));
				}else{
					i.parentNode.classList.remove("error");
				}
			break;
			default:
				if(i.value==''){
					i.parentNode.classList.add("error");
					valid.push(i.getAttribute('name'));
				}else{
					i.parentNode.classList.remove("error");
				}
			break;
		}
	});


	if(valid.length>0){
		return false;
	}else{
		return true;
	}
	
}

export {
    validateInputs
}
