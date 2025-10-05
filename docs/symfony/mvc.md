# MVC Pattern

## MVC = Model – View – Controller

Symfony is structured around the **MVC design pattern**, which separates responsibilities:

---

## 1. Model (Data & Business Logic)

- Represents your application's **data** and how it's manipulated
- In Symfony, models are often implemented with **Doctrine Entities** (classes mapped to database tables)
- Business logic (e.g., services, repositories) is usually kept outside controllers for clean code

---

## 2. View (Presentation Layer)

- Defines **how data is displayed** to the user
- Symfony uses **Twig templates** to render HTML pages (or JSON/XML for APIs)
- Views should not contain business logic, only presentation rules

---

## 3. Controller (Request Handling & Coordination)

- Acts as the **bridge** between Model and View
- In Symfony, controllers are PHP classes (often extending `AbstractController`)
- They handle HTTP requests, call services/models, and return a response (usually via a Twig template or JSON)


## MVC Workflow Diagram

![MVC Pattern Diagram](/img/mvc-diagram.png)