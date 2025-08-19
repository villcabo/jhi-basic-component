# JHI Basic Component Library

A comprehensive Angular component library providing essential UI components for modern web applications.

## Installation

```bash
npm install villcabo/jhi-basic-component
```

## Components

### 1. Active Toggle Component

A smart toggle component for activating/deactivating items with optional confirmation dialogs.

#### Features
- Customizable active/inactive states
- Optional confirmation dialogs
- Multiple sizes (sm, md, lg)
- Disabled state support
- Bootstrap styling

#### Usage

```typescript
import { ActiveToggleComponent } from 'villcabo/jhi-basic-component';

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

#### Inputs
- `isActive: boolean | null | undefined` - Current active state
- `disabled: boolean` - Whether the toggle is disabled (default: false)
- `activeText: string` - Text to display when active (default: 'Activated')
- `inactiveText: string` - Text to display when inactive (default: 'Deactivated')
- `size: 'sm' | 'md' | 'lg'` - Size of the toggle button (default: 'sm')
- `showConfirmDialog: boolean` - Show confirmation dialog (default: true)

#### Outputs
- `toggleChange: EventEmitter<boolean>` - Emitted when toggle state changes

---

### 2. Advanced Search Component

A powerful search component with multiple filter types and form validation.

#### Features
- Multiple filter types: input, select, date, numeric, boolean
- Async option loading
- Local storage persistence
- Form validation
- Responsive design

#### Usage

```typescript
import { AdvancedSearchComponent, FilterItem } from 'villcabo/jhi-basic-component';

@Component({
  selector: 'app-search',
  imports: [AdvancedSearchComponent],
  template: `
    <jhi-advanced-search
      [filterItems]="searchFilters"
      [displaySearch]="showFilters"
      (searchEvent)="onSearch($event)"
      (resetEvent)="onReset()">
    </jhi-advanced-search>
  `
})
export class SearchComponent {
  showFilters = false;
  
  searchFilters: FilterItem[] = [
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
      title: 'Date Range',
      type: 'dateRange',
      searchKey: 'dateRange'
    },
    {
      title: 'Price',
      type: 'numeric',
      searchKey: 'price',
      min: 0,
      max: 1000,
      step: 10
    }
  ];
  
  onSearch(filters: Record<string, any>) {
    console.log('Search filters:', filters);
  }
  
  onReset() {
    console.log('Filters reset');
  }
}
```

#### Filter Types
- `input` - Text input field
- `comboSelect` - Single/multiple select dropdown
- `comboCheck` - Checkbox list
- `date` - Single date picker
- `dateRange` - Date range picker
- `numeric` - Number input with min/max
- `boolean` - Boolean toggle

#### Inputs
- `filterItems: FilterItem[]` - Array of filter configurations
- `displaySearch: boolean` - Whether to show the search form
- `persistInLocalStorage: boolean` - Save filters to localStorage (default: true)

#### Outputs
- `searchEvent: EventEmitter<FilterOutput>` - Emitted when search is triggered
- `resetEvent: EventEmitter<void>` - Emitted when filters are reset
- `displaySearchChange: EventEmitter<boolean>` - Emitted when display state changes

---

### 3. Button Search Component

A toggle button for showing/hiding search filters with keyboard shortcuts.

#### Features
- F3 keyboard shortcut support
- Loading state
- Bootstrap styling
- Tooltip support

#### Usage

```typescript
import { ButtonSearchComponent } from 'villcabo/jhi-basic-component';

@Component({
  selector: 'app-toolbar',
  imports: [ButtonSearchComponent],
  template: `
    <jhi-button-search
      [displaySearch]="showSearch"
      [isLoading]="loading"
      (displaySearchChange)="onToggleSearch($event)">
    </jhi-button-search>
  `
})
export class ToolbarComponent {
  showSearch = false;
  loading = false;
  
  onToggleSearch(show: boolean) {
    this.showSearch = show;
  }
}
```

#### Inputs
- `displaySearch: boolean` - Current display state
- `isLoading: boolean` - Whether to show loading spinner (default: false)

#### Outputs
- `displaySearchChange: EventEmitter<boolean>` - Emitted when button is clicked

---

### 4. Breadcrumb Component

A navigation breadcrumb component with automatic route generation and back button support.

#### Features
- Automatic breadcrumb generation
- Back route support with "Vista Previa" display
- FontAwesome icons
- Query parameter handling
- Responsive design

#### Usage

```typescript
import { BreadcrumbComponent } from 'villcabo/jhi-basic-component';

