# Filentra - Single Panel Architecture

## 🎯 Overview

This document outlines our single panel architecture approach for Filentra, where we use one unified dashboard interface that adapts its content, navigation, and functionality based on the user's role and permissions. This approach prioritizes simplicity, maintainability, and user experience consistency.

## 🏗️ Architecture Decision: Single Adaptive Panel

### **Why Single Panel is Simpler**

1. **Reduced Complexity**: One codebase, one routing system, one layout to maintain
2. **Natural User Experience**: Users see more features as their roles expand
3. **Easier Maintenance**: Changes apply universally without panel-specific updates
4. **Smoother Role Transitions**: No jarring interface changes when roles change
5. **Less Boilerplate**: No duplicate components, routes, or logic across panels
6. **Junior Developer Friendly**: Simpler mental model and clearer code organization

### **Comparison: Single vs Multiple Panels**

| Aspect | Single Panel ✅ | Multiple Panels ❌ |
|--------|----------------|-------------------|
| **Complexity** | Lower (one interface) | Higher (multiple interfaces) |
| **Code Duplication** | Minimal (shared everything) | High (separate components) |
| **User Experience** | Consistent, progressive | Fragmented, switching |
| **Maintenance** | Easier (universal changes) | Complex (panel-specific) |
| **Role Transitions** | Smooth (same interface) | Jarring (different interfaces) |
| **Development Speed** | Faster (shared components) | Slower (separate development) |

## 📊 Single Panel Strategy

### **Unified Route Structure**

```
/dashboard/*             - Single entry point for all users
├── /dashboard           # Main dashboard (role-aware content)
├── /dashboard/users     # User management (admin/manager features)
├── /dashboard/settings  # Settings (role-appropriate options)
├── /dashboard/reports   # Reports (based on permissions)
├── /dashboard/billing   # Billing (admin-only, hidden for others)
└── /dashboard/profile   # Personal profile (all users)
```

### **Role-Based Content Adaptation**

```typescript
// Components automatically adapt based on user context
function UserManagement() {
  const { user } = useAuth();
  const { can } = usePermissions();
  
  if (!can('users.view')) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      <UserList />
      {can('users.create') && <CreateUserButton />}
      {user.hasRole('admin') && <AdvancedUserTools />}
    </div>
  );
}
```

## 🗂️ Directory Structure

### **Backend Organization**

```
app/Http/Controllers/
├── DashboardController.php        # Main dashboard controller
├── UserController.php             # User management (role-aware)
├── SettingsController.php         # Settings (role-aware)
├── ReportsController.php          # Reports (permission-based)
├── BillingController.php          # Billing (admin features)
└── ProfileController.php          # Profile management

app/Http/Middleware/
├── EnsureAuthenticated.php        # Basic auth check
├── CheckPermissions.php           # Permission-based access
└── LoadUserContext.php            # Load user role/permissions

routes/web.php                     # Single route file
```

### **Frontend Organization**

```
resources/js/
├── components/                     # Role-aware components
│   ├── ui/                        # Base UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── DataTable.tsx
│   │   └── Form.tsx
│   ├── dashboard/                 # Dashboard-specific components
│   │   ├── DashboardStats.tsx
│   │   ├── QuickActions.tsx
│   │   └── RecentActivity.tsx
│   ├── users/                     # User management components
│   │   ├── UserList.tsx
│   │   ├── UserForm.tsx
│   │   └── UserCard.tsx
│   ├── settings/                  # Settings components
│   │   ├── TenantSettings.tsx
│   │   ├── UserPreferences.tsx
│   │   └── FeatureFlags.tsx
│   └── navigation/                # Navigation components
│       ├── Sidebar.tsx
│       ├── Header.tsx
│       └── Breadcrumbs.tsx
├── pages/                         # Page components
│   ├── Dashboard.tsx
│   ├── Users.tsx
│   ├── Settings.tsx
│   ├── Reports.tsx
│   ├── Billing.tsx
│   └── Profile.tsx
├── layouts/                       # Layout components
│   ├── DashboardLayout.tsx        # Main dashboard layout
│   ├── AuthLayout.tsx             # Authentication layout
│   └── ErrorLayout.tsx            # Error page layout
├── hooks/                         # Custom hooks
│   ├── useAuth.ts                 # Authentication hook
│   ├── usePermissions.ts          # Permissions hook
│   ├── useNavigation.ts           # Navigation hook
│   └── useFeatureFlags.ts         # Feature flags hook
├── services/                      # API services
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── settings.service.ts
│   └── api.service.ts
├── types/                         # TypeScript types
│   ├── auth.types.ts
│   ├── user.types.ts
│   ├── navigation.types.ts
│   └── api.types.ts
└── app.tsx                        # Main application
```

