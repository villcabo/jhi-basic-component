import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild,
  OnChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ActivatedRoute } from '@angular/router';

export interface FilterItem {
  title: string;
  type: 'input' | 'comboSelect' | 'comboCheck' | 'date' | 'dateRange' | 'numeric' | 'boolean';
  searchKey: string;
  placeholder?: string;
  defaultValue?: any;
  value?: any;
  options?: { key: string; value: any }[];
  loadOptions?: () => Promise<{ key: string; value: any }[]>;
  multiple?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export type FilterOutput = Record<string, any>;

@Component({
  selector: 'jhi-advanced-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent],
  templateUrl: './advanced-search.component.html',
  styleUrl: './advanced-search.component.scss',
})
export class AdvancedSearchComponent implements OnInit, AfterViewInit, OnChanges {
  @HostListener('document:keydown.enter', ['$event'])
  onEnterKey(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (this.displaySearch && this.filterForm?.valid) {
      keyboardEvent.preventDefault();
      this.onSearch();
    }
  }

  @Input({ required: true })
  set filterItems(items: FilterItem[]) {
    this._filterItems.set(items);
    this.initForm();
  }

  get filterItems() {
    return this._filterItems();
  }

  @Input()
  set displaySearch(value: boolean) {
    this._displaySearch.set(value);
  }

  get displaySearch() {
    return this._displaySearch();
  }

  @Output() search = new EventEmitter<FilterOutput>();
  @Output() reset = new EventEmitter<void>();

  filterForm!: FormGroup;
  loading = signal(false);
  optionsLoading = signal<Record<string, boolean>>({});

  @ViewChild('firstInput') firstInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private _filterItems = signal<FilterItem[]>([]);
  private _displaySearch = signal<boolean>(false);
  private route = inject(ActivatedRoute);

  ngAfterViewInit(): void {
    this.focusFirstInput();
  }

  ngOnInit(): void {
    this.initForm();
    this.loadFromUrl();
  }

  async onLoadOptions(item: FilterItem): Promise<void> {
    if (item.loadOptions && !item.options) {
      this.optionsLoading.update(current => ({
        ...current,
        [item.searchKey]: true,
      }));

      try {
        item.options = await item.loadOptions();
      } finally {
        this.optionsLoading.update(current => ({
          ...current,
          [item.searchKey]: false,
        }));
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardShortcut(event: KeyboardEvent): void {
    if (!this.displaySearch) return;
    switch (event.key) {
      case 'F2':
        event.preventDefault();
        this.onSearch();
        break;
      case 'F4':
        event.preventDefault();
        this.onReset();
        break;
    }
  }

  onSearch(): void {
    if (this.filterForm.valid) {
      this.loading.set(true);
      const formValue = this.filterForm.value;
      const output: FilterOutput = {};

      Object.keys(formValue).forEach(key => {
        if (formValue[key] !== null && formValue[key] !== undefined && formValue[key] !== '') {
          output[key] = formValue[key];
        }
      });

      this.search.emit(output);
      this.loading.set(false);
    }
  }

  onReset(): void {
    this.filterForm.reset();

    this._filterItems().forEach(item => {
      if (item.defaultValue !== undefined) {
        this.filterForm.get(item.searchKey)?.setValue(item.defaultValue);
      }
    });

    this.reset.emit();
  }

  ngOnChanges(): void {
    if (this.displaySearch) {
      setTimeout(() => this.focusFirstInput(), 0);
    }
  }

  private initForm(): void {
    const formGroup: Record<string, any> = {};

    this._filterItems().forEach(item => {
      formGroup[item.searchKey] = [item.defaultValue ?? null];

      if (item.defaultValue !== undefined) {
        item.value = item.defaultValue;
      }
    });

    this.filterForm = this.fb.group(formGroup);
  }

  private focusFirstInput(): void {
    if (this.displaySearch && this.firstInput) {
      this.firstInput.nativeElement.focus();
    }
  }

  private loadFromUrl(): void {
    this.route.queryParamMap.subscribe(params => {
      const formValues: Record<string, any> = {};
      this._filterItems().forEach(item => {
        const paramKey = `filter[${item.searchKey}]`;
        const value = params.get(paramKey);
        if (value !== null) {
          formValues[item.searchKey] = value;
        }
      });
      this.filterForm.patchValue(formValues);
    });
  }
}
