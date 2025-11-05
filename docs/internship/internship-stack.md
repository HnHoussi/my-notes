# Internship Stack Overview


```
                    ┌─────────────────────────────────────────────────────────────┐
                    │                         Frontend Layer                      │
                    │  ┌──────────────────────────────────────────────────────┐   │
                    │  │  Next.js (React + TypeScript)                        │   │
                    │  │  - UI Components                                     │   │
                    │  │  - Client & Server-Side Rendering                    │   │
                    │  │  - Routing                                           │   │
                    │  │  - API Calls                                         │   │
                    │  └──────────────────────────────────────────────────────┘   │
                    └─────────────────────────────────────────────────────────────┘
                                                  ↕ HTTP/REST API
                    ┌─────────────────────────────────────────────────────────────┐
                    │                         Backend Layer                       │
                    │  ┌──────────────────────────────────────────────────────┐   │
                    │  │  API Platform (on Symfony)                           │   │
                    │  │  - REST/GraphQL API                                  │   │
                    │  │  - Automatic CRUD endpoints                          │   │
                    │  │  - Serialization                                     │   │
                    │  │  - Validation                                        │   │
                    │  │  - Documentation (Swagger/OpenAPI)                   │   │
                    │  └──────────────────────────────────────────────────────┘   │
                    │  ┌──────────────────────────────────────────────────────┐   │
                    │  │  Symfony Framework                                   │   │
                    │  │  - Business Logic                                    │   │
                    │  │  - Authentication & Security                         │   │
                    │  │  - Doctrine ORM                                      │   │
                    │  │  - Custom Services                                   │   │
                    │  └──────────────────────────────────────────────────────┘   │
                    └─────────────────────────────────────────────────────────────┘
                                                  ↕ SQL Queries
                    ┌─────────────────────────────────────────────────────────────┐
                    │                        Database Layer                       │
                    │  ┌──────────────────────────────────────────────────────┐   │
                    │  │  PostgreSQL                                          │   │
                    │  │  - Data Storage                                      │   │
                    │  │  - Relationships                                     │   │
                    │  │  - Transactions                                      │   │
                    │  └──────────────────────────────────────────────────────┘   │
                    └─────────────────────────────────────────────────────────────┘
```

---

## Technology Responsibilities

### 1. **PostgreSQL**
**Role:** Data persistence and management

**Responsibilities:**
- Store all application data (users, products, orders, etc.)
- Maintain data relationships (foreign keys, joins)
- Ensure data integrity and consistency
- Handle complex queries and transactions
- Provide ACID compliance (Atomicity, Consistency, Isolation, Durability)

**Why PostgreSQL?**
- Advanced features (JSON support, full-text search, array types)
- Excellent performance for complex queries
- Strong data integrity
- Open-source and widely adopted


### 2. **Symfony** (Backend Framework)
**Role:** Server-side application framework

**Responsibilities:**
- Business logic implementation
- Database interaction via Doctrine ORM
- Authentication and authorization
- Validation rules
- Email sending, file uploads, background jobs
- Custom services and commands
- Security management

**Key Features:**
- Mature, enterprise-ready PHP framework
- Excellent documentation
- Large ecosystem of bundles (plugins)
- Strong conventions and best practices


### 3. **API Platform** (API Layer)
**Role:** REST/GraphQL API builder on top of Symfony

**Responsibilities:**
- **Automatically generate API endpoints** from Doctrine entities
- Handle **serialization/deserialization** (JSON ↔ PHP objects)
- Provide **pagination, filtering, and sorting** out of the box
- Generate **OpenAPI/Swagger documentation** automatically
- Handle **content negotiation** (JSON, JSON-LD, etc.)
- Implement **HATEOAS** (Hypermedia as the Engine of Application State)
- Validation and error handling

**Why API Platform?**
- Saves tons of boilerplate code
- RESTful best practices by default
- Auto-generated documentation
- Easy integration with React/Next.js frontends


