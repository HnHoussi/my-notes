# MVC : Controller

## Create and Inspect Controllers

```bash
# Create a new controller
symfony console make:controller NameController

# Check available routes and controllers
symfony console debug:router
```

## Example: Basic Symfony Controller

```php
<?php

// Defines the namespace for this class. In Symfony, controllers usually live in App\Controller.
namespace App\Controller;

// Importing dependencies
use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// "final" means this class cannot be extended by another class.
final class UserController extends AbstractController
{
    // Lists all users
    #[Route('/users', name: 'user_index')]
    public function showAll(UserRepository $userRepository): Response
    {
        $users = $userRepository->findAll();

        return $this->render('user/index.html.twig', [
            'users' => $users,
        ]);
    }

    // Create a new user
    #[Route('/user/create', name: 'user_create')]
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->persist($user);
            $em->flush();

            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/create.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    // Display a single user by ID
    #[Route('/user/{id}', name: 'user_show')]
    public function showUser(User $user): Response
    {
        return $this->render('user/show.html.twig', [
            'user' => $user,
        ]);
    }

    // Edit an existing user
    #[Route('/user/edit/{id}', name: 'user_edit')]
    public function edit(Request $request, User $user, EntityManagerInterface $em): Response
    {
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $em->flush();
            return $this->redirectToRoute('user_index');
        }

        return $this->render('user/edit.html.twig', [
            'form' => $form->createView(),
            'user' => $user,
        ]);
    }

    // Delete a user
    #[Route('/user/delete/{id}', name: 'user_delete', methods: ['POST'])]
    public function delete(User $user, EntityManagerInterface $em): Response
    {
        $em->remove($user);
        $em->flush();

        return $this->redirectToRoute('user_index');
    }
}
```

## Utility Methods

### Display and Responses

```php
// Render a Twig template
$this->render('template.html.twig', ['var' => $value]);

// Return JSON response
$this->json(['status' => 'ok']);

// Throw a 404 error
throw $this->createNotFoundException('Page not found');
```

### Routing Helpers

```php
// Redirect to a named route
$this->redirectToRoute('route_name');

// Redirect to a URL
$this->redirect('/some/url');

// Generate a URL from a route name
$this->generateUrl('route_name', ['id' => 123]);
```

### Security

```php
// Get the current logged-in user
$user = $this->getUser();

// Check if user has a role
$this->isGranted('ROLE_ADMIN');

// Deny access unless user has a role
$this->denyAccessUnlessGranted('ROLE_ADMIN');
```

### Model and Data

```php
// Create a form
$form = $this->createForm(SomeType::class, $entity);
```

### Flash Messages

```php
// Add a flash message (will be displayed once on next page)
$this->addFlash('success', 'Action completed successfully!');
$this->addFlash('error', 'Something went wrong!');
$this->addFlash('warning', 'Please be careful!');
$this->addFlash('info', 'Here is some information.');
```

## Routing

Each URL corresponds to a controller method in Symfony.

You can define routes in two main ways:

### 1. Attributes (Annotations)

Best for small or medium-sized projects.

```php
#[Route('/hello', name: 'app_hello')]
public function index(): Response
{
    return $this->render('hello/index.html.twig');
}
```

**Route with Parameters:**

```php
#[Route('/user/{id}', name: 'user_show', requirements: ['id' => '\d+'])]
public function show(int $id): Response
{
    // ...
}
```

**Route with HTTP Methods:**

```php
#[Route('/user/delete/{id}', name: 'user_delete', methods: ['POST', 'DELETE'])]
public function delete(User $user): Response
{
    // ...
}
```

### 2. YAML Configuration

Better for large, enterprise-level applications.

```yaml
# config/routes.yaml
app_hello:
    path: /hello
    controller: App\Controller\HelloController::index

user_show:
    path: /user/{id}
    controller: App\Controller\UserController::show
    requirements:
        id: '\d+'
```

## ⚡ Tips & Best Practices

### Security Tips

```php
// Protect entire controller
#[IsGranted('ROLE_USER')]
class UserController extends AbstractController
{
    // All methods require ROLE_USER
}

// Protect specific action
#[Route('/admin', name: 'admin_dashboard')]
#[IsGranted('ROLE_ADMIN')]
public function dashboard(): Response
{
    // Only ROLE_ADMIN can access
}
```

:::note
- Controllers live in `src/Controller/`
- Each method should return a `Response` object
- Use `#[Route()]` attributes for simplicity and readability
- Use forms with `$this->createForm()` for entity handling
- Use `$this->redirectToRoute()` instead of hardcoded URLs
- Always sanitize and validate user input before persisting
- Keep controllers thin - move business logic to services
- Use dependency injection instead of service location
- Add HTTP method restrictions on destructive actions (POST/DELETE)
:::
