import { Component, Input, inject, computed, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  private activatedRoute = inject(ActivatedRoute);

  // Signal para el backRoute obtenido de query params
  private backRouteSignal = signal<string | null>(null);

  ngOnInit(): void {
    // Suscribirse a los query parameters para obtener backRoute
    this.activatedRoute.queryParams.subscribe(params => {
      const backRoute = params['backRoute'];
      // Decodificar la URL para manejar caracteres especiales
      const decodedBackRoute = backRoute ? decodeURIComponent(backRoute) : null;
      this.backRouteSignal.set(decodedBackRoute);
    });
  }

  /**
   * Genera automáticamente los items del breadcrumb basándose en el backRoute
   */
  private generateBreadcrumbItems(backRoute: string): IBreadcrumbItem[] {
    const items: IBreadcrumbItem[] = [{ label: 'Home', route: '/', icon: 'home' }];

    // Generar un nombre descriptivo basado en la ruta
    const previousViewName = this.generatePreviousViewName(backRoute);

    // Generar un icono apropiado basado en el nombre
    const previousViewIcon = this.generateIconForRoute(backRoute, previousViewName);

    items.push({
      label: previousViewName,
      route: backRoute,
      icon: previousViewIcon
    });

    // Agregar página actual
    items.push({ label: this.currentPageTitle, icon: this.currentPageIcon });

    return items;
  }

  /**
   * Genera un icono apropiado basado en la ruta y el nombre
   */
  private generateIconForRoute(backRoute: string, routeName: string): string {
    // Convertir a lowercase para comparación
    const routeLower = backRoute.toLowerCase();
    const nameLower = routeName.toLowerCase();

    // Mapeo de patrones comunes a iconos
    const iconMappings: { [key: string]: string } = {
      // Usuarios y Personas
      'user': 'user',
      'users': 'users',
      'profile': 'user-circle',
      'account': 'user-cog',
      'customer': 'user-tie',
      'customers': 'user-friends',
      'employee': 'user-tie',
      'employees': 'users-cog',
      'admin': 'user-shield',
      'member': 'user-plus',
      'members': 'users',

      // Productos y Comercio
      'product': 'box',
      'products': 'boxes',
      'item': 'cube',
      'items': 'cubes',
      'category': 'tags',
      'categories': 'tags',
      'brand': 'trademark',
      'brands': 'industry',
      'inventory': 'warehouse',
      'stock': 'boxes',
      'catalog': 'book',
      'shop': 'store',
      'store': 'store-alt',

      // Órdenes y Transacciones
      'order': 'shopping-cart',
      'orders': 'shopping-bag',
      'purchase': 'credit-card',
      'sale': 'cash-register',
      'sales': 'chart-line',
      'invoice': 'file-invoice',
      'invoices': 'file-invoice-dollar',
      'payment': 'money-bill',
      'payments': 'money-check',
      'transaction': 'exchange-alt',
      'transactions': 'history',

      // Reportes y Analytics
      'report': 'chart-bar',
      'reports': 'chart-pie',
      'dashboard': 'tachometer-alt',
      'analytics': 'chart-line',
      'statistics': 'chart-area',
      'metric': 'ruler',
      'metrics': 'calculator',

      // Configuración y Administración
      'setting': 'cog',
      'settings': 'cogs',
      'config': 'tools',
      'configuration': 'sliders-h',
      'permission': 'key',
      'permissions': 'lock',
      'role': 'user-tag',
      'roles': 'users-cog',
      'security': 'shield-alt',

      // Contenido y Documentos
      'document': 'file-alt',
      'documents': 'folder-open',
      'file': 'file',
      'files': 'folder',
      'page': 'file-alt',
      'pages': 'copy',
      'content': 'newspaper',
      'article': 'newspaper',
      'articles': 'blog',
      'post': 'edit',
      'posts': 'pen-fancy',
      'news': 'rss',
      'blog': 'blog',

      // Comunicación
      'message': 'envelope',
      'messages': 'comments',
      'email': 'at',
      'emails': 'mail-bulk',
      'notification': 'bell',
      'notifications': 'bell',
      'chat': 'comment',
      'comment': 'comment-alt',
      'comments': 'comments',

      // Ubicación y Geografía
      'location': 'map-marker-alt',
      'locations': 'map',
      'address': 'home',
      'addresses': 'map-marked',
      'city': 'city',
      'cities': 'building',
      'country': 'flag',
      'countries': 'globe',
      'region': 'map-marked-alt',

      // Tiempo y Eventos
      'event': 'calendar-alt',
      'events': 'calendar',
      'schedule': 'clock',
      'appointment': 'calendar-check',
      'appointments': 'calendar-week',
      'meeting': 'handshake',
      'meetings': 'users',
      'task': 'tasks',
      'tasks': 'list-check',
      'project': 'project-diagram',
      'projects': 'folder-tree',

      // Contactos y Comunicación
      'contact': 'address-book',
      'contacts': 'address-card',
      'phone': 'phone',
      'company': 'building',
      'companies': 'city',
      'organization': 'sitemap',

      // Educación
      'course': 'graduation-cap',
      'courses': 'book-reader',
      'student': 'user-graduate',
      'students': 'users',
      'teacher': 'chalkboard-teacher',
      'teachers': 'users-cog',
      'class': 'chalkboard',
      'classes': 'school',
      'lesson': 'book-open',
      'lessons': 'books',

      // Salud
      'patient': 'user-injured',
      'patients': 'users',
      'doctor': 'user-md',
      'doctors': 'users-cog',
      'medical': 'stethoscope',
      'health': 'heartbeat',
      'hospital': 'hospital',

      // Finanzas
      'budget': 'calculator',
      'expense': 'money-bill-wave',
      'expenses': 'credit-card',
      'income': 'hand-holding-usd',
      'tax': 'receipt',
      'taxes': 'file-invoice-dollar',
      'bank': 'university',

      // Tecnología
      'server': 'server',
      'servers': 'database',
      'api': 'code',
      'service': 'cogs',
      'services': 'network-wired',
      'log': 'list-alt',
      'logs': 'terminal',
      'backup': 'save',
      'backups': 'hdd',

      // Deportes y Recreación
      'team': 'users',
      'teams': 'users-cog',
      'player': 'running',
      'players': 'users',
      'game': 'gamepad',
      'games': 'chess',
      'sport': 'football-ball',
      'sports': 'trophy',

      // Transporte
      'vehicle': 'car',
      'vehicles': 'truck',
      'route': 'route',
      'routes': 'map-signs',
      'trip': 'suitcase',
      'trips': 'plane',
      'delivery': 'shipping-fast',
      'deliveries': 'truck-loading',

      // General
      'list': 'list',
      'grid': 'th',
      'table': 'table',
      'form': 'wpforms',
      'search': 'search',
      'filter': 'filter',
      'sort': 'sort',
      'export': 'download',
      'import': 'upload',
      'edit': 'edit',
      'view': 'eye',
      'detail': 'info-circle',
      'details': 'list-ul'
    };

    // 1. Buscar coincidencias exactas primero
    for (const [keyword, icon] of Object.entries(iconMappings)) {
      if (nameLower === keyword || nameLower === keyword + 's' || nameLower === keyword.slice(0, -1)) {
        return icon;
      }
    }

    // 2. Buscar coincidencias parciales directas
    for (const [keyword, icon] of Object.entries(iconMappings)) {
      if (nameLower.includes(keyword) || routeLower.includes(keyword)) {
        return icon;
      }
    }

    // 3. Búsqueda inteligente con coincidencias difusas
    const foundIcon = this.findFuzzyMatch(nameLower, routeLower, iconMappings);
    if (foundIcon) {
      return foundIcon;
    }

    // 4. Buscar patrones en la URL completa
    if (routeLower.includes('/admin')) return 'user-shield';
    if (routeLower.includes('/dashboard')) return 'tachometer-alt';
    if (routeLower.includes('/profile')) return 'user-circle';
    if (routeLower.includes('/settings')) return 'cogs';
    if (routeLower.includes('/config')) return 'tools';
    if (routeLower.includes('/report')) return 'chart-bar';
    if (routeLower.includes('/analytics')) return 'chart-line';
    if (routeLower.includes('/management')) return 'tasks';
    if (routeLower.includes('/api/')) return 'code';
    if (routeLower.includes('/edit')) return 'edit';
    if (routeLower.includes('/view')) return 'eye';
    if (routeLower.includes('/list')) return 'list';
    if (routeLower.includes('/search')) return 'search';

    // Si no encuentra ninguna coincidencia, usar arrow-left como fallback
    return 'arrow-left';
  }

  /**
   * Busca coincidencias difusas para detectar palabras parciales o combinadas
   */
  private findFuzzyMatch(nameLower: string, routeLower: string, iconMappings: { [key: string]: string }): string | null {
    const textToAnalyze = `${nameLower} ${routeLower}`;

    // Dividir en palabras y segmentos separados por guiones, barras, etc.
    const segments = textToAnalyze.split(/[-_/\s.]+/).filter(segment => segment.length > 0);

    for (const segment of segments) {
      // Buscar coincidencias exactas de segmentos
      if (iconMappings[segment]) {
        return iconMappings[segment];
      }

      // Buscar palabras que empiecen con el segmento (mínimo 3 caracteres para evitar false positives)
      if (segment.length >= 3) {
        for (const [keyword, icon] of Object.entries(iconMappings)) {
          if (keyword.startsWith(segment) || segment.startsWith(keyword.substring(0, Math.min(keyword.length, 4)))) {
            return icon;
          }
        }
      }

      // Buscar palabras que contengan el segmento (mínimo 4 caracteres)
      if (segment.length >= 4) {
        for (const [keyword, icon] of Object.entries(iconMappings)) {
          if (keyword.includes(segment) || segment.includes(keyword)) {
            return icon;
          }
        }
      }
    }

    // Búsqueda por similitud de Levenshtein para casos como "compan" -> "company"
    for (const [keyword, icon] of Object.entries(iconMappings)) {
      if (keyword.length >= 4) {
        for (const segment of segments) {
          if (segment.length >= 3) {
            const similarity = this.calculateSimilarity(segment, keyword);
            // Si la similitud es alta (más del 70%), considerarlo una coincidencia
            if (similarity > 0.7) {
              return icon;
            }
          }
        }
      }
    }

    return null;
  }

  /**
   * Calcula la similitud entre dos strings usando una versión simplificada de Levenshtein
   */
  private calculateSimilarity(str1: string, str2: string): number {
    if (str1.length === 0 || str2.length === 0) return 0;

    // Si una palabra está contenida en la otra
    if (str1.includes(str2) || str2.includes(str1)) return 0.8;

    // Si empiezan igual (primeras 3+ letras)
    if (str1.length >= 3 && str2.length >= 3) {
      const prefix1 = str1.substring(0, 3);
      const prefix2 = str2.substring(0, 3);
      if (prefix1 === prefix2) return 0.75;
    }

    // Calcular distancia de Levenshtein simplificada
    const maxLength = Math.max(str1.length, str2.length);
    const minLength = Math.min(str1.length, str2.length);

    // Si la diferencia de longitud es muy grande, probablemente no coincidan
    if (maxLength - minLength > 3) return 0;

    let matches = 0;
    const shorter = str1.length <= str2.length ? str1 : str2;
    const longer = str1.length > str2.length ? str1 : str2;

    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) {
        matches++;
      }
    }

    return matches / maxLength;
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

    const backRoute = this.backRouteSignal()!;
    // Separar la ruta base de los query parameters
    const urlParts = backRoute.split('?');
    return urlParts[0] || '/';
  }

  /**
   * Obtiene los query parameters para el routerLink del botón de regreso
   */
  getBackRouteQueryParams(): Record<string, any> | null {
    if (!this.backRouteSignal()) return null;

    const backRoute = this.backRouteSignal()!;
    const urlParts = backRoute.split('?');

    // Si no hay query parameters, retornar null
    if (urlParts.length < 2 || !urlParts[1]) {
      return null;
    }

    // Parsear los query parameters
    const queryString = urlParts[1];
    const queryParams: Record<string, any> = {};

    const params = new URLSearchParams(queryString);
    params.forEach((value, key) => {
      queryParams[key] = value;
    });

    return Object.keys(queryParams).length > 0 ? queryParams : null;
  }

  /**
   * Verifica si el breadcrumb debe ser visible
   */
  get shouldShowBreadcrumb(): boolean {
    return this.items().length > 1;
  }
}
