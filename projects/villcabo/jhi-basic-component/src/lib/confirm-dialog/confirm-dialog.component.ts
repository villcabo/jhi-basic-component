import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{ title }}</h4>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="cancel()">
        {{ cancelButtonText }}
      </button>
      <button type="button" [class]="'btn ' + confirmButtonClass" (click)="confirm()">
        {{ confirmButtonText }}
      </button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  @Input() title = 'Confirm';
  @Input() message = 'Are you sure?';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';
  @Input() confirmButtonClass = 'btn-primary';

  constructor(public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss(false);
  }

  confirm(): void {
    this.activeModal.close(true);
  }
}
