# Filentra - Simplified Implementation Guide

## 🎯 Overview

This guide provides a step-by-step approach to transform your current Laravel + Inertia + React project into a simplified modular multi-tenant architecture.

## 📊 Current State vs Target

### **What We Have**
- ✅ Laravel 12 + Inertia.js + React 19 + TypeScript
- ✅ Tailwind CSS + Radix UI components
- ✅ Basic authentication structure
- ✅ Pest testing configured

### **What We're Building**
- ✅ Simple modular architecture
- ✅ Single-database multi-tenancy with tenant_id scoping
- ✅ Basic RBAC with Spatie Laravel Permission
- ✅ Comprehensive testing (Pest + Jest + Dusk)
- ✅ Clean, maintainable foundation

## 🚀 Phase 1: Foundation Setup (Week 1)

### **1.1 Install Dependencies**
**TODO:**
- [ ] Install RBAC: `composer require spatie/laravel-permission`
- [ ] Install feature flags: Laravel Pennant (included in Laravel 12)
- [ ] Install E2E testing: `composer require --dev laravel/dusk`
- [ ] Install frontend testing: `npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event`
- [ ] Install Laravel Precognition: `npm install laravel-precognition-react-inertia`
- [ ] Configure Dusk: `php artisan dusk:install`
- [ ] Verify Laravel 12 dependencies: Update `composer.json` for Laravel 12, PHPUnit 11, Pest 3.0
- [ ] Configure parallel testing: Set up separate test databases for parallel execution

### **1.2 Create Directory Structure**
**TODO:**
- [ ] Create backend structure:
  ```bash
  mkdir -p app/Core/{Services,Traits,Middleware}
  mkdir -p app/Modules/{Auth,Dashboard,Users,Tenants,Settings}
  ```

- [ ] Create frontend structure:
  ```bash
  mkdir -p resources/js/core
  mkdir -p resources/js/modules/{auth,dashboard,users,tenants,settings}
  mkdir -p resources/js/shared/{components,layouts}
  ```

- [ ] Create testing structure:
  ```bash
  mkdir -p tests/{Feature,Unit,Browser}
  mkdir -p tests/Javascript/{unit,components,integration}
  ```

### **1.3 Module Structure Template**
Each module should have:
```
app/Modules/[ModuleName]/
├── Controllers/
├── Services/
├── Requests/
├── Resources/
├── routes.php
└── ServiceProvider.php

resources/js/modules/[module-name]/
├── components/
├── pages/
├── hooks/
├── actions/          # React 19 form actions
└── types.ts
```

### **1.4 Configure React 19 & TypeScript**
**TODO:**
- [ ] Update TypeScript config for React 19 compatibility
- [ ] Handle breaking changes: ref callbacks, JSX namespace
- [ ] Remove explicit `useReducer` generics where possible
- [ ] Update PropTypes to TypeScript interfaces
- [ ] Configure ESLint rules for React 19 patterns

## 🏢 Phase 2: Multi-Tenancy Setup (Week 1-2)

### **2.1 Create Tenant Model**
**TODO:**
- [ ] Create migration: `php artisan make:migration create_tenants_table`
- [ ] Create Tenant model: `php artisan make:model Tenant`
- [ ] Add tenant fields:
  ```php
  // Migration fields
  - id
  - name
  - subdomain
  - status (active/inactive)
  - created_at
  - updated_at
  ```

### **2.2 Add Tenant Scoping**
**TODO:**
- [ ] Add `tenant_id` column to relevant tables:
  - [ ] `users` table
  - [ ] Other tenant-specific tables as needed
- [ ] Create tenant scope trait for models
- [ ] Add global scopes to tenant-aware models

### **2.3 Tenant Middleware**
**TODO:**
- [ ] Create `ResolveTenantMiddleware`
- [ ] Implement subdomain-based tenant resolution
- [ ] Set tenant context in application
- [ ] Add middleware to web routes

### **2.4 Update User Model**
**TODO:**
- [ ] Add `tenant_id` to User model
- [ ] Add tenant relationship
- [ ] Apply tenant scoping
- [ ] Update authentication to be tenant-aware

## 🔐 Phase 3: Basic RBAC System (Week 2)

### **3.1 Configure Spatie Permissions**
**TODO:**
- [ ] Publish config: `php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"`
- [ ] Run migrations: `php artisan migrate`
- [ ] Configure guard in `config/permission.php`

