# API Platform

API Platform is a powerful framework built on Symfony for creating REST, GraphQL, and JSON:API web services quickly.

---

## Installation

### Add API Platform to a Symfony project
```bash
# Using Composer
composer require api

# Install admin & client (optional, for React/Vue)
composer require symfony/webpack-encore-bundle
npm install @api-platform/admin @api-platform/client
```

### Verify installation
```bash
bin/console about
bin/console debug:router
```

## Directory Structure

- `src/Entity/` → Doctrine entities (resources).
- `config/packages/api_platform.yaml` → API Platform config.
- `src/Controller/` → Custom controllers (optional).
- `src/DataProvider/` → Custom providers (for advanced use).

## Basic Usage

### Create an API Resource
```php
<?php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ApiResource]
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

✅ This automatically exposes CRUD endpoints:
- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `PUT /books/{id}`
- `DELETE /books/{id}`

## Common Annotations

### Expose as an API Resource
```php
#[ApiResource]
```

### Operations
```php
#[ApiResource(
    operations: [
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
        new GetCollection()
    ]
)]
```

### Serialization Groups
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

## Filtering & Pagination

### Enable filtering
```bash
composer require api-platform/doctrine-orm
```

```php
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['title' => 'partial'])]
class Book { ... }
```

✅ Example: `GET /books?title=harry`

## Pagination
Enabled by default:
```yaml
# config/packages/api_platform.yaml
api_platform:
  collection:
    pagination:
      enabled: true
      items_per_page: 10
```

## Security

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

## Useful Commands

```bash
bin/console debug:router       # Show routes
bin/console make:entity        # Create an entity
bin/console doctrine:migrations:diff
bin/console doctrine:migrations:migrate
bin/console doctrine:fixtures:load
```

## GraphQL Support

Enable in config:
```yaml
# config/packages/api_platform.yaml
api_platform:
  graphql:
    enabled: true
```

Example queries:
```graphql
{
  books {
    edges {
      node {
        id
        title
      }
    }
  }
}
```

## Real-Life Patterns

### Custom Controller for an Operation
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

### Custom Data Provider
```php
use ApiPlatform\State\ProviderInterface;

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
        // custom save logic (e.g. external API call)
    }
}
```

### File Uploads
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

### JWT Authentication (with LexikJWT)
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

Login endpoint: `POST /login_check`


## Testing the API

- Swagger UI → `/api`
- GraphQL Playground → `/graphql`
- JSON:API / Hydra supported out of the box.

---

:::note

⚡ **Tips**
- Use `EXPLAIN` in SQL to optimize performance.
- Always configure **serialization groups** for proper input/output control.
- Use **custom DataProviders & DataPersisters** when default CRUD is not enough.
:::
