# MVC : View (Twig)

## Installation

Install Twig (not needed if you created your project with `--webapp`)

```bash
composer require twig
```

## Control Structures

### Conditional

```php
{% if user %}
  Hello {{ user.name }}      {# If "user" exists, greet with name #}
{% elseif guest %}
  Hello Guest                {# If "guest" exists but no user #}
{% else %}
  Hello Stranger             {# Default greeting #}
{% endif %}
```

### Loops

```php
{% for item in items %}
  {{ loop.index }} - {{ item }}   {# "loop.index" = 1-based counter #}
{% else %}
  No items found.                 {# Runs if list is empty #}
{% endfor %}
```

### Set Variables

```php
{% set total = price * quantity %}
```

## Includes & Embeds

### Include a Partial

```php
{% include 'partials/menu.html.twig' %}
```

Reuses another template's content (like components or fragments).

### Embed a Component

```php
{% embed 'components/card.html.twig' %}
  {% block title %}Overridden Title{% endblock %}
{% endembed %}
```

Embeds another template and allows overriding its blocks.

## Tag Types in Twig

| Tag Type | Syntax      | Description                                         |
|----------|-------------|-----------------------------------------------------|
| Output   | `{{ ... }}` | Prints a variable or expression                     |
| Logic    | `{% ... %}` | Control structures (if, for, set, extends, etc.)    |
| Comment  | `{# ... #}` | Ignored by Twig (does not appear in HTML)           |


## Forms

Twig integrates with Symfony Forms automatically.

```php
{{ form_start(form) }}
  {{ form_widget(form) }}
  <button type="submit">Save</button>
{{ form_end(form) }}
```

- `form_start()` → Opens `<form>` tag with proper attributes
- `form_widget()` → Renders all fields
- `form_end()` → Closes the `<form>` properly

## Variables & Output

```php
{{ variable }}           {# Escaped output (safe against XSS) #}
{{ variable|raw }}       {# Unescaped output (renders HTML) #}
{{ user.name }}          {# Access object property or array key #}
{{ items[0] }}           {# Access list element by index #}
```

## Template Inheritance

### Base Layout (base.html.twig)

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <title>{% block title %}My App{% endblock %}</title>
  </head>
  <body>
    {% block body %}{% endblock %}
  </body>
</html>
```

### Child Template (child.html.twig)

```php
{% extends 'base.html.twig' %}

{% block title %}Homepage{% endblock %}

{% block body %}
  <h1>Welcome!</h1>
{% endblock %}
```

## Filters

| Example                                           | Description              | Output           |
|---------------------------------------------------|--------------------------|------------------|
| `{{ 'hello'\|upper }}`                            | Uppercase                | HELLO            |
| `{{ 'HELLO'\|lower }}`                            | Lowercase                | hello            |
| `{{ 'twig'\|capitalize }}`                        | Capitalize first letter  | Twig             |
| `{{ 1234.567\|number_format(2, '.', ',') }}`      | Format number            | 1,234.57         |
| `{{ 'now'\|date('Y-m-d H:i') }}`                  | Format date/time         | 2025-01-15 14:30 |
| `{{ text\|length }}`                              | Length of string/array   | 10               |
| `{{ text\|default('N/A') }}`                      | Fallback if undefined    | N/A              |


## Rules & Conventions

- Twig templates use the `.html.twig` extension
- One Twig file per controller method (by convention)
- Template file named after the controller's method
- Placed in a folder named after the controller
- Use lowercase filenames (no uppercase letters)

### Example Structure:

```
templates/
└── product/
    ├── index.html.twig
    └── show.html.twig
```

## Twig Functions

| Function   | Example                                    | Description                                      |
|------------|--------------------------------------------|--------------------------------------------------|
| `path()`   | `{{ path('route_name', {id: 5}) }}`        | Generate relative URL for a Symfony route        |
| `url()`    | `{{ url('route_name') }}`                  | Generate absolute URL                            |
| `asset()`  | `{{ asset('images/logo.png') }}`           | Path to public assets (CSS, JS, images)          |
| `dump()`   | `{{ dump(var) }}`                          | Debug variable (dev mode only)                   |