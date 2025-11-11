# React.js

## Create a new React app (Vite)

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
npm run dev
```

## Project Structure

```
my-app/
├─ public/        # Static files (favicon, images…)
├─ src/
│ ├─ assets/      # Images, fonts, static assets
│ ├─ components/  # Reusable UI components
│ ├─ pages/       # Page-level components (if using routing)
│ ├─ hooks/       # Custom React hooks
│ ├─ context/     # React Context providers
│ ├─ App.jsx      # Root component
│ ├─ main.jsx     # Entry point
│ └─ index.css    # Global styles
├─ package.json
├─ vite.config.js
└─ README.md
```

---

## Components

### Functional Component (Arrow Function)

```jsx
const Hello = ({ name }) => {
  return <h1>Hello, {name}!</h1>;
};
```

### Props with Default Value

```jsx
const Button = ({ text = "Click me" }) => {
  return <button>{text}</button>;
};
```

### Export / Import

```jsx
export default Hello;
// import Hello from "./Hello";
```

---

## State & Events

```jsx
import { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
};
```

**💡 Tip:**  
- State updates are asynchronous.  
- When updating based on the previous state, pass a function:  
  ```jsx
  setCount(prev => prev + 1);
  ```

---

## Common Patterns

- **Lifting state up** → Keep state in the nearest common parent.  
- **Composition > Inheritance** → Use components inside each other.  
- **Custom hooks** → Extract reusable logic (`useFetch`, `useAuth`, etc.).  

---

## React Hooks (Detailed)

### useState – Local Component State

```jsx
const [count, setCount] = useState(0);
setCount(count + 1);
```

**Use when:** You need reactive local state inside a component.

💡 **Tips:**
- Works with primitive and complex values.
- Use function updater form for derived state:
  ```jsx
  setCount(prev => prev + 1);
  ```

---

### useEffect – Side Effects

```jsx
import { useEffect } from "react";

useEffect(() => {
  console.log("Component mounted or updated");
  return () => console.log("Cleanup");
}, [dependency]);
```

**Use when:** Fetching data, event listeners, timers.

💡 **Tips:**
- `[]` → run only once.  
- `[dep]` → run when `dep` changes.  
- No array → run on every render.  

---

### useRef – Mutable References

```jsx
import { useRef, useEffect } from "react";

const inputRef = useRef();

useEffect(() => {
  inputRef.current.focus();
}, []);

<input ref={inputRef} />;
```

**Use when:** Accessing DOM elements or storing mutable values that don’t trigger re-renders.

---

### useContext – Shared Global Data

```jsx
import { createContext, useContext } from "react";

const ThemeContext = createContext("light");

const Component = () => {
  const theme = useContext(ThemeContext);
  return <div className={theme}>Theme: {theme}</div>;
};
```

**Use when:** Sharing global data (theme, auth, user).

---

### useReducer – Complex State Logic

```jsx
import { useReducer } from "react";

const reducer = (state, action) => {
  switch(action.type) {
    case "increment": return { count: state.count + 1 };
    case "decrement": return { count: state.count - 1 };
    default: return state;
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, { count: 0 });

  return (
    <>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
};
```

---

### useMemo – Memoize Expensive Computations

```jsx
import { useMemo } from "react";

const expensiveValue = useMemo(() => {
  console.log("Computing...");
  return someHeavyComputation(a, b);
}, [a, b]);
```

**Use when:** Avoid recalculating heavy computations unless dependencies change.

---

### useCallback – Memoize Functions

```jsx
import { useCallback } from "react";

const handleClick = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

**Use when:** Passing stable function references to child components.

---

### Custom Hooks

```jsx
import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData);
  }, [url]);

  return data;
};
```

**Use when:** Reusing logic like fetching, auth, local storage.

---

## Lists & Keys

```jsx
const items = ["A", "B", "C"];
const List = () => (
  <ul>
    {items.map((item, i) => (
      <li key={i}>{item}</li>
    ))}
  </ul>
);
```

---

## Controlled Forms

```jsx
import { useState } from "react";

const Form = () => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(text);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## Conditional Rendering

```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{count > 0 && <p>You have {count} items</p>}
```

---

## Fetching Data

```jsx
import { useState, useEffect } from "react";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then(res => res.json())
      .then(setUsers);
  }, []);

  return (
    <ul>
      {users.map(u => <li key={u.id}>{u.name}</li>)}
    </ul>
  );
};
```

---

## React Router (v6+)

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

const App = () => (
  <BrowserRouter>
    <nav>
      <Link to="/">Home</Link> | <Link to="/about">About</Link>
    </nav>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  </BrowserRouter>
);
```

