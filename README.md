# 🗂 PHP Multi-File Uploader with Gallery Preview and .env Support

A clean, Composer-free, multi-host file uploader app built with PHP and JavaScript, featuring:

* Multi-file upload
* Image preview before upload
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
/js/app-scripts.js      # Your main JavaScript logic
/js/image-previewer.js  # Standalone gallery previewer
/js/gallery-previewer.js  # Standalone gallery previewer
/api/config.php         # convert environment data into DEFINE
/api/upload.php         # Upload handler
/api/delete.php         # File deletion handler
/api/files.php          # File listing per host
/helpers/env.php        # Custom .env parser and loader
.env                    # Configuration file (non-Composer)
/x-deploy               # Create or update all project files before deploy to server.
...
```

---

## 💡 Features

### ✅ Multi-File Uploader (Frontend in BS4)

* Drag & drop (WIP) or file input (`<input type="file" name="files[]" multiple>`)
* Preview image thumbnails before uploading
* Choose target host(s) for upload
* Progress feedback for each file

### ✅ PHP Upload Handler (`upload.php`)

* Handles any file type
* Detects and distinguishes files/folders via `scandir`
* Uploads to dynamically chosen subfolders based on host
* Keeps upload history and returns JSON status

### ✅ File Management (`files.php`, `delete.php`)

* Lists uploaded files per host
* Deletes files via AJAX
* Shows labels accordingly

### ✅ Image Previewer (`image-previewer.js`, `image-previewer.js`)

* Single JS file, just `<script src="...">` to use
* Supports:

  * Fullscreen overlay with dim background
  * Dynamic centering (portrait/landscape)
  * Navigation buttons (← / →)
  * Smooth bounce effect at gallery bounds
  * Close button
  * Shows file name info

```js
// Example usage:
GalleryPreviewer.show('https://yourhost.com/image.jpg');
GalleryPreviewer.show([
  'image1.jpg',
  'image2.jpg',
  'image3.jpg'
]);
```

---

## 🔐 Login System (`api/auth.php`, `login.php`, `logout.php`)

Simple login form with predefined username/password, defined in .env file

* PHP-only, no database required
* Session-based
* Protects uploader page until authenticated

---

## 🔧 .env Loader (`env-loader.php`)

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

Let me know if you want me to export this directly as `README.md` or generate a GitHub-ready project scaffold for you.
