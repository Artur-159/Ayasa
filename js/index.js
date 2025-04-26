import { docReady, slideDown, slideUp, openPopupByBtn, cachedData, scrollPage} from "./imports/utils.js";
import { initGlobalFunctions, $language } from "./main.js";



var toggleLinks = document.querySelectorAll(".service_section .toggle_link");

toggleLinks.forEach(function (toggleLink) {
    toggleLink.addEventListener("click", function (e) {
        e.preventDefault();

        var currentSection = toggleLink.closest(".service_section");
        var serviceBlock = currentSection.querySelector(".service_block");
        var allToggleLinks = currentSection.querySelectorAll(".toggle_link");

        // Close other open sections
        document.querySelectorAll(".service_section.show").forEach(section => {
            if (section !== currentSection) {
                section.classList.remove("show");
                slideUp(section.querySelector(".service_block"));
            }
        });

        // Toggle current section
        if (currentSection.classList.toggle("show")) {
            allToggleLinks.forEach(function(link) {
                link.textContent = cachedData[$language].show_less;
            });
            slideDown(serviceBlock);
        } else {
            allToggleLinks.forEach(function(link) {
                link.textContent = cachedData[$language].show_more;
            });
            slideUp(serviceBlock);
            if(window.innerWidth < 576) {
                if(!document.querySelectorAll(".service_section.show").length > 0){
                    setTimeout(function(){
                        currentSection.scrollIntoView({ behavior: 'smooth'});
                    },300)
                }
            }
        }
    });
});




let swiperInstance = null;

function initSwiper() {
    const screenWidth = window.innerWidth;

    if (screenWidth < 1024) {
        if (!swiperInstance) { 
            swiperInstance = new Swiper(".blocks_section .swiper-container", {
                slidesPerView: 1.1,
				breakpoints: {
					1200: {
						slidesPerView: 3.1,
					},
					1024: {
						slidesPerView: 1.1,
					},
					576: {
						slidesPerView: 2.1,
					},
				},
            });
        }
    } else {
        if (swiperInstance) { 
            swiperInstance.destroy(true, true);
            swiperInstance = null;
        }
    }
}




// Run the function on window resize
window.addEventListener('resize', initSwiper);



docReady(() => {
	initGlobalFunctions();
	scrollPage(initSwiper)

	let popupBtns = document.querySelectorAll('.popup_btn');

	popupBtns.forEach((btn) => {
		btn.addEventListener('click', openPopupByBtn);
	
	});
})
