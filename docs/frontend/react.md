# ReactJS

## Create a new React app (Vite)

```bash
npm create vite@latest my-app --template react
cd my-app
npm install
npm run dev
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

## Common Patterns

* **Lifting state up** → Keep state in the nearest common parent
* **Composition > Inheritance**
* **Custom hooks** → Extract reusable logic

## Hooks

```jsx
import { useState, useEffect, useRef, createContext, useContext } from "react";

// useState
const [value, setValue] = useState(initialValue);

// useEffect
useEffect(() => {
  console.log("Runs on mount & when dep changes");
  return () => console.log("Cleanup"); // optional
}, [dep]);

// useRef
const inputRef = useRef();
<input ref={inputRef} />;
inputRef.current.focus();

// useContext
const ThemeContext = createContext("light");
const theme = useContext(ThemeContext);
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

### useMemo & useCallback

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a), [a]);
```

### Context with Provider

```jsx
<ThemeContext.Provider value={theme}>
  <App />
</ThemeContext.Provider>
```
