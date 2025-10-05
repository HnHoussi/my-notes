# Services

## What is a Service?

- A **service** is any PHP object that performs a task in your application
- Examples: mailers, repositories, custom business logic classes
- Services are **registered in the container** and can be injected wherever needed (controllers, other services, commands, etc.)
- Symfony promotes **Dependency Injection (DI)** to make services reusable and testable

---

## Creating a Service

### 1. Create a PHP Class

```php
<?php

namespace App\Service;

class NotificationService
{
    private string $senderEmail;

    public function __construct(string $senderEmail)
    {
        $this->senderEmail = $senderEmail;
    }

    public function sendEmail(string $recipient, string $subject, string $message): void
    {
        // Logic to send email
        // Example: use Symfony Mailer
        echo "Sending email to {$recipient} from {$this->senderEmail}";
    }
}
```

### 2. Register the Service in the Container (optional if using autowiring)

```yaml
# config/services.yaml
services:
  App\Service\NotificationService:
    arguments:
      $senderEmail: 'no-reply@example.com'
```

> **Note:** With Symfony autowiring and PSR-4 folder structure, most services do not need explicit registration. Symfony will automatically recognize classes under `src/`.

## Using a Service in a Controller

### Dependency Injection via Constructor

```php
<?php

namespace App\Controller;

use App\Service\NotificationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class EmailController extends AbstractController
{
    private NotificationService $notifier;

    public function __construct(NotificationService $notifier)
    {
        $this->notifier = $notifier;
    }

    #[Route('/send-email', name: 'send_email')]
    public function send(): Response
    {
        $this->notifier->sendEmail('user@example.com', 'Hello!', 'This is a test.');

        return new Response('Email sent!');
    }
}
```

### Dependency Injection via Method Argument

```php
#[Route('/send-email', name: 'send_email')]
public function send(NotificationService $notifier): Response
{
    $notifier->sendEmail('user@example.com', 'Hello!', 'This is a test.');

    return new Response('Email sent!');
}
```

> Symfony automatically injects services when type-hinted (autowiring).

## Service Types

### Shared (Singleton) - Default

Same instance is reused throughout the request.

```yaml
services:
  App\Service\ConfigurationService:
    shared: true  # Default behavior
```

### Non-shared (Prototype)

New instance created every time the service is requested.

```yaml
services:
  App\Service\RandomNumberGenerator:
    shared: false
```

## Common Built-in Services

| Service | Description | Usage Example |
|---------|-------------|---------------|
| `LoggerInterface` | PSR-3 compatible logger | `$logger->info('Message')` |
| `MailerInterface` | Symfony Mailer | Send emails |
| `RouterInterface` | Generate URLs | `$router->generate('route_name')` |
| `Security` | Access current user & security checks | `$security->getUser()` |
| `EntityManagerInterface` | Doctrine EntityManager | Database operations |
| `RequestStack` | Access current request | `$requestStack->getCurrentRequest()` |
| `ParameterBagInterface` | Access container parameters | `$params->get('app.version')` |


### Example: Using Logger Service

```php
use Psr\Log\LoggerInterface;

public function index(LoggerInterface $logger): Response
{
    $logger->info('Index page accessed.');
    $logger->error('An error occurred!');
    $logger->warning('This is a warning.');

    return new Response('Logged!');
}
```

### Example: Using Mailer Service

```php
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

public function sendEmail(MailerInterface $mailer): Response
{
    $email = (new Email())
        ->from('sender@example.com')
        ->to('recipient@example.com')
        ->subject('Hello from Symfony!')
        ->text('This is a test email.');

    $mailer->send($email);

    return new Response('Email sent!');
}
```

## Service Autowiring & Autoconfiguration

### Autowiring

Symfony automatically injects dependencies based on type hints.

### Autoconfiguration

Symfony automatically tags services implementing certain interfaces.

```yaml
# config/services.yaml
services:
  _defaults:
    autowire: true      # Automatically inject dependencies
    autoconfigure: true # Automatically apply tags (e.g., for event listeners)
    public: false       # Recommended default (services are private by default)

  # All classes in src/ are available as services
  App\:
    resource: '../src/'
    exclude:
      - '../src/DependencyInjection/'
      - '../src/Entity/'
      - '../src/Kernel.php'
```

