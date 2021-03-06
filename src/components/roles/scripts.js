import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

class RolesSlider {
  constructor() {
    this.nav = document.querySelector('[data-entity="roles-nav"]');
    this.slider = document.querySelector('[data-entity="roles-slider"]');
    this.init();
  }

  init() {
    const navPrevButton = this.slider.querySelector('[data-entity="roles-slider-prev"]');
    const navNextButton = this.slider.querySelector('[data-entity="roles-slider-next"]');

    const navSlider = new Swiper(this.nav, {
      direction: 'horizontal',
      slidesPerView: 'auto',
      observer: true,

      breakpoints: {
        1024: {
          direction: 'vertical',
          loop: true,
        },
      },
    });

    const slider = new Swiper(this.slider, {
      observer: true,
      slidesPerView: 1,

      thumbs: {
        swiper: navSlider,
      },

      navigation: {
        nextEl: navNextButton,
        prevEl: navPrevButton,
      },

      spaceBetween: 16,
    });
  }
}

const initRolesSlider = () => {
  new RolesSlider();
};

export default initRolesSlider;