### **3.2 Create Basic Permissions**
**TODO:**
- [ ] Define permission structure: `[module].[action]`
- [ ] Create seeder for basic permissions:
  ```php
  // Example permissions
  - users.view
  - users.create
  - users.edit
  - users.delete
  - dashboard.view
  - settings.view
  - settings.edit
  ```

### **3.3 Configure Laravel Pennant Features**
**TODO:**
- [ ] Publish Pennant config: `php artisan vendor:publish --tag=pennant-config`
- [ ] Enable feature discovery: Add `Feature::discover()` to `AppServiceProvider`
- [ ] Create basic feature flags:
  ```php
  // Example features
  - advanced-dashboard
  - new-user-interface  
  - beta-features
  - premium-features
  ```
- [ ] Set up tenant-scoped feature flags

### **3.4 Create Basic Roles**
**TODO:**
- [ ] Create role seeder with basic roles:
  - [ ] Admin (all permissions)
  - [ ] Manager (most permissions)
  - [ ] User (basic permissions)
- [ ] Make roles tenant-scoped
- [ ] Assign default role to new users

### **3.5 Add Authorization**
**TODO:**
- [ ] Create policies for each module
- [ ] Add permission middleware
- [ ] Add authorization checks to controllers
- [ ] Create authorization helpers
- [ ] Integrate feature flags with permissions
- [ ] Create combined feature + permission service

## 🧩 Phase 4: Single Panel Architecture & Module System (Week 2-3)

### **4.1 Create Unified Dashboard Structure**
**TODO:**
- [ ] Create dashboard controller directory (`app/Http/Controllers/`)
- [ ] Set up unified route structure with permission-based access
- [ ] Create permission-checking middleware for routes
- [ ] Implement role-aware navigation system

### **4.2 Create Base Module Provider**
**TODO:**
- [ ] Create `app/Core/Providers/ModuleServiceProvider.php`
- [ ] Implement automatic route loading with permission awareness
- [ ] Add module registration system
- [ ] Create module discovery with role-based features

### **4.3 Move Existing Code to Unified Structure**
**TODO:**
- [ ] Move `app/Http/Controllers/Auth/` to `app/Modules/Auth/Controllers/`
- [ ] Move `app/Http/Controllers/Settings/` to `app/Modules/Settings/Controllers/`
- [ ] Organize controllers for dashboard functionality
- [ ] Create service providers for each module
- [ ] Update route definitions for single dashboard structure
- [ ] Create role-aware layouts and components

### **4.4 Frontend Single Panel Architecture**
**TODO:**
- [ ] Create unified dashboard layout (`resources/js/layouts/DashboardLayout.tsx`)
- [ ] Implement permission-based component rendering
- [ ] Create role-aware navigation system
- [ ] Move authentication components to `resources/js/modules/auth/`
- [ ] Create adaptive navigation components based on user permissions
- [ ] Add permission-based route guards for single dashboard
- [ ] Implement React 19 form action patterns with role awareness
- [ ] Set up `useActionState` and `useFormStatus` patterns
- [ ] Configure optimistic updates with `useOptimistic`
- [ ] Create permission checking hooks (`usePermissions`, `useAuth`)

## 🧪 Phase 5: Testing Setup (Week 3)

### **5.1 Backend Testing (Pest)**
**TODO:**
- [ ] Configure parallel testing: `php artisan test --parallel`
- [ ] Create test base classes for modules
- [ ] Set up tenant-aware testing with unique identifiers
- [ ] Create feature tests for authentication
- [ ] Create unit tests for services
- [ ] Test multi-tenant isolation
- [ ] Test feature flag functionality
- [ ] Test combined permission + feature scenarios

### **5.2 Frontend Testing (Jest)**
**TODO:**
- [ ] Configure Jest with React Testing Library for React 19
- [ ] Create component test templates using new hooks
- [ ] Test `useActionState` and `useFormStatus` patterns
- [ ] Test authentication components
- [ ] Test permission-based rendering
- [ ] Test optimistic updates with `useOptimistic`
- [ ] Set up API mocking for Inertia calls

### **5.3 E2E Testing (Dusk)**
**TODO:**
- [ ] Create browser test base class with parallel support
- [ ] Test user registration/login flow
- [ ] Test tenant switching
- [ ] Test permission-based access
- [ ] Test feature flag scenarios
- [ ] Test React 19 form submission patterns
- [ ] Test core user journeys with optimistic updates