### Example of Autoconfigured Tag

```php
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\KernelEvents;

class AppSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onRequest',
        ];
    }

    public function onRequest(): void
    {
        // Handle request event
    }
}
```

Symfony will automatically register it as an event subscriber.

## Example: Service with Dependencies

```php
<?php

namespace App\Service;

use Psr\Log\LoggerInterface;

class UserNotifier
{
    private LoggerInterface $logger;
    private NotificationService $notifier;

    public function __construct(LoggerInterface $logger, NotificationService $notifier)
    {
        $this->logger = $logger;
        $this->notifier = $notifier;
    }

    public function notifyUser(string $email, string $message): void
    {
        $this->notifier->sendEmail($email, 'Notification', $message);
        $this->logger->info("User notified: $email");
    }
}
```

All dependencies are automatically injected via autowiring.

## Service Configuration Examples

### Binding Arguments

```yaml
services:
  _defaults:
    bind:
      $projectDir: '%kernel.project_dir%'
      $appEnv: '%kernel.environment%'
```

### Service Aliases

```yaml
services:
  # Create an alias for a service
  App\Service\NotificationInterface: '@App\Service\EmailNotifier'
```

### Lazy Services

Load services only when they're actually used:

```yaml
services:
  App\Service\HeavyService:
    lazy: true
```

### Tagged Services

```yaml
services:
  App\Service\ReportGenerator:
    tags:
      - { name: 'app.report_generator', priority: 10 }
```

## Debugging Services

### List All Services

```bash
symfony console debug:container
```

### Search for a Specific Service

```bash
symfony console debug:container NotificationService
```

### Show Service Details

```bash
symfony console debug:container App\Service\NotificationService
```

### List Autowiring Types

```bash
symfony console debug:autowiring
```

## Service Locator Pattern

When you need to inject multiple similar services:

```php
use Symfony\Component\DependencyInjection\ServiceLocator;

class ReportService
{
    private ServiceLocator $generators;

    public function __construct(ServiceLocator $generators)
    {
        $this->generators = $generators;
    }

    public function generate(string $type): void
    {
        $generator = $this->generators->get($type);
        $generator->generate();
    }
}
```

```yaml
services:
  App\Service\ReportService:
    arguments:
      $generators: !service_locator
        pdf: '@App\Service\PdfGenerator'
        excel: '@App\Service\ExcelGenerator'
```

## Using Environment Variables in Services

```yaml
services:
  App\Service\ApiClient:
    arguments:
      $apiKey: '%env(API_KEY)%'
      $apiUrl: '%env(API_URL)%'
```

```php
class ApiClient
{
    private string $apiKey;
    private string $apiUrl;

    public function __construct(string $apiKey, string $apiUrl)
    {
        $this->apiKey = $apiKey;
        $this->apiUrl = $apiUrl;
    }
}
```

## Testing Services

```php
use PHPUnit\Framework\TestCase;
use App\Service\NotificationService;

class NotificationServiceTest extends TestCase
{
    public function testSendEmail(): void
    {
        $service = new NotificationService('test@example.com');
        
        // Test your service
        $this->assertNotNull($service);
    }
}
```

For services with dependencies, use mocks:

```php
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class UserNotifierTest extends TestCase
{
    public function testNotifyUser(): void
    {
        $logger = $this->createMock(LoggerInterface::class);
        $notifier = $this->createMock(NotificationService::class);
        
        $service = new UserNotifier($logger, $notifier);
        $service->notifyUser('test@example.com', 'Hello');
        
        // Assert expectations
    }
}
```

## ⚡ Tips & Best Practices

:::note
- **Inject services instead of calling `new`** - improves testability
- **Keep services small and focused** - single responsibility principle
- **Use autowiring and autoconfiguration** - reduces boilerplate
- **Avoid making services public** unless necessary
- **Use interfaces for service contracts** - easier swapping/mocking
- **Services should be stateless** - don't store request-specific data
- **Prefer constructor injection** over setter injection
- **Name services descriptively** - `UserNotifier` instead of `Helper`
  :::