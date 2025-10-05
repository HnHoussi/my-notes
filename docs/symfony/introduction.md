# Introduction

## Why Use a PHP Framework?

- Structures the code
- Facilitates teamwork
- Avoids reinventing the wheel
- Produces high-quality code
- Speeds up development

## The Kernel

- Located in `src/Kernel.php`
- The core of the application
- Instantiated by the front controller
- Handles the HTTP request and returns a response

## Symfony Project Structure

```
my_project/
├─ bin/                    # Executable files (Symfony console)
├─ config/                 # Configuration files (YAML, PHP, XML)
│  ├─ packages/            # Package-specific configs
│  ├─ routes/              # Routing configs
│  └─ services.yaml        # Services configuration
├─ public/                 # Publicly accessible files
│  └─ index.php            # Front controller
├─ src/                    # PHP code
│  ├─ Controller/          # Controllers
│  ├─ Entity/              # Doctrine entities
│  ├─ Repository/          # Doctrine repositories
│  └─ Service/             # Services
├─ templates/              # Twig templates
├─ translations/           # Translation files
├─ migrations/             # Database migrations
├─ tests/                  # Unit and functional tests
├─ var/                    # Cache, logs
│  ├─ cache/
│  └─ log/
└─ vendor/                 # Composer dependencies
```

## Composer: PHP Dependency Manager

Composer allows you to:

- Install PHP modules/libraries
- Update them
- Manage versions
- Create projects based on predefined structures


## Extra Symfony Concepts

### Bundles

- Reusable packages in Symfony (like plugins/modules)
- Symfony itself is made of bundles

### Services & Dependency Injection (DI)

- Symfony apps are built around services (reusable classes)
- The DI container automatically provides them where needed

### Routing

- Defines which URL triggers which controller/method
- Configured with annotations, attributes, or YAML

### Doctrine ORM

- Integrated ORM for database access
- Maps PHP classes (Entities) to database tables

### Twig

- Templating engine for rendering views securely and efficiently

### Symfony CLI

- Developer tool to start servers, check configurations, run commands, etc.
- Example: `symfony server:start`

### Environments

- Symfony runs in different modes: `dev`, `test`, `prod`
- Each mode has different settings (caching, debug, logging)

---

## Resources

### Installing & Setting up Symfony

- [Symfony Setup Documentation](https://symfony.com/doc/current/setup.html)
- [Symfony Cheat Sheet](https://laconsole.dev/cheatsheets/symfony)

### Twig

- [Twig Cheat Sheet](https://willthemoor.github.io/Twig-Cheat-Sheet)
- [Twig Official Documentation](https://twig.symfony.com/doc/current/)

### Doctrine (Database & ORM)

- [Doctrine ORM Documentation](https://www.doctrine-project.org/projects/doctrine-orm/en/current/)
- [Symfony Doctrine Documentation](https://symfony.com/doc/current/doctrine.html)

### Symfony Console & CLI

- [Symfony Console Component](https://symfony.com/doc/current/components/console.html)
- [Symfony CLI Download](https://symfony.com/download)

### Testing

- [Symfony Testing Documentation](https://symfony.com/doc/current/testing.html)

### Extra Handy Resources

- [Symfony Best Practices](https://symfony.com/doc/current/best_practices.html)
- [SymfonyCasts Tutorials](https://symfonycasts.com/)
- [Symfony Recipes](https://github.com/symfony/recipes)