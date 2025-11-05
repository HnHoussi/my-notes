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

---

## Voters & Advanced Authorization

### What Are Voters?

Voters are part of Symfony's **authorization system**.  
They are used to make **fine-grained decisions** about whether a user can perform a specific **action** on a specific **object**.

Roles (like `ROLE_ADMIN`) are **coarse-grained** — they define general access levels.  
Voters, on the other hand, are **context-aware** — they decide access dynamically.

### Why Use a Voter?

Use a voter when:
- You need to decide if a user can **edit, view, or delete** a specific entity (e.g., `Post`, `Order`, `Project`)
- The decision depends on **object properties** (like the author of a post)
- You want to **avoid hardcoding logic** in controllers

### Example Use Case

Let's say only the author of a post or an admin can edit it.

#### Create a Voter

```bash
symfony console make:voter PostVoter
```

This generates something like:

```php
<?php

namespace App\Security\Voter;

use App\Entity\Post;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class PostVoter extends Voter
{
    public const EDIT = 'POST_EDIT';
    public const VIEW = 'POST_VIEW';
    public const DELETE = 'POST_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [self::EDIT, self::VIEW, self::DELETE])
            && $subject instanceof Post;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();

        // User must be logged in
        if (!$user instanceof UserInterface) {
            return false;
        }

        /** @var Post $post */
        $post = $subject;

        return match ($attribute) {
            self::VIEW => true, // Everyone can view
            self::EDIT => $this->canEdit($post, $user),
            self::DELETE => $this->canDelete($post, $user),
            default => false,
        };
    }

    private function canEdit(Post $post, UserInterface $user): bool
    {
        // Author can edit, or admin
        return $user === $post->getAuthor() || in_array('ROLE_ADMIN', $user->getRoles());
    }

    private function canDelete(Post $post, UserInterface $user): bool
    {
        // Only admin can delete
        return in_array('ROLE_ADMIN', $user->getRoles());
    }
}
```

#### Use It in a Controller

```php
// Throw exception if user can't edit
$this->denyAccessUnlessGranted('POST_EDIT', $post);

// Check conditionally
if ($this->isGranted('POST_EDIT', $post)) {
    // User can edit the post
}

// In a route method
#[Route('/post/{id}/edit', name: 'post_edit')]
#[IsGranted('POST_EDIT', subject: 'post')]
public function edit(Post $post): Response
{
    // Only users who can edit will reach here
}
```

#### Use It in Twig

```php
{% if is_granted('POST_EDIT', post) %}
  <a href="{{ path('post_edit', {id: post.id}) }}">Edit</a>
{% endif %}

{% if is_granted('POST_DELETE', post) %}
  <a href="{{ path('post_delete', {id: post.id}) }}">Delete</a>
{% endif %}
```

### Difference Between Roles and Voters

| Feature | Roles | Voters |
|---------|-------|--------|
| **Level** | Broad / Global | Fine-grained / Contextual |
| **Use case** | General access (admin, user, moderator) | Specific actions (edit post, view order) |
| **Data context** | None (user only) | Has access to the object (entity) |
| **Definition** | In `security.yaml` | Custom PHP class |
| **Example** | `ROLE_ADMIN` | `'POST_EDIT'` |
| **Check method** | `is_granted('ROLE_ADMIN')` | `is_granted('POST_EDIT', $post)` |

### 💡 When to Use Which

- Use **roles** to define general access levels (Admin, User, Moderator)
- Use **voters** when access depends on the user's relationship to specific data
- You can **combine both** — voters can check both roles and object ownership

### 💡 Voter Best Practices

- Keep voter logic focused on **one entity type** (e.g., `PostVoter`, `OrderVoter`)
- Use **constants for attributes** (`VIEW`, `EDIT`, `DELETE`) to avoid typos
- Return `false` early if the user isn't authenticated
- Combine roles and voters for maximum flexibility
- Always call `isGranted()` or `denyAccessUnlessGranted()` — never expose direct role checks in templates for sensitive actions
- Extract complex logic into private methods for better readability

---

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

---

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

---

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

---

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

---
## CSRF Protection (Cross-Site Request Forgery)

**What is CSRF ?** CSRF is an attack where a malicious website tricks your browser into performing unwanted actions on a trusted site where you're logged in. For example, if you're logged into your bank, a malicious site could try to submit a transfer form using your authenticated session.

**How Symfony Protects You:** Symfony automatically generates unique, random tokens for each form and validates them on submission. Since attackers can't access these tokens (due to browser Same-Origin Policy), they can't forge valid requests from external sites.

**In Practice:** CSRF protection is **enabled by default** in Symfony forms - no configuration needed! When you use `{{ form_start(form) }}`, Symfony automatically includes a hidden `_csrf_token` field. On submission, it validates the token and rejects requests without valid tokens.
```php
// Forms automatically include CSRF protection
{{ form_start(form) }}
    {{ form_widget(form) }}
    <button type="submit">Submit</button>
{{ form_end(form) }}
// Hidden field <input type="hidden" name="_csrf_token" value="..."> is added automatically
```

**For Manual Forms or AJAX:**
```php
// Generate token in controller
$token = $this->container->get('security.csrf.token_manager')
    ->getToken('intention-name')->getValue();

// Include in form
<input type="hidden" name="_csrf_token" value="{{ csrf_token('intention-name') }}">
```

**Best Practice:** Keep CSRF protection enabled (default) for all state-changing operations (POST, PUT, DELETE). Only disable it for stateless APIs that use token-based authentication instead of sessions.

---

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

# Generate a voter
symfony console make:voter
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
- Use voters for fine-grained access control on specific entities
- Combine roles (broad permissions) with voters (contextual permissions) for robust authorization
:::