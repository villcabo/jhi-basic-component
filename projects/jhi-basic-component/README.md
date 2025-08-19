# JHI Basic Component Library

A comprehensive Angular component library providing essential UI components for modern web applications built with Angular 19+ and Bootstrap.

## Installation

```bash
npm install jhi-basic-component
```

## Components

### 1. Active Toggle Component

A smart toggle component for activating/deactivating items with optional confirmation dialogs.

#### Features
- Customizable active/inactive states
- Optional confirmation dialogs
- Multiple sizes (sm, md, lg)
- Disabled state support
- Bootstrap styling integration

#### Usage

```typescript
import { ActiveToggleComponent } from 'jhi-basic-component';

@Component({
  selector: 'app-example',
  imports: [ActiveToggleComponent],
  template: `
    <jhi-active-toggle
      [isActive]="userStatus"
      [showConfirmDialog]="true"
      activeText="Active"
      inactiveText="Inactive"
      size="md"
      (toggleChange)="onStatusChange($event)">
    </jhi-active-toggle>
  `
})
export class ExampleComponent {
  userStatus = true;
  
  onStatusChange(newStatus: boolean) {
    console.log('Status changed to:', newStatus);
    this.userStatus = newStatus;
  }
}
```

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isActive` | `boolean \| null \| undefined` | `false` | Current active state |
| `disabled` | `boolean` | `false` | Disable the toggle |
| `activeText` | `string` | `'Activated'` | Text when active |
| `inactiveText` | `string` | `'Deactivated'` | Text when inactive |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Button size |
| `showConfirmDialog` | `boolean` | `true` | Show confirmation dialog |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `toggleChange` | `EventEmitter<boolean>` | Emitted when state changes |

---

### 2. Advanced Search Component

A powerful search component with toggle functionality and keyboard shortcuts.

#### Features
- Toggle search visibility
- Keyboard shortcut support (F3)
- Loading states
- LocalStorage persistence
- FontAwesome icons
- Bootstrap tooltips

#### Usage

```typescript
import { AdvancedSearchComponent, ButtonSearchComponent } from 'jhi-basic-component';

@Component({
  selector: 'app-search-example',
  imports: [AdvancedSearchComponent, ButtonSearchComponent],
  template: `
    <!-- Search Toggle Button -->
    <jhi-button-search
      [displaySearch]="showSearch"
      [isLoading]="searching"
      (displaySearchChange)="onToggleSearch($event)">
    </jhi-button-search>

    <!-- Search Form -->
    <jhi-advanced-search
      *ngIf="showSearch"
      [searchForm]="searchFormGroup"
      [isLoading]="searching"
      (searchSubmit)="onSearch($event)"
      (searchReset)="onReset()">
    </jhi-advanced-search>
  `
})
export class SearchExampleComponent {
  showSearch = false;
  searching = false;
  searchFormGroup = this.fb.group({
    name: [''],
    category: [''],
    dateFrom: [''],
    dateTo: ['']
  });

  constructor(private fb: FormBuilder) {}

  onToggleSearch(show: boolean) {
    this.showSearch = show;
  }

  onSearch(formValue: any) {
    this.searching = true;
    console.log('Searching with:', formValue);
    // Perform search logic
    setTimeout(() => this.searching = false, 2000);
  }

  onReset() {
    this.searchFormGroup.reset();
  }
}
```

#### ButtonSearchComponent Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `displaySearch` | `boolean` | `false` | Show/hide search state |
| `isLoading` | `boolean` | `false` | Loading state |

#### ButtonSearchComponent Events

| Event | Type | Description |
|-------|------|-------------|
| `displaySearchChange` | `EventEmitter<boolean>` | Emitted when toggle state changes |

#### AdvancedSearchComponent Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `searchForm` | `FormGroup` | `required` | Reactive form for search |
| `isLoading` | `boolean` | `false` | Loading state |

#### AdvancedSearchComponent Events

| Event | Type | Description |
|-------|------|-------------|
| `searchSubmit` | `EventEmitter<any>` | Emitted when search is submitted |
| `searchReset` | `EventEmitter<void>` | Emitted when form is reset |

---

### 3. Breadcrumb Component

An intelligent breadcrumb navigation component that automatically generates navigation paths.

#### Features
- Auto-generates breadcrumb from URL paths
- Back button with smart route handling
- URL decoding for special characters
- Customizable icons and labels
- FontAwesome icon support
- Smart path name generation

#### Usage

```typescript
import { BreadcrumbComponent } from 'jhi-basic-component';