---

## Additional Concepts

### Fragments

```jsx
<>
  <Child1 />
  <Child2 />
</>
```

### Error Boundaries (Class Required)

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
```

### React.memo

```jsx
const MemoizedComponent = React.memo(Component);
```

### Context with Provider

```jsx
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```

---


## TypeScript in React — Interfaces & Props

When using TypeScript (`.tsx` files), you can **define props and state types** using either `interface` or `type`.

### Defining Props with an Interface

```tsx
interface ButtonProps {
  text: string;             // required string prop
  onClick?: () => void;     // optional function prop
}

const Button = ({ text, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{text}</button>;
};
```

💡 **Tips:**
- `React.FC` (or `React.FunctionComponent`) is optional but helps define `children` automatically.
- `onClick?` means this prop is optional.
- You can add **default values**:
  ```tsx
  const Button: React.FC<ButtonProps> = ({ text = "Click", onClick }) => ...
  ```

---

### Using `type` Instead of `interface`

```tsx
type CardProps = {
  title: string;
  content?: string;
};

const Card = ({ title, content }: CardProps) => (
  <div>
    <h3>{title}</h3>
    {content && <p>{content}</p>}
  </div>
);
```

 **When to prefer `type`:**
- You need unions or intersections.
- You want shorter inline definitions.

 **When to prefer `interface`:**
- You want to extend props or reuse across components.

---

### Extending Props (Composition)

```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => (
  <label>
    {label}
    <input {...props} />
  </label>
);
```

 Great for wrapping native elements like `<input>`, `<button>`, etc.

---

### Children Prop (ReactNode)

```tsx
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <main>{children}</main>
);
```

 Always type `children` as `ReactNode` — it can be strings, numbers, JSX, or arrays of them.

---

### Example – Putting It All Together

```tsx
interface UserCardProps {
  name: string;
  age?: number;
  onSelect?: (name: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ name, age, onSelect }) => (
  <div onClick={() => onSelect?.(name)}>
    <h2>{name}</h2>
    {age && <p>Age: {age}</p>}
  </div>
);
```

Fully typed props, with optional callback and conditional rendering.

---

### Bonus: Typed useState, useRef, and Context

```tsx
// useState
const [count, setCount] = useState<number>(0);

// useRef
const inputRef = useRef<HTMLInputElement>(null);

// useContext
interface Theme {
  color: string;
}
const ThemeContext = createContext<Theme>({ color: "blue" });
```

 Always specify the generic type when the initial value doesn’t give a clear type.

---

## ⚡ Tips & Best Practices

:::note
- Keep components small & focused.  
- Prefer functional components + hooks.  
- Use `React.StrictMode` in dev.  
- Avoid prop drilling → use Context.  
- Memoize computations → `useMemo`, `useCallback`.  
- Lazy load routes/components → `React.lazy` + `Suspense`.  
- Separate UI & logic → use custom hooks.  
- Use environment variables (`import.meta.env`).  
- Accessibility first (semantic HTML).  
- Profile with React DevTools.  
- Keep consistent structure: `components/`, `hooks/`, `pages/`.
- Use `interface` for reusable prop definitions.
- Type `children` explicitly (`ReactNode`).
- Extend built-in types for elements (`ButtonHTMLAttributes`, etc.).
- Define **custom hooks** with proper generic types.
:::