### 4. **React**
**Role:** Component-based user interface

**Responsibilities:**
- Build reusable UI components
- Manage component state
- Handle user interactions
- Render dynamic content
- Client-side interactivity

**Key Features:**
- Component-based architecture
- Virtual DOM for performance
- Large ecosystem of libraries
- Declarative UI patterns


### 5. **Next.js**
**Role:** Full-stack React framework

**Responsibilities:**
- **Routing** (file-based routing system)
- **Server-Side Rendering (SSR)** - Render pages on the server
- **Static Site Generation (SSG)** - Pre-render pages at build time
- **API Routes** - Optional backend endpoints (though you'll mainly use Symfony)
- **Image optimization**
- **Code splitting** and performance optimization
- **SEO optimization**

**Why Next.js?**
- Better performance and SEO than vanilla React
- Built-in routing
- Hybrid rendering (SSR + SSG + CSR)
- Production-ready out of the box


### 6. **TypeScript**
**Role:** Type-safe JavaScript superset

**Responsibilities:**
- Add static typing to JavaScript
- Catch errors at compile-time
- Provide better IDE autocompletion
- Improve code maintainability
- Document code through types

**Benefits:**
- Fewer runtime errors
- Better developer experience
- Easier refactoring
- Self-documenting code

---

##  Complete User Flow Example

Let's walk through a **complete scenario**: A user viewing a list of blog posts and creating a new post.

### Scenario: Blog Application

#### **Step 1: Database (PostgreSQL)**

First, you have a `post` table in PostgreSQL:

```sql
CREATE TABLE post (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES user(id),
    created_at TIMESTAMP DEFAULT NOW(),
    published BOOLEAN DEFAULT FALSE
);
```

---

#### **Step 2: Backend - Symfony Entity**

Create a Doctrine entity that maps to the database table:

```php
<?php
// src/Entity/Post.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post as ApiPost;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new ApiPost()
    ]
)]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 5, max: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    #[Assert\NotBlank]
    private ?string $content = null;

    #[ORM\Column]
    private bool $published = false;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $author = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters and setters...
}
```

**What just happened?**
- `#[ORM\Entity]` - Tells Doctrine this is a database entity
- `#[ApiResource]` - **API Platform automatically creates**:
    - `GET /api/posts` - List all posts
    - `GET /api/posts/{id}` - Get one post
    - `POST /api/posts` - Create a post
    - Plus automatic validation, serialization, and documentation!

---

#### **Step 3: API Platform - Auto-Generated API**

API Platform automatically creates these endpoints:

```
GET    /api/posts           → List all posts (with pagination)
GET    /api/posts/{id}      → Get a single post
POST   /api/posts           → Create a new post
PUT    /api/posts/{id}      → Update a post
DELETE /api/posts/{id}      → Delete a post
```

**Example API Response** (GET /api/posts):

```json
{
  "@context": "/api/contexts/Post",
  "@id": "/api/posts",
  "@type": "hydra:Collection",
  "hydra:member": [
    {
      "@id": "/api/posts/1",
      "@type": "Post",
      "id": 1,
      "title": "My First Post",
      "content": "This is the content...",
      "published": true,
      "createdAt": "2025-11-05T10:30:00+00:00",
      "author": "/api/users/1"
    },
    {
      "@id": "/api/posts/2",
      "@type": "Post",
      "id": 2,
      "title": "Another Post",
      "content": "More content here...",
      "published": false,
      "createdAt": "2025-11-04T15:20:00+00:00",
      "author": "/api/users/2"
    }
  ],
  "hydra:totalItems": 2
}
```

**Bonus:** API Platform also generates **Swagger/OpenAPI documentation** automatically at `/api/docs`!

---

#### **Step 4: Frontend - TypeScript Types**

Define TypeScript interfaces based on your API:

```typescript
// types/post.ts

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author: string; // IRI reference to user
}

export interface PostCollection {
  'hydra:member': Post[];
  'hydra:totalItems': number;
}
```

---

#### **Step 5: Frontend - API Service**

Create a service to interact with the API:

```typescript
// services/api.ts

const API_URL = 'http://localhost:8000/api';

export async function fetchPosts(): Promise<Post[]> {
  const response = await fetch(`${API_URL}/posts`, {
    headers: {
      'Accept': 'application/ld+json',
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  
  const data: PostCollection = await response.json();
  return data['hydra:member'];
}

export async function createPost(post: Omit<Post, 'id' | 'createdAt'>): Promise<Post> {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json',
    },
    body: JSON.stringify(post),
  });
  
  if (!response.ok) {
    throw new Error('Failed to create post');
  }
  
  return response.json();
}
```

---

#### **Step 6: Frontend - Next.js Page (Server Component)**

Create a page to display posts:

```typescript
// app/posts/page.tsx

import { fetchPosts } from '@/services/api';
import PostCard from '@/components/PostCard';

export default async function PostsPage() {
  // This runs on the SERVER (SSR)
  const posts = await fetchPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

---

#### **Step 7: Frontend - React Component**

Create a reusable component:

```typescript
// components/PostCard.tsx

import { Post } from '@/types/post';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
      <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
        <Link 
          href={`/posts/${post.id}`}
          className="text-blue-600 hover:underline"
        >
          Read More →
        </Link>
      </div>
      
      {!post.published && (
        <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
          Draft
        </span>
      )}
    </div>
  );
}
```

---

#### **Step 8: Frontend - Form to Create a Post**

Create a client-side form:

```typescript
// components/CreatePostForm.tsx
'use client'; // This is a Client Component

import { useState } from 'react';
import { createPost } from '@/services/api';
import { useRouter } from 'next/navigation';

export default function CreatePostForm() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createPost({
        title,
        content,
        published: false,
        author: '/api/users/1', // Current user IRI
      });
      
      // Redirect to posts list
      router.push('/posts');
      router.refresh(); // Refresh server component data
    } catch (err) {
      setError('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          required
          minLength={5}
          maxLength={255}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
          rows={10}
          required
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}
```

---

## Complete Data Flow Summary

### **Reading Data (GET Request)**

```
User opens browser
        ↓
Next.js Server Component renders
        ↓
Calls fetchPosts() from API service
        ↓
HTTP GET request to /api/posts
        ↓
API Platform receives request
        ↓
Symfony Security checks authentication
        ↓
API Platform queries Doctrine ORM
        ↓
Doctrine generates SQL query
        ↓
PostgreSQL executes query and returns rows
        ↓
Doctrine converts rows to Post entities
        ↓
API Platform serializes to JSON-LD
        ↓
HTTP response sent back
        ↓
Next.js receives data
        ↓
React components render with data
        ↓
User sees posts in browser
```

### **Writing Data (POST Request)**

```
User fills out form and clicks "Create"
        ↓
React form handler calls createPost()
        ↓
HTTP POST request to /api/posts with JSON body
        ↓
API Platform receives request
        ↓
Symfony Security checks authentication
        ↓
API Platform deserializes JSON to Post entity
        ↓
Symfony Validator validates the entity
        ↓
Doctrine ORM persists entity
        ↓
PostgreSQL executes INSERT query
        ↓
Transaction committed
        ↓
API Platform serializes new entity to JSON-LD
        ↓
HTTP 201 Created response sent
        ↓
Next.js receives response
        ↓
Router navigates to posts list
        ↓
User sees their new post
```

---

### Authentication Flow Example

```
User enters credentials in Next.js form
        ↓
POST /api/login_check (Symfony)
        ↓
Symfony validates credentials
        ↓
Returns JWT token
        ↓
Next.js stores token (httpOnly cookie or localStorage)
↓
Subsequent API requests include token in Authorization header
        ↓
API Platform validates token
        ↓
Request proceeds if valid
```