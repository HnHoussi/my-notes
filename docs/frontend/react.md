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
├─ public/ # Static files (favicon, images…)
├─ src/
│ ├─ assets/ # Images, fonts, static assets
│ ├─ components/ # Reusable UI components
│ ├─ pages/ # Page-level components (if using routing)
│ ├─ hooks/ # Custom React hooks
│ ├─ context/ # React Context providers
│ ├─ App.jsx # Root component
│ ├─ main.jsx # Entry point
│ └─ index.css # Global styles
├─ package.json
├─ vite.config.js
└─ README.md
```

## Components

### Functional Component

```jsx
function Hello({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Props with Default Value

```jsx
function Button({ text = "Click me" }) {
  return <button>{text}</button>;
}
```

### Export / Import

```jsx
export default Hello;
// import Hello from "./Hello";
```

## State & Events

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}
```

**💡 Tip:** State updates are asynchronous — always use the setter (`setCount`) to update values.

---

## 🧩 Common Patterns

* **Lifting state up** → Keep state in the nearest common parent.
* **Composition > Inheritance** → Use components inside each other, not inheritance.
* **Custom hooks** → Extract reusable logic (`useFetch`, `useAuth`, etc.).

---

## React Hooks

Hooks are functions that let you “hook into” React features like state, lifecycle, and context.

### useState – Local Component State
**Use when:** You need to track data that changes inside a component (e.g., input value, counter).

```jsx
const [count, setCount] = useState(0);
setCount(count + 1);
```

### useEffect – Side Effects
**Use when:** You need to perform actions *after render* (e.g., fetching data, event listeners, timers).

```jsx
useEffect(() => {
  console.log("Component mounted or updated");
  return () => console.log("Cleanup on unmount");
}, [dependency]);
```

### useRef – Mutable References
**Use when:** You need to access or store a DOM element or mutable value that doesn’t trigger re-renders.

```jsx
const inputRef = useRef();
useEffect(() => inputRef.current.focus(), []);
<input ref={inputRef} />;
```

### useContext – Shared Global Data
**Use when:** You want to share data (like theme or user info) across components without prop drilling.

```jsx
const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);
```

### useReducer – Complex State Logic
**Use when:** You have multiple related state updates (e.g., form state, counters with conditions).

```jsx
const [state, dispatch] = useReducer(reducer, initialState);
dispatch({ type: "increment" });
```

### useMemo – Memoize Expensive Computations
**Use when:** A function or value is costly to compute, and you only want to recalculate when dependencies change.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### useCallback – Memoize Functions
**Use when:** You pass functions as props and want to prevent unnecessary re-renders.

```jsx
const handleClick = useCallback(() => setCount(c => c + 1), []);
```

### Custom Hooks
**Use when:** You need to reuse logic (like fetching data) across multiple components.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);
  }, [url]);
  return data;
}
```

## Lists & Keys

```jsx
const items = ["🍎", "🍌", "🍒"];
<ul>
  {items.map((item, i) => (
    <li key={i}>{item}</li>
  ))}
</ul>
```

## Controlled Forms

```jsx
function Form() {
  const [text, setText] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(text);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

## Conditional Rendering

```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{count > 0 && <p>You have {count} items</p>}
```

## Fetching Data

```jsx
import { useEffect, useState } from "react";

function Users() {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then(setUsers);
  }, []);
  
  return (
    <ul>
      {users.map((u) => (
        <li key={u.id}>{u.name}</li>
      ))}
    </ul>
  );
}
```

## React Router (v6+)

```bash
npm install react-router-dom
```

```jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

function App() {
  return (
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
}
```

## Additional Concepts

### Fragments
```jsx
<>
  <Child1 />
  <Child2 />
</>
```

### Error Boundaries
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
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
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

## ⚡ Tips & Best Practices

- **Keep components small & focused** → One component = one responsibility.  
- **Prefer functional components + hooks** instead of class components.  
- **Always use keys when rendering lists** → Prefer unique IDs.  
- **Use `React.StrictMode`** in development to catch potential issues.  
- **Avoid prop drilling** → Use Context or state management libraries.  
- **Memoize expensive computations** → `useMemo` & `useCallback`.  
- **Lazy load routes/components** → `React.lazy` + `Suspense`.  
- **Error boundaries** → Catch runtime UI errors gracefully.  
- **Separate UI & logic** → Use custom hooks for data fetching.  
- **Use environment variables** → (`import.meta.env` in Vite).  
- **Accessibility first** → Use semantic HTML (`<button>` > `<div onClick>`).  
- **Test components** → React Testing Library + Jest.  
- **Profile performance** → React DevTools.  
- **Consistent structure** → `components/`, `hooks/`, `pages/`.  

