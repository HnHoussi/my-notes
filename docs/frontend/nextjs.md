# Next.js

---

## Installation

### Create a New Next.js App

```bash
# With npm
npx create-next-app@latest my-app
```

**Recommended Options:**
- ✅ TypeScript support
- ✅ ESLint
- ✅ Tailwind CSS (optional)
- ✅ App Router (default for Next.js 13+)

### Key Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
---

## Project Structure

```
my-app/
├── app/                   # App Router (Next.js 13+)
│   ├── layout.tsx         # Root layout (required)
│   ├── page.tsx           # Homepage
│   ├── globals.css        # Global styles
│   ├── about/
│   │   └── page.tsx       # Route: /about
│   ├── api/
│   │   └── users/
│   │       └── route.ts   # API: /api/users
│   └── [id]/
│       └── page.tsx       # Dynamic route: /[id]
│
├── public/                # Static assets (images, fonts)
├── components/            # Reusable components
├── lib/                   # Utility functions
├── next.config.js         # Next.js configuration
├── .env.local             # Environment variables
├── tsconfig.json          # TypeScript config
└── package.json
```

### Special Files in App Router

| File | Purpose |
|------|---------|
| `page.tsx` | Makes route publicly accessible |
| `layout.tsx` | Shared UI wrapper for routes |
| `loading.tsx` | Loading UI with Suspense |
| `error.tsx` | Error boundary |
| `not-found.tsx` | 404 page |
| `route.ts` | API endpoint |

---

## Routing & Navigation

### File-Based Routing

Next.js uses **convention over configuration**. Create routes by adding directories and files:

```
app/
├── page.tsx              # /
├── about/page.tsx        # /about
├── blog/
│   ├── page.tsx          # /blog
│   └── [slug]/page.tsx   # /blog/[slug]
└── admin/
    ├── layout.tsx        # Admin layout
    └── page.tsx          # /admin
```

### Navigation with Link Component

```tsx
import Link from "next/link";

const Navbar = () => (
  <nav>
    <Link href="/">Home</Link>
    <Link href="/about">About</Link>
    <Link href="/blog">Blog</Link>
  </nav>
)

export default Navbar
```

**Benefits of Link Component:**
- Client-side navigation (no full page reload)
- Automatic prefetching of visible links
- Smooth page transitions

### Dynamic Routes

Create dynamic routes using square brackets:

```tsx
// app/users/[id]/page.tsx
interface Props {
  params: { id: string }
}

const UserPage = ({ params }: Props) => (
  <h1>User ID: {params.id}</h1>
)

export default UserPage
```

**Catch-all routes:**
```
app/blog/[...slug]/page.tsx  # Matches /blog/a, /blog/a/b, etc.
```

### Accessing Parameters

```tsx
// Route parameters
interface Props {
  params: { id: string }
  searchParams: { sort?: string }
}

const ProductPage = ({ params, searchParams }: Props) => (
  <div>
    <h1>Product: {params.id}</h1>
    <p>Sort: {searchParams.sort}</p>
  </div>
)

export default ProductPage
```

### Programmatic Navigation (redirection)

```tsx
'use client'

import { useRouter } from 'next/navigation'

const Button = () => {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/dashboard')}>
      Go to Dashboard
    </button>
  )
}

export default Button
```

### Layouts

Layouts wrap multiple pages with shared UI:

```tsx
// app/layout.tsx (Root Layout - Required)
const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>
      <nav>Common Navigation</nav>
      {children}
      <footer>Common Footer</footer>
    </body>
  </html>
)

export default RootLayout
```

```tsx
// app/admin/layout.tsx (Nested Layout)
const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <aside>Admin Sidebar</aside>
    <main>{children}</main>
  </div>
)

export default AdminLayout
```

### Client Cache

- Next.js caches page content on the client side
- Cache persists for the entire browser session
- Reduces server requests when navigating back
- Reset by full page refresh

---

## Server & Client Components

### Server Components (Default)

All components in the `app/` directory are **Server Components** by default.

**✅ Advantages:**
- Reduced bundle size (code stays on server)
- Better performance
- Direct database/backend access
- Better SEO
- Enhanced security (sensitive data stays on server)

**❌ Limitations:**
-  Cannot use React hooks (useState, useEffect)
- Cannot handle browser events
- Cannot access browser APIs

```tsx
// Server Component (default)
const Users = async () => {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}

export default Users
```

### Client Components

Use Client Components when you need:
- Interactivity (onClick, onChange)
- Browser APIs (localStorage, window)
- React hooks (useState, useEffect, useContext)

```tsx
'use client'

import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}

export default Counter
```

**Best Practice:** Use Server Components by default, Client Components only when needed.

---

## Data Fetching

### Server Components (Recommended)

```tsx
// Static rendering (SSG) - default
const Posts = async () => {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache' // Default behavior
  })
  const posts = await res.json()

  return <div>{/* render posts */}</div>
}

export default Posts
```

```tsx
// Dynamic rendering (SSR)
const Posts = async () => {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'no-store' // Always fetch fresh data
  })
  const posts = await res.json()

  return <div>{/* render posts */}</div>
}

export default Posts
```

```tsx
// Revalidation (ISR)
const Posts = async () => {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 } // Revalidate every hour
  })
  const posts = await res.json()

  return <div>{/* render posts */}</div>
}

export default Posts
```

### Rendering Strategies

| Strategy | When | How |
|----------|------|-----|
| **Static Rendering** | Build time | `cache: 'force-cache'` (default) |
| **Dynamic Rendering** | Request time | `cache: 'no-store'` |
| **Incremental Static Regeneration (ISR)** | Periodic updates | `next: { revalidate: seconds }` |

### Client Components

```tsx
'use client'

import { useState, useEffect } from 'react'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('https://api.example.com/users')
      .then(res => res.json())
      .then(data => setUsers(data))
  }, [])

  return <ul>{/* render users */}</ul>
}

export default Users
```

---

## Building APIs

### Creating API Routes

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server'

// GET /api/users
export async function GET() {
  const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
  ]
  
  return NextResponse.json(users)
}

// POST /api/users
export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate and save to database
  
  return NextResponse.json(
    { id: 3, ...body },
    { status: 201 }
  )
}
```

### Dynamic API Routes

```tsx
// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server'

interface Props {
  params: { id: string }
}

// GET /api/users/:id
export async function GET(request: Request, { params }: Props) {
  // Fetch user from database
  const user = { id: params.id, name: 'John' }
  
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json(user)
}

// PUT /api/users/:id
export async function PUT(request: Request, { params }: Props) {
  const body = await request.json()
  // Update user in database
  
  return NextResponse.json({ id: params.id, ...body })
}

// DELETE /api/users/:id
export async function DELETE(request: Request, { params }: Props) {
  // Delete user from database
  
  return NextResponse.json({}, { status: 200 })
}
```

### Data Validation (exp with Zod)

```bash
npm install zod
```

```tsx
// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email()
})

export async function POST(request: Request) {
  const body = await request.json()
  
  const validation = userSchema.safeParse(body)
  
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    )
  }
  
  // Save to database
  
  return NextResponse.json(validation.data, { status: 201 })
}
```

---

## Authentication

### NextAuth.js Setup

```bash
npm install next-auth
```

### Configuration

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Validate credentials
        const user = { id: "1", name: "John", email: "john@example.com" }
        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: '/auth/signin'
  }
})

export { handler as GET, handler as POST }
```

### SessionProvider Setup

```tsx
// app/providers.tsx
'use client'

import { SessionProvider } from "next-auth/react"

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <SessionProvider>{children}</SessionProvider>
)
```

```tsx
// app/layout.tsx
import { Providers } from './providers'

const RootLayout = ({ children }) => (
  <html>
    <body>
      <Providers>{children}</Providers>
    </body>
  </html>
)

export default RootLayout
```

### Using Authentication

```tsx
'use client'

import { useSession, signIn, signOut } from "next-auth/react"

const AuthButton = () => {
  const { data: session, status } = useSession()

  if (status === "loading") return <div>Loading...</div>

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return <button onClick={() => signIn()}>Sign in</button>
}

export default AuthButton
```

### Protecting Routes with Middleware

```ts
// middleware.ts
export { default } from "next-auth/middleware"

export const config = { 
  matcher: ["/dashboard/:path*", "/admin/:path*"] 
}
```

### Server-Side Session Access

```tsx
// app/dashboard/page.tsx
import { getServerSession } from "next-auth"

const Dashboard = async () => {
  const session = await getServerSession()

  if (!session) {
    return <div>Access Denied</div>
  }

  return <div>Welcome {session.user?.name}</div>
}

export default Dashboard
```

### Database Adapter (exp with Prisma)

```bash
npm install @next-auth/prisma-adapter
```

```ts
// app/api/auth/[...nextauth]/route.ts
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  // ... other config
})
```

---

## File Uploads

### Using FormData

```tsx
// app/upload/page.tsx
'use client'

import { useState } from 'react'

const UploadPage = () => {
  const [file, setFile] = useState<File>()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    console.log(result)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <button type="submit">Upload</button>
    </form>
  )
}

export default UploadPage
```

### API Route for Upload

```ts
// app/api/upload/route.ts
import { NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided' },
      { status: 400 }
    )
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  
  await writeFile(filepath, buffer)

  return NextResponse.json({ 
    filename,
    url: `/uploads/${filename}`
  })
}
```

---

## Sending Emails

### React Email Setup

```bash
npm install react-email @react-email/components
```

### Create Email Template

```tsx
// emails/welcome.tsx
import {Html, Head, Preview, Body, Container, Heading, Text, Button} from '@react-email/components'

interface WelcomeEmailProps {
  username: string
}

const WelcomeEmail = ({ username }: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to our platform!</Preview>
    <Body style={{ backgroundColor: '#f6f9fc' }}>
      <Container>
        <Heading>Welcome, {username}!</Heading>
        <Text>Thanks for signing up.</Text>
        <Button href="https://example.com">Get Started</Button>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail
```

### Sending Email (exp with Resend)

```bash
npm install resend
```

```ts
// app/api/send-email/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import WelcomeEmail from '@/emails/welcome'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const { email, username } = await request.json()

  try {
    const data = await resend.emails.send({
      from: 'onboarding@example.com',
      to: email,
      subject: 'Welcome!',
      react: WelcomeEmail({ username })
    })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
```

---

## Optimizations

### Image Optimization

```tsx
import Image from "next/image"

const Avatar = () => (
  <Image
    src="/profile.jpg"
    width={200}
    height={200}
    alt="Profile picture"
    priority // Load immediately (above fold)
  />
)

export default Avatar
```

**Benefits:**
- Automatic image optimization
- Responsive images
- Lazy loading by default
- Modern formats (WebP, AVIF)
- Prevents layout shift

### Metadata for SEO

```tsx
// app/layout.tsx or page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My App',
  description: 'My awesome Next.js app',
  openGraph: {
    title: 'My App',
    description: 'My awesome Next.js app',
    images: ['/og-image.jpg'],
  },
}
```

**Dynamic metadata:**
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

### Lazy Loading

```tsx
'use client'

import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <p>Loading...</p>,
  ssr: false // Disable server-side rendering for this component
})

const Page = () => <DynamicComponent />

export default Page
```

---

## ⚡ Tips & Best Practices

:::note
- Use **Server Components** by default - Only use **Client Components** when needed
- Don't use `useState` in Server Components - Use Client Components instead
- Don't fetch data on the client - Prefer Server Components for data fetching
- Use the `Image` component - Automatic optimization and lazy loading
- Use the `Link` component - Client-side navigation and prefetching
- Validate all user inputs - Use **Zod** or similar libraries
- Implement proper error handling - Use `error.tsx` and `try-catch` blocks
- Colocate related files - Keep components near their pages
- Use metadata for **SEO** - Export `metadata` objects from `pages/layouts`
- Don't ignore loading states - Use `loading.tsx` or `Suspense`
- Don't forget error boundaries - Use `error.tsx` files
- Don't mix `page.tsx` and `route.ts` - Can't have both in the same directory
:::
