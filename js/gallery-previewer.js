
// gallery-previewer.js
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    #x-gallery-previewer {
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0, 0, 0, 0.85);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      flex-direction: column;
    }

    #x-gallery-previewer img {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }

    #x-gallery-previewer .info {
      margin-top: 10px;
      color: #fff;
      font-size: 16px;
    }

    #x-gallery-previewer .close-btn,
    #x-gallery-previewer .nav-btn {
      position: absolute;
      color: white;
      font-size: 32px;
      cursor: pointer;
      background: transparent;
      border: none;
      z-index: 10000;
    }

    #x-gallery-previewer .close-btn {
      top: 20px;
      right: 30px;
      font-size: 24px;
    }

    #x-gallery-previewer .left-btn {
      left: 20px;
      top: 50%;
      transform: translateY(-50%);
    }

    #x-gallery-previewer .right-btn {
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
  `;
  document.head.appendChild(style);

  const container = document.createElement('div');
  container.id = 'x-gallery-previewer';
  //Set tabindex to 0 to make it focusable and to be able to use the keyboard
  container.setAttribute('tabindex', '0');
  container.innerHTML = `
    <button class="x-close close-btn" onclick="GalleryPreviewer.hide()">&times;</button>
    <button class="nav-btn left-btn" onclick="GalleryPreviewer.prev()">&#10094;</button>
    <img id="x-gallery-preview-element" src="" alt="Preview">
    <button class="nav-btn right-btn" onclick="GalleryPreviewer.next()">&#10095;</button>
    <div class="info d-none" id="img-preview-filename"></div>
  `;
  document.body.appendChild(container);

  $('body').on('keydown', '#x-gallery-previewer', function(event) {
    event.stopPropagation();
    event.preventDefault();
    if (['ArrowRight', 'Enter', 'ArrowDown'].includes(event.key)) {
      window.GalleryPreviewer.next();
    } else  if (['ArrowLeft', 'Backspace', 'ArrowUp'].includes(event.key)) {
      window.GalleryPreviewer.prev();
    }

		if (event.key === 'Escape') {
			window.GalleryPreviewer.hide();
		}
	});

  $('body').on('keyup', '#x-gallery-previewer', function(event) {
    event.stopPropagation();
    event.preventDefault();
  })

  window.GalleryPreviewer = {
    container: document.getElementById('x-gallery-previewer'),
    image: document.getElementById('x-gallery-preview-element'),
    filename: document.getElementById('img-preview-filename'),
    urls: [],
    index: 0,

    show(urlOrArray, startIndex = 0) {
      this.urls = Array.isArray(urlOrArray) ? urlOrArray : [urlOrArray];
      this.index = startIndex;
      this.displayImage();
      this.container.style.display = 'flex';
      this.container.focus();
    },

    displayImage() {
      const url = this.urls[this.index];
      //const fileName = url.split('/').pop();
      this.image.src = url;
      //this.filename.textContent = fileName;

      this.image.onload = () => {
        const isLandscape = this.image.naturalWidth > this.image.naturalHeight;
        this.container.style.justifyContent = isLandscape ? 'center' : 'center';
        this.container.style.alignItems = isLandscape ? 'center' : 'center';
        this.image.style.marginTop = isLandscape ? '0' : '0'//'10vh';
      };
    },

    next() {
      if (this.index < this.urls.length - 1) {
        this.index++;
        this.displayImage();
      } else {
        this.bounce();
      }
    },

    prev() {
      if (this.index > 0) {
        this.index--;
        this.displayImage();
      } else {
        this.bounce();
      }
    },

    bounce() {
      this.image.animate([
        { transform: 'translateX(0)' },
        { transform: 'translateX(-20px)' },
        { transform: 'translateX(20px)' },
        { transform: 'translateX(0)' }
      ], {
        duration: 300,
        iterations: 1
      });
    },

    hide() {
      this.container.style.display = 'none';
      this.image.src = '';
      this.urls = [];
      this.index = 0;
    }
  };
})();