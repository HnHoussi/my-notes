# Express.js

## Setup

```bash
# Install
npm install express
```

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
```

## Basic Routing

```js
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/data', (req, res) => {
  res.json({ body: req.body });
});

app.put('/user/:id', (req, res) => {
  res.send(`Update user ${req.params.id}`);
});

app.delete('/user/:id', (req, res) => {
  res.send(`Delete user ${req.params.id}`);
});
```

## Request Object (req)

- `req.params` → URL parameters (`/user/:id`)
- `req.query` → Query string (`?page=2`)
- `req.body` → Body data (JSON, form, etc.)
- `req.headers` → Request headers
- `req.ip` → Client IP

## Response Object (res)

- `res.send('text')` → Send text/HTML  
- `res.json({ key: 'value' })` → Send JSON  
- `res.status(404).send('Not found')` → Set status + send  
- `res.redirect('/login')` → Redirect  
- `res.download('/file/path')` → Prompt file download  
- `res.sendFile(__dirname + '/index.html')` → Send file  

## Middleware

```js
// Application-level middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Route-level middleware
const checkAuth = (req, res, next) => {
  if (req.headers['x-auth']) next();
  else res.status(403).send('Forbidden');
};

app.get('/secure', checkAuth, (req, res) => {
  res.send('Welcome authorized user!');
});
```

## Static Files

```js
app.use(express.static('public'));
// serves files in /public (e.g. public/style.css → /style.css)
```

## Router

```js
const router = express.Router();

router.get('/', (req, res) => res.send('Users home'));
router.get('/:id', (req, res) => res.send(`User ${req.params.id}`));

app.use('/users', router);
// /users → Users home
// /users/123 → User 123
```

## Error Handling

```js
// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

## Useful Middleware Packages

- `morgan` → logging  
- `cors` → enable CORS  
- `helmet` → secure headers  
- `cookie-parser` → parse cookies  
