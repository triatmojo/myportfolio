/* ----------------------- navigation menu ---------------------- */
(() => {
    const hamburgerBtn = document.querySelector('.hamburger-btn'),
        navMenu = document.querySelector('.nav-menu'),
        closeNav = navMenu.querySelector('.close-nav-menu');

    hamburgerBtn.addEventListener('click', showNavMenu);
    closeNav.addEventListener('click', hideMenu);
    
    function showNavMenu() {
        navMenu.classList.add('open');
        bodyScrollingToggle();
    }
    function hideMenu() {
        navMenu.classList.remove('open');
        fadeOutEffect();
        bodyScrollingToggle();
    }
    function fadeOutEffect() {
        document.querySelector('.fade-out-effect').classList.add('active');
        setTimeout(() => {
            document.querySelector('.fade-out-effect').classList.remove('active');
        }, 300)
    }

    // attach an event handler to document
    // hash for call #id
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('link-item')) {
            if (event.target.hash !== "") {
                // prevent default achor click behavior
                event.preventDefault();
                const hash = event.target.hash;
                // deactive existing active 'section'
                document.querySelector('.section.active').classList.add('hide');
                document.querySelector('.section.active').classList.remove('active');
                // active new 'section'
                document.querySelector(hash).classList.add('active');
                document.querySelector(hash).classList.remove('hide');
                // deactive existing active menu navigation 'link-item'
                navMenu.querySelector('.active').classList.add('outer-shadow', 'hover-in-shadow');
                navMenu.querySelector('.active').classList.remove('active', 'inner-shadow');

                if (navMenu.classList.contains('open')) {
                    // active new 'link-item'
                    event.target.classList.add('active', 'inner-shadow');
                    event.target.classList.remove('outer-shadow', 'hover-in-shadow');
                    // hide navigation menu
                    hideMenu();
                } else {
                    let navItems = navMenu.querySelectorAll('.link-item');
                    navItems.forEach((item) => {
                        if (hash === item.hash) {
                            // active new navigation menu 'link-item'
                            item.classList.add('active', 'inner-shadow');
                            item.classList.remove('outer-shadow', 'hover-in-shadow');
                        }
                    })
                    fadeOutEffect();
                }
                window.location.hash = hash;
           }
        } 
    })

})();

/* ----------------------- about section tabs ---------------------- */

    (() => {
        const aboutSection = document.querySelector(".about-section");
        const tabsContainer = document.querySelector(".about-tabs");

        tabsContainer.addEventListener("click", (event) => {
            // // if event.target contains 'tab-item' class and not contains 'active' class
            if (event.target.classList.contains("tab-item") && !event.target.classList.contains("active")) {
                const target = event.target.getAttribute("data-target");
                // deactive existing active 'tab-item'
                tabsContainer.querySelector('.active').classList.remove('outer-shadow', 'active');
                // active new 'tab-item'
                event.target.classList.add('active', 'outer-shadow');
                // deactive existing active 'tab-content'
                aboutSection.querySelector('.tab-content.active').classList.remove('active');
                // active new 'tab-content'
                aboutSection.querySelector(target).classList.add('active');
            }
        })
    })();

    function bodyScrollingToggle() {
         document.body.classList.toggle('stop-scrolling');
    }

