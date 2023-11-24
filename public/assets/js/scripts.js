
!(function (NioApp) {
  "use strict";


  /*  =======================================================
  Custom Menu (sidebar/header)
========================================================== */

  let nav = {
    classes: {
      main: 'nk-nav',
      item: 'nk-nav-item',
      link: 'nk-nav-link',
      toggle: 'nk-nav-toggle',
      sub: 'nk-nav-sub',
      subparent: 'has-sub',
      active: 'active',
      current: 'current-page'
    },
  };

  NioApp.Dropdown = {
    load: function (elm, subparent) {
      let parent = elm.parentElement;
      if (!parent.classList.contains(subparent)) {
        parent.classList.add(subparent);
      }
    },
    toggle: function (elm, active) {
      let parent = elm.parentElement;
      let nextelm = elm.nextElementSibling;
      let speed = nextelm.children.length > 5 ? 400 + nextelm.children.length * 10 : 400;
      if (!parent.classList.contains(active)) {
        parent.classList.add(active);
        NioApp.SlideDown(nextelm, speed);
      } else {
        parent.classList.remove(active);
        NioApp.SlideUp(nextelm, speed);
      }
    },
    closeSiblings: function (elm, active, subparent, submenu) {
      let parent = elm.parentElement;
      let siblings = parent.parentElement.children;
      Array.from(siblings).forEach(item => {
        if (item !== parent) {
          item.classList.remove(active);
          if (item.classList.contains(subparent)) {
            let subitem = item.querySelectorAll(`.${submenu}`);
            subitem.forEach(child => {
              child.parentElement.classList.remove(active);
              NioApp.SlideUp(child, 400);
            })
          }
        }
      });
    }
  }

  NioApp.Dropdown.header = function (selector) {
    const elm = document.querySelectorAll(selector);
    let active = nav.classes.active;
    let subparent = nav.classes.subparent;
    let submenu = nav.classes.sub;
    let navbarCollapse = NioApp.body.dataset.navbarCollapse ? NioApp.body.dataset.navbarCollapse : NioApp.Break.lg;
    elm.forEach(item => {
      NioApp.Dropdown.load(item, subparent);
      item.addEventListener("click", function (e) {
        e.preventDefault();
        if (NioApp.Win.width < eval(`NioApp.Break.${navbarCollapse}`)) {
          NioApp.Dropdown.toggle(item, active);
          NioApp.Dropdown.closeSiblings(item, active, subparent, submenu);
        }
      });
    })
  }


  /*  =======================================================
Custom Navbar 
========================================================== */
  let navbar = {
    classes: {
      base: 'nk-navbar',
      toggle: 'navbar-toggle',
      toggleActive: 'active',
      active: 'navbar-active',
      overlay: 'navbar-overlay',
      body: 'navbar-shown',
    },
    break: {
      main: NioApp.body.dataset.navbarCollapse ? eval(`NioApp.Break.${NioApp.body.dataset.navbarCollapse}`) : NioApp.Break.lg,
    }
  };

  NioApp.Navbar = {
    show: function (toggle, target) {
      toggle.forEach(toggleItem => {
        toggleItem.classList.add(navbar.classes.toggleActive);
      })
      target.classList.add(navbar.classes.active);
      NioApp.body.classList.add(navbar.classes.body);
      let overalyTemplate = `<div class='${navbar.classes.overlay}'></div>`
      target.insertAdjacentHTML('beforebegin', overalyTemplate);
    },
    hide: function (toggle, target) {
      toggle.forEach(toggleItem => {
        toggleItem.classList.remove(navbar.classes.toggleActive);
      })
      target.classList.remove(navbar.classes.active);
      NioApp.body.classList.remove(navbar.classes.body);
      let overlay = document.querySelector(`.${navbar.classes.overlay}`);
      setTimeout(() => {
        overlay && overlay.remove();
      }, 400);
    },
    mobile: function (target) {
      if (navbar.break.main < NioApp.Win.width) {
        target.classList.remove('navbar-mobile');
      } else {
        setTimeout(() => {
          target.classList.add('navbar-mobile');
        }, 500);
      }
    },
    sticky: function (target) {
      let elem = document.querySelectorAll(target);
      if (elem.length > 0) {
        elem.forEach(item => {
          let _item_offset = item.offsetTop;
          window.addEventListener("scroll", function () {
            if (window.scrollY > _item_offset) {
              item.classList.add('has-fixed');
            } else {
              item.classList.remove('has-fixed');
            }
          });
        });
      }
    }
  }

  NioApp.Navbar.init = function () {
    let targetSl = document.querySelector(`.${navbar.classes.base}`);
    let toggleSl = document.querySelectorAll(`.${navbar.classes.toggle}`);
    toggleSl.forEach(item => {
      NioApp.Navbar.mobile(targetSl);
      item.addEventListener("click", function (e) {
        e.preventDefault();
        if (navbar.break.main > NioApp.Win.width) {
          if (!targetSl.classList.contains(navbar.classes.active)) {
            NioApp.Navbar.show(toggleSl, targetSl);
          } else {
            NioApp.Navbar.hide(toggleSl, targetSl);
          }
        }
      });

      window.addEventListener("resize", function (e) {
        if (navbar.break.main < NioApp.Win.width) {
          NioApp.Navbar.hide(toggleSl, targetSl);
        }
        NioApp.Navbar.mobile(targetSl);
      });

      document.addEventListener("mouseup", function (e) {
        if (e.target.closest(`.${navbar.classes.base}`) === null) {
          NioApp.Navbar.hide(toggleSl, targetSl);
        }
      });
    })

    NioApp.Navbar.sticky('.nk-header .nk-header-main');
  }


  /*  =======================================================
  Add some class to current link
========================================================== */

  NioApp.CurrentLink = function (selector, parent, submenu, base, active, intoView) {
    let elm = document.querySelectorAll(selector);
    let currentURL = document.location.href,
      removeHash = currentURL.substring(0, (currentURL.indexOf("#") == -1) ? currentURL.length : currentURL.indexOf("#")),
      removeQuery = removeHash.substring(0, (removeHash.indexOf("?") == -1) ? removeHash.length : removeHash.indexOf("?")),
      fileName = removeQuery;

    elm.forEach(function (item) {
      var selfLink = item.getAttribute('href');
      if (fileName.match(selfLink)) {
        let parents = NioApp.getParents(item, `.${base}`, parent);
        parents.forEach(parentElemets => {
          parentElemets.classList.add(...active);
          let subItem = parentElemets.querySelector(`.${submenu}`);
          subItem !== null && (subItem.style.display = "block")
        })
        intoView && item.scrollIntoView({ block: "end" })
      } else {
        item.parentElement.classList.remove(...active);
      }
    })
  }

  /*  =======================================================
  Swiper Slider
========================================================== */

  NioApp.Addons.swiperCarousel = function (selector) {
    let elem = document.querySelectorAll(selector);
    if (elem.length > 0) {

      elem.forEach(item => {
        let $this = item;
        let _breakpoints = $this.dataset.breakpoints ? JSON.parse($this.dataset.breakpoints) : null;
        let _autoplay = $this.dataset.autoplay ? JSON.parse($this.dataset.autoplay) : false;
        let _loop = $this.dataset.loop ? JSON.parse($this.dataset.loop) : false;
        let _centeredSlides = $this.dataset.centeredslides ? JSON.parse($this.dataset.centeredslides) : false;
        let _slidesPerView = $this.dataset.slidesperview ? $this.dataset.slidesperview : '';
        let _speed = $this.dataset.speed ? parseInt($this.dataset.speed) : 900;
        let _spaceBetween = $this.dataset.spaceBetween ? parseInt($this.dataset.spaceBetween) : 0;
        let _effect = $this.dataset.effect ? $this.dataset.effect : 'slide';

        const swiper = new Swiper($this, {
          // Optional parameters
          centeredSlides: _centeredSlides,
          slidesPerView: _slidesPerView,
          loop: _loop,
          speed: _speed,
          autoplay: _autoplay,
          spaceBetween: _spaceBetween,
          effect: _effect,
          freeMode: false,
          // Pagination
          pagination: {
            el: $this.querySelectorAll(".swiper-pagination")[0],
            type: 'bullets',
            clickable: true,

          },
          // Navigation
          navigation: {
            prevEl: $this.querySelectorAll(".swiper-button-prev")[0],
            nextEl: $this.querySelectorAll(".swiper-button-next")[0],
            clickable: true,
          },
          breakpoints: _breakpoints,
        });

      });
    }
  }

  NioApp.Addons.swiperThumbs = function (mainSelector, thumbsSelector) {

    var mainSwiper = new Swiper(mainSelector, {
      loop: true,
      freeMode: true,
      centeredSlides: true,
      watchSlidesProgress: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        0: {
          spaceBetween: 12,
          slidesPerView: 3
        },
        992: {
          spaceBetween: 24,
          slidesPerView: 4
        },
      }
    });

    var thumbsSwiper = new Swiper(thumbsSelector, {
      loop: true,
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      thumbs: {
        swiper: mainSwiper,
      },
    });
  }

  /*  =======================================================
   Parallax
========================================================== */

  NioApp.Addons.parallax = function (selector) {
    let elem = document.querySelectorAll(selector);
    if (elem.length > 0) {
      elem.forEach(item => {
        let _background = item.dataset.background ? !(JSON.parse(item.dataset.background)) : true;
        let _delay = item.dataset.delay ? parseInt(item.dataset.delay) : 0;
        let _scale = item.dataset.scale ? parseFloat(item.dataset.scale) : 1.4;
        let _orientation = item.dataset.orientation ? item.dataset.orientation : 'down';
        let _transition = item.dataset.transition ? item.dataset.transition : 'cubic-bezier(0,0,0,1)';
        new simpleParallax(item, {
          delay: _delay,
          orientation: _orientation,
          scale: _scale,
          overflow: _background,
          transition: _transition
        });
      });
    }
  }

  /*  =======================================================
  AOS - Animated Scroll Animation
========================================================== */
  NioApp.Addons.aos = function () {
    AOS.init({
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 60,
      offset: 0,
      delay: 0,
      duration: 900,
      easing: 'ease',
      once: true,
      mirror: false,
      anchorPlacement: 'top-bottom'
    });

    AOS.refresh();
  };


  /*  =======================================================
  Pricing Table
========================================================== */

  NioApp.Custom.priceToggle = function (toggleSelector, targetSelector) {
    let toggleElem = document.querySelectorAll(toggleSelector);
    let parentElem = document.querySelectorAll(targetSelector);

    if (toggleElem) {
      toggleElem.forEach(elem => {
        elem.addEventListener('click', function () {
          parentElem.forEach(item => {
            item.classList.toggle('is-active');
          })
        })
      })
    }
  }


  /*  =======================================================
      Character Counter for Text Areas
========================================================== */

  NioApp.Custom.characterCounter = function (textareaSelector, countCelector, countMaxCelector, submitBtnSelector) {
    let textareaElem = document.getElementById(textareaSelector);
    let countElem = document.getElementById(countCelector);
    let countMaxElem = document.getElementById(countMaxCelector);
    let submitBtn = document.getElementById(submitBtnSelector);

    let maxNumOfChars;
    if (countMaxElem !== null) {
      maxNumOfChars = countMaxElem.dataset.charMax;
      countMaxElem.innerHTML = maxNumOfChars;
    }

    let minNumOfChars = 0;

    const countCharacter = () => {
      let numOfEnteredChars = textareaElem.value.length;
      let counter = minNumOfChars + numOfEnteredChars;
      countElem.textContent = counter;
      submitBtn.disabled = false;

      if (counter > maxNumOfChars) {
        countElem.style.color = "red";
        submitBtn.disabled = true;
      } else if (counter > 240) {
        countElem.style.color = "orange";
      } else if (counter == minNumOfChars) {
        countElem.style.color = "#8094ae";
      } else {
        countElem.style.color = "#2a3962";
      }
    }

    if (textareaElem !== null) {
      textareaElem.addEventListener("input", countCharacter);
    }
  }


  /*  =======================================================
  Password Show/Hide
========================================================== */

  NioApp.Custom.showHidePassword = function (selector) {
    let elem = document.querySelectorAll(selector);
    if (elem) {
      elem.forEach(item => {
        item.addEventListener("click", function (e) {
          e.preventDefault();
          let target = document.getElementById(item.getAttribute("href"));

          if (target.type == "password") {
            target.type = "text";
            item.classList.add("is-shown");
          } else {
            target.type = "password";
            item.classList.remove("is-shown");
          }
        });

      });
    }
  }

  /*  =======================================================
  Back To Top Button
========================================================== */

  NioApp.Custom.backToTop = function (selector) {
    let elem = document.querySelector(selector)
    window.addEventListener("scroll", () => {
      if (window.scrollY > 60) {
        elem.classList.add("active")
      } else {
        elem.classList.remove("active")
      }
    })
  }


  /*  =======================================================
  Select Drop Menu
========================================================== */

  NioApp.Custom.dropdownSelectMenu = function () {
    const dropdowns = Array.from(document.querySelectorAll('.nk-dropdown'));
    dropdowns.forEach((dropdown) => {
      const toggle = dropdown.querySelector('.nk-dropdown-field');
      const label = dropdown.querySelector('.nk-dropdown-filter-selected');
      const options = Array.from(dropdown.querySelectorAll('.nk-dropdown-select-option'));

      options.forEach((option) => {
        option.addEventListener('click', () => {
          label.innerHTML = option.innerHTML;
        });
      });

      document.addEventListener('click', (e) => {
        const element = e.target;

        if (element === toggle) return;

        const isDropdownChild = element.closest('.nk-dropdown');

        if (!isDropdownChild) {
          toggle.checked = false;
        }
      });
    });
  }


  /*  =======================================================
  Clipboard js
========================================================== */
  NioApp.Custom.Clipboard = function (selector) {
    let clipboardTrigger = document.querySelectorAll(selector);

    if (clipboardTrigger) {
      let options = {
        tooltip: {
          selector: `${selector.slice(1)}-tooltip`,
          init: 'Copy',
          success: 'Copied',
        },
        icon: {
          init: 'copy',
          success: 'copy-fill',
        }
      }
      clipboardTrigger.forEach(item => {
        //init clipboard
        let clipboard = new ClipboardJS(item);
        //set markup
        let initMarkup = `<span class="fs-6 fw-medium">${options.tooltip.init}</span>`;
        let successMarkup = `<span class="fs-6 fw-medium text-success">${options.tooltip.success}</span>`;
        item.innerHTML = initMarkup;
        //on-sucess
        clipboard.on("success", function (e) {
          let target = e.trigger;
          target.innerHTML = successMarkup;
          setTimeout(function () {
            target.innerHTML = initMarkup;
          }, 1000)
        });
      });
    }

  }


  /*  =======================================================
  Set BG Image
========================================================== */

  NioApp.Custom.setbgImage = function (selector) {
    let elements = document.querySelectorAll(`[${selector}]`);
    elements.forEach((element) => {
      let image = element.getAttribute(selector);
      element.style.backgroundImage = `url(images/${image})`;
    });
  };


  /*  =======================================================
      ADD Sace On Section
========================================================== */

  NioApp.Custom.addBGSpace = function (selector) {

    // Get all sections with section class "nk-section"
    let sections = document.getElementsByClassName(selector);

    // Loop through the elements
    for (let i = 0; i < sections.length; i++) {
      let section = sections[i];

      // Check if the sections's class names contain "bg-"
      if (section.classList && Array.from(section.classList).some(className => className.includes("bg-"))) {

        // Add your desired padding
        section.classList.add("py-7", "py-lg-120")
      }
    }
  }

  /*  =======================================================
Pristines 
========================================================== */

  NioApp.Addons.pristine = function (elem, live) {

    let pristine = new Pristine(elem, {
      classTo: 'form-control-wrap',
      errorClass: 'nk-error',
      successClass: 'nk-sucess',
      errorTextParent: 'form-control-wrap',
      errorTextTag: 'span',
      errorTextClass: 'nk-message nk-message-error'
    }, live);

    return pristine;
  }


  /*  =======================================================
Scroll Carousel
========================================================== */

  NioApp.Addons.scrollTexts = function (selector) {

    let elem = document.querySelectorAll(selector);

    if (elem.length > 0) {
      elem.forEach(item => {
        let $this = item;

        let _speed = $this.dataset.speed ? JSON.parse($this.dataset.speed) : null;
        let _smartSpeed = $this.dataset.smartSpeed ? JSON.parse($this.dataset.smartSpeed) : false;
        let _autoplay = $this.dataset.autoplay ? JSON.parse($this.dataset.autoplay) : true;
        let _margin = $this.dataset.margin ? JSON.parse($this.dataset.margin) : null;
        let _dir = $this.dataset.dir ? $this.dataset.dir : 'ltr';

        const scrollText = new ScrollCarousel($this, {
          speed: _speed,
          margin: _margin,
          direction: _dir,
          autoplay: _autoplay,
          smartSpeed: _smartSpeed,
        });

      });
    }

  }


  /*  =======================================================
      Toast
========================================================== */

  NioApp.Addons.toast = function (varient, msg) {
    let varientType = varient === 'success' ? ' nk-toast-success'
      : varient === 'warning' ? ' nk-toast-warning'
        : varient === 'error' ? ' nk-toast-error'
          : '';

    let varientIcon = varient === 'success' ? 'check'
      : varient === 'error' ? 'alert-circle-fill'
        : varient === 'warning' ? 'alert-fill'
          : 'info-i';
    let varientText = varient === 'success' ? 'Success'
      : varient === 'error' ? 'Error'
        : varient === 'warning' ? 'Warning'
          : 'info-i';


    let toastContainer =
      `
    <div class="nk-toast ${varientType} toast show animate animate-slide-right animate-duration-12 position-fixed m-3 border-0" role="alert" aria-live="assertive" aria-atomic="true" id="toastContainer" >
      <div>
        <span class="nk-toast-icon">
          <em class="icon ni ni-${varientIcon}"></em>
        </span>
      </div>
      <div class="nk-toast-info">
        <h6 class="m-0 text-capitalize text-dark">
          ${varientText} 
        </h6>
        <p>${msg}
      </div>
        <button type="button" class="nk-toast-btn" data-bs-dismiss="toast" aria-label="Close">
          <em class="icon ni ni-cross"></em>
        </button>
      </div>
    `;

    NioApp.body.insertAdjacentHTML('beforeend', toastContainer);

    setTimeout(() => document.getElementById('toastContainer').remove(), 6000)
  }


  /*  =======================================================
      FilterizR   
========================================================== */

  NioApp.Addons.filterTab = function () {
    var filterContainer = document.querySelector('.nk-filter-container');
    var filterControls = document.querySelectorAll('.nk-filter-control');

    if (filterContainer) {

      var filterizr = new Filterizr(filterContainer, {
        gridItemsSelector: '.nk-filter-item',
        spinner: {
          enabled: false,
          fillColor: '#2184D0',
          styles: {
            height: '75px',
            margin: '0 auto',
            width: '75px',
            'z-index': 2,
          },
        },
      });

      filterControls.forEach(function (control) {
        control.addEventListener('click', function (event) {
          event.preventDefault();
          var target = event.currentTarget;

          filterControls.forEach(function (control) {
            control.classList.remove('active');
          });

          target.classList.add('active');
        });
      });
    }



  };


  /*  =======================================================
      Countdown.JS   
========================================================== */

  NioApp.Addons.countDown = function () {

    let container = document.querySelector('.nk-countdown');

    if (container) {
      let countDownStart = new countdown({
        target: '.nk-countdown',
        dayWord: 'Days',
        hourWord: 'Hours',
        minWord: 'Min',
        secWord: 'Sec'
      })
    }

  }



  /*  =======================================================
    Newsletter
========================================================== */

  NioApp.Custom.submitForm = function (selector) {
    let elm = document.querySelectorAll(selector);
    if (elm) {
      elm.forEach(item => {
        const formAction = item.dataset.action;

        let formValidate = NioApp.Addons.pristine(item, false)
        item.addEventListener('submit', function (e) {
          e.preventDefault();
          let valid = formValidate.validate();


          if (valid) {
            let data = new FormData(item);
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                let res = null;
                try { res = JSON.parse(xhttp.responseText) } catch (e) { }
                if (res) {
                  NioApp.Addons.toast(res.result, res.message);
                } else {
                  NioApp.Addons.toast("error", "Oops! There was something went wrong.")
                }
              }
            };

            xhttp.open("POST", formAction, true);
            xhttp.send(data);

            // Clear Input Field 
            item.reset();
          }

        });
      })
    }



  }

  /*  =======================================================
      Tool Tip
========================================================== */

  NioApp.Custom.tooltip = function (selector) {
    const tooltipTriggerList = document.querySelectorAll(selector)
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
  }


  /*  =======================================================
    SET Current Year   
========================================================== */

  NioApp.Custom.currentYear = function (selector) {
    let year = document.querySelector(selector);
    if (year) {
      year.textContent = new Date().getFullYear();
    }
  }


  /*  =======================================================
    Preloader   
========================================================== */

  NioApp.Custom.preLoader = function (selector) {

    let preloaderElement = document.querySelector(selector);

    if (preloaderElement) {
      preloaderElement.classList.add('hide');
    }

  };


  /*  =======================================================
    Counter   
========================================================== */

  NioApp.Custom.counterButton = function () {
    let count = 0;
    const container = document.getElementById('counter');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const countDisplay = document.getElementById('count');

    function increment() {
      count++;
      updateCountDisplay();
    }

    function decrement() {
      if (count > 0) {
        count--;
        updateCountDisplay();
      }
    }

    function updateCountDisplay() {
      countDisplay.textContent = count;
    }

    if (container) {
      incrementBtn.addEventListener('click', increment);
      decrementBtn.addEventListener('click', decrement);
    }


    // Return an object with methods that can be accessed externally
    return {
      increment,
      decrement
    };
  }

  /* Custom Scripts init */
  NioApp.Custom.init = function () {
    NioApp.Navbar.init();
    NioApp.Custom.dropdownSelectMenu();
    NioApp.Custom.preLoader('.preloader');
    NioApp.Custom.backToTop('.scroll-top');
    NioApp.Custom.currentYear('#currentYear');
    NioApp.Custom.submitForm('.form-submit-init');
    NioApp.Custom.showHidePassword(".password-toggle");
    NioApp.Custom.Clipboard('.js-copy')
    NioApp.Custom.counterButton();
    NioApp.Custom.setbgImage('data-bg-image');
    NioApp.Custom.addBGSpace('nk-section');
    NioApp.Dropdown.header(`.${nav.classes.toggle}`);
    NioApp.Addons.swiperCarousel('.swiper-init');
    NioApp.Addons.swiperThumbs(".product-slider-sm", ".product-slider-lg");
    NioApp.Addons.scrollTexts('.texts-animation-scroll');
    NioApp.Addons.parallax('.parallax-init');
    setTimeout(() => {
      NioApp.Addons.aos();
    }, 300)
    NioApp.Addons.filterTab();
    NioApp.Addons.countDown();
    NioApp.Custom.priceToggle('.price-toggle-input', '.nk-pricing');
    NioApp.Custom.characterCounter("textarea-box", "char-count", "char-max", "submit-btn");

  }

  // Initial by default
  /////////////////////////////
  NioApp.init = function () {
    NioApp.winLoad(NioApp.Custom.init);
  }

  NioApp.init();
  return NioApp;
})(NioApp);
