# JHI Basic Component Library

A comprehensive Angular component library providing essential UI components for modern web applications. This library includes reusable components for toggles, advanced search functionality, breadcrumb navigation, and confirmation dialogs.

## Version
Current version: **1.0.0**

## Installation

Install the library via npm:

```bash
npm install villcabo/jhi-basic-component
```

### Dependencies

This library requires the following peer dependencies:

```json
{
  "@angular/common": "20.1.0",
  "@angular/core": "20.1.0",
  "@fortawesome/angular-fontawesome": "1.0.0",
  "@fortawesome/fontawesome-svg-core": "6.7.2",
  "@fortawesome/free-regular-svg-icons": "6.7.2",
  "@fortawesome/free-solid-svg-icons": "6.7.2",
  "@ng-bootstrap/ng-bootstrap": "18.0.0"
}
```

## Getting Started

All components are standalone and can be imported directly into your Angular components:

```typescript
import { ActiveToggleComponent, AdvancedSearchComponent, ButtonSearchComponent, BreadcrumbComponent } from 'villcabo/jhi-basic-component';
```

## Components

### 1. ActiveToggleComponent

A customizable toggle component for activating/deactivating items with optional confirmation dialog.

#### Features
- Customizable active/inactive text
- Multiple sizes (sm, md, lg)
- Optional confirmation dialog
- Disabled state support
- Bootstrap styling

#### Usage

```typescript
import { ActiveToggleComponent } from 'villcabo/jhi-basic-component';

@Component({
  standalone: true,
  imports: [ActiveToggleComponent],
  template: `
    <jhi-active-toggle
      [isActive]="userActive"
      [disabled]="loading"
      [showConfirmDialog]="true"
      activeText="Active"
      inactiveText="Inactive"
      size="md"
      (toggleChange)="onToggleUser($event)">
    </jhi-active-toggle>
  `
})
export class UserComponent {
  userActive = true;
  loading = false;

  onToggleUser(newState: boolean): void {
    this.loading = true;
    // Your API call here
    this.userService.updateUserStatus(newState).subscribe(() => {
      this.userActive = newState;
      this.loading = false;
    });
  }
}
```

#### API

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isActive` | `boolean \| null \| undefined` | `false` | Current active state |
| `disabled` | `boolean` | `false` | Whether the toggle is disabled |
| `activeText` | `string` | `'Activated'` | Text shown when active |
| `inactiveText` | `string` | `'Deactivated'` | Text shown when inactive |
| `size` | `'sm' \| 'md' \| 'lg'` | `'sm'` | Size of the toggle button |
| `showConfirmDialog` | `boolean` | `true` | Whether to show confirmation dialog |

| Event | Type | Description |
|-------|------|-------------|
| `toggleChange` | `EventEmitter<boolean>` | Emitted when toggle state changes |

### 2. AdvancedSearchComponent

A powerful search component with multiple filter types and keyboard shortcuts.

#### Features
- Multiple filter types: input, select, checkbox, date, numeric, boolean
- Async option loading
- Keyboard shortcuts (Enter to search, F2 to search, F4 to reset)
- Form validation
- URL parameter integration

#### Usage

```typescript
import { AdvancedSearchComponent, FilterItem, FilterOutput } from 'villcabo/jhi-basic-component';

@Component({
  standalone: true,
  imports: [AdvancedSearchComponent],
  template: `
    <jhi-advanced-search
      [filterItems]="filterItems"
      [displaySearch]="showFilters"
      (search)="onSearch($event)"
      (reset)="onReset()">
    </jhi-advanced-search>
  `
})
export class SearchComponent {
  showFilters = true;
  filterItems: FilterItem[] = [
    {
      title: 'Name',
      type: 'input',
      searchKey: 'name',
      placeholder: 'Enter name...'
    },
    {
      title: 'Status',
      type: 'comboSelect',
      searchKey: 'status',
      options: [
        { key: 'Active', value: 'active' },
        { key: 'Inactive', value: 'inactive' }
      ]
    },
    {
      title: 'Created Date',
      type: 'dateRange',
      searchKey: 'createdDate'
    },
    {
      title: 'Age',
      type: 'numeric',
      searchKey: 'age',
      min: 0,
      max: 120
    }
  ];

  onSearch(filters: FilterOutput): void {
    console.log('Search filters:', filters);
    // Perform search with filters
  }

  onReset(): void {
    console.log('Filters reset');
    // Handle reset
  }
}
```

#### Filter Types

| Type | Description | Additional Properties |
|------|-------------|----------------------|
| `input` | Text input field | `placeholder` |
| `comboSelect` | Dropdown selection | `options`, `loadOptions`, `multiple` |
| `comboCheck` | Checkbox group | `options`, `loadOptions` |
| `date` | Single date picker | - |
| `dateRange` | Date range picker | - |
| `numeric` | Number input | `min`, `max`, `step` |
| `boolean` | Boolean toggle | - |

#### API

| Property | Type | Description |
|----------|------|-------------|
| `filterItems` | `FilterItem[]` | Array of filter configurations |
| `displaySearch` | `boolean` | Whether to show the search form |

| Event | Type | Description |
|-------|------|-------------|
| `search` | `EventEmitter<FilterOutput>` | Emitted when search is performed |
| `reset` | `EventEmitter<void>` | Emitted when filters are reset |

### 3. ButtonSearchComponent

A companion component for toggling the advanced search visibility.

#### Usage

```typescript
import { ButtonSearchComponent } from 'villcabo/jhi-basic-component';

