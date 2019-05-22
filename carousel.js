(function () {
  'use strict';

  class Carousel {
    constructor() {
      this.slideNumber = 5
      this.position = [...Array(this.slideNumber).keys()].map((val) => val * -100 + '%');
      this.auto = false;
      this.refID = null;
      this.toggle = 0;

      this.header = ' Carousel Example ';
      this.title = 'SOME MORE TEXT HERE';
      this.styles = [
        /**
         * Ideally CSS and JS would be seperated but this code sample doesn't presuppose
         * a 'carousel.css' stylesheet preloaded into the DOM
         */
        'html { height: 100%;}',
        `body {
        min-height: 100%;
        background-color: slategrey;

        display: flex;
        justify-content: center;
        align-items: center;
        align-content: center;
      }`,
        `div {
        display: flex;
        flex-direction: column;
        align-content: center;
        border: 1px solid black;
      }`,
        `div.container {
        top: 50%;
        width: 640px;
        height: 520px;
        background-color: white;
      }`,
        `div#viewport {
        height: 400px;
        min-height: 400px;
        width: inherit;
        position: relative;

        display: flex;
        flex-direction: row;
        align-content: center;
        overflow: hidden;
        box-sizing: border-box;
      }`,
        `button.toggle {
        position: absolute;
        top: 50%;
        z-index: 2;
        width: 0;
        height: 0;
        border-style: solid;
        background-color: transparent;
        outline: none;
      }`,
        `button.toggle.left {
        border-width: 11.5px 19.9px 11.5px 0;
        border-color: transparent #007bff transparent transparent;
        left: 15px;
      }`,
        `button.toggle.right {
        border-width: 11.5px 0 11.5px 19.9px;
        border-color: transparent transparent transparent #007bff;
        right: 15px;
      }`,
        `button.toggleAuto {
        position: absolute;
        right: 15px;
      }`,
        `button.toggleAuto.active {
        background-color: #007bff;
      }`,

        `div.container .sm {
        height: 40px;
        justify-content: center;
        align-items: center;
      }`,
        `div.header.sm {
        position: relative;
        display: flex;
        flex-direction: row;
        align-content: center;
        align-items: center;
      }`,
        `div.number {
        flex-direction: row;
      }`,
        `div.circle {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: yellow;
        margin: 2px;

        justify-content: center;
        align-items: center;
      }`,
        `div.circle.active {
        background-color: red;
      }`,
        `img {
        position: relative;
        margin: 0 auto;
        min-width: 640px;
        min-height: 400px;
        left: 0%;
        transition:left 200ms ease;
      }`,
      ]

      this.init = this.init.bind(this);
      this.loadStyles = this.loadStyles.bind(this);
      this.mountCarousel = this.mountCarousel.bind(this);
      this.loadSlides = this.loadSlides.bind(this);
      this.toggleAuto = this.toggleAuto.bind(this);
      this.toggleImage = this.toggleImage.bind(this);
    }

    init() {
      this.loadStyles();
      this.mountCarousel();
      this.loadSlides();
    }

    loadStyles() {
      /**
       * Inserts CSS rules if 'carousel.css' is not already loaded into the DOM
       * Cf. note above about inserting CSS with JS
       */
      const styleSheets = document.styleSheets;
      Array.prototype.forEach.call(styleSheets, (sheet, i) => {
        if (styleSheets[i].href.endsWith('carousel.css')) return
      });

      const styleEl = document.createElement('style')
      document.head.appendChild(styleEl);
      this.styles.forEach(style => {
        styleEl.sheet.insertRule(style);
      })
    }

    mountCarousel() {
      /**
       * defines semantics
       * Cf. https://github.com/JohnTrecker/Carousel/blob/master/index.html
       */
      const container = document.createElement('div');
      const header = document.createElement('div');
      const image = document.createElement('div');
      const title = document.createElement('div');
      const number = document.createElement('div');

      const headerText = document.createElement('h3');
      const headerAutoToggleButton = document.createElement('button');

      const imageButtonLeft = document.createElement('button');
      const imageButtonRight = document.createElement('button');

      container.classList.add('container');
      header.classList.add('header', 'sm');
      title.classList.add('title', 'sm');
      number.classList.add('number', 'sm');

      headerAutoToggleButton.classList.add('toggleAuto');
      imageButtonLeft.classList.add('toggle', 'left');
      imageButtonRight.classList.add('toggle', 'right');

      image.setAttribute('id', 'viewport');
      title.innerHTML = this.title;
      headerText.innerHTML = this.header;
      headerAutoToggleButton.innerHTML = 'Toggle Auto';

      headerAutoToggleButton.onclick = this.toggleAuto;
      imageButtonLeft.onclick = () => this.toggleImage('left');
      imageButtonRight.onclick = () => this.toggleImage('right');

      headerAutoToggleButton.tabIndex = '0';
      imageButtonLeft.tabIndex = '0';
      imageButtonRight.tabIndex = '0';

      header.appendChild(headerText)
      header.appendChild(headerAutoToggleButton)
      image.appendChild(imageButtonLeft)
      image.appendChild(imageButtonRight)

      container.appendChild(header)
      container.appendChild(image)
      container.appendChild(title)
      container.appendChild(number)

      document.body.appendChild(container)
    }

    loadSlides() {
      /**
       * mounts slides and circles to viewport
       */
      const slides = [...Array(this.slideNumber + 1).keys()].slice(1) // e.g. [1,2,3,4,5]
      let viewport = document.getElementById('viewport');
      let bottombar = document.getElementsByClassName('number')[0]

      slides.forEach((val) => {
        let image = document.createElement('img')
        let circle = document.createElement('div')

        image.classList.add('image', `image-${val}`)
        image.src = `http://via.placeholder.com/640x400?text=${val}`
        image.alt = `Image ${val}`;
        viewport.appendChild(image)

        circle.classList.add('circle', `circle-${val}`)
        if (val === 1) circle.classList.add('active')
        circle.innerHTML = val
        bottombar.appendChild(circle)
      })
    }

    toggleAuto() {
      /**
       * defined auto-toggle function
       */
      this.auto = !this.auto
      if (this.auto) {
        this.refID = setInterval(this.toggleImage, 2000)
      }
      else {
        clearInterval(this.refID)
      }
    }

    toggleImage(direction) {
      /**
       * defines left/right toggle functions
       */
      direction = direction || 'right'
      if (this.toggle === this.slideNumber - 1 && direction === 'right') {
        if (this.auto) this.toggleAuto()
        return
      }
      if (this.toggle === 0 && direction === 'left') return

      this.toggle = direction === 'right'
        ? this.toggle + 1
        : this.toggle - 1;

      let slides = document.getElementsByClassName('image');
      Array.prototype.forEach.call(slides, el => {
        el.style.left = this.position[this.toggle]
      })

      let active = document.getElementsByClassName('active')[0]
      let current = document.getElementsByClassName(`circle-${this.toggle + 1}`)[0]

      if (active) active.classList.remove('active')
      current.classList.add('active')
    }
  }

  if (!!document) {
    const c = new Carousel();
    document.addEventListener('DOMContentLoaded', c.init)
  } else {
    if (console) console.warn('No DOM detected.')
  }
}());
