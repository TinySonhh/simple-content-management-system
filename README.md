# 🗂 PHP Multi-File Uploader with Gallery Preview and .env Support

A clean, Composer-free, multi-host file uploader app built with PHP and JavaScript, featuring:

* Multi-file upload
* Preview any files and manage(e.g. remove them) before uploading
* Support for multiple upload targets (hosts)
* Real-time upload status
* Browsing and deleting uploaded files per host
* Gallery-style image previewer with fullscreen overlay
* Optional `.env` config loader with variable expansion

---

## 📁 Project Structure

```
/index.php              # Main entry point
/login.php
/logout.php
/css
/js
/js/modals.js           # Modal popup to wrap the default confirm, alert, prompt
/js/app-scripts.js      # Your main JavaScript logic
/js/gallery-previewer.js# Standalone images previewer supporting slideshow
/js/any-file-viewer.js  # Able to preview any files, images included
/api/__config.php       # convert environment data into DEFINE
/api/upload.php         # Upload handler
/api/delete.php         # File deletion handler
/api/files.php          # File listing per host
/helpers/env.php        # Custom .env parser and loader
.env                    # Configuration file (non-Composer)
/x-deploy               # Create or update all project files before deploy to server.
...
```

## 📁 Requirements

### **Front End**
Make sure to include all following libraries in your PHP files so that all JS libraries can work properly.
  - bootstrap@4.6.1
  - font-awesome/4.7.0
  - jquery/3.5.1

### **Back End**
  - XAMP for localhost [https://www.apachefriends.org/download.html]
  - PHP
  - .env processing
  - .htaccess configuration

### **Tools**
  - python [https://www.python.org/downloads/]
  - javascript-obfuscator [https://github.com/javascript-obfuscator/javascript-obfuscator]
  - Windows OS. You can port them to Linux later.


---

## 💡 Features

### ✅ Multi-File Uploader (Frontend in BS4)

* Select multiple files from from a single folder.
* Preview and manage them (e.g remove) before uploading
* Choose target host(s) for upload
* Progress feedback for each file
* Drag & drop (WIP)

### ✅ JS Files & Folder Uploader (`js/folder-uploader.js`, `js/files-uploader.js`)

* Using `input-file` (`<input type="file" name="files[]" multiple>`) for files and `input-webkitdirectory` or `File System API` for folder
* Handles any file type
* Detects and distinguishes files/folders via `scandir`
* Uploads to dynamically chosen subfolders based on host
* Keeps upload history and returns JSON status

### ✅ PHP Upload Handler (`api/upload.php`, `api/upload-multi.php`)

* Handles any file type
* Detects and distinguishes files/folders via `scandir`
* Uploads to dynamically chosen subfolders based on host
* Keeps upload history and returns JSON status

### ✅ File Management (`api/files.php`, `api/delete.php`)

* Lists uploaded files per host
* Deletes files via AJAX
* Shows labels accordingly

### ✅ Image Previewer (`js/gallery-previewer.js`)

Single JS file, just `<script src="...">` to use
* Supports:

  * Fullscreen overlay with dim background
  * Dynamic centering (portrait/landscape)
  * Navigation buttons (← / →)
  * Smooth bounce effect at gallery bounds
  * Close button
  * Shows file name info
  * Support keyboard: Left/Up (←), Right/Down/Enter (→), and ESC (close)

```js
// Example usage:
GalleryPreviewer.show('https://yourhost.com/image.jpg');
GalleryPreviewer.show([
  'image1.jpg',
  'image2.jpg',
  'image3.jpg'
]);
```

### ✅ Any File Previewer (`js/any-file-viewer.js` ,`api/preview.php`)

Preview all files:
* `AnyFileViewer.previewFile(host_root, sub_path, file)`:
  - fetch files and folder using `api/preview.php` from a remote host file by this path `${host_root}/${sub_path}/${file}` on server
  - then render the corresponding content to the preview pane
* `AnyFileViewer.previewUploadFile(path, fileMap={})`:
  - preview the content of uploading files via the input controls (temporarily stored in browser memory (RAM), not on disk or server)
  - then render the corresponding content to the preview pane
  - `fileMap`: is the mapped JSON object of the input.files, using this method
  - `path`: is the key of a item in `fileMap`

```js
function getFileMapOf(files=[]){
  const fileMap = {};
  Array.from(files || []).forEach(file => {
   const fullPath = file.webkitRelativePath || file.name;
   fileMap[fullPath] = file;
  });
  return fileMap;
}
```

---

## 🔐 Login System (`api/jwt.php`, `api/auth.php`, `login.php`, `logout.php`)

Simple login form with predefined username/password, defined in .env file

* PHP-only, no database required
* Session-based
* JWT token
* Protects uploader page until authenticated

---

## 🔧 .env Loader (`helpers/env.php`, `.env`, `.htaccess`)

.env file is safely protected by .htaccess file

Supports `.env` files like:

```dotenv
APP_NAME="Content Management System"
APP_ALIAS=cms
COMPANY_NAME=YOUR_COMPANY_NAME
COMPANY_NAME_BRIEF=your_company_name
APP_DOMAIN="${COMPANY_NAME_BRIEF}.com"
HOSTING_DIR_ROOT="/home/xxxxx/domains/${APP_DOMAIN}/public_html"
HOSTING_DIR_ROOT_LOCALHOST="d:/${APP_DOMAIN}"
SESSION_LIFETIME=3600
APP_ALGORITHM=HS256
APP_USERNAME=admin
APP_PASSWORD=admin
```

Please check `.env.template` for more info.

### ✅ Supports:

* `KEY=VALUE` with or without quotes
* Variable substitution: `${VAR}`
* Auto-populates `getenv()`, `$_ENV`, and `$_SERVER`

```php
loadEnv(__DIR__ . '/.env');
echo getenv('APP_URL'); // https://app.hssoftvn.com
```

---

## 💻 Setup Instructions

1. Clone the repo
2. Clone `.env.template` to your `.env` config
3. Serve the folder via local server (`php -S localhost:8000`)
4. Log in to access the uploader
5. Upload and preview files

---

## 📌 Notes

* No Composer dependencies
* Uses Bootstrap 4 for styling
* PHP-only backend logic
* JS fetch used for AJAX with `POST` and `FormData`
* Base `<base>` tag is used to adjust relative paths for frontend only

---

## Completed recently:

### 29 May 2025:
* change root-dir file listing
* implement previewer
* more friendly UI to select files and upload
* support select files and also folder (folder-uploader.js)

### Minor
* Respond to the 401 error so that users know what happen, and lead them to login again to continue
* Tidy it JWT

## TODO 
* Split FilesUploader as a single uploader as Folder Uploader
* Drag & drop (WIP)

Let me know if you want me to export this directly as `README.md` or generate a GitHub-ready project scaffold for you.
