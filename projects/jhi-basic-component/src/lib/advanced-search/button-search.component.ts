import { Component, EventEmitter, HostListener, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

const localStorageKey = 'jhiDisplaySearch';

@Component({
  selector: 'jhi-button-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FaIconComponent, NgbTooltip],
  template: `
    <button
      class="btn me-2"
      (click)="onDisplaySearch()"
      [disabled]="isLoading"
      [ngClass]="{ 'btn-danger': displaySearch, 'btn-dark': !displaySearch }"
      placement="top"
      ngbTooltip="Shortcut: Press F3"
    >
      <fa-icon icon="search" [animation]="isLoading ? 'spin' : undefined"></fa-icon>
      <span>{{ !displaySearch ? 'Show Filter' : 'Hide Filter' }}</span>
    </button>
  `,
})
export class ButtonSearchComponent implements OnInit {
  @Input({ required: true })
  set displaySearch(value: boolean) {
    this._displaySearch.set(value);
  }

  get displaySearch() {
    return this._displaySearch();
  }

  private _displaySearch = signal<boolean>(false);

  @Input({ required: true })
  set isLoading(value: boolean) {
    this._isLoading.set(value);
  }

  get isLoading() {
    return this._isLoading();
  }

  private _isLoading = signal<boolean>(false);

  @Output()
  displaySearchChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.f3', ['$event'])
  handleKeyboardEvent(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.onDisplaySearch();
  }

  ngOnInit(): void {
    const saved = localStorage.getItem(localStorageKey);
    if (saved !== null) {
      this.displaySearch = saved === 'true';
      setTimeout(() => {
        this.displaySearchChange.emit(this.displaySearch);
      });
    }
  }

  onDisplaySearch() {
    if (!this.isLoading) {
      this.displaySearch = !this.displaySearch;
      this.displaySearchChange.emit(this.displaySearch);
      localStorage.setItem(localStorageKey, String(this.displaySearch));
    }
  }
}
