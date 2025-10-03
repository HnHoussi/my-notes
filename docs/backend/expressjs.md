# Express.js

## Project Setup

```bash
# Initialize a new Node.js project
npm init -y

# Install Express and useful middleware
npm install express morgan cors helmet cookie-parser

# Optional: install nodemon for auto-restart during development
npm install --save-dev nodemon

# Run the server (with nodemon)
npx nodemon index.js
```

## Project Structure

```
my-express-app/
├─ node_modules/
├─ public/             # Static files (images, CSS, JS)
├─ routes/             # Express routers
│  └─ users.js
├─ controllers/        # Route logic / handlers
│  └─ usersController.js
├─ middleware/         # Custom middleware functions
│  └─ auth.js
├─ models/             # Data models (if using a DB)
├─ views/              # HTML templates (optional, e.g., with EJS)
├─ .env                # Environment variables
├─ package.json
└─ index.js            # Main server entry point
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

## ⚡ Tips & Best Practices

:::note
- **Keep routes organized using `Router()`** → Make your app modular and easier to maintain.  
- **Validate `req.body` & `req.params`** → Protect your API from invalid or malicious input.  
- **Use `helmet` & `cors`** → Secure headers and handle cross-origin requests safely.  
- **Log requests & errors with `morgan`** → Simplifies debugging and monitoring.  
- **Always call `next(err)` in async middleware** → Ensure proper error handling.  
- **Use environment variables (`process.env`)** → Avoid hardcoding values like ports or API keys.  
- **Test API endpoints** → Use Postman, Insomnia, or similar tools to verify behavior.  
:::
