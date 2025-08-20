export interface IBreadcrumbItem {
  label: string;
  route?: string;
  queryParams?: Record<string, any> | null;
  icon?: string;
  isBackRoute?: boolean;
}
