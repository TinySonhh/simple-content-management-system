# Summary: `require "file.php";` vs `require "./file.php";` and related topics

---

### 1. **`require "file.php";` vs `require "./file.php";` in PHP**

* `require "file.php";`

  * PHP looks for `file.php` in the **include\_path** (a set of directories configured in PHP).
  * If not found in include\_path, then PHP tries relative to the **current working directory** (which may vary depending on how PHP is run).
  * This can be unpredictable.

* `require "./file.php";`

  * PHP looks for `file.php` **explicitly in the current directory of the running script** (relative to current working directory).
  * More predictable but still depends on working directory.

* **Best practice:**
  Use `require __DIR__ . '/file.php';`

  * This uses the **absolute directory path of the current PHP file** (where the require is called).
  * Fully reliable regardless of working directory.

---

### 2. **When to call `./file.php`?**

* Use `./file.php` when you want to explicitly require a file in the **same directory** as the executing script, but be aware it depends on working directory.
* For best stability, prefer `__DIR__`.

---

### 3. **`./file.js` vs `file.js` in HTML/JS**

* Both usually resolve to the **same file in the same directory** as the HTML page.
* `./file.js` is **more explicit** and clearer, so recommended especially in module imports.
* In JS modules, you **must** use `./` or `../` — e.g., `import x from './file.js';`

---

### 4. **Effect of `<base>` tag in HTML**

* `<base href="...">` sets the base URL for **all relative URLs** in the HTML document (scripts, links, images, fetch calls).
* It affects **only frontend URL resolution**, **not PHP file system paths**.
* Example: with `<base href="/app/">`, `<script src="js/app.js">` loads `/app/js/app.js`.
* Use carefully, because it changes all relative paths.

---

### 5. **Passing arguments to `fetch()` in JS**

* **GET requests:** pass arguments in URL query string, e.g. `fetch('/api/data.php?user=alice')`
* **POST requests:** pass data in request body, usually as JSON or FormData

  * JSON example:

    ```js
    fetch('/api/save.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: 'alice', id: 123 })
    });
    ```
  * FormData example:

    ```js
    const formData = new FormData();
    formData.append('user', 'alice');
    fetch('/api/upload.php', { method: 'POST', body: formData });
    ```

---

### 6. **`fetch('/api/upload.php')` vs `fetch('api/upload.php')`**

* `fetch('/api/upload.php')`:

  * Absolute path from root domain, always resolves to `https://domain.com/api/upload.php`.

* `fetch('api/upload.php')`:

  * Relative path to current page URL, e.g., if page is `/folder/page.html`, it resolves to `/folder/api/upload.php`.

* Use absolute paths (`/api/...`) for consistency and safety unless you explicitly want relative paths.

---

### 7. **Your project structure and API calls**

* Your main page `index.php` lives in `/UPLOAD/`
* Your API scripts are in `/UPLOAD/api/`
* Your JS is in `/UPLOAD/js/app-script.js` loaded by `index.php`

**Because URLs in JS fetch calls are relative to the HTML page, not the JS file**,

* Using `fetch('api/upload.php')` works if your page is `/UPLOAD/index.php`
* Using `fetch('/UPLOAD/api/upload.php')` is safer and works regardless of the page location

---

### 8. **Best practice for dynamic base path**

In `index.php`:

```php
<script>
  const BASE_PATH = "<?php echo dirname($_SERVER['SCRIPT_NAME']); ?>";
</script>
<script src="js/app-script.js"></script>
```

In `app-script.js`:

```js
fetch(`${BASE_PATH}/api/upload.php`);
```

This makes your paths flexible to deployment folder changes.

---

If you want, I can help you write exact snippets for your setup!