## 📋 Phase 6: Core Modules Implementation (Week 4-5)

### **6.1 Auth Module**
**TODO:**
- [ ] Implement tenant-aware authentication
- [ ] Add role assignment during registration
- [ ] Create login/logout functionality with React 19 patterns
- [ ] Add password reset (tenant-scoped)
- [ ] Implement Laravel Precognition for real-time validation
- [ ] Use `useActionState` for form state management
- [ ] Test authentication flows

### **6.2 Dashboard Module (Unified Interface)**
**TODO:**
- [ ] Create unified dashboard layout with feature flag integration
- [ ] Add personal task management for all users
- [ ] Create role-aware dashboard components
- [ ] Add quick actions using React 19 form actions with permission checks
- [ ] Implement optimistic updates for interactions
- [ ] Create adaptive navigation based on user role
- [ ] Test dashboard functionality across all roles

### **6.3 Users Module (Role-Aware)**
**TODO:**
- [ ] Create user CRUD operations with modern form patterns
- [ ] Add role management with feature flag integration
- [ ] Implement permission-based user interfaces (show admin features only to admins)
- [ ] Add user search and filtering with optimistic updates
- [ ] Use `useFormStatus` for submission states
- [ ] Create role-aware user actions and views
- [ ] Test user management with different permission levels

### **6.4 Settings Module (Permission-Based)**
**TODO:**
- [ ] Create tenant settings management (visible to admins only)
- [ ] Add user preferences (available to all users)
- [ ] Implement permission-based configuration options
- [ ] Add settings validation with Precognition
- [ ] Use modern form patterns throughout
- [ ] Create adaptive settings interface based on user permissions
- [ ] Test settings functionality across permission levels

### **6.5 Billing Module (Admin-Only)**
**TODO:**
- [ ] Create billing management interface (admin permission required)
- [ ] Add subscription management features
- [ ] Implement billing analytics and reporting
- [ ] Add payment method management
- [ ] Create billing history and invoices
- [ ] Use permission guards to restrict access
- [ ] Test billing functionality with admin users only

### **6.6 Reports Module (Role-Based Access)**
**TODO:**
- [ ] Create role-aware reporting interface
- [ ] Add user-specific reports (basic users)
- [ ] Implement team reports (managers)
- [ ] Add tenant-wide reports (admins)
- [ ] Create customizable dashboard widgets
- [ ] Add export functionality with permission checks
- [ ] Test reporting across different user roles

## 🎨 Phase 7: Frontend Polish (Week 5-6)

### **7.1 UI Consistency**
**TODO:**
- [ ] Create consistent component library using React 19 patterns
- [ ] Implement design system
- [ ] Add loading states with `useFormStatus`
- [ ] Add error handling with `useActionState`
- [ ] Implement optimistic updates where appropriate
- [ ] Improve user experience with instant feedback

### **7.2 Adaptive UI & Navigation**
**TODO:**
- [ ] Create single adaptive navigation component that changes based on user role
- [ ] Implement progressive navigation disclosure based on permissions
- [ ] Add permission and role indicators in UI
- [ ] Create shared components that adapt to user context
- [ ] Implement unified feature flag integrations
- [ ] Add role-aware loading and error states
- [ ] Test navigation adaptation across different roles
- [ ] Create unified authorization component system

### **7.3 Permission & Feature-Based UI**
**TODO:**
- [ ] Hide/show components based on permissions AND feature flags dynamically
- [ ] Add combined permission + feature navigation system
- [ ] Create role-based dashboard experiences with feature toggles
- [ ] Add permission and feature indicators throughout the interface
- [ ] Test permission-based rendering with different user roles
- [ ] Test feature flag scenarios across user types
- [ ] Create contextual help and guidance based on user capabilities

## ✅ Phase 8: Testing & Validation (Week 6)

### **8.1 Comprehensive Testing**
**TODO:**
- [ ] Achieve 80%+ test coverage using parallel testing
- [ ] Test all permission scenarios
- [ ] Test all feature flag scenarios
- [ ] Validate tenant isolation
- [ ] Test React 19 form patterns
- [ ] Test optimistic update rollbacks
- [ ] Test error handling
- [ ] Performance testing with parallel execution

