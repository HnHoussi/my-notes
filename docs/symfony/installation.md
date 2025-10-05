# Installation (First Project)

## 1. Install a Local Server Environment

- Download and install **WAMP** (or XAMPP, Laragon, etc.)
- WAMP already includes **Apache + MySQL + PHP**, so you don't need to install PHP separately
- Make sure WAMP is running (green icon)

---

## 2. PHP Installation (Optional)

- If you want **standalone PHP** (without WAMP), download from: https://windows.php.net/download#php-8.4
- Extract it (e.g., `C:\php`) and add the folder to your **PATH environment variable**

---

## 3. Enable Required PHP Extensions

- Open `php.ini` (WAMP → PHP → php.ini)
- Make sure these are enabled (remove `;` in front if needed):

```ini
extension=pdo_mysql
extension=openssl
extension=intl
extension=zip
```

- Restart WAMP after changes

---

## 4. Install Composer

- Download Composer: https://getcomposer.org/download/
- Install it **for all users**, associate it with the correct PHP (WAMP's or standalone)
- Test installation:

```bash
composer -v
```

---

## 5. Fix Missing Dependencies

- If you see errors like `VCRUNTIME140.dll missing`, install **Visual C++ Redistributable** packages:
- Download: https://aka.ms/vs/17/release/vc_redist.x64.exe

---

## 6. Install Symfony CLI

- Download: https://symfony.com/download
- Add the `symfony.exe` to a folder in PATH (you can put it in your PHP folder or `C:\Program Files\Symfony`)
- Test installation:

```bash
symfony -v
```

---

## 7. Create a Symfony Project

```bash
symfony new my_project --webapp
```

> 💡 **Note:** `--webapp` installs a **full web application skeleton** (Twig, Doctrine, etc.)

---

## 8. Run Symfony Local Server

```bash
cd my_project
symfony server:start
```

- Visit **https://127.0.0.1:8000/** in your browser

---

## Quick Troubleshooting

- **Composer not found?** Make sure it's in your PATH
- **PHP extensions missing?** Check `php.ini` and restart WAMP
- **Port 8000 already in use?** Stop other servers or use: `symfony server:start --port=8001`