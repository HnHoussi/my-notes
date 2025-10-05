# Forms & Validation

## Concept Overview

In Symfony, **form validation** happens at the **Entity** level.

- A **Constraint** = a validation rule applied to a property
- You can apply **0, 1, or multiple constraints** to each field
- Symfony provides **40+ built-in constraints**
- You can also **create custom constraints**
- Each constraint comes with configurable **options** and **error messages**

## Common Constraints

**Examples:**

`NotBlank` • `Type` • `Email` • `Length` • `Url` • `Regex` • `Range` • `Date` • `Choice` • `UniqueEntity` • `File` • `Image` • `Callback` • `EqualTo` / `NotEqualTo` • `LessThan` / `GreaterThan`

## Validation Syntax in the Entity

Validation rules are defined directly on entity properties using **PHP attributes** (`#[Assert\...]`).

```php
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
class Product
{
    #[Assert\NotBlank(message: 'Please provide a product name!')]
    #[Assert\Length(
        min: 2,
        max: 50,
        minMessage: 'Too short! Minimum 2 characters.',
        maxMessage: 'Too long! Maximum 50 characters.'
    )]
    #[ORM\Column(type: Types::STRING, length: 50)]
    private string $name;

    #[Assert\Type(type: 'integer', message: 'The price must be an integer!')]
    #[Assert\NotBlank(message: 'Please provide a product price!')]
    #[Assert\Range(
        min: 2,
        max: 1000,
        minMessage: 'Minimum price is €2!',
        maxMessage: 'Maximum price is €1000!'
    )]
    #[ORM\Column(type: Types::INTEGER)]
    private int $price;

    // Getters and setters...
}
```

## Creating a Form Type

In Symfony, a form corresponds to an Entity. Form classes typically end with `Type` (e.g., `ProductType`).

```bash
symfony console make:form
```

This command will create a form class in `src/Form/ProductType.php`.

### Example Form Type

```php
<?php

namespace App\Form;

use App\Entity\Product;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ProductType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Product Name',
                'attr' => ['placeholder' => 'Enter product name']
            ])
            ->add('price', IntegerType::class, [
                'label' => 'Price (€)',
                'attr' => ['placeholder' => 'Enter price']
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Product::class,
        ]);
    }
}
```

## Using a Form in a Controller

```php
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/product/new', name: 'product_create', methods: ['GET', 'POST'])]
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        $product = new Product();
        $productForm = $this->createForm(ProductType::class, $product);

        $productForm->handleRequest($request);

        if ($productForm->isSubmitted() && $productForm->isValid()) {
            // Persist the product to the database
            $em->persist($product);
            $em->flush();

            $this->addFlash('success', 'Product created successfully!');

            return $this->redirectToRoute('main_home');
        }

        return $this->render('product/create.html.twig', [
            'productForm' => $productForm,
        ]);
    }
}
```

## Displaying a Form in Twig

### Simple Form Rendering

```php
<div>
  <h2>Add a Product</h2>
  {{ form(productForm) }}
</div>
```

### Custom Form Rendering

```php
{{ form_start(productForm) }}
  
  <div class="form-group">
    {{ form_label(productForm.name) }}
    {{ form_widget(productForm.name, {'attr': {'class': 'form-control'}}) }}
    {{ form_errors(productForm.name) }}
  </div>

  <div class="form-group">
    {{ form_label(productForm.price) }}
    {{ form_widget(productForm.price, {'attr': {'class': 'form-control'}}) }}
    {{ form_errors(productForm.price) }}
  </div>

  <button type="submit" class="btn btn-primary">Create Product</button>

{{ form_end(productForm) }}
```

## Using Form Themes

### Global Theme (for all forms)

Add this to `config/packages/twig.yaml`:

```yaml
twig:
  form_themes: ['bootstrap_5_layout.html.twig']
```

### Specific Theme (for one form only)

Add this at the top of your Twig template:

```php
{% form_theme productForm 'bootstrap_5_layout.html.twig' %}
```

### Available Form Themes

- `bootstrap_5_layout.html.twig` - Bootstrap 5
- `bootstrap_4_layout.html.twig` - Bootstrap 4
- `foundation_5_layout.html.twig` - Foundation
- `tailwind_2_layout.html.twig` - Tailwind CSS

## Displaying Flash Messages in Twig

In your `base.html.twig` file:

```php
{% for label, messages in app.flashes %}
  {% for message in messages %}
    <div class="alert alert-{{ label }}">
      {{ message }}
    </div>
  {% endfor %}
{% endfor %}
```

### Flash Message Types

```php
// Success message
$this->addFlash('success', 'Product created successfully!');

// Error message
$this->addFlash('danger', 'An error occurred!');

// Warning message
$this->addFlash('warning', 'Please be careful!');

// Info message
$this->addFlash('info', 'Here is some information.');
```

## Common Form Field Types

| Field Type          | Description                          | Example                                    |
|---------------------|--------------------------------------|--------------------------------------------|
| `TextType`          | Single-line text input               | `->add('name', TextType::class)`           |
| `TextareaType`      | Multi-line text input                | `->add('description', TextareaType::class)`|
| `EmailType`         | Email input with validation          | `->add('email', EmailType::class)`         |
| `IntegerType`       | Integer number input                 | `->add('quantity', IntegerType::class)`    |
| `NumberType`        | Decimal number input                 | `->add('price', NumberType::class)`        |
| `ChoiceType`        | Dropdown or radio buttons            | `->add('category', ChoiceType::class)`     |
| `EntityType`        | Choose from database entities        | `->add('category', EntityType::class)`     |
| `DateType`          | Date picker                          | `->add('createdAt', DateType::class)`      |
| `FileType`          | File upload                          | `->add('image', FileType::class)`          |
| `CheckboxType`      | Checkbox                             | `->add('agree', CheckboxType::class)`      |
| `PasswordType`      | Password input (hidden text)         | `->add('password', PasswordType::class)`   |


## ⚡ Tips & Best Practices

### Security Considerations

```php
// CSRF protection is enabled by default
// Disable only if you have a good reason
$builder->add('submit', SubmitType::class, [
    'attr' => ['class' => 'btn btn-primary']
]);

// In your form type, CSRF is automatically handled
// You can customize the token ID:
public function configureOptions(OptionsResolver $resolver): void
{
    $resolver->setDefaults([
        'data_class' => Product::class,
        'csrf_protection' => true,
        'csrf_field_name' => '_token',
        'csrf_token_id'   => 'product_item',
    ]);
}
```

:::note
- Validation messages are customizable per constraint
- You can validate data manually using the validator service
- Form themes can use Bootstrap, Tailwind, or custom layouts
- Always handle both GET and POST requests in form controllers
- Use flash messages to display success/error feedback to the user
- For complex validation logic, create a custom constraint class
- Keep form types simple - one form per entity
- Use `EntityType` for selecting related entities from the database
- Add CSRF protection (enabled by default in Symfony forms)
:::