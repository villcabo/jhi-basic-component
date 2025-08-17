import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../confirm-dialog';

@Component({
  selector: 'jhi-active-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './active-toggle.component.html',
  styleUrls: ['./active-toggle.component.scss'],
})
export class ActiveToggleComponent {
  @Input() isActive: boolean | null | undefined = false;
  @Input() disabled = false;
  @Input() activeText = 'Activated';
  @Input() inactiveText = 'Deactivated';
  @Input() size: 'sm' | 'md' | 'lg' = 'sm';
  @Input() showConfirmDialog = true; // Opción para mostrar diálogo de confirmación

  @Output() toggleChange = new EventEmitter<boolean>();

  private confirmDialogService = inject(ConfirmDialogService);

  onToggle(): void {
    if (this.disabled) return;

    const newState = !this.isActive;

    if (this.showConfirmDialog) {
      // Mostrar diálogo de confirmación antes de emitir el cambio
      this.confirmDialogService.openActivateDialog({ isActivated: newState }).then(confirmed => {
        if (confirmed) {
          this.toggleChange.emit(newState);
        }
      });
    } else {
      // Emitir el cambio directamente sin confirmación
      this.toggleChange.emit(newState);
    }
  }

  get buttonClass(): string {
    const baseClass = `btn btn-${this.size} rounded-pill fw-bold border`;
    const stateClass = this.isActive ? 'btn-outline-success border-success' : 'btn-outline-danger border-danger';
    const disabledClass = this.disabled ? 'disabled' : '';

    return `${baseClass} ${stateClass} ${disabledClass}`.trim();
  }

  get displayText(): string {
    return this.isActive ? this.activeText : this.inactiveText;
  }
}