/* ---------------------- portfolio filter and popup ------------------------*/
    
    (() => {
        const filterContainer = document.querySelector('.portfolio-filter');
        const portfolioItemsContainer = document.querySelector('.portfolio-items');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        const popup = document.querySelector('.portfolio-popup');
        const prevBtn = popup.querySelector('.pp-prev');
        const nextBtn = popup.querySelector('.pp-next');
        const closeBtn = popup.querySelector('.pp-close');
        const projectDetailsContainer = document.querySelector('.pp-details');
        const projectDetailsBtn = document.querySelector('.pp-project-details-btn');
        let itemIndex, slideIndex, screenshots;

        /* filter portfolio items */
        filterContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('filter-item') && !event.target.classList.contains('active')) {
                filterContainer.querySelector('.active').classList.remove('outer-shadow', 'active');

                event.target.classList.add('active', 'outer-shadow');
                const target = event.target.getAttribute('data-target');
                portfolioItems.forEach((item) => {
                    if (target === item.getAttribute("data-category") || target === 'all') {
                        item.classList.remove('hide');
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                        item.classList.add('hide');
                    }
                })
            }
        });

        portfolioItemsContainer.addEventListener('click', (event) => {
            if (event.target.closest(".portfolio-item-inner")) {
                const portfolioItem = event.target.closest('.portfolio-item-inner').parentElement;
                // get index portfolioItem
                 itemIndex = Array.from(portfolioItem.parentElement.children).indexOf(portfolioItem);
                 screenshots = portfolioItems[itemIndex].querySelector('.portfolio-item-img img').getAttribute('data-screenshots');
                // convert screenshot to string
                screenshots = screenshots.split(',');
                if (screenshots.length === 1) {
                    prevBtn.style.display = 'none';
                    nextBtn.style.display = 'none';
                } else {
                    prevBtn.style.display = 'block';
                    nextBtn.style.display = 'block';
                }
                 slideIndex = 0;
                 popupToggle();
                 popupSlideShow();
            }
        });

        closeBtn.addEventListener('click', () => {
            if (projectDetailsContainer.classList.contains('active')) {
                popupDetails();
            }
            popupToggle();
        })

        function popupToggle() {
            popup.classList.toggle('open');
            bodyScrollingToggle();
        }
        function popupSlideShow() {
            const imgSrc = screenshots[slideIndex];
            const popupImg = popup.querySelector('.pp-img');

            popup.querySelector('.pp-loader').classList.add('active');
            popupImg.src = imgSrc;
            popupImg.onload = () => {
                popup.querySelector('.pp-loader').classList.remove('active');
            }
            popup.querySelector('.pp-counter').innerHTML = (slideIndex+1) + " of " + screenshots.length;
        }
        
        // next slide 
        nextBtn.addEventListener('click', () => {
            if (slideIndex === screenshots.length - 1) {
                slideIndex = 0
            } else {
                slideIndex++;
            }
            popupSlideShow();
            // console.log("slideIndex:" + slideIndex);
        });
        // prev slide 
        prevBtn.addEventListener('click', () => {
            if (slideIndex === 0) {
                slideIndex = screenshots.length - 1;
            } else {
                slideIndex--;
            }
            popupSlideShow();
            // console.log("slideIndex:" + slideIndex);
        });
        function popupDetails() {
            if (!portfolioItems[itemIndex].querySelector(".portfolio-item-details")) {
                projectDetailsBtn.style.display = 'none';
                return;
            }
            projectDetailsBtn.style.display = 'block';
            // get the project details
            const details = portfolioItems[itemIndex].querySelector('.portfolio-item-details').innerHTML;
            // set the projec details
            popup.querySelector('.pp-project-details').innerHTML = details;
            // get the project title
            const title = portfolioItems[itemIndex].querySelector('.portfolio-item-title').innerHTML;
            // set the projec title
            popup.querySelector('.pp-title h2').innerHTML = title;
              // get the project details
            const category = portfolioItems[itemIndex].getAttribute('data-category');
            // set the projec details
            popup.querySelector('.pp-project-category').innerHTML = category.split("-").join(" ");
        }
        // details btn 
        projectDetailsBtn.addEventListener('click', () => {
            popupDetailsToggle();
            popupDetails();
        });
        function popupDetailsToggle() {
            if (projectDetailsContainer.classList.contains('active')) {
                projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
                projectDetailsBtn.querySelector("i").classList.add("fa-plus");
                projectDetailsContainer.classList.remove('active');
                projectDetailsContainer.style.maxHeight = 0 + 'px';
            } else {
                projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
                projectDetailsBtn.querySelector("i").classList.add("fa-minus");
                projectDetailsContainer.classList.add('active');
                projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + 'px';
                popup.scrollTo(0, projectDetailsContainer.offsetTop);
                
            }
        }

    })();


/* ---------------------- testimonial slider ------------------------*/

// function expression arrow function
(() => {
    const sliderContainer = document.querySelector('.testi-slider-container'),
        slides = document.querySelectorAll('.testi-item'),
        slideWidth = sliderContainer.offsetWidth,
        prevBtn = document.querySelector('.prev'),
        nextBtn = document.querySelector('.next'),
        activeSlide = sliderContainer.querySelector('.testi-item.active');
    let slideIndex = Array.from(activeSlide.parentElement.children).indexOf(activeSlide);
    slides.forEach((slide) => {
        // set width of all slides
        slide.style.width = slideWidth + 'px';
    })
    //set width of sliderContainer 
    sliderContainer.style.width = slideWidth * slides.length + 'px';

    nextBtn.addEventListener('click', () => {
        if (slideIndex === slides.length - 1) {
            slideIndex = 0;
        } else {
            slideIndex++;
        }
        slider();
    });
    prevBtn.addEventListener('click', () => {
        if (slideIndex === 0) {
            slideIndex = slides.length - 1;
        } else {
            slideIndex--;
        }
        slider();
    });
    
    function slider() {
        // deactive existing active slides
        sliderContainer.querySelector('.testi-item.active').classList.remove('active');
        // active new slide
        slides[slideIndex].classList.add('active');
        sliderContainer.style.marginLeft = - (slideWidth * slideIndex) + 'px';
    }
    slider();
})();


/* ---------------------- hide all section ------------------------*/
 (() => {
     const sections = document.querySelectorAll('.section');
     sections.forEach((section) => {
         if (!section.classList.contains('active')) {
             section.classList.add('hide');
         }
     })
 })();

/*  preloader fade */
window.addEventListener('load', () => {
   // preloader 
    document.querySelector('.preloader').classList.add('fade-out');
    setTimeout(() => {
        document.querySelector('.preloader').style.display = 'none';
    }, 600)
});


