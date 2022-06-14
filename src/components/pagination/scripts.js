class ScrollSpy {
  constructor() {
    this.navBarButtons = Array.from(document.querySelectorAll('[data-entity="navbar-button"]'));
    this.navFrames = Array.from(document.querySelectorAll('[data-entity="frame"]'));
    this.rootObserver = document.documentElement;

    this.activeFrameIndex = 0;

    this.init();
  }

  init() {
    const observerOptions = {
      threshold: 0.55,
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
          const navIndex = entry.target.dataset.pageIndex;
          this.activeFrameIndex = Number(navIndex);
          this.renderNavbar();
        }
      });
    };

    const navObserver = new IntersectionObserver(observerCallback, observerOptions);

    this.navFrames.forEach((navFrame) => {
      navObserver.observe(navFrame);
    });

    this.navBarButtons.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.navFrames[index].scrollIntoView();
        this.activeFrameIndex = index;
        this.renderNavbar();
      });
    });
  }

  renderNavbar() {
    this.navBarButtons.forEach((item, index) => {
      item.classList.remove('pagination__button_active');

      if (this.activeFrameIndex === index) {
        item.classList.add('pagination__button_active');
      }
    });
  }
}

const initScrollSpy = () => {
  new ScrollSpy();
};

export default initScrollSpy;
