import { Component, Input, inject, computed, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IBreadcrumbItem } from './breadcrumb.model';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'jhi-breadcrumb',
  imports: [CommonModule, RouterModule, FaIconComponent],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent implements OnInit {
  @Input() showBackButton = false;
  @Input() backButtonTitle = 'Go back';
  @Input() currentPageTitle = 'Current Page';
  @Input() currentPageIcon = 'file';

  // Computed property que genera automáticamente los breadcrumb items
  items = computed<IBreadcrumbItem[]>(() => {
    const backRoute = this.backRouteSignal();
    if (!backRoute) {
      return [
        { label: 'Home', route: '/', icon: 'home' },
        { label: this.currentPageTitle, icon: this.currentPageIcon },
      ];
    }

    return this.generateBreadcrumbItems(backRoute);
  });

  private router = inject(Router);
  private location = inject(Location);
  private activatedRoute = inject(ActivatedRoute);

  // Signal para el backRoute obtenido de query params
  private backRouteSignal = signal<string | null>(null);

  ngOnInit(): void {
    // Suscribirse a los query parameters para obtener backRoute
    this.activatedRoute.queryParams.subscribe(params => {
      const backRoute = params['backRoute'];
      this.backRouteSignal.set(backRoute ?? null);
    });
  }

  /**
   * Genera automáticamente los items del breadcrumb basándose en el backRoute
   */
  private generateBreadcrumbItems(backRoute: string): IBreadcrumbItem[] {
    const items: IBreadcrumbItem[] = [{ label: 'Home', route: '/', icon: 'home' }];

    // Generar un nombre descriptivo basado en la ruta
    const previousViewName = this.generatePreviousViewName(backRoute);

    items.push({
      label: previousViewName,
      route: backRoute,
      icon: 'arrow-left'
    });

    // Agregar página actual
    items.push({ label: this.currentPageTitle, icon: this.currentPageIcon });

    return items;
  }

  /**
   * Genera un nombre descriptivo para la vista previa basado en la ruta
   */
  private generatePreviousViewName(backRoute: string): string {
    try {
      // Extraer solo la parte de la URL sin query parameters para el nombre
      const urlPart = backRoute.split('?')[0];

      // Obtener el último segmento significativo de la ruta
      const segments = urlPart.split('/').filter(segment => segment && segment !== 'view' && segment !== 'edit');

      if (segments.length === 0) {
        return 'Previous View';
      }

      // Tomar el último segmento (que generalmente es el más descriptivo)
      const lastSegment = segments[segments.length - 1];

      // Si es un número (ID), tomar el segmento anterior
      if (!isNaN(Number(lastSegment)) && segments.length > 1) {
        const entityType = segments[segments.length - 2];
        return this.formatEntityLabel(entityType);
      }

      // Si no es un número, formatearlo directamente
      return this.formatEntityLabel(lastSegment);

    } catch (error) {
      console.warn('Error generating previous view name:', error);
      return 'Previous View';
    }
  }

  /**
   * Formatea el nombre de entidad para mostrar
   */
  private formatEntityLabel(entityType: string): string {
    return entityType
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Obtiene la URL base para el routerLink del botón de regreso
   */
  getBackRouteUrl(): string {
    if (!this.backRouteSignal()) return '/';
    return this.backRouteSignal()!;
  }

  /**
   * Obtiene los query parameters para el routerLink del botón de regreso
   */
  getBackRouteQueryParams(): Record<string, any> | null {
    // No necesitamos parsear query parameters, Angular los manejará automáticamente
    return null;
  }

  /**
   * Verifica si el breadcrumb debe ser visible
   */
  get shouldShowBreadcrumb(): boolean {
    return this.items().length > 1;
  }
}
