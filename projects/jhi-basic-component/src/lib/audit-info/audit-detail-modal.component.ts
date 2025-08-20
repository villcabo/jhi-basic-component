import { Component, inject, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuditableEntity } from '../audit-info/audit-info.component';

@Component({
  selector: 'jhi-audit-detail-modal',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        <fa-icon icon="history" class="me-2 text-primary"></fa-icon>
        Audit Information
      </h4>
      <button type="button" class="btn-close" aria-label="Close" (click)="dismiss()"></button>
    </div>

    <div class="modal-body">
      <div class="audit-details">
        <!-- Creation Information -->
        <div class="audit-section">
          <div class="section-header">
            <fa-icon icon="calendar-check" class="section-icon created-icon"></fa-icon>
            <h5 class="section-title">Creation Details</h5>
          </div>
          <div class="audit-info-grid">
            <div class="info-item">
              <label class="info-label">Created By:</label>
              <span class="info-value">{{ entity().createdBy || 'Unknown' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">Creation Date:</label>
              <span class="info-value">{{ formatFullDate(entity().createdDate) }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">Time Ago:</label>
              <span class="info-value time-ago">{{ getTimeAgo(entity().createdDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Modification Information -->
        <div class="audit-section">
          <div class="section-header">
            <fa-icon icon="newspaper" class="section-icon modified-icon"></fa-icon>
            <h5 class="section-title">Last Modification</h5>
          </div>
          <div class="audit-info-grid">
            <div class="info-item">
              <label class="info-label">Modified By:</label>
              <span class="info-value">{{ entity().lastModifiedBy || 'Unknown' }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">Modification Date:</label>
              <span class="info-value">{{ formatFullDate(entity().lastModifiedDate) }}</span>
            </div>
            <div class="info-item">
              <label class="info-label">Time Ago:</label>
              <span class="info-value time-ago">{{ getTimeAgo(entity().lastModifiedDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        @if (getRecordAge() !== null) {
          <div class="audit-section stats-section">
            <div class="section-header">
              <fa-icon icon="chart-bar" class="section-icon stats-icon"></fa-icon>
              <h5 class="section-title">Statistics</h5>
            </div>
            <div class="stats-grid">
              <div class="stat-item">
                <fa-icon icon="clock" class="stat-icon"></fa-icon>
                <div class="stat-content">
                  <span class="stat-label">Record Age</span>
                  <span class="stat-value">{{ getRecordAge() }} day(s)</span>
                </div>
              </div>
              <div class="stat-item">
                <fa-icon icon="edit" class="stat-icon"></fa-icon>
                <div class="stat-content">
                  <span class="stat-label">Status</span>
                  <span class="stat-value">{{ hasBeenModified() ? 'Modified' : 'Original' }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="dismiss()">
        <fa-icon icon="times" class="me-1"></fa-icon>
        Close
      </button>
    </div>
  `,
  styleUrls: [ './audit-detail-modal.component.scss' ],
})
export class AuditDetailModalComponent {
  entity = input.required<AuditableEntity>();

  private activeModal = inject(NgbActiveModal);

  dismiss(): void {
    this.activeModal.dismiss();
  }

  formatFullDate(date: string | Date | null | undefined): string {
    if (!date) return 'Not available';

    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }

  getTimeAgo(date: string | Date | null | undefined): string {
    if (!date) return 'Unknown';

    const now = new Date();
    const dateObj = new Date(date);
    const diffMs = now.getTime() - dateObj.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  getRecordAge(): number | null {
    const entity = this.entity();
    const createdDate = entity.createdDate ? new Date(entity.createdDate) : null;
    const modifiedDate = entity.lastModifiedDate ? new Date(entity.lastModifiedDate) : null;

    if (!createdDate || !modifiedDate) return null;

    const diffMs = modifiedDate.getTime() - createdDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  hasBeenModified(): boolean {
    const entity = this.entity();
    const createdDate = entity.createdDate ? new Date(entity.createdDate).getTime() : null;
    const modifiedDate = entity.lastModifiedDate ? new Date(entity.lastModifiedDate).getTime() : null;

    if (!createdDate || !modifiedDate) return false;

    return Math.abs(modifiedDate - createdDate) > 1000; // More than 1 second difference
  }
}