### **8.2 Security Validation**
**TODO:**
- [ ] Test cross-tenant data access prevention
- [ ] Validate permission enforcement throughout the application
- [ ] Test role-based access security for all features
- [ ] Test feature flag security across user types
- [ ] Test authentication security and role changes
- [ ] Validate React 19 form security with permission checks
- [ ] Check for common vulnerabilities in routing and components
- [ ] Audit logging verification for all user actions
- [ ] Test combined permission + feature scenarios
- [ ] Validate proper access control throughout the single dashboard

## 🚀 Phase 9: Deployment Preparation (Week 6-7)

### **9.1 Production Configuration**
**TODO:**
- [ ] Configure environment variables
- [ ] Set up database connections
- [ ] Configure caching
- [ ] Set up queue processing
- [ ] Configure logging

### **9.2 CI/CD Setup**
**TODO:**
- [ ] Set up automated parallel testing
- [ ] Configure code quality checks for React 19 patterns
- [ ] Set up deployment scripts with SSR support
- [ ] Configure monitoring
- [ ] Set up backup procedures
- [ ] Configure feature flag deployment strategies

## 📝 Key Implementation Details

### **Single Dashboard Routing Strategy**
```typescript
// app.tsx - Single dashboard with role-aware content
function App() {
  const { user } = useAuth();
  
  if (!user) return <AuthApp />;
  
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/users" element={<Users />} />
        <Route path="/dashboard/settings" element={<Settings />} />
        <Route path="/dashboard/billing" element={<Billing />} />
      </Routes>
    </DashboardLayout>
  );
}
```

### **Permission-Based Route Protection**
```php
// routes/web.php - Single route file with permission middleware
Route::middleware(['auth', 'tenant'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    
    Route::middleware('permission:users.view')->group(function () {
        Route::resource('users', UserController::class);
    });
    
    Route::middleware('permission:settings.view')->group(function () {
        Route::get('settings', [SettingsController::class, 'index']);
    });
    
    Route::middleware('permission:billing.view')->group(function () {
        Route::resource('billing', BillingController::class);
    });
});
```

### **Role-Aware Component Strategy**
```typescript
// Single component that adapts to user permissions
import { DataTable } from '@/shared/components';

function UserList() {
  const { can } = usePermissions();
  const { user } = useAuth();
  
  return (
    <DataTable 
      data={users} 
      actions={
        <div>
          {can('users.edit') && <EditButton />}
          {can('users.delete') && <DeleteButton />}
          {user.hasRole('admin') && <AdminActions />}
        </div>
      }
    />
  );
}
```

### **Module Service Provider Template**
```php
class UserModuleServiceProvider extends ModuleServiceProvider
{
    public function register(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
    }
}
```

## 🎯 Success Criteria

### **Technical Validation**
- [ ] All modules work independently
- [ ] Tenant isolation is complete
- [ ] Permissions work at all levels
- [ ] Tests pass with good coverage
- [ ] Performance is acceptable

### **Business Validation**
- [ ] New tenants can be created easily
- [ ] Users can be managed per tenant
- [ ] Permissions control access properly
- [ ] System is maintainable
- [ ] Easy to add new features

## 🛠️ Development Commands

### **Useful Artisan Commands**
```bash
# Create new module
php artisan make:module ModuleName

# Run tests
php artisan test
php artisan dusk

# Clear caches
php artisan optimize:clear

# Database operations
php artisan migrate
php artisan db:seed
```

### **Frontend Commands**
```bash
# Run tests
npm test
npm run test:watch

# Build assets
npm run build
npm run dev

# Type checking
npm run types
```

## 🔄 Iterative Approach

### **Week 1-2: Foundation**
Focus on getting basic multi-tenancy and module structure working.

### **Week 3-4: Core Features**
Implement authentication, users, and basic RBAC.

### **Week 5-6: Polish & Testing**
Complete testing, UI polish, and security validation.

### **Week 7: Deployment**
Prepare for production and deploy.

## 📈 Future Enhancements

Once the foundation is solid, consider adding:
- [ ] Advanced permission hierarchies
- [ ] API rate limiting
- [ ] Audit logging
- [ ] Advanced caching
- [ ] Webhook system
- [ ] Multi-database support (if needed)

This simplified approach gives you a solid foundation that can grow with your needs while remaining maintainable and secure.