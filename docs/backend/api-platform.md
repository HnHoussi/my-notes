# API Platform

API Platform is a framework built on **Symfony** that allows you to create **REST**, **GraphQL**, and **JSON:API** web services quickly. It handles a lot of boilerplate automatically, making your API development faster and cleaner.

---

## 1. Installation

### Add API Platform to Symfony

```bash
# Install API Platform core
composer require api

# Optional: install admin UI & client (React/Vue)
composer require symfony/webpack-encore-bundle
npm install @api-platform/admin @api-platform/client
```

### Verify installation

```bash
# Symfony info about installed packages
bin/console about

# Check automatically generated routes for your API resources
bin/console debug:router
```

---

## 2. Directory Structure

* `src/Entity/` → Your **Doctrine entities**, which are also your API resources.
* `config/packages/api_platform.yaml` → API Platform configuration.
* `src/Controller/` → Custom controllers (optional for custom operations).
* `src/DataProvider/` → Custom providers for advanced queries.
* `src/DataPersister/` → Custom data saving logic.

---

## 3. Create a Basic API Resource

A **Resource** is usually a Doctrine Entity exposed as an API endpoint:

```php
<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource] // Expose this entity as an API
class Book
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $title;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    // getters and setters...
}
```

This generates CRUD endpoints automatically:

* `GET /books` → list all books
* `GET /books/{id}` → get a book by ID
* `POST /books` → create a book
* `PUT /books/{id}` → update a book
* `DELETE /books/{id}` → delete a book

---

## 4. Serialization Groups

Serialization groups control **which fields are exposed in API responses** and **which fields can be written**.

```php
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['book:read']],
    denormalizationContext: ['groups' => ['book:write']]
)]
class Book
{
    #[Groups(['book:read'])]
    private ?int $id;

    #[Groups(['book:read', 'book:write'])]
    private string $title;
}
```

* `normalizationContext` → controls **reading** (GET responses).
* `denormalizationContext` → controls **writing** (POST/PUT requests).

---

## 5. Filtering & Pagination

### Filtering

```php
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial'])] // search by title
class Book { ... }
```

Example: `GET /books?title=harry`

### Pagination

```yaml
# config/packages/api_platform.yaml
api_platform:
  collection:
    pagination:
      enabled: true
      items_per_page: 10
```

* Default: `10 items per page`
* Query: `GET /books?page=2`

---

## 6. Symfony Validation

Use Symfony’s Validator component to ensure data integrity:

```php
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource]
class Book
{
    #[Assert\NotBlank(message: "Title cannot be empty")]
    #[Assert\Length(
        min: 3,
        max: 255,
        minMessage: "Title too short",
        maxMessage: "Title too long"
    )]
    #[Groups(['book:read', 'book:write'])]
    private string $title;
}
```

* Invalid data will return **HTTP 400** with validation errors.
* Works automatically with API Platform forms.

---

## 7. Security & JWT Authentication

### Restrict access

```php
#[ApiResource(security: "is_granted('ROLE_ADMIN')")]
class Book { ... }
```

### Per operation

```php
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_ADMIN')")
    ]
)]
```

### JWT Authentication with LexikJWT

```bash
composer require lexik/jwt-authentication-bundle
```

```yaml
# config/packages/security.yaml
security:
  firewalls:
    login:
      pattern: ^/login
      stateless: true
      json_login:
        check_path: /login
        username_path: email
        password_path: password
    api:
      pattern: ^/api
      stateless: true
      jwt: ~
```

* Login endpoint: `POST /login_check`
* Include token in header for protected routes:

  ```
  Authorization: Bearer <JWT_TOKEN>
  ```

---

## 8. Custom Controllers & Operations

### Custom operation

```php
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\ApiResource;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/books/{id}/preview',
            controller: App\Controller\BookPreviewController::class,
            read: false
        )
    ]
)]
class Book { ... }
```

* Useful for custom logic like generating PDFs, previews, or external API calls.

### Custom Data Provider

```php
use ApiPlatform\State\ProviderInterface;
use ApiPlatform\Metadata\Operation;

class CustomBookProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = [])
    {
        // custom query logic
    }
}
```

### Custom Data Persister

```php
use ApiPlatform\State\ProcessorInterface;

class BookProcessor implements ProcessorInterface
{
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        // e.g., save to external API instead of DB
    }
}
```

---

## 9. File Uploads

```php
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/books/{id}/cover',
            controller: App\Controller\UploadCoverController::class,
            deserialize: false
        )
    ]
)]
class Book { ... }
```

* Set `deserialize: false` to handle raw files.
* Can store files on server or cloud (S3, etc).

---

## ⚡ Tips & Best Practices

:::note
- Always use **serialization groups**.
- Validate input with **Symfony Validator**.
- Use **custom DataProviders/Processors** for complex logic.
- Optimize performance with `EXPLAIN` for SQL queries.
- Keep **security per operation**, not just globally.
- Explore official docs: [API Platform Docs](https://api-platform.com/docs/)
:::
