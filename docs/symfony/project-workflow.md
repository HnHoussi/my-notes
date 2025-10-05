# Project Setup & Workflow Commands

## 1. Create a New Project

```bash
# Creates a new project with the full webapp skeleton (Twig, Doctrine, Profiler, etc.)
# Use without --webapp for a minimal skeleton (you'll need to install components manually)
symfony new my_project --webapp
```

## 2. Start Local Server

```bash
# Run the local Symfony web server in the background
cd my_project
symfony server:start
```

## 3. Git Initialization

```bash
# Start version control for your project
git init
git add .
git commit -m "Initial Symfony project"
```

## Development Tools

### 4. Install Dev Helpers (if not already included)

```bash
# MakerBundle: generate controllers, entities, forms, etc.
composer require --dev symfony/maker-bundle

# Symfony Profiler: debug toolbar (if not included)
composer require --dev symfony/profiler-pack

# Install Bootstrap
symfony console importmap:require bootstrap
```

## Controllers & Routes

### 5. Generate a Controller

```bash
# Creates HomeController with index() + a Twig template
symfony console make:controller HomeController
```

## Database Setup

### 6. Install Doctrine ORM

```bash
# Installs Doctrine ORM, DBAL, migrations support
composer require symfony/orm-pack

# Optional: allows loading fake data into DB for testing
composer require --dev doctrine/doctrine-fixtures-bundle
```

### 7. Configure Database in .env

```bash
# Adjust with your DB type: mysql / postgres / sqlite
DATABASE_URL="mysql://user:password@127.0.0.1:3306/my_database"
```

### 8. Create the Database

```bash
# Creates database defined in DATABASE_URL
symfony console doctrine:database:create
```

### 9. Generate an Entity (Model)

```bash
# Wizard: add fields like name:string, price:float, createdAt:datetime
symfony console make:entity Product
```

### 10. Run Migrations

```bash
# Generates migration file for DB changes
symfony console make:migration

# Applies migration to the database
symfony console doctrine:migrations:migrate
```

## Forms & CRUD

### 11. Generate a Form Type

```bash
# Creates a form class for the Product entity
symfony console make:form ProductType Product
```

### 12. Generate CRUD

```bash
# Generates controller, views, and forms for the Product entity
php bin/console make:crud Product
```

## Fixtures (Optional: Seed DB with Fake Data)

### 13. Create Fixture Class

```bash
# Class where you can create demo objects for testing
symfony console make:fixture ProductFixtures
```

### 14. Load Fixtures

```bash
# Erases DB and loads sample data
symfony console doctrine:fixtures:load
```

## Assets (Optional, for CSS/JS)

### 15. Install Asset Component

```bash
# Handle URLs for images, CSS, JS
composer require symfony/asset
```

### 16. Install Webpack Encore (if you want frontend build system)

```bash
# Manage CSS/JS with Webpack
composer require symfony/webpack-encore-bundle
npm install
npm encore dev --watch
```

## Cache & Maintenance

### 17. Clear Cache

```bash
# Clears Symfony cache (useful when config changes)
symfony console cache:clear
```

### 18. Debug Useful Info

```bash
php bin/console debug:router           # Show all routes
php bin/console debug:autowiring       # Show available services
php bin/console debug:container        # Show service container
```

## Symfony Setup for a Cloned GitHub Project

### 1. Clone the Repository

```bash
git clone https://github.com/user/project.git
cd project
```

### 2. Install PHP Dependencies

```bash
# Installs all required Symfony/PHP packages from composer.json
composer install
```

### 3. Install Node.js Dependencies (if frontend/Encore is used)

```bash
# Installs JavaScript/CSS build tools if package.json exists
npm install
```

### 4. Configure Environment

```bash
# Copy default .env → .env.local for your machine
cp .env .env.local
```

Then edit `DATABASE_URL` and other secrets inside `.env.local`:

```bash
DATABASE_URL="mysql://user:password@127.0.0.1:3306/project_db"
```

### 5. Create Database

```bash
# Creates database defined in .env.local
symfony console doctrine:database:create
```

### 6. Run Migrations

```bash
# Updates schema to latest version
symfony console doctrine:migrations:migrate
```

### 7. Load Fixtures (if available)

```bash
# Loads demo/test data (⚠️ wipes existing data)
symfony console doctrine:fixtures:load
```

### 8. Build Assets (if Webpack Encore is used)

```bash
# Build CSS/JS once
npm encore dev

# Auto-rebuild while coding
npm encore dev --watch
```

### 9. Start Symfony Server

```bash
# Run local server in background
symfony server:start
```