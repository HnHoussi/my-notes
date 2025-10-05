# MVC : Model

## Create and Manage Entities

### Create an Entity

```bash
symfony console make:entity NameEntity
```

### Run Migrations (after entity changes)

```bash
symfony console make:migration
symfony console doctrine:migrations:migrate
```

## Doctrine Repository

Used for fetching entities from the database — the **R (Read)** in CRUD.

### Two Ways to Retrieve a Repository

#### 1. Dependency Injection (Recommended)

No need to ask for the EntityManager manually.

```php
public function index(ProductRepository $repo): Response
{
    $products = $repo->findAll();
    // ...
}
```

#### 2. From the EntityManager

You ask the EntityManager for a repository for a specific entity class.

```php
$repo = $entityManager->getRepository(Product::class);
$products = $repo->findAll();
```

### Main Repository Methods

```php
$repo->findAll();                         // Fetch all entities
$repo->find($id);                         // Find by primary key
$repo->findOneBy(['name' => 'lorem']);    // Find a single entity by criteria
$repo->findBy([], ['price' => 'DESC'], 30, 0); // Filter + sort + limit + offset
$repo->count([]);                         // Count entities
```

## Entity Syntax

```php
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks] // Enables PrePersist, PreUpdate, etc.
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: 'float')]
    private float $price;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTime $updatedAt = null;

    // --- Lifecycle Callbacks ---
    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        // Called only before INSERT
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        // Called each time before UPDATE
        $this->updatedAt = new \DateTime();
    }

    // --- Getters & Setters ---
    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }

    public function getPrice(): float { return $this->price; }
    public function setPrice(float $price): self { $this->price = $price; return $this; }

    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function getUpdatedAt(): ?\DateTime { return $this->updatedAt; }
}
```

## Entity Manager (Doctrine)

The EntityManager handles the **C (Create)**, **U (Update)**, and **D (Delete)** parts of CRUD.

### Injecting the EntityManager

```php
use Doctrine\ORM\EntityManagerInterface;

public function __construct(private EntityManagerInterface $em) {}
```

or directly in a controller action:

```php
public function create(EntityManagerInterface $em): Response
```

### Common EntityManager Methods

```php
$em->persist($object);      // Stage new entity (INSERT)
$em->remove($object);       // Delete entity (DELETE)
$em->flush();               // Commit changes (INSERT/UPDATE/DELETE)
$em->createQuery($dql);     // Custom DQL queries
$em->getRepository(Class::class); // Access repository
```

## Fixtures

Fixtures allow you to easily create datasets for testing or seeding.

### Install Fixtures

```bash
composer require --dev orm-fixtures
```

### Execute Fixtures

```bash
symfony console doctrine:fixtures:load
```

### Example with Faker

```bash
composer require --dev fakerphp/faker
```

```php
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use App\Entity\Product;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create();

        for ($i = 0; $i < 20; $i++) {
            $product = new Product();
            $product->setName($faker->word);
            $product->setPrice($faker->randomFloat(2, 10, 100));
            $manager->persist($product);
        }

        $manager->flush();
    }
}
```

## Relations Between Entities

Objects can be associated with one or several others.

### Add Relations

Use:

```bash
symfony console make:entity
```

to add relationships between existing entities.

> 💡 **Note:**
> - Doctrine handles most of the SQL logic automatically (lazy loading, joins, etc.)
> - Be mindful of query counts and performance

### Common Relation Types

#### ManyToOne / OneToMany

Foreign key is stored on the **Many** side.

```php
#[ORM\ManyToOne(inversedBy: 'products')]
private ?Category $category = null;

#[ORM\OneToMany(mappedBy: 'category', targetEntity: Product::class)]
private Collection $products;
```

#### OneToOne

You choose where the foreign key is stored.

```php
#[ORM\OneToOne(inversedBy: 'profile', cascade: ['persist', 'remove'])]
private ?User $user = null;
```

#### ManyToMany

Doctrine creates a pivot table automatically. You can customize the table name but cannot easily add extra columns.

```php
#[ORM\ManyToMany(targetEntity: Tag::class)]
#[ORM\JoinTable(name: 'product_tag')]
private Collection $tags;
```

## Useful Commands

```bash
# Validate entity mappings
symfony console doctrine:schema:validate

# Run raw SQL
symfony console doctrine:query:sql "SELECT * FROM product"

# Keep existing data when loading fixtures
symfony console doctrine:fixtures:load --append
```