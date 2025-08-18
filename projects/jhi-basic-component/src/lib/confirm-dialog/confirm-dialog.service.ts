import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  constructor(private modalService: NgbModal) {}

  openDialog(options: {
    title?: string;
    message?: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    confirmButtonClass?: string;
  }): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmDialogComponent, { backdrop: 'static' });
    modalRef.componentInstance.title = options.title ?? 'Confirm';
    modalRef.componentInstance.message = options.message ?? 'Are you sure?';
    modalRef.componentInstance.confirmButtonText = options.confirmButtonText ?? 'Confirm';
    modalRef.componentInstance.cancelButtonText = options.cancelButtonText ?? 'Cancel';
    modalRef.componentInstance.confirmButtonClass = options.confirmButtonClass ?? 'btn-primary';

    return modalRef.result;
  }

  // Specialize one for activate or deactivate, without passing many parameters
  openActivateDialog(options: { isActivated: boolean }): Promise<boolean> {
    return this.openDialog({
      title: options.isActivated ? 'Activate' : 'Inactivate',
      message: `Are you sure you want to ${options.isActivated ? 'activate' : 'inactivate'} this item?`,
      confirmButtonText: 'Yes, ' + (options.isActivated ? 'Activate' : 'Inactivate'),
      cancelButtonText: 'No, Cancel',
      confirmButtonClass: options.isActivated ? 'btn-success' : 'btn-danger',
    });
  }
}
