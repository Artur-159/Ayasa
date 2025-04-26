//close all collapsable elements with outside click
const closeAllMenues = (evt) => {

	$('.drop_btn').parent().removeClass('opened');
	$('.drop_block').slideUp(300);

	if($('.search_block').data('type') && $('.search_block').data('type') == 'close') {
		$('.search_block').removeClass('opened');
	}

	if(isTouchDevice() && window.innerWidth > $mobileSize) {
		$('.header .main_menu li').removeClass('opened');
		$('.header .submenu_list').fadeOut(300);
	}
}

const ignorBodyClick = (evt) => {
	evt.stopPropagation();
}

const ignorMobileBodyClick = (evt) => {
	if (window.innerWidth <= $mobileSize) {
		evt.stopPropagation();
	}
}

const dropList = (dropButton, dropList, dropItem, dropElement) => {
           
    if(dropButton.parents(dropItem).hasClass('opened')) {
        dropButton.parents(dropItem).removeClass('opened').find(dropElement).slideUp(300);
    } else {
        dropButton.parents(dropList).find('.opened').removeClass('opened');
        dropButton.parents(dropList).find(dropElement).slideUp(300);
        dropButton.parents(dropItem).addClass('opened').find(dropElement).stop(true,true).slideDown(300);
        setTimeout(() => {
            if($(dropList).find('.opened').length > 0) {
                if(dropButton.parents(dropItem).offset().top < $(document).scrollTop()) {
                    $('body,html').animate({scrollTop:dropButton.parents(dropItem).offset().top},300);
                }
            }
        },300)
    }

};



const detectContentHeight = () => {
	let footerHeight = $('.footer').length > 0 ? $('.footer').height() : 0;
	let headerHeight = $('.header').length > 0  && $('.header').css('position') != 'fixed' ? $('.header').height() : 0;
	let freeSpace = window.innerHeight - footerHeight - headerHeight;
	if (freeSpace > 0) {
		$('.content').css('min-height',freeSpace);
	} else {
		$('.content').css('min-height',0);
	};
	$('.footer').css('opacity',1);
}



const toggleSearch = (evt) => {
	if(!$('.search_block').hasClass('opened')) {
		evt.preventDefault();
		closeAllMenues(evt);
		evt.stopPropagation();
		$('.search_block').addClass('opened').find('input').focus();
	} else if(!$('.search_block input').val()) {
		$('.search_block input').focus();
		evt.preventDefault();
	} else {
		evt.stopPropagation();
	}
}

const focusEmptySearch = (evt) => {
	if(!$('.search_block input').val()) {
		evt.preventDefault();
		$('.search_block input').focus();
	}
}

const checkFields = () => {
	$(document).on('change','form input',(e) => {
		let $this = $(e.target);
        if ($this.val().length > 0) {
            $this.parents('.field_block').addClass('filled').find('.individual_hint').show();
            $this.parents('.field_block').find('.standard_hint').hide();
        } else {
            $this.parents('.field_block').removeClass('filled').find('.individual_hint').hide();
            $this.parents('.field_block').find('.standard_hint').show();
        };

		if($('.confirm_field').length > 0) {
            $('.confirm_field').on('keyup change', (i, item) => {
				let $field = $(item);
                if($field.val() == $field.parents('form').find('.password_field').val()) {
                    $field.parent().removeClass('has-error');
                    passwordConfirm = true;
                }
            })
        }
    }).trigger('change');
}

const checkPassConfirm = () => {
    let passValue = $('.confirm_field').parents('form').find('.password_field').val();
    let passConfirm = $('.confirm_field').val();
    if(passValue && passValue != passConfirm && $('.pass_fields').css('display') != "none") {
        $('.confirm_field').parent().addClass('has-error');
        passwordConfirm = null;
    } else {
        passwordConfirm = true;
    }
}

const checkForm = (e) => {
    let $button = $(e.currentTarget);
    if($button.parents('form').find('.confirm_field').length > 0) {
        checkPassConfirm();
    } else {
        passwordConfirm = true;
    }
    $.validate({
        scrollToTopOnError: false,
        onError: () => {
            if ($button.parents('form').hasClass('login_form') || $button.parents('form').hasClass('register_form')) {

                $('.has-error').each((i, item) => {
                    let errorInputType = $(item).find('input').attr('type');
                    $('input[type="'+errorInputType+'"]').parents('.general_field').addClass('has-error');
                });
            };
        },
        onSuccess: () => {
            if(!passwordConfirm) {
                return false;
            }
        }
        
    });
    setTimeout(() => {
        if($button.hasClass('checkout_submit') && $('.has-error').length > 0) {
            $('body, html').animate({scrollTop: $('.has-error').eq(0).offset().top - $('.header').height()},1000);
        }
    },100)

  
};

const dropToggle = (evt) => {
	evt.preventDefault();
	let $this = $(evt.currentTarget);
	if(!$this.parent().hasClass('opened')) {
		closeAllMenues(evt);
		evt.stopPropagation();
		$this.parent().addClass('opened').find('.drop_block').stop(true,true).slideDown(300);
	}
};





