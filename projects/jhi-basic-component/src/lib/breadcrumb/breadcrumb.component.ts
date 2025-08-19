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
   * Obtiene la URL base para el routerLink del botón de regreso
   */
  getBackRouteUrl(): string {
    if (!this.backRouteSignal()) return '/';

    const { url } = this.parseBackRoute(this.backRouteSignal()!);
    return url;
  }

  /**
   * Obtiene los query parameters para el routerLink del botón de regreso
   */
  getBackRouteQueryParams(): Record<string, any> | null {
    if (!this.backRouteSignal()) return null;

    const { queryParams } = this.parseBackRoute(this.backRouteSignal()!);
    return Object.keys(queryParams).length > 0 ? queryParams : null;
  }

  /**
   * Genera automáticamente los items del breadcrumb basándose en el backRoute
   */
  private generateBreadcrumbItems(backRoute: string): IBreadcrumbItem[] {
    const items: IBreadcrumbItem[] = [{ label: 'Home', route: '/', icon: 'home' }];

    // Simplemente agregar un item de "Vista Previa" para el backRoute
    const { url } = this.parseBackRoute(backRoute);
    items.push({
      label: 'Previous View',
      route: url,
      icon: 'arrow-left'
    });

    // Agregar página actual
    items.push({ label: this.currentPageTitle, icon: this.currentPageIcon });

    return items;
  }

  /**
   * Parsea query parameters de la URL
   */
  private parseQueryParams(queryString?: string): Record<string, string> {
    const params: Record<string, string> = {};
    if (queryString) {
      const urlParams = new URLSearchParams(queryString);
      urlParams.forEach((value, key) => {
        params[key] = value;
      });
    }
    return params;
  }

  /**
   * Extrae solo los query parameters relevantes para el breadcrumb
   */
  private extractRelevantQueryParams(allParams: Record<string, string>, relevantKeys: string[]): Record<string, string> {
    const relevant: Record<string, string> = {};
    relevantKeys.forEach(key => {
      if (allParams[key]) {
        relevant[key] = allParams[key];
      }
    });
    return Object.keys(relevant).length > 0 ? relevant : undefined!;
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
   * Parsea el backRoute y extrae la URL y query parameters
   * Maneja tanto URLs codificadas como no codificadas
   */
  private parseBackRoute(backRoute: string): { url: string; queryParams: Record<string, any> } {
    try {
      // Primero intentamos decodificar la URL completa
      const decodedRoute = decodeURIComponent(backRoute);

      // Separar la URL base de los query parameters
      const [baseUrl, queryString] = decodedRoute.split('?');

      const queryParams: Record<string, any> = {};

      if (queryString) {
        // Parsear query parameters
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
          // Manejar valores múltiples para la misma key
          if (queryParams[key]) {
            if (Array.isArray(queryParams[key])) {
              queryParams[key].push(value);
            } else {
              queryParams[key] = [queryParams[key], value];
            }
          } else {
            queryParams[key] = value;
          }
        });
      }

      return { url: baseUrl, queryParams };
    } catch (error) {
      // Si falla la decodificación, intentar con la URL original
      console.warn('Error parsing backRoute:', error);
      const [baseUrl, queryString] = backRoute.split('?');

      const queryParams: Record<string, any> = {};
      if (queryString) {
        const urlParams = new URLSearchParams(queryString);
        urlParams.forEach((value, key) => {
          queryParams[key] = value;
        });
      }

      return { url: baseUrl, queryParams };
    }
  }

  /**
   * Verifica si el breadcrumb debe ser visible
   */
  get shouldShowBreadcrumb(): boolean {
    return this.items().length > 1;
  }
}