## 🔐 Permission-Based Security

### **Route Protection Strategy**

```php
// routes/web.php
Route::middleware(['auth', 'tenant'])->prefix('dashboard')->group(function () {
    Route::get('/', [DashboardController::class, 'index']);
    
    // Permission-based route protection
    Route::middleware('permission:users.view')->group(function () {
        Route::resource('users', UserController::class);
    });
    
    Route::middleware('permission:settings.view')->group(function () {
        Route::get('settings', [SettingsController::class, 'index']);
    });
    
    Route::middleware('permission:billing.view')->group(function () {
        Route::resource('billing', BillingController::class);
    });
    
    // Available to all authenticated users
    Route::get('profile', [ProfileController::class, 'show']);
});
```

### **Component-Level Permission Checks**

```typescript
// Permission-aware components
function UserList() {
  const { can } = usePermissions();
  const { user } = useAuth();
  
  return (
    <div>
      <DataTable 
        data={users}
        columns={getUserColumns(user.role)}
        actions={
          <div>
            {can('users.create') && <CreateButton />}
            {can('users.export') && <ExportButton />}
            {user.hasRole('admin') && <BulkActions />}
          </div>
        }
      />
    </div>
  );
}
```

## ⚛️ React Implementation

### **Role-Aware Navigation**

```typescript
// hooks/useNavigation.ts
export function useNavigation() {
  const { user } = useAuth();
  const { can } = usePermissions();
  
  return useMemo(() => {
    const items = [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'home',
        show: true
      },
      {
        label: 'Users',
        href: '/dashboard/users',
        icon: 'users',
        show: can('users.view')
      },
      {
        label: 'Reports',
        href: '/dashboard/reports',
        icon: 'chart',
        show: can('reports.view')
      },
      {
        label: 'Settings',
        href: '/dashboard/settings',
        icon: 'settings',
        show: can('settings.view')
      },
      {
        label: 'Billing',
        href: '/dashboard/billing',
        icon: 'credit-card',
        show: user.hasRole('admin') && can('billing.view')
      }
    ];
    
    return items.filter(item => item.show);
  }, [user, can]);
}

// components/navigation/Sidebar.tsx
function Sidebar() {
  const navigation = useNavigation();
  
  return (
    <nav className="sidebar">
      {navigation.map(item => (
        <NavItem key={item.href} {...item} />
      ))}
    </nav>
  );
}
```

### **Adaptive Dashboard Layout**

```typescript
// layouts/DashboardLayout.tsx
interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const { activeFeatures } = useFeatureFlags();
  
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Header user={user} />
        <main className="content">
          {children}
        </main>
        {activeFeatures.includes('help-widget') && <HelpWidget />}
      </div>
    </div>
  );
}
```

### **Role-Aware Page Components**

```typescript
// pages/Users.tsx
function Users() {
  const { user } = useAuth();
  const { can } = usePermissions();
  const { users, loading } = useUsers();
  
  if (!can('users.view')) {
    return <AccessDenied message="You don't have permission to view users" />;
  }
  
  return (
    <div className="users-page">
      <PageHeader 
        title="Users"
        actions={
          can('users.create') && <CreateUserButton />
        }
      />
      
      <UserList 
        users={users}
        loading={loading}
        showAdvancedActions={user.hasRole('admin')}
        allowEdit={can('users.edit')}
        allowDelete={can('users.delete')}
      />
      
      {user.hasRole('admin') && <AdminUserStats />}
    </div>
  );
}
```

### **Smart Component Composition**