@Component({
  selector: 'app-breadcrumb-example',
  imports: [BreadcrumbComponent],
  template: `
    <jhi-breadcrumb
      [showBackButton]="true"
      currentPageTitle="User Details"
      currentPageIcon="user"
      backButtonTitle="Previous View">
    </jhi-breadcrumb>
  `
})
export class BreadcrumbExampleComponent {}
```

#### Advanced Usage with Custom Navigation

```typescript
// Navigate to a page with backRoute parameter
this.router.navigate(['/users/123/edit'], {
  queryParams: {
    backRoute: encodeURIComponent('/users?page=1&sort=name')
  }
});
```

The breadcrumb will automatically:
- Decode the URL
- Generate a readable name from the path (e.g., "Users" from "/users")
- Create navigation links
- Handle special characters properly

#### Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showBackButton` | `boolean` | `false` | Show back navigation button |
| `backButtonTitle` | `string` | `'Go back'` | Back button tooltip |
| `currentPageTitle` | `string` | `'Current Page'` | Current page display name |
| `currentPageIcon` | `string` | `'file'` | Current page icon |

---

### 4. Confirm Dialog Service

A service for displaying confirmation dialogs with customizable messages and actions.

#### Features
- Bootstrap modal integration
- Customizable messages
- Promise-based API
- Auto-focus on confirm button
- Keyboard support (Enter/Escape)

#### Usage

```typescript
import { ConfirmDialogService } from 'jhi-basic-component';

@Component({
  selector: 'app-confirm-example',
  template: `
    <button 
      class="btn btn-danger" 
      (click)="deleteItem()">
      Delete Item
    </button>
    
    <button 
      class="btn btn-warning" 
      (click)="toggleStatus()">
      Toggle Status
    </button>
  `
})
export class ConfirmExampleComponent {
  constructor(private confirmDialog: ConfirmDialogService) {}

  async deleteItem() {
    const confirmed = await this.confirmDialog.openDeleteDialog({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel'
    });

    if (confirmed) {
      console.log('Item deleted');
      // Perform deletion logic
    }
  }

  async toggleStatus() {
    const confirmed = await this.confirmDialog.openActivateDialog({
      isActivated: true // or false
    });

    if (confirmed) {
      console.log('Status toggled');
      // Perform status change logic
    }
  }
}
```

#### Methods

| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `openDeleteDialog(options)` | `{title?, message?, confirmText?, cancelText?}` | `Promise<boolean>` | Shows delete confirmation dialog |
| `openActivateDialog(options)` | `{isActivated: boolean}` | `Promise<boolean>` | Shows activate/deactivate confirmation |

## Requirements

- Angular 19+
- Bootstrap 5+ (for styling)
- FontAwesome (for icons)
- NgBootstrap (for modals and tooltips)

## Setup

1. Install the library:
```bash
npm install jhi-basic-component
```

2. Install peer dependencies:
```bash
npm install @angular/core @angular/common @angular/forms @angular/router
npm install @fortawesome/angular-fontawesome @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons
npm install @ng-bootstrap/ng-bootstrap bootstrap
```

3. Import required modules in your `app.config.ts`:
```typescript
import { provideNgbConfig } from '@ng-bootstrap/ng-bootstrap';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideNgbConfig(),
    // Initialize FontAwesome
    {
      provide: FaIconLibrary,
      useFactory: (library: FaIconLibrary) => {
        library.addIconPacks(fas);
        return library;
      },
      deps: [FaIconLibrary]
    }
  ]
};
```

4. Import Bootstrap CSS in your `styles.scss`:
```scss
@import '~bootstrap/dist/css/bootstrap.min.css';
```

## Development

For local development and testing:

1. Clone the repository
2. Install dependencies: `npm install`
3. Build in watch mode: `npm run build:lib:watch`
4. Link for local testing: `npm link` (in dist/jhi-basic-component)

### Scripts

- `npm run build:lib` - Build the library
- `npm run build:lib:prod` - Build for production
- `npm run build:lib:watch` - Build in watch mode
- `npm run test:lib` - Run tests
- `npm run pack:lib` - Create package
- `npm run publish:lib` - Publish to npm
- `npm run publish:lib:beta` - Publish beta version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License

## Author

**Bismarck Villca** ([@villcabo](https://github.com/villcabo))

![GitHub Avatar](https://avatars.githubusercontent.com/u/7145004?v=4&s=50)

- **GitHub**: [villcabo](https://github.com/villcabo)
- **Website**: [villcabo.github.io](https://villcabo.github.io/)
- **Twitter**: [@BismarckVillcaS](https://twitter.com/BismarckVillcaS)
- **Company**: [@SintesisSA](https://github.com/SintesisSA)
- **Location**: Bolivia

*Software Engineer & FullStack Developer specializing in Spring Boot, Angular, Docker, Kubernetes, and CI/CD with Jenkins, GitHub Actions, and TeamCity.*
