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

    try {
      const decodedRoute = decodeURIComponent(backRoute);
      const [baseUrl, queryString] = decodedRoute.split('?');

      // Parsear query parameters para contexto adicional
      const queryParams = this.parseQueryParams(queryString);

      // Analizar la URL para generar breadcrumbs inteligentes
      const urlSegments = baseUrl.split('/').filter(segment => segment.length > 0);

      this.buildBreadcrumbFromSegments(urlSegments, queryParams, items);
    } catch (error) {
      console.warn('Error generating breadcrumb from backRoute:', error);
      items.push({ label: 'Back', route: backRoute.split('?')[0], icon: 'arrow-left' });
    }

    // Agregar página actual
    items.push({ label: this.currentPageTitle, icon: this.currentPageIcon });

    return items;
  }

  /**
   * Construye el breadcrumb basándose en los segmentos de URL
   */
  private buildBreadcrumbFromSegments(segments: string[], queryParams: Record<string, string>, items: IBreadcrumbItem[]): void {
    for (let i = 0; i < segments.length; i += 2) {
      const entityType = segments[i];
      const entityId = segments[i + 1];

      switch (entityType) {
        case 'company':
          items.push({ label: 'Companies', route: '/company', icon: 'building' });
          if (entityId) {
            const companyRoute = `/company/${entityId}`;
            // Detectar si es vista de detalle
            if (segments[i + 2] === 'view') {
              items.push({
                label: `Company #${entityId}`,
                route: companyRoute + '/view',
                queryParams: this.extractRelevantQueryParams(queryParams, ['tab']),
                icon: 'info-circle',
              });
              i++; // Saltar el segmento 'view'
            } else {
              items.push({ label: `Company #${entityId}`, route: companyRoute, icon: 'info-circle' });
            }
          }
          break;

        case 'company-user':
          items.push({ label: 'Company Users', route: '/company-user', icon: 'users' });
          if (entityId) {
            items.push({ label: `User #${entityId}`, route: `/company-user/${entityId}`, icon: 'user' });
          }
          break;

        case 'company-service-type':
          items.push({ label: 'Service Types', route: '/company-service-type', icon: 'th-list' });
          if (entityId) {
            items.push({ label: `Service #${entityId}`, route: `/company-service-type/${entityId}`, icon: 'cog' });
          }
          break;

        case 'webhook-config':
          items.push({ label: 'Webhooks', route: '/webhook-config', icon: 'webhook' });
          if (entityId) {
            items.push({ label: `Webhook #${entityId}`, route: `/webhook-config/${entityId}`, icon: 'link' });
          }
          break;

        case 'payment-gateway':
          items.push({ label: 'Payment Gateways', route: '/payment-gateway', icon: 'credit-card' });
          if (entityId) {
            items.push({ label: `Gateway #${entityId}`, route: `/payment-gateway/${entityId}`, icon: 'gateway' });
          }
          break;

        default:
          // Para entidades no reconocidas, crear un breadcrumb genérico
          if (entityId) {
            const label = this.formatEntityLabel(entityType);
            items.push({
              label: `${label} #${entityId}`,
              route: `/${entityType}/${entityId}`,
              icon: 'file',
            });
          } else {
            const label = this.formatEntityLabel(entityType);
            items.push({
              label,
              route: `/${entityType}`,
              icon: 'list',
            });
          }
          break;
      }
    }
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
