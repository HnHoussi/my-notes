# TypeScript

## Basic Types

```ts
let isDone: boolean = true;
let age: number = 25;
let username: string = "Alice";
let numbers: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];
let anything: any = "can be anything";
let nothing: void = undefined;
let unique: unknown = "safer any";
let neverHappens: never; // function that never returns
```

## Functions

```ts
function add(a: number, b: number): number {
  return a + b;
}

const multiply = (a: number, b: number): number => a * b;

// Optional & default params
function greet(name: string, age?: number, prefix: string = "Hi"): string {
  return `${prefix} ${name} (${age ?? "unknown"})`;
}
```

## Interfaces & Types

```ts
// Interface
interface Person {
  name: string;
  age: number;
  isStudent?: boolean; // optional
}

// Interface extension
interface Employee extends Person {
  role: string;
}

// Type alias
type Point = { x: number; y: number };

// Union & intersection
type Status = "success" | "error" | "loading";
type Worker = Person & { company: string };
```

## Classes

```ts
class Animal {
  constructor(public name: string) {}
  move(distance: number = 0) {
    console.log(`${this.name} moved ${distance}m.`);
  }
}

class Dog extends Animal {
  bark() {
    console.log("Woof!");
  }
}
```

## Generics

```ts
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42);
const str = identity("hello");

interface ApiResponse<T> {
  data: T;
  error?: string;
}
```

## Utility Types

```ts
type PartialUser = Partial<Person>;   // all fields optional
type RequiredUser = Required<Person>; // all fields required
type ReadonlyUser = Readonly<Person>; // immutable
type PickUser = Pick<Person, "name">; // only name
type OmitUser = Omit<Person, "age">;  // everything except age
```

## Enums

```ts
enum Direction {
  Up,
  Down,
  Left,
  Right
}

let move: Direction = Direction.Up;
```

## Type Assertions & Guards

```ts
let someValue: unknown = "hello";
let strLength: number = (someValue as string).length;

// Type guard
function isString(value: unknown): value is string {
  return typeof value === "string";
}
```

## Modules

```ts
// math.ts
export function add(a: number, b: number) {
  return a + b;
}

// app.ts
import { add } from "./math";
console.log(add(2, 3));
```

## Extras

### Readonly & Const

```ts
interface Car {
  readonly brand: string; // cannot be changed after initialization
  model: string;
}
```

### Null & Undefined

```ts
let nullableValue: string | null = null;
let optionalValue: string | undefined;
```

### Namespaces (less common, legacy style)

```ts
namespace Utils {
  export function log(message: string) {
    console.log("LOG:", message);
  }
}

Utils.log("Hello");
```
