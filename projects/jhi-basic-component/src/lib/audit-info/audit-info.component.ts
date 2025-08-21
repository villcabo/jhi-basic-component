import { Component, input, inject, computed } from '@angular/core';
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

/**
 * Extrae información de auditoría de cualquier objeto
 * Busca propiedades comunes de auditoría con diferentes nomenclaturas
 */
function extractAuditInfo(entity: any): AuditableEntity {
  if (!entity) return {};

  return {
    createdBy: entity.createdBy || entity.createdUser || entity.createUser || entity.creator || null,
    createdDate: entity.createdDate || entity.createdAt || entity.createDate || entity.creationDate || null,
    lastModifiedBy: entity.lastModifiedBy || entity.modifiedBy || entity.updatedBy || entity.lastUpdatedBy || entity.modifier || null,
    lastModifiedDate: entity.lastModifiedDate || entity.modifiedDate || entity.updatedAt || entity.lastUpdatedAt || entity.updateDate || null,
  };
}

@Component({
  selector: 'jhi-audit-info',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="audit-info" (click)="openAuditModal()">
      <div class="audit-line">
        <fa-icon icon="calendar-check" class="audit-icon created-icon"></fa-icon>
        <span class="audit-user">{{ auditInfo().createdBy || 'N/A' }}</span>
        <span class="audit-date">{{ auditInfo().createdDate | date: 'yyyy-MM-dd HH:mm' }}</span>
      </div>
      <div class="audit-line">
        <fa-icon icon="newspaper" class="audit-icon modified-icon"></fa-icon>
        <span class="audit-user">{{ auditInfo().lastModifiedBy || 'N/A' }}</span>
        <span class="audit-date">{{ auditInfo().lastModifiedDate | date: 'yyyy-MM-dd HH:mm' }}</span>
      </div>
      <div class="audit-action">
        <fa-icon icon="search-plus" class="action-icon" title="Click to view detailed audit information"></fa-icon>
      </div>
    </div>
  `,
  styleUrls: [ './audit-info.component.scss' ],
})
export class AuditInfoComponent {
  entity = input.required<any>();

  // Computed signal que extrae automáticamente la información de auditoría
  auditInfo = computed(() => extractAuditInfo(this.entity()));

  private modalService = inject(NgbModal);

  openAuditModal(): void {
    const modalRef = this.modalService.open(AuditDetailModalComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: true,
      centered: true,
    });

    modalRef.componentInstance.entity = this.auditInfo;
  }
}
