export interface AccessOptions {
  module?: string; // Наприклад, 'clients', 'cars', 'invoices', 'reports'
  requiredRole?: string; // Наприклад, 'director', 'superadmin'
  action?: 'read' | 'create' | 'update' | 'delete'; // Дозволи для модулів
}
