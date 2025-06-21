# Filentra - Simplified Modular Architecture Plan

## Overview

This document outlines a simplified, achievable modular architecture for **Filentra**, a Laravel 12 + Inertia.js + React 19 + TypeScript + Tailwind CSS application designed as a multi-tenant SaaS boilerplate with focus on simplicity and maintainability.

## Technology Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React 19 + TypeScript
- **Bridge**: Inertia.js v2
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Multi-Tenancy**: Simple tenant column approach
- **Database**: Single database with tenant scoping
- **Build Tool**: Vite 6
- **Testing**: Pest (PHP), Jest (JS/TS), Laravel Dusk (E2E)

## Architecture Principles

1. **Keep It Simple**: Start with basic patterns that work
2. **Modular Design**: Clear module boundaries without over-engineering
3. **Tenant Scoping**: Simple tenant_id column approach
4. **Scalable Foundation**: Built to grow, not over-engineered from start
5. **Type-Safe**: Full TypeScript coverage on frontend
6. **Testable**: Easy to test with good coverage

## Simplified Directory Structure

```
Filentra/
├── app/
│   ├── Core/                      # Core application logic
│   │   ├── Services/              # Core services
│   │   ├── Traits/                # Reusable traits
│   │   └── Middleware/            # Core middleware
│   ├── Modules/                   # Feature modules
│   │   ├── Auth/                  # Authentication
│   │   ├── Dashboard/             # Dashboard
│   │   ├── Users/                 # User management
│   │   ├── Tenants/               # Tenant management
│   │   └── Settings/              # Settings
│   └── Models/                    # All models (existing structure)
├── resources/
│   └── js/
│       ├── core/                  # Core frontend utilities
│       ├── modules/               # Module-specific frontend
│       ├── shared/                # Shared components
│       └── app.tsx                # Main app entry
├── database/
│   ├── migrations/                # All migrations
│   └── seeders/                   # Database seeders
└── tests/
    ├── Feature/                   # Feature tests by module
    ├── Unit/                      # Unit tests
    └── Browser/                   # Dusk E2E tests
```

## Module Structure (Simplified)

Each module follows this simple structure:

```
app/Modules/[ModuleName]/
├── Controllers/                   # Module controllers
├── Services/                      # Business logic
├── Requests/                      # Form requests
├── Resources/                     # API resources
├── routes.php                     # Module routes
└── ServiceProvider.php            # Module provider

resources/js/modules/[module-name]/
├── components/                    # Module components
├── pages/                         # Module pages
├── hooks/                         # Module hooks
└── types.ts                       # Module types
```

## Multi-Tenancy (Simplified)

### Single Database with Tenant Scoping
- **One Database**: All tenants share the same database
- **Tenant Column**: `tenant_id` column on relevant tables
- **Automatic Scoping**: Global scopes to filter by tenant
- **Tenant Model**: Simple tenant management

### Tenant Resolution
- **Subdomain**: `tenant1.filentra.com`
- **Header-based**: For API requests
- **Session-based**: For web requests

### Tenant Models
```
tenants table:
- id
- name
- subdomain
- status
- created_at
- updated_at

Add tenant_id to relevant tables:
- users.tenant_id
- posts.tenant_id (example)
- etc.
```

## Basic RBAC System

### Simple Role-Permission Structure
- **Roles**: Admin, Manager, User (per tenant)
- **Permissions**: Basic CRUD permissions per module
- **Spatie Package**: Use `spatie/laravel-permission`
- **Tenant Scoped**: Roles and permissions are tenant-scoped

### Permission Format
```
[module].[action]
Examples:
- users.create
- users.view
- users.edit
- users.delete
- dashboard.view
```

## Core Components

### 1. Tenant Middleware
- Resolve tenant from subdomain
- Set tenant context in application
- Scope all queries to current tenant

### 2. Module System
- **ModuleServiceProvider**: Base for all modules
- **Route Registration**: Automatic route loading
- **Simple Discovery**: Manual module registration

### 3. Frontend Module System
- **Module Registry**: Simple module loading
- **Route Guards**: Permission-based routing
- **Tenant Context**: React context for tenant info

## Testing Strategy (Simplified)

### Backend Testing (Pest)
- **Unit Tests**: Service classes, utilities
- **Feature Tests**: HTTP endpoints, authentication
- **Tenant Tests**: Multi-tenant isolation

### Frontend Testing (Jest)
- **Component Tests**: Individual components
- **Integration Tests**: API integration
- **Hook Tests**: Custom hooks

### E2E Testing (Dusk)
- **User Flows**: Login, basic CRUD operations
- **Multi-tenant**: Tenant switching and isolation

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Install basic dependencies
- [ ] Create simplified directory structure
- [ ] Set up tenant model and middleware
- [ ] Basic module system

### Phase 2: Authentication & Users (Week 3)
- [ ] Move auth to Auth module
- [ ] Implement basic RBAC
- [ ] Tenant-scoped users
- [ ] Basic testing setup

### Phase 3: Core Modules (Week 4-5)
- [ ] Dashboard module
- [ ] Users module
- [ ] Settings module
- [ ] Tenants module (for tenant management)

### Phase 4: Testing & Polish (Week 6)
- [ ] Complete test coverage
- [ ] E2E tests with Dusk
- [ ] Performance optimization
- [ ] Documentation

## Key Simplifications Made

### What We Removed (For Now)
- ❌ Separate tenant databases
- ❌ Complex permission hierarchies
- ❌ Row-level security
- ❌ Field-level permissions
- ❌ Advanced caching strategies
- ❌ Microservices architecture
- ❌ Event sourcing
- ❌ CQRS patterns

### What We Keep (Simple & Effective)
- ✅ Single database with tenant_id scoping
- ✅ Basic role-permission system
- ✅ Modular structure without over-engineering
- ✅ Simple tenant resolution
- ✅ Straightforward testing approach
- ✅ Clear separation of concerns

## Migration Steps from Current Structure

### Step 1: Install Dependencies
```bash
composer require spatie/laravel-permission
composer require --dev laravel/dusk
npm install --save-dev jest @testing-library/react
```

### Step 2: Create Basic Structure
- Create `/app/Core/` and `/app/Modules/` directories
- Create `/resources/js/modules/` structure
- Move existing controllers to appropriate modules

### Step 3: Implement Tenant System
- Create `Tenant` model
- Add `tenant_id` migrations
- Create tenant middleware
- Add global scopes

### Step 4: Set Up RBAC
- Configure Spatie permissions
- Create basic roles and permissions
- Add permission middleware

### Step 5: Module System
- Create `ModuleServiceProvider` base class
- Move existing features to modules
- Set up frontend module loading

## Success Criteria

### Technical Goals
- [ ] Clean modular structure
- [ ] Complete tenant isolation
- [ ] Working RBAC system
- [ ] 80%+ test coverage
- [ ] Fast development cycle

### Business Goals  
- [ ] Easy to add new features
- [ ] Simple tenant onboarding
- [ ] Secure multi-tenancy
- [ ] Maintainable codebase
- [ ] Good developer experience

## Future Growth Path

Once this foundation is solid, we can gradually add:
- Enhanced permission systems
- Better caching strategies
- Advanced tenant features
- Performance optimizations
- More sophisticated testing
- Advanced deployment strategies

This approach gives us a strong, working foundation that can evolve naturally as needs grow, rather than trying to solve all problems upfront.