@Component({
  standalone: true,
  imports: [ButtonSearchComponent],
  template: `
    <jhi-button-search
      [displaySearch]="showFilters"
      [isLoading]="loading"
      (displaySearchChange)="onToggleSearch($event)">
    </jhi-button-search>
  `
})
export class SearchPageComponent {
  showFilters = false;
  loading = false;

  onToggleSearch(show: boolean): void {
    this.showFilters = show;
  }
}
```

### 4. BreadcrumbComponent

An intelligent breadcrumb navigation component that automatically generates navigation paths.

#### Features
- Automatic breadcrumb generation from routes
- Back button support
- FontAwesome icon integration
- Query parameter handling
- Customizable current page display

#### Usage

```typescript
import { BreadcrumbComponent } from 'villcabo/jhi-basic-component';

@Component({
  standalone: true,
  imports: [BreadcrumbComponent],
  template: `
    <jhi-breadcrumb
      [showBackButton]="true"
      [currentPageTitle]="pageTitle"
      [currentPageIcon]="pageIcon"
      backButtonTitle="Return to List">
    </jhi-breadcrumb>
  `
})
export class DetailPageComponent {
  pageTitle = 'User Details';
  pageIcon = 'user';
}
```

#### API

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `showBackButton` | `boolean` | `false` | Whether to show back button |
| `backButtonTitle` | `string` | `'Go back'` | Back button tooltip text |
| `currentPageTitle` | `string` | `'Current Page'` | Current page display name |
| `currentPageIcon` | `string` | `'file'` | FontAwesome icon for current page |

### 5. ConfirmDialogComponent & ConfirmDialogService

A flexible confirmation dialog system with customizable messages and buttons.

#### Usage

```typescript
import { ConfirmDialogService } from 'villcabo/jhi-basic-component';

@Component({
  // ...
})
export class MyComponent {
  constructor(private confirmDialog: ConfirmDialogService) {}

  async deleteUser(): Promise<void> {
    const confirmed = await this.confirmDialog.openDialog({
      title: 'Delete User',
      message: 'Are you sure you want to delete this user? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'btn-danger'
    });

    if (confirmed) {
      // Perform deletion
      this.userService.deleteUser(this.userId).subscribe();
    }
  }

  async toggleUserStatus(): Promise<void> {
    const confirmed = await this.confirmDialog.openActivateDialog({
      isActivated: !this.user.active
    });

    if (confirmed) {
      this.user.active = !this.user.active;
      this.userService.updateUser(this.user).subscribe();
    }
  }
}
```

#### ConfirmDialogService API

| Method | Parameters | Return | Description |
|--------|------------|--------|-------------|
| `openDialog` | `options: DialogOptions` | `Promise<boolean>` | Opens a custom confirmation dialog |
| `openActivateDialog` | `options: { isActivated: boolean }` | `Promise<boolean>` | Opens an activate/deactivate confirmation |

#### DialogOptions Interface

```typescript
interface DialogOptions {
  title?: string;
  message?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonClass?: string;
}
```

## Setup and Configuration

### 1. Import Required Modules

In your `app.config.ts` or module setup:

```typescript
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideAnimations(),
    // ...
  ],
};

// If using modules, import NgbModule in your app module
@NgModule({
  imports: [NgbModule],
  // ...
})
export class AppModule { }
```

### 2. FontAwesome Setup

Configure FontAwesome icons in your main application:

```typescript
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

export class AppComponent {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}
```

### 3. Bootstrap Styles

Ensure Bootstrap CSS is included in your `angular.json` or `styles.scss`:

```scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

## Keyboard Shortcuts

| Component | Shortcut | Action |
|-----------|----------|--------|
| AdvancedSearch | `Enter` | Perform search |
| AdvancedSearch | `F2` | Perform search |
| AdvancedSearch | `F4` | Reset filters |
| ButtonSearch | `F3` | Toggle search visibility |

## Building the Library

To build the library for distribution:

```bash
ng build jhi-basic-component
```

The build artifacts will be stored in the `dist/jhi-basic-component` directory.

## Publishing

1. Build the library:
   ```bash
   ng build jhi-basic-component
   ```

2. Navigate to the dist directory:
   ```bash
   cd dist/jhi-basic-component
   ```

3. Publish to npm:
   ```bash
   npm publish
   ```

## Contributing

When contributing to this library:

1. Follow Angular best practices
2. Ensure all components are standalone
3. Add comprehensive documentation for new features
4. Include usage examples
5. Test thoroughly before submitting

## License

This library is distributed under the MIT License.

## Support

For issues, feature requests, or questions, please refer to the project repository or contact the maintainers.
