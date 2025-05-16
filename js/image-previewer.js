// image-previewer.js
(function() {
  const style = document.createElement('style');
  style.innerHTML = `
    #x-img-previewer {
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

    #x-img-previewer img {
      max-width: 90vw;
      max-height: 90vh;
      object-fit: contain;
      box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
    }

    #x-img-previewer .info {
      margin-top: 10px;
      color: #fff;
      font-size: 16px;
    }

    #x-img-previewer .close-btn {
      position: absolute;
      top: 20px;
      right: 30px;
      color: white;
      font-size: 24px;
      cursor: pointer;
      background: transparent;
      border: none;
    }
  `;
  document.head.append(style);

  const container = document.createElement('div');
  container.id = 'x-img-previewer';
  container.innerHTML = `
    <button class="close-btn" onclick="ImagePreviewer.hide()">&times;</button>
    <img id="img-preview-element" src="" alt="Preview">
    <div class="info" id="img-preview-filename"></div>
  `;
  document.body.append(container);

  window.ImagePreviewer = {
    container: document.getElementById('x-img-previewer'),
    image: document.getElementById('img-preview-element'),
    filename: document.getElementById('img-preview-filename'),

    show(url) {
      const fileName = url.split('/').pop();
      this.image.src = url;
      this.filename.textContent = fileName;

      this.image.onload = () => {
        const isLandscape = this.image.naturalWidth > this.image.naturalHeight;
        this.container.style.justifyContent = isLandscape ? 'center' : 'flex-start';
        this.container.style.alignItems = isLandscape ? 'center' : 'center';
        this.image.style.marginTop = isLandscape ? '0' : '10vh';
      };

      this.container.style.display = 'flex';
    },

    hide() {
      this.container.style.display = 'none';
      this.image.src = '';
    }
  };
})();