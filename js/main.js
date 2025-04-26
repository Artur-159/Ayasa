import { closeAllMenues, getElement, $body, $html, $, $$, showDropBlock, validateBtn, getSources, docReady, callPopup } from "./imports/utils.js";

const body = getElement('body'); //body as clickable element

const defaultLg = $html.getAttribute('data-defaultlang');
console.log(defaultLg);

let $language = null;
const lgList = getElement('.lg_list');

const getLanguage = () => {

	if (window.location.hash) {

		$language = window.location.hash.toString().replace('#', '');
	} else {
		$language = defaultLg;
		window.location.hash = defaultLg;
	}

	$('.lg_list  a[data-lg="' + $language + '"]').click();
};


const changeLanguage = (e) => {
	e.preventDefault();
	const $lgBtn = e.target;
	if ($lgBtn.tagName === 'A' && !$lgBtn.classList.contains('current')) {
		if ($$('.lg_list .current').length > 0) {
			$('.lg_list .current').classList.remove('current');
		}
		$lgBtn.classList.add('current');
		$language = $lgBtn.getAttribute('data-lg');
		window.location.hash = $language;
		$html.setAttribute('lang', $language);
		getSources();
	}
}

//web/touch detect function
const isTouchDevice = () => {
	return 'ontouchstart' in document.documentElement;
};


//viewport meta change function for ios devices during touch and focusout fields with small font sizes
const changeIosMeta = () => {
	const fields = $$('input, textarea');
	if (body.classList.contains('ios_device') && fields.length > 0) {

		const viewPortMeta = $('meta[name="viewport"]'); //viewport meta
		const standardMeta = "width=device-width, initial-scale=1.0, minimum-scale=1.0, viewport-fit=cover"; //viewport meta content standard value
		const unScaleMeta = "width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover"; //viewport meta content unscaleable value for ios devices with fields with small font sizes
		let metaChange = null; //meta content value change indicator

		fields.forEach((field) => {
			const fieldFontSize = parseFloat(window.getComputedStyle(field).fontSize);
			if (fieldFontSize < 16) {
				field.addEventListener('touchstart', () => {
					if (metaChange) {
						clearTimeout(metaChange);
					}

					viewPortMeta.content = unScaleMeta;
				});

				field.addEventListener('focusout', () => {
					if (metaChange) {
						clearTimeout(metaChange);
					}
					metaChange = setTimeout(() => {
						viewPortMeta.content = standardMeta;
					}, 300)
				})
			}
		})
	}
}


const openPopup = (evt) => {
	evt.preventDefault();
	document.body.classList.add('popup_opened');
	let popupName = '.' + evt.currentTarget.getAttribute('data-popup') + '_popup';
	let popupTemplate = '.' + evt.currentTarget.getAttribute('data-popup') + '_template';
	let popupContent = evt.currentTarget.getAttribute('data-content') || null;
	let popupCreateTime = 0;

	if (document.querySelectorAll(popupName).length < 1) {
		popupCreateTime = 300;
		document.body.insertAdjacentHTML('beforeend', document.querySelector(popupTemplate).innerHTML);

		if (document.querySelectorAll('.city_select').length > 0) {
			selectElements(popupContent);
		}

		if (document.querySelectorAll('#date_picker').length > 0) {
			dataPicker();
		}
	}


	setTimeout(() => {
		let $popup = document.querySelector(popupName);

		$popup.classList.add('showed');

		let formInPopup = $popup.querySelector('form');
		if (formInPopup) {
			validateBtn();
		}

		if (popupContent) {
			let $content = $popup.querySelector('.popup_content[data-content="' + popupContent + '"]');
			if ($content && !$content.classList.contains('active') || $popup.querySelector('.popup_content')) {
				$popup.querySelectorAll('.popup_content').forEach(content => {
					content.classList.remove('active');
				});
				$content.classList.add('active');

			}
		}
	}, popupCreateTime);
	getSources()
};

const closePopup = () => {
	document.body.classList.remove('popup_opened');
	let popupBlocks = document.querySelectorAll('.popup_block');
	popupBlocks.forEach((popupBlock) => {
		popupBlock.classList.remove('showed');
	});
};

document.addEventListener('click', (e) => {
	if (e.target.classList.contains('popup_close')) {
		closePopup();
	}
})


let popupBtns = document.querySelectorAll('.popup_btn');
popupBtns.forEach((btn) => {
	btn.addEventListener('click', openPopup);
});


// device type and ios detect function;
const detectDevice = () => {

	//detect ios device or not
	if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
		$body.classList.add('ios_device');
	};

	//detect touch device or not
	if (isTouchDevice()) {
		$html.classList.add('touch');

		changeIosMeta();

	} else {
		$html.classList.add('web');
	}
}

//device call posibillity detect function
const detectCallPosibillity = () => {
	const phoneLink = $$('[href*="tel:"]');
	if (phoneLink.length > 0 && !/Android|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
		phoneLink.forEach((link, index) => {
			link.removeAttribute('href');
		})
	}
}

const detectContentHeight = () => {
	let footerHeight = $$('.footer').length > 0 ? parseFloat(window.getComputedStyle($('.footer')).height) : 0;
	let headerHeight = $$('.header').length > 0 && $('.header').style.position != 'fixed' ? parseFloat(window.getComputedStyle($('.header')).height) : 0;

	let freeSpace = window.innerHeight - Math.round(footerHeight) - Math.round(headerHeight) - 1;
	if (freeSpace > 0) {
		$('.content').style.minHeight = freeSpace + 'px';
	} else {
		$('.content').style.minHeight = null;
	};
	$('.footer').style.opacity = 1;
}


//group all global functions in one function for exporting
const initGlobalFunctions = () => {
	detectDevice();
	detectCallPosibillity();


	body.onClick(closeAllMenues);

}


docReady(() => {
	lgList.onClick(changeLanguage);
	getLanguage();
})

window.addEventListener('load', () => {
	detectContentHeight();

	document.addEventListener('click', (e) => {
		if (e.target.classList.contains('message_remove')) {
			fadeOut($('.message_block'));
			setTimeout(() => {
				$('.message_block').remove();
			}, 300)
		} else if (e.target.classList.contains('popup_btn')) {
			e.preventDefault();
			const popupId = e.target.getAttribute('data-popup');
			callPopup(popupId);
		} else if (e.target.classList.contains('popup_close')) {
			closePopup();
		}
	});

	setTimeout(function () {
		const headerDropBtn = getElement('.lg_list');
		headerDropBtn.addEventListener('click', showDropBlock);

	},300)
})

export {
	initGlobalFunctions,
	detectContentHeight,
	$language
}