```typescript
// components/users/UserList.tsx
interface UserListProps {
  users: User[];
  loading: boolean;
  showAdvancedActions?: boolean;
  allowEdit?: boolean;
  allowDelete?: boolean;
}

function UserList({ 
  users, 
  loading, 
  showAdvancedActions, 
  allowEdit, 
  allowDelete 
}: UserListProps) {
  const columns = useMemo(() => [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    ...(showAdvancedActions ? [
      { key: 'lastLogin', label: 'Last Login' },
      { key: 'status', label: 'Status' }
    ] : [])
  ], [showAdvancedActions]);
  
  const actions = useMemo(() => (user: User) => (
    <div className="user-actions">
      <ViewButton user={user} />
      {allowEdit && <EditButton user={user} />}
      {allowDelete && <DeleteButton user={user} />}
      {showAdvancedActions && <AdminActions user={user} />}
    </div>
  ), [allowEdit, allowDelete, showAdvancedActions]);
  
  return (
    <DataTable
      data={users}
      columns={columns}
      loading={loading}
      renderActions={actions}
    />
  );
}
```

## 🔄 Feature Flag Integration

### **Progressive Feature Revelation**

```typescript
// hooks/useFeatureFlags.ts
export function useFeatureFlags() {
  const { user } = useAuth();
  const { flags } = useQuery(['feature-flags', user.id], () => 
    getFeatureFlags(user)
  );
  
  return {
    activeFeatures: flags?.filter(f => f.active).map(f => f.name) || [],
    hasFeature: (name: string) => flags?.some(f => f.name === name && f.active),
    isEnabled: (name: string) => flags?.some(f => f.name === name && f.enabled)
  };
}

// Usage in components
function Dashboard() {
  const { hasFeature } = useFeatureFlags();
  const { user } = useAuth();
  
  return (
    <div className="dashboard">
      <DashboardStats />
      
      {user.hasRole('admin') && <AdminQuickActions />}
      {hasFeature('advanced-analytics') && <AdvancedAnalytics />}
      {hasFeature('beta-features') && <BetaFeaturePanel />}
      
      <RecentActivity />
    </div>
  );
}
```

## 🧪 Testing Strategy

### **Permission-Based Testing**

```php
// tests/Feature/DashboardTest.php
class DashboardTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_user_sees_appropriate_navigation()
    {
        $tenant = Tenant::factory()->create();
        $user = User::factory()->for($tenant)->create();
        $user->assignRole('user');
        
        $response = $this->actingAs($user)->get('/dashboard');
        
        $response->assertInertia(fn (Assert $page) =>
            $page->has('navigation')
                ->where('navigation.0.label', 'Dashboard')
                ->where('navigation.1.label', 'Profile')
                ->missing('navigation.2') // No admin items
        );
    }
    
    public function test_admin_sees_admin_navigation()
    {
        $tenant = Tenant::factory()->create();
        $admin = User::factory()->for($tenant)->create();
        $admin->assignRole('admin');
        
        $response = $this->actingAs($admin)->get('/dashboard');
        
        $response->assertInertia(fn (Assert $page) =>
            $page->has('navigation')
                ->where('navigation.0.label', 'Dashboard')
                ->where('navigation.1.label', 'Users')
                ->where('navigation.2.label', 'Settings')
                ->where('navigation.3.label', 'Billing')
        );
    }
}
```

### **Component Testing**

```typescript
// tests/Javascript/components/UserList.test.tsx
import { render, screen } from '@testing-library/react';
import { UserList } from '@/components/users/UserList';

describe('UserList', () => {
  it('shows basic actions for regular users', () => {
    const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
    
    render(
      <UserList 
        users={users}
        loading={false}
        allowEdit={false}
        allowDelete={false}
        showAdvancedActions={false}
      />
    );
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
  
  it('shows admin actions for admin users', () => {
    const users = [{ id: 1, name: 'John Doe', email: 'john@example.com' }];
    
    render(
      <UserList 
        users={users}
        loading={false}
        allowEdit={true}
        allowDelete={true}
        showAdvancedActions={true}
      />
    );
    
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByText('Last Login')).toBeInTheDocument();
  });
});
```

## 📈 Performance Optimization

### **Smart Code Splitting**

```typescript
// Lazy load heavy admin components only when needed
const AdvancedUserTools = lazy(() => import('@/components/users/AdvancedUserTools'));
const AdminAnalytics = lazy(() => import('@/components/dashboard/AdminAnalytics'));
const BillingManagement = lazy(() => import('@/components/billing/BillingManagement'));

function Users() {
  const { user } = useAuth();
  
  return (
    <div>
      <UserList />
      
      {user.hasRole('admin') && (
        <Suspense fallback={<Loading />}>
          <AdvancedUserTools />
        </Suspense>
      )}
    </div>
  );
}
```

