# Security & Authentication

## Steps to Create an Authentication System

### 1. Create the User Entity

```bash
symfony console make:user
```

This creates a `User` entity with email/username and password fields, implementing `UserInterface`.

### 2. Generate the Authentication System

```bash
symfony console make:auth
```

This generates:
- An authenticator class (e.g., `AppAuthenticator`)
- A login form controller and template
- Updates `security.yaml` with authentication configuration

### 3. Create the Registration Form

```bash
symfony console make:registration-form
```

This creates:
- A registration controller
- A registration form type
- A registration template

### 4. Optional Additional Features

- **Enable "Remember Me" functionality** - Keep users logged in across sessions
- **Password reset system** - Allow users to recover forgotten passwords
- **Email confirmation after registration** - Verify user email addresses
- **Two-Factor Authentication (2FA)** - Add extra security layer

---

## Roles & Authorization

Roles are strings that conventionally start with `ROLE_`, e.g., `ROLE_USER`, `ROLE_ADMIN`.

Roles can be hierarchical, so one role can include permissions of another.

### Role Hierarchy Example

In `config/packages/security.yaml`:

```yaml
security:
  role_hierarchy:
    ROLE_ADMIN: ROLE_USER
    ROLE_SUPER_ADMIN: ROLE_ADMIN
```

This means:
- `ROLE_ADMIN` inherits all permissions from `ROLE_USER`
- `ROLE_SUPER_ADMIN` inherits all permissions from `ROLE_ADMIN` (and transitively from `ROLE_USER`)

### Access Control

You can protect routes with access control:

```yaml
security:
  access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/profile, roles: ROLE_USER }
    - { path: ^/api, roles: ROLE_API_USER }
```

## Controller Security Checks

### Using Attributes (Recommended)

```php
use Symfony\Component\Security\Http\Attribute\IsGranted;

// Protect entire controller
#[IsGranted('ROLE_USER')]
class ProfileController extends AbstractController
{
    // All methods require ROLE_USER
}

// Protect specific action
#[Route('/admin/dashboard')]
#[IsGranted('ROLE_ADMIN')]
public function dashboard(): Response
{
    // Only ROLE_ADMIN can access
}
```

### Using Methods

```php
// Check if user has a role
if ($this->isGranted('ROLE_ADMIN')) {
    // User has ROLE_ADMIN
}

// Throw exception if user doesn't have role
$this->denyAccessUnlessGranted('ROLE_ADMIN');

// Get current user
$user = $this->getUser();
if ($user) {
    // User is logged in
}
```

## Twig Syntax for Security Checks

```php
{# Check if user is logged in #}
{% if app.user %}
  <p>Welcome, {{ app.user.username }}!</p>
  <a href="{{ path('app_logout') }}">Logout</a>
{% else %}
  <a href="{{ path('app_login') }}">Login</a>
{% endif %}

{# Check for specific role #}
{% if is_granted('ROLE_ADMIN') %}
  <a href="{{ path('admin_dashboard') }}">Admin Panel</a>
{% endif %}

{# Display user email #}
{% if app.user %}
  Logged in as: {{ app.user.email }}
{% endif %}
```

### Twig Security Functions

- `is_granted('ROLE_X')` → Check if the current user has a role
- `app.user` → Access the currently logged-in user object
- `app.user.username` → Get username
- `app.user.email` → Get email

## Password Reset (Forgot Password)

### Install the Reset-Password Bundle

```bash
composer require symfonycasts/reset-password-bundle
```

### Generate the Reset-Password System

```bash
symfony console make:reset-password
```

This provides:
- Routes for requesting and resetting passwords
- Forms for email input and new password
- Email workflow to securely reset user passwords
- Token-based verification system

### Send Reset Email

```php
use SymfonyCasts\Bundle\ResetPassword\ResetPasswordHelperInterface;

public function requestReset(
    Request $request, 
    ResetPasswordHelperInterface $resetPasswordHelper
): Response {
    $email = $request->request->get('email');
    $user = $userRepository->findOneBy(['email' => $email]);
    
    if ($user) {
        $resetToken = $resetPasswordHelper->generateResetToken($user);
        // Send email with reset link containing $resetToken
    }
}
```

## security.yaml Configuration

Complete example of `config/packages/security.yaml`:

```yaml
security:
  # How passwords are hashed
  password_hashers:
    Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface: 'auto'

  # User sources (providers)
  providers:
    app_user_provider:
      entity:
        class: App\Entity\User
        property: email  # Can be 'username' or 'email'

  # Firewalls
  firewalls:
    # Dev firewall for profiler, assets, etc.
    dev:
      pattern: ^/(_(profiler|wdt)|css|images|js)/
      security: false

    # Main firewall (active by default)
    main:
      lazy: true
      provider: app_user_provider

      # Authenticator class for login
      custom_authenticator: App\Security\AppAuthenticator

      # Logout configuration
      logout:
        path: app_logout
        target: app_home  # Redirect after logout

      # Remember Me functionality
      remember_me:
        secret: '%kernel.secret%'
        lifetime: 604800  # 1 week in seconds
        path: /
        always_remember_me: true  # Optional: auto-check "Remember Me"

  # Access control rules
  access_control:
    - { path: ^/admin, roles: ROLE_ADMIN }
    - { path: ^/profile, roles: ROLE_USER }
    # Allow anyone to access login and register pages
    - { path: ^/login, roles: PUBLIC_ACCESS }
    - { path: ^/register, roles: PUBLIC_ACCESS }

  # Role hierarchy
  role_hierarchy:
    ROLE_ADMIN: ROLE_USER
    ROLE_SUPER_ADMIN: ROLE_ADMIN
```

### Configuration Notes:

- **password_hashers** → Symfony hashes passwords automatically using modern algorithms
- **providers** → Define how users are loaded (database, LDAP, memory, etc.)
- **firewalls** → Define authentication rules for different sections of your app
- **remember_me** → Allows "Remember Me" cookies for persistent login
- **access_control** → Protects routes based on roles
- **role_hierarchy** → Define role inheritance

## User Entity Example

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    // Getters and setters...

    public function getRoles(): array
    {
        $roles = $this->roles;
        // Guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function eraseCredentials(): void
    {
        // Clear temporary sensitive data if any
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }
}
```

## Password Hashing

### Hash a Password

```php
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

public function register(
    UserPasswordHasherInterface $passwordHasher
): Response {
    $user = new User();
    $user->setEmail('user@example.com');
    
    // Hash the password
    $hashedPassword = $passwordHasher->hashPassword(
        $user,
        'plain-text-password'
    );
    $user->setPassword($hashedPassword);
    
    // Persist user...
}
```

### Verify a Password

```php
$isValid = $passwordHasher->isPasswordValid(
    $user,
    'plain-text-password'
);
```
## ⚡ Tips & Best Practices

### Useful Security Commands

```bash
# Check for security vulnerabilities
symfony console security:check

# Create a new user (if you have a command for it)
symfony console app:create-user

# List all users (custom command)
symfony console app:list-users

# Hash a password manually
symfony console security:hash-password
```

:::note
- Never store passwords in plain text - always use password hashing
- Use `ROLE_USER` as the default role for all authenticated users
- Implement email verification for new registrations
- Use HTTPS in production to protect authentication cookies
- Set appropriate session timeouts
- Implement rate limiting on login attempts
- Use CSRF protection on forms (enabled by default)
- Consider Two-Factor Authentication for sensitive applications
- Regular security audits with `symfony console security:check`
- Keep Symfony and dependencies up to date
  :::