const mouseLeaveItem = (e) => {
	$(e.currentTarget).parents('li').removeClass('hovered');
}

const closeSubWithHover = (e) => {
	if (!isTouchDevice()) {
		$(e.currentTarget).removeClass('opened').children('.submenu_list').fadeOut(300);
	}
}

const comboHover = ($link,$block) => {
	$link.hover((e) => {
		$(e.currentTarget).parents($block).addClass('hovered');
	}, (e) => {
		$(e.currentTarget).parents($block).removeClass('hovered');
	})
}

const tabSwitch = (e) => {
	e.preventDefault();
	let $this = $(e.currentTarget);
	if(!$this.hasClass('selected')) {
		$this.parents('.tab_btns').find('button').removeClass('selected');
		$this.parents('.tab_btns').next('.tabs_container').children('.tab_block').removeClass('selected');
		$this.addClass('selected');
		$('.tab_block.'+$this.data('tab')).addClass('selected');
	}
}

const goToTarget = (e)  =>{
    let endPoint = $(e.currentTarget).data('endpoint');
    $('html,body').animate({scrollTop: $('[data-target="'+endPoint+'"]').offset().top - $('.header_inner').height()},500);
    if($('[data-target="'+endPoint+'"]').parent().hasClass('tab_buttons')) {
        $('[data-target="'+endPoint+'"]').trigger('click');
    }
}

const openPopup = (evt) => {
    evt.preventDefault();
	
    body.addClass('popup_opened');
    let popupName = '.' + $(evt.currentTarget).data('popup') + '_popup';
	let popupTemplate =  '.' + $(evt.currentTarget).data('popup') + '_template';
	let popupCreateTime = 0;
	if($(popupName).length < 1) {
		popupCreateTime = 300;
		body.append($(popupTemplate).html());
	}
	setTimeout(()=> {
		$(popupName).addClass('showed');
		if($(popupName).find('form').length > 0) {
			checkFields();
		}
	}, popupCreateTime)
}

const closePopup = () => {
    body.removeClass('popup_opened');
    $('.popup_block').removeClass('showed');
}

const changeCount = (countBlock, decreaseBtn, increaseBtn, countInput) => {
	
	$(countInput).each((i, item) => {
		let maxValue = $(item).data('max') ? $(item).data('max') : Math.pow(10,$(item).attr('maxlength')) - 1;
		if($(item).val() == 1) {
			$(item).parents(countBlock).find(decreaseBtn).addClass('inactive');
		} else if ($(item).val() == maxValue) {
			$(item).parents(countBlock).find(increaseBtn).addClass('inactive');
		}
	});

	$(document).on('change',countInput,(e) => {
		let $this = $(e.currentTarget);
		let thisDecrease = $this.parents(countBlock).find(decreaseBtn);
		let thisIncrease = $this.parents(countBlock).find(increaseBtn);
		let maxValue = $this.data('max') ? $this.data('max') : Math.pow(10,$this.attr('maxlength')) - 1;
		if($this.val() <= 1) {
			$this.val(1);
			thisDecrease.addClass('inactive');
			thisIncrease.removeClass('inactive');
		} else if ($this.val() >= maxValue) {
			$this.val(maxValue);
			thisIncrease.addClass('inactive');
			thisDecrease.removeClass('inactive');
		} else {
			thisIncrease.removeClass('inactive');
			thisDecrease.removeClass('inactive');
		}
	})

	$(document).on('click',decreaseBtn,(e) => {
		let $this = $(e.currentTarget);
		let thisInput = $this.parent().find('input');
		let thisIncrease = $this.parent().find(increaseBtn);
		let _value = thisInput.val();
		thisIncrease.removeClass('inactive');
		if(_value > 1) {
			_value--;
			thisInput.val(_value);
		}
		if(_value == 1) {
			$this.addClass('inactive');
		}
	});

	$(document).on('click',increaseBtn,(e) => {
		let $this = $(e.currentTarget);
		let thisInput = $this.parent().find('input');
		let thisDecrease = $this.parent().find(decreaseBtn);
		let _value = thisInput.val();
		let maxValue = thisInput.data('max') ? thisInput.data('max') : Math.pow(10,thisInput.attr('maxlength')) - 1;
		thisDecrease.removeClass('inactive');
		if(_value < maxValue) {
			_value++;
			thisInput.val(_value);
		} 
		if(_value == maxValue) {
			$this.addClass('inactive');
		}
	});
}

const initDatePicker = ($dateInput) => {
	let daysList =  {
		"en": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
		"am": ["Կի", "Եկ", "Եք", "Չո", "Հի", "Ու", "Շա"],
		"ru": ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
	};

	let monthsList = {
		"en": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		"am": ["Հունվար", "Փետրվար", "Մարտ", "Ապրիլ", "Մայիս", "Հունիս", "Հուլիս", "Օգոստոս", "Սեպտեմբեր", "Հոկտեմբեր", "Նոյեմբեր", "Դեկտեմբեր"],
		"ru": ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
	};

	let rangesList = {
		"en": ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "This Month", "Last Month"],
		"am": ["Այսօր", "Երեկ", "Վերջին 7 օր", "Վերջին 30 օր", "Այս ամիս", "Վերջին ամիս"],
		"ru": ["Сегодня", "Вчера", "Последние 7 дней", "Последние 30 дней", "Этот месяц", "Последний месяц"]
	}

	let cancelBtnLabel = {
		"en": "From Beginning",
		"ru": "С начала",
		"am": "Սկզբից"
	};

	$dateInput.each((i, item) => {
		let $parrent = $(item).parent();
		let $dateInput = $(item);
		let $dateFormat = $dateInput.data('format') ? $dateInput.data('format') : 'DDDD.MM.YY';
		let $dateLg = $dateInput.data('lg') ? $dateInput.data('lg') : 'en';
		let $autoUpdate = $dateInput.data('update') ? true : false;
		let $dateRanges = $dateInput.data('ranges') ? {
			[rangesList[$dateLg][0]] : [moment(), moment()],
			[rangesList[$dateLg][1]] : [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
			[rangesList[$dateLg][2]] : [moment().subtract(6, 'days'), moment()],
			[rangesList[$dateLg][3]] : [moment().subtract(29, 'days'), moment()],
			[rangesList[$dateLg][4]] : [moment().startOf('month'), moment().endOf('month')],
			[rangesList[$dateLg][5]] : [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
		} : null;


		$dateInput.daterangepicker({
			opens: 'left',
			autoUpdateInput: $autoUpdate,
			maxDate: new Date(),
			parentEl: $parrent,
			autoApply: true,
			alwaysShowCalendars: true,
			showCustomRangeLabel: false,
			locale: {
				format: $dateFormat,
				daysOfWeek: daysList[$dateLg],
				monthNames: monthsList[$dateLg],
				cancelLabel: cancelBtnLabel[$dateLg]
			},
			ranges: $dateRanges,
			onSelect: (arg) => {
				$dateInput.val($dateInput.attr("placeholder") + arg);
			},
	
		}, (chosen_date, end) => {
			$dateInput.val(chosen_date.format($dateFormat) + " - " + end.format($dateFormat));
		});
	});


	$dateInput.on('cancel.daterangepicker',(ev, picker) => {
		$(ev.currentTarget).val('');
	});
}

const activateYTVideo = ($videoBlock) => {
	let $videoSrc = $videoBlock.data('video');
	let $videoId = $videoBlock.attr('id');
	let $videoContainer = $videoBlock.parents('.video_block');
	let $videoBtn = $videoContainer.find('.video_btn');
	var player;

	function onYouTubeIframeAPIReady() {
		player = new YT.Player($videoId, {
			height: '100%',
			width: '100%',
			videoId: $videoSrc,
			playerVars: {
				'playsinline': 1
			},
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	};

	function onPlayerReady(event) {
		$videoContainer.addClass('ready');
    }

	function onPlayerStateChange(event) {

		if (event.data == YT.PlayerState.PLAYING) {
			$videoContainer.addClass('playing').removeClass('loading')

		} else if (event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.ENDED) {
			$videoContainer.removeClass('playing');
		}
	}

	onYouTubeIframeAPIReady();

	const playVideo = () => {

		setTimeout(() => {
			if($videoContainer.hasClass('ready') ) {
				player.playVideo();
			} else {
				$videoContainer.addClass('loading');
				playVideo();
			}
		},100)
	}

	$videoBtn.click(playVideo);
}

// $(document).ready(() => {
// 	//detect device type
	

// 	//close dropdowns with outside click
// 	body.click(closeAllMenues);

// 	//opening/closing mobile menu
// 	$('.menu_btn').click(mobMenuTrigger);
// 	$('.header .submenu_btn').hover(openSubWithHover, mouseLeaveItem);
// 	$('.header .main_menu li').hover(() =>{}, closeSubWithHover);


// 	// form front validation
// 	if($('.validate_btn').length > 0) {
// 		checkFields();
// 	};	

// 	$(document).on('click','.validate_btn', checkForm);

// 	//drop element open close
// 	$('.drop_btn').click(dropToggle);

// 	//hidden search open/close
// 	$('.search_block button[type="submit"]').click((evt) => {
// 		if($('.search_block').data('type') && $('.search_block').data('type') == 'close') {
// 			toggleSearch(evt);
// 		} else {
// 			focusEmptySearch(evt);
// 		}
// 	});

// 	$('.search_block input').click((evt) => {
// 		if($('.search_block').data('type') && $('.search_block').data('type') == 'close') {
// 			ignorBodyClick(evt);
// 		}
// 	});

// 	//tab functionality
// 	$('.tab_btns button').click(tabSwitch);
// });

// $(window).on('load',() => {
// 	$(window).resize(() => {
// 		//detect content min height and show footer 
// 		detectContentHeight();

// 	}).trigger('resize');
// })