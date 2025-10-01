# Node.js

## Basics

```bash
# Run a file
node app.js

# Initialize a project
npm init -y

# Install dependencies
npm install <package-name>
npm install --save-dev <package-name>

# Run script from package.json
npm run start
```

## Modules & Imports

```js
// CommonJS (default in Node.js)
const fs = require('fs');

// ES Modules (if "type": "module" in package.json)
import fs from 'fs';
```

## File System (fs)

```js
const fs = require('fs');

// Read file (async)
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});

// Write file
fs.writeFile('file.txt', 'Hello World', (err) => {
  if (err) throw err;
  console.log('File written!');
});

// Append to file
fs.appendFile('file.txt', ' More text', (err) => {
  if (err) throw err;
});
```

## HTTP Server

```js
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

## Path Module

```js
const path = require('path');

console.log(path.basename(__filename)); // current file name
console.log(path.dirname(__filename));  // directory name
console.log(path.extname(__filename));  // file extension
console.log(path.join(__dirname, 'folder', 'file.txt')); // build path
```

## Events

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('greet', (name) => {
  console.log(`Hello ${name}`);
});

emitter.emit('greet', 'Alice');
```

## Process & Environment

```js
console.log(process.argv);        // CLI args
console.log(process.env.NODE_ENV); // Environment variable
process.exit();                   // exit app
```

## Extras

### REPL (Interactive Node)

```bash
node
> 2 + 2
4
> .exit
```

### JSON Handling

```js
const data = { name: "Alice", age: 25 };
const json = JSON.stringify(data);
console.log(json); // {"name":"Alice","age":25}

const obj = JSON.parse(json);
console.log(obj.name); // Alice
```

### Async/Await with fs.promises

```js
const fs = require('fs').promises;

async function readFile() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
readFile();
```