### **Permission Caching**

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth();
  
  // Cache permissions to avoid repeated calculations
  const permissions = useMemo(() => {
    const userPermissions = user?.permissions || [];
    const rolePermissions = user?.roles?.flatMap(role => role.permissions) || [];
    return [...userPermissions, ...rolePermissions];
  }, [user]);
  
  const can = useCallback((permission: string) => {
    return permissions.some(p => p.name === permission);
  }, [permissions]);
  
  const hasRole = useCallback((role: string) => {
    return user?.roles?.some(r => r.name === role) || false;
  }, [user?.roles]);
  
  return { can, hasRole, permissions };
}
```

## 🎨 UI/UX Patterns

### **Progressive Disclosure**

```typescript
// Show features progressively based on role
function SettingsPage() {
  const { user } = useAuth();
  const { can } = usePermissions();
  
  return (
    <div className="settings">
      {/* Always visible */}
      <PersonalSettings />
      
      {/* Progressive disclosure based on permissions */}
      {can('settings.team') && (
        <Collapsible title="Team Settings">
          <TeamSettings />
        </Collapsible>
      )}
      
      {can('settings.tenant') && (
        <Collapsible title="Organization Settings">
          <TenantSettings />
        </Collapsible>
      )}
      
      {user.hasRole('admin') && (
        <Collapsible title="Advanced Settings">
          <AdvancedSettings />
        </Collapsible>
      )}
    </div>
  );
}
```

### **Contextual Actions**

```typescript
// Actions appear based on context and permissions
function PageHeader({ title, children }) {
  const { can } = usePermissions();
  const { hasFeature } = useFeatureFlags();
  
  return (
    <header className="page-header">
      <h1>{title}</h1>
      <div className="actions">
        {children}
        
        {/* Contextual actions based on page and permissions */}
        {title === 'Users' && can('users.export') && <ExportButton />}
        {title === 'Reports' && can('reports.schedule') && <ScheduleButton />}
        {hasFeature('help-system') && <HelpButton />}
      </div>
    </header>
  );
}
```

## 🔧 Implementation Benefits

### **For Developers**
- **Single Codebase**: One set of components, routes, and logic to maintain
- **Shared Context**: All functionality benefits from shared state and services
- **Easier Debugging**: One interface to debug and optimize
- **Faster Development**: No duplicate components or logic across panels

### **For Users**
- **Consistent Experience**: Same interface regardless of role changes
- **Progressive Enhancement**: See more features as roles expand
- **Smooth Transitions**: No jarring interface changes
- **Intuitive Growth**: Natural progression of capabilities

### **For Maintenance**
- **Universal Updates**: Changes apply across all user types
- **Centralized Logic**: Business logic in one place
- **Simplified Testing**: Test one interface with different permission states
- **Easier Scaling**: Add new roles without new interfaces

## 🎯 Key Patterns

### **Convention Over Configuration**

```typescript
// Auto-generate navigation based on routes and permissions
function generateNavigation(routes: Route[], permissions: Permission[]) {
  return routes
    .filter(route => route.nav?.show)
    .filter(route => !route.permission || permissions.includes(route.permission))
    .map(route => ({
      label: route.nav.label,
      href: route.path,
      icon: route.nav.icon
    }));
}
```

### **Smart Defaults**

```typescript
// Components with intelligent defaults based on context
function DataTable<T>({ 
  data, 
  columns, 
  actions,
  variant = 'default' // auto-detected from context
}: DataTableProps<T>) {
  const { user } = useAuth();
  
  // Smart defaults based on user role
  const defaultActions = useMemo(() => {
    if (actions) return actions;
    
    return (item: T) => (
      <div>
        <ViewButton item={item} />
        {user.hasRole('admin') && <EditButton item={item} />}
      </div>
    );
  }, [actions, user]);
  
  return (
    // Table implementation
  );
}
```

This single panel architecture provides the perfect balance of simplicity, maintainability, and user experience while avoiding the complexity and duplication of multiple panel systems.