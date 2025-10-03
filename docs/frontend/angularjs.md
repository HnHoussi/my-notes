# Angular.js

## Project Setup

```bash
npm install -g @angular/cli
ng new my-app      # create new project
ng serve           # run dev server (default: http://localhost:4200)
ng generate c xyz  # generate component
ng generate s xyz  # generate service
```

## Project Structure

```
src/
 ├── app/                        # Application source
 │    ├── app.component.ts       # Root component logic
 │    ├── app.component.html     # Root template
 │    ├── app.component.css      # Root styles
 │    ├── app.module.ts          # Root module
 │    ├── app-routing.module.ts  # (Optional) Routing module
 │    └── components/            # Feature components
 │         └── example/          
 │              ├── example.component.ts
 │              ├── example.component.html
 │              ├── example.component.css
 │              └── example.component.spec.ts
 │
 ├── assets/                     # Static assets (images, icons…)
 ├── environments/               # Environment configs
 │    ├── environment.ts         # Default (dev)
 │    └── environment.prod.ts    # Production
 │
 ├── index.html                  # Main HTML file
 ├── main.ts                     # Entry point (bootstraps AppModule)
 ├── styles.css                  # Global styles
 └── polyfills.ts                # Polyfills for browser compatibility
```

## Component Basics

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-hello',
  templateUrl: './hello.component.html',
  styleUrls: ['./hello.component.css']
})
export class HelloComponent {
  title: string = 'Angular Cheat Sheet';
}
```

```html
<!-- hello.component.html -->
<h1>{{ title }}</h1>
```

## Data Binding

```html
<!-- Interpolation -->
<p>{{ user.name }}</p>

<!-- Property Binding -->
<img [src]="imageUrl">

<!-- Event Binding -->
<button (click)="onClick()">Click me</button>

<!-- Two-way Binding (requires FormsModule) -->
<input [(ngModel)]="user.name">
```

## Directives

```html
<!-- Structural Directives -->
<div *ngIf="isVisible">Visible</div>
<ul>
  <li *ngFor="let item of items">{{ item }}</li>
</ul>

<!-- Attribute Directives -->
<p [ngClass]="{ highlight: isActive }">Styled text</p>
<p [ngStyle]="{ color: isActive ? 'red' : 'blue' }">Dynamic style</p>
```

## Pipes

```html
<p>{{ birthday | date:'longDate' }}</p>
<p>{{ amount | currency:'USD' }}</p>
<p>{{ message | uppercase }}</p>
```

**Custom Pipe:**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'exclaim' })
export class ExclaimPipe implements PipeTransform {
  transform(value: string): string {
    return value + '!!!';
  }
}
```

## Services & Dependency Injection

```typescript
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DataService {
  getData() {
    return ['a', 'b', 'c'];
  }
}
```

**Use in Component:**

```typescript
constructor(private dataService: DataService) {}

ngOnInit() {
  this.items = this.dataService.getData();
}
```

## Routing

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

```html
<!-- app.component.html -->
<nav>
  <a routerLink="/home">Home</a>
</nav>
<router-outlet></router-outlet>
```

## HTTP Requests

```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) {}

getUsers() {
  this.http.get('https://jsonplaceholder.typicode.com/users')
    .subscribe(data => console.log(data));
}
```

:::note
Don't forget to import `HttpClientModule` in `app.module.ts`.
:::

## Lifecycle Hooks

```typescript
ngOnInit() {}        // on component init
ngOnDestroy() {}     // before destroy
ngOnChanges() {}     // when @Input changes
ngAfterViewInit() {} // after view is loaded
```

## Forms

### Template-driven

```html
<form #f="ngForm" (ngSubmit)="submit(f.value)">
  <input name="username" ngModel required>
  <button type="submit">Submit</button>
</form>
```

### Reactive

```typescript
import { FormGroup, FormControl } from '@angular/forms';

form = new FormGroup({
  username: new FormControl(''),
});

submit() {
  console.log(this.form.value);
}
```

```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="username">
  <button type="submit">Submit</button>
</form>
```

## ⚡ Tips & Best Practices

:::note
- **Keep components small & focused** → One component = one responsibility.  
- **Use feature modules** → Organize related components, services, and routes.  
- **Prefer OnPush change detection** → Improves performance for large apps.  
- **Use `async` pipe** → Avoid manual subscription management in templates.  
- **Lazy load routes/modules** → Improves initial load time.  
- **Use services for shared state** → Avoid unnecessary parent-child prop drilling.  
- **Always unsubscribe from Observables** → Use `takeUntil` or `async` pipe.  
- **Use environment variables** → Store API URLs and secrets in `environments/`.  
- **Consistent folder structure** → Keep `components/`, `services/`, `pipes/`, `models/` organized.  
- **Forms** → Use reactive forms for complex validation, template-driven for simple forms.  
- **HTTP** → Use interceptors for auth tokens and error handling.  
- **Styling** → Use Angular's `ViewEncapsulation` to avoid style leaks.  
- **Testing** → Use Jasmine/Karma or Jest for unit testing components and services.  
- **Accessibility** → Use semantic HTML, ARIA labels, and proper focus management.  
:::