@Component({
  selector: 'app-page',
  imports: [BreadcrumbComponent],
  template: `
    <jhi-breadcrumb
      [showBackButton]="true"
      backButtonTitle="Go Back"
      currentPageTitle="User Details"
      currentPageIcon="user">
    </jhi-breadcrumb>
  `
})
export class PageComponent {}
```

#### Inputs
- `showBackButton: boolean` - Whether to show back button (default: false)
- `backButtonTitle: string` - Back button tooltip text (default: 'Go back')
- `currentPageTitle: string` - Current page title (default: 'Current Page')
- `currentPageIcon: string` - FontAwesome icon name (default: 'file')

#### Query Parameters
- `backRoute` - Encoded URL for the back navigation, displays as "Vista Previa"

---

### 5. Confirm Dialog Component & Service

A modal confirmation dialog with customizable messages and buttons.

#### Features
- Customizable title, message, and buttons
- Bootstrap modal styling
- Promise-based API
- Specialized activation/deactivation dialogs

#### Usage

```typescript
import { ConfirmDialogService } from 'villcabo/jhi-basic-component';

@Component({
  selector: 'app-actions',
  template: `
    <button (click)="deleteItem()" class="btn btn-danger">Delete</button>
    <button (click)="toggleActivation()" class="btn btn-warning">
      {{ isActive ? 'Deactivate' : 'Activate' }}
    </button>
  `
})
export class ActionsComponent {
  isActive = true;
  
  constructor(private confirmDialog: ConfirmDialogService) {}
  
  async deleteItem() {
    const confirmed = await this.confirmDialog.openDialog({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      confirmButtonClass: 'btn-danger'
    });
    
    if (confirmed) {
      console.log('Item deleted');
    }
  }
  
  async toggleActivation() {
    const confirmed = await this.confirmDialog.openActivateDialog({
      isActivated: !this.isActive
    });
    
    if (confirmed) {
      this.isActive = !this.isActive;
      console.log('Status changed to:', this.isActive);
    }
  }
}
```

#### Service Methods

##### `openDialog(options)`
Opens a generic confirmation dialog.

**Options:**
- `title?: string` - Dialog title (default: 'Confirm')
- `message?: string` - Dialog message (default: 'Are you sure?')
- `confirmButtonText?: string` - Confirm button text (default: 'Confirm')
- `cancelButtonText?: string` - Cancel button text (default: 'Cancel')
- `confirmButtonClass?: string` - Confirm button CSS class (default: 'btn-primary')

**Returns:** `Promise<boolean>` - true if confirmed, false if cancelled

##### `openActivateDialog(options)`
Opens a specialized activation/deactivation dialog.

**Options:**
- `isActivated: boolean` - Whether the item will be activated or deactivated

**Returns:** `Promise<boolean>` - true if confirmed, false if cancelled

---

## Dependencies

This library requires the following peer dependencies:

```json
{
  "@angular/common": "^18.0.0",
  "@angular/core": "^18.0.0",
  "@angular/forms": "^18.0.0",
  "@angular/router": "^18.0.0",
  "@fortawesome/angular-fontawesome": "^0.15.0",
  "@ng-bootstrap/ng-bootstrap": "^17.0.0"
}
```

## Installation with Dependencies

```bash
# Install the library
npm install villcabo/jhi-basic-component

# Install peer dependencies if not already installed
npm install @fortawesome/angular-fontawesome @ng-bootstrap/ng-bootstrap
```

## Setup

1. Import NgBootstrap and FontAwesome in your app:

```typescript
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    NgbModule,
    FontAwesomeModule,
    // ... other imports
  ]
})
export class AppModule {}
```

2. Import Bootstrap CSS in your styles:

```scss
@import '~bootstrap/dist/css/bootstrap.min.css';
```

## Contributing

This library is part of the villcabo component ecosystem. For bug reports and feature requests, please create an issue in the repository.

## License

MIT License
