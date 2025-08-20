import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuditDetailModalComponent } from './audit-detail-modal.component';

export interface AuditableEntity {
  createdBy?: string | null;
  createdDate?: string | Date | null;
  lastModifiedBy?: string | null;
  lastModifiedDate?: string | Date | null;
}

@Component({
  selector: 'jhi-audit-info',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="audit-info" (click)="openAuditModal()">
      <div class="audit-line">
        <fa-icon icon="calendar-check" class="audit-icon created-icon"></fa-icon>
        <span class="audit-user">{{ entity().createdBy || 'N/A' }}</span>
        <span class="audit-date">{{ entity().createdDate | date: 'yyyy-MM-dd HH:mm' }}</span>
      </div>
      <div class="audit-line">
        <fa-icon icon="newspaper" class="audit-icon modified-icon"></fa-icon>
        <span class="audit-user">{{ entity().lastModifiedBy || 'N/A' }}</span>
        <span class="audit-date">{{ entity().lastModifiedDate | date: 'yyyy-MM-dd HH:mm' }}</span>
      </div>
      <div class="audit-action">
        <fa-icon icon="search-plus" class="action-icon" title="Click to view detailed audit information"></fa-icon>
      </div>
    </div>
  `,
  styleUrls: [ './audit-info.component.scss' ],
})
export class AuditInfoComponent {
  entity = input.required<AuditableEntity>();

  private modalService = inject(NgbModal);

  openAuditModal(): void {
    const modalRef = this.modalService.open(AuditDetailModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true,
    });

    modalRef.componentInstance.entity = this.entity;
  }
}
