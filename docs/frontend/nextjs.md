# Next.js


## Installation

### Create a new Next.js app
```bash
# With npm
npx create-next-app@latest my-app

# With yarn
yarn create next-app my-app

# With pnpm
pnpm create next-app my-app
```

Options:
- ✅ TypeScript support
- ✅ ESLint
- ✅ Tailwind (optional)
- ✅ App Router (Next.js 13+) or Pages Router (legacy)

---

## Project Structure

```
my-app/
├─ app/                # App Router (Next.js 13+)
│  ├─ page.tsx         # Homepage
│  ├─ layout.tsx       # Root layout
│  └─ about/page.tsx   # Route: /about
│
├─ pages/              # Pages Router (pre-Next.js 13)
│  ├─ index.tsx        # Homepage
│  └─ api/hello.ts     # API Route: /api/hello
│
├─ public/             # Static files (images, fonts…)
├─ styles/             # CSS / Tailwind
├─ next.config.js      # Next.js config
└─ package.json
```

## Routing

### App Router (Next.js 13+)
- File-based routing inside `app/`
- `page.tsx` → renders the route
- `layout.tsx` → shared UI wrapper
- Supports **nested layouts**

Example:
```tsx
// app/page.tsx
export default function Home() {
  return <h1>Hello Next.js</h1>
}
```

```tsx
// app/about/page.tsx
export default function About() {
  return <h1>About Page</h1>
}
```

---

### Pages Router (Legacy)
```tsx
// pages/index.tsx
export default function Home() {
  return <h1>Hello Next.js</h1>
}

// pages/about.tsx
export default function About() {
  return <h1>About Page</h1>
}
```

## Navigation

```tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>
    </nav>
  )
}
```

## Data Fetching

### App Router
- **Server Components**: async functions allowed
```tsx
// app/page.tsx
export default async function Home() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  return (
    <ul>
      {posts.map((p: any) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}
```

- **Static Data (SSG)**: `fetch` with `{ cache: "force-cache" }`
- **Dynamic Data (SSR)**: `fetch` with `{ cache: "no-store" }`

### Pages Router
- `getStaticProps` → Static Generation
- `getServerSideProps` → Server-side Rendering
- `getStaticPaths` → Dynamic routes

Example:
```tsx
export async function getStaticProps() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts");
  const posts = await res.json();

  return { props: { posts } };
}
```

## API Routes

### Pages Router
```tsx
// pages/api/hello.ts
export default function handler(req, res) {
  res.status(200).json({ message: "Hello API" })
}
```

### App Router
```tsx
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello API" })
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({ data: body });
}
```

## Styling

- Global CSS → `app/globals.css` or `pages/_app.tsx`
- CSS Modules → `Home.module.css`
- Tailwind → built-in option during setup

## Environment Variables

`.env.local`
```
NEXT_PUBLIC_API_URL=https://api.example.com
SECRET_KEY=mysecret
```

Use in code:
```ts
const url = process.env.NEXT_PUBLIC_API_URL;
```

## Image Optimization

```tsx
import Image from "next/image";

<Image src="/me.png" width={200} height={200} alt="Me" />
```

## Deployment

### Vercel (recommended)
```bash
npm run build
npm start
```
Deploy via:
```bash
vercel
```

### Custom server
```bash
npm run build
npm run start
```

---

## Useful Commands

```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

:::note
⚡ **Tips**
- Use the **App Router** for new projects (better layouts, server components).
- Always prefix public env vars with `NEXT_PUBLIC_`.
- Use `Image` and `Link` from Next.js for optimization.
- For backend logic → API routes (in `/api`).
:::
