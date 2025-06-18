t # Filentra - Multi-Tenant SaaS Boilerplate

> A comprehensive, API-first boilerplate for building multi-tenant SaaS applications with web, mobile, and enterprise-grade features.

## 🎯 Project Vision

Filentra provides a complete foundation for rapidly developing multi-tenant SaaS applications with the following core principles:

1. **API-First Architecture** - Unified backend serving web, mobile, and third-party integrations
2. **Multi-Tenancy First** - Built-in tenant isolation and organization management
3. **Cross-Platform Ready** - Web dashboard + native mobile apps from day one
4. **Enterprise Authentication** - WorkOS integration for SSO, directory sync, and compliance
5. **Page Builder Integration** - Visual page construction for tenant customization
6. **AI Ready** - Integrated AI capabilities and extensible architecture
7. **Developer Experience** - Modern tooling and best practices out of the box
8. **Cost Effective** - Optimized for minimal infrastructure costs

## 🏗️ API-First Multi-Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Laravel 12 API Backend                    │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │  Multi-Tenancy  │    │   AI Services   │               │
│  │   (Stancl)      │    │ (OpenAI/Claude) │               │
│  └─────────────────┘    └─────────────────┘               │
│  ┌─────────────────┐    ┌─────────────────┐               │
│  │  Page Builder   │    │ FilamentPHP     │               │
│  │   API Layer     │    │ Super Admin     │               │
│  └─────────────────┘    └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
              │                    │                    │
         ┌────▼────┐          ┌────▼────┐          ┌────▼────┐
         │   Web   │          │ Mobile  │          │   API   │
         │ React + │          │React Native│        │ Clients │
         │ Inertia │          │   Expo   │          │   3rd   │
         └─────────┘          └─────────┘          └─────────┘
```

### Backend (Laravel 12+ API)
- **API-First Design** with versioned REST endpoints and GraphQL support
- **Multi-Tenant API** with organization-scoped data isolation
- **WorkOS Integration** for enterprise authentication and SSO
- **Laravel Sanctum** for API authentication across all platforms
- **Event-Driven Architecture** using Laravel Events & Broadcasting
- **Queue System** with Redis for background processing
- **Real-time API** via Laravel Reverb (WebSockets)
- **AI Integration Layer** for machine learning capabilities
- **Page Builder API** for visual content creation

### Multi-Platform Frontend Architecture
- **Web Dashboard**: Laravel 12 + Inertia.js + React for tenant interfaces
- **Super Admin Panel**: FilamentPHP for platform management
- **Mobile Apps**: React Native + Expo for iOS/Android with shared API
- **API Documentation**: Auto-generated with Scribe
- **Real-time Sync**: WebSocket connections across all platforms
- **PWA Support**: Service workers and offline capabilities

### Mobile-First Features
- **Cross-Platform**: Single React Native codebase for iOS & Android
- **Offline Support**: Local data caching and automatic sync
- **Push Notifications**: Tenant-specific messaging and alerts
- **Deep Linking**: Direct navigation to tenant features and content
- **Biometric Auth**: Touch/Face ID integration for secure access
- **Camera Integration**: Document scanning and image upload
- **White-Label Ready**: Customizable branding per tenant
- **App Store Ready**: Pre-configured for iOS and Android deployment

### Database & Storage
- **Primary Database**: PostgreSQL (with MySQL support)
- **Caching**: Redis for enhanced performance
- **File Storage**: S3-compatible storage with CDN integration
- **Search**: Typesense for fast, typo-tolerant search
- **Tenant Isolation**: Complete data separation between organizations

## 🚀 Core Features

### 🔐 Authentication & Authorization
- **WorkOS Integration** for enterprise-grade authentication
- **Multi-Platform Auth** (Web, Mobile, API) with shared sessions
- **Multi-tenant Authentication** with organization-scoped access
- Single Sign-On (SSO) and OAuth2 via WorkOS
- Role-based permissions with Spatie Laravel Permission
- API token management with tenant-scoped access
- Directory sync and user provisioning
- Audit logging and compliance features

### 🏢 Multi-Tenancy & SaaS Features
- **Multi-Level Administration**
  - Super Admin panel (FilamentPHP - platform management)
  - Tenant Admin panels (React + Inertia - organization-specific)
  - User dashboards (React + Inertia - end-user interfaces)
  - Mobile admin capabilities with full feature parity

- **Organization Management**
  - WorkOS-powered team management and directory sync
  - Complete data isolation between tenants
  - Custom domains and white-label branding
  - Cross-tenant analytics and reporting
  - Tenant onboarding and provisioning
  - Mobile tenant switching and management

- **Subscription Management**
  - Multiple pricing plans and feature toggles
  - Usage-based billing and metering
  - Trial periods and grace periods
  - Plan upgrades and downgrades
  - Billing portal and invoices
  - Mobile payment integration

### 🎨 Page Builder & Customization
- **Visual Page Builder**
  - Drag-and-drop interface for content creation
  - Pre-built component library
  - Tenant-specific page templates
  - Mobile-responsive design system
  - Custom CSS and branding options

- **White-Label Capabilities**
  - Custom branding per tenant (web + mobile)
  - Custom domains and SSL certificates
  - Tenant-specific app configurations
  - Branded mobile app deployment

### 🔔 Communication & Notifications
- **Real-time Notifications**
  - In-app notifications across web and mobile
  - Push notifications for mobile apps
  - Email notifications with queued processing
  - SMS notifications via Twilio

- **Communication Tools**
  - Live chat system (web + mobile)
  - Support ticket management
  - Email campaigns and newsletters
  - Automated drip campaigns

### 🤖 AI & Machine Learning
- **AI Service Layer**
  - OpenAI GPT integration
  - Claude AI integration
  - Custom model integration endpoints
  - Text processing and generation
  - Image processing and analysis
  - Recommendation engine

- **AI-Powered Features**
  - Smart content generation
  - Automated customer support
  - Predictive analytics
  - Intelligent search and recommendations
  - Mobile AI features (camera text recognition, etc.)

### 📱 Mobile & Progressive Web App
- **React Native Mobile App**
  - Native iOS and Android applications
  - Shared API layer with web platform
  - Offline-first architecture
  - Push notification support
  - Biometric authentication
  - Camera and device integration

- **Progressive Web App**
  - Offline functionality
  - Push notifications
  - App-like experience
  - Installation prompts
  - Service worker caching

## 🛠️ Development Stack

### Backend Technologies
```
- Laravel 12+ (PHP 8.3+)
- WorkOS (Enterprise Authentication)
- Laravel Sanctum (API Authentication)
- Laravel Cashier (Subscription Billing)
- Laravel Reverb (WebSockets)
- Laravel Folio (Page-based Routing)
- Spatie Laravel Permission (ACL)
- Stancl/Tenancy (Multi-tenancy)
- FilamentPHP v3 (Super Admin Panel)
- Typesense (Search Engine)
- Laravel Telescope (Debugging)
- Laravel Pulse (Application Monitoring)
- Pest PHP (Testing Framework)
```

### Frontend Technologies
```
- Laravel 12 + Inertia.js with React (Web)
- React Native + Expo (Mobile)
- TypeScript support across all platforms
- Tailwind CSS + shadcn/ui components
- FilamentPHP v3 (Super Admin only)
- Vite for asset building
- Server-side Rendering (SSR)
- PWA capabilities
```

### Infrastructure & DevOps
```
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+
- Typesense Server
- Nginx/Apache
- S3-compatible storage with CDN
- GitHub Actions (CI/CD)
- EAS Build (Mobile deployment)
```

## 📦 Project Structure

```
filentra/
├── app/
│   ├── Actions/              # Single-purpose action classes
│   ├── Broadcasting/         # WebSocket channel classes
│   ├── Events/              # Event classes
│   ├── Filament/
│   │   └── SuperAdmin/      # Super admin panel resources
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/         # API controllers (v1, v2)
│   │   │   ├── SuperAdmin/  # Super admin web controllers
│   │   │   ├── TenantAdmin/ # Tenant admin controllers
│   │   │   └── User/        # User dashboard controllers
│   │   ├── Middleware/      # Custom middleware
│   │   └── Resources/       # API resources
│   ├── Jobs/                # Queue job classes
│   ├── Listeners/           # Event listeners
│   ├── Models/              # Eloquent models with tenant scoping
│   ├── Notifications/       # Notification classes
│   ├── Policies/           # Authorization policies
│   ├── Services/           # Business logic services
│   │   ├── WorkOS/         # WorkOS integration
│   │   ├── Typesense/      # Search services
│   │   ├── Tenant/         # Multi-tenancy services
│   │   ├── AI/             # AI service integrations
│   │   └── PageBuilder/    # Page builder services
│   └── Traits/             # Reusable model traits
├── database/
│   ├── factories/          # Model factories
│   ├── migrations/         # Database migrations
│   └── seeders/           # Database seeders
├── mobile/                 # React Native Expo app
│   ├── app/               # Expo Router pages
│   ├── components/        # Reusable components
│   ├── services/          # API services
│   ├── stores/            # State management
│   └── types/             # TypeScript definitions
├── resources/
│   ├── js/
│   │   ├── components/     # React components
│   │   ├── layouts/        # Inertia layouts
│   │   ├── pages/
│   │   │   ├── TenantAdmin/ # Tenant admin pages
│   │   │   └── User/        # User dashboard pages
│   │   ├── types/          # TypeScript definitions
│   │   └── utils/          # Utility functions
│   ├── views/
│   │   ├── pages/          # Laravel Folio pages
│   │   └── components/     # Blade components
│   └── lang/              # Localization files
├── routes/
│   ├── api.php            # API routes (versioned)
│   ├── web.php            # Web routes
│   └── channels.php       # Broadcasting channels
├── storage/
├── tests/                 # Automated tests
│   ├── Feature/           # Feature tests
│   ├── Unit/              # Unit tests
│   └── Mobile/            # Mobile app tests
├── docker/               # Docker configuration
├── docs/                 # Documentation
└── scripts/              # Deployment scripts
```

## 🚀 Quick Start Guide

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ & npm/yarn
- Composer
- Expo CLI (for mobile development)

### 1. Clone and Setup
```bash
git clone https://github.com/your-org/filentra.git
cd filentra
cp .env.example .env
```

### 2. Environment Configuration
```bash
# Generate application key
php artisan key:generate

# Configure database and services in .env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_DATABASE=filentra

# Redis Configuration
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=redis

# WorkOS Configuration
WORKOS_API_KEY=your-workos-api-key
WORKOS_CLIENT_ID=your-workos-client-id
WORKOS_REDIRECT_URI=https://your-domain.com/auth/workos/callback

# Typesense Configuration
TYPESENSE_API_KEY=your-typesense-api-key
TYPESENSE_HOST=typesense
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=http

# Broadcasting
BROADCAST_DRIVER=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key
```

### 3. Start Development Environment
```bash
# Start Docker services
docker-compose up -d

# Install backend dependencies
composer install
php artisan migrate:fresh --seed

# Install API and broadcasting
php artisan install:api
php artisan install:broadcasting --reverb

# Setup Typesense collections
php artisan typesense:create-collections

# Install frontend dependencies
npm install
npm run build

# Setup mobile app
cd mobile
npm install
cd ..

# Start development servers
php artisan serve &
php artisan reverb:start &
php artisan queue:work &
npm run dev
```

### 4. Mobile Development Setup
```bash
# Navigate to mobile directory
cd mobile

# Install Expo CLI globally (if not installed)
npm install -g @expo/cli

# Start Expo development server
npx expo start

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### 5. Access the Application
- **User Dashboard**: http://localhost:8000
- **Tenant Admin Panel**: http://localhost:8000/admin
- **Super Admin Panel**: http://localhost:8000/super-admin
- **API Documentation**: http://localhost:8000/docs
- **WebSocket Server**: ws://localhost:8080
- **Mobile App**: Expo development server

## 📋 Enhanced Implementation Roadmap

### Phase 1: API Foundation (Weeks 1-3)
- [x] Laravel 12 API setup with multi-tenancy architecture
- [x] WorkOS authentication integration for API
- [x] API versioning and documentation setup
- [x] Database schema with tenant scoping
- [x] Laravel Sanctum for cross-platform auth
- [ ] API rate limiting and tenant isolation
- [ ] Basic subscription billing API
- [ ] WebSocket setup for real-time features

### Phase 2: Mobile Development (Weeks 4-6)
- [ ] React Native + Expo project setup
- [ ] Mobile authentication flow with Laravel API
- [ ] Tenant selection and switching in mobile
- [ ] Core mobile UI components library
- [ ] Push notifications infrastructure
- [ ] Offline data synchronization
- [ ] App store preparation and assets
- [ ] Deep linking for tenant features

### Phase 3: Web Platform & Page Builder (Weeks 7-9)
- [ ] Web dashboard (React + Inertia)
- [ ] Page builder API and interfaces
- [ ] FilamentPHP super admin panel
- [ ] Tenant admin panels (React + Inertia)
- [ ] Real-time notifications (web + mobile)
- [ ] File upload and media management
- [ ] Advanced tenant customization
- [ ] Performance optimization

### Phase 4: AI Integration & Advanced Features (Weeks 10-12)
- [ ] AI service layer integration
- [ ] OpenAI and Claude API integration
- [ ] AI-powered page builder features
- [ ] Mobile AI capabilities
- [ ] Advanced analytics and reporting
- [ ] White-label mobile app capabilities
- [ ] Security hardening and penetration testing
- [ ] Load testing and scalability optimization

### Phase 5: Enterprise & Launch (Weeks 13-15)
- [ ] Advanced SSO and directory sync
- [ ] Tenant-specific branding (web + mobile)
- [ ] Enterprise compliance features
- [ ] Advanced monitoring and alerting
- [ ] Documentation and developer guides
- [ ] Mobile app store submission
- [ ] Launch preparation and marketing assets
- [ ] Beta testing program

## 🔧 Configuration & Customization

### Environment Variables
```env
# Application
APP_NAME=Filentra
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=filentra
DB_USERNAME=your-username
DB_PASSWORD=your-password

# Redis
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password

# WorkOS Authentication
WORKOS_API_KEY=your-workos-api-key
WORKOS_CLIENT_ID=your-workos-client-id
WORKOS_REDIRECT_URI=https://your-domain.com/auth/workos/callback

# Typesense Search
TYPESENSE_API_KEY=your-typesense-api-key
TYPESENSE_HOST=your-typesense-host
TYPESENSE_PORT=8108
TYPESENSE_PROTOCOL=https

# Broadcasting
BROADCAST_DRIVER=reverb
REVERB_APP_ID=your-app-id
REVERB_APP_KEY=your-app-key
REVERB_APP_SECRET=your-app-secret

# Payment
STRIPE_KEY=your-stripe-key
STRIPE_SECRET=your-stripe-secret
STRIPE_WEBHOOK_SECRET=your-webhook-secret

# AI Services
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-claude-key

# Storage
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name

# Mobile App Configuration
EXPO_PROJECT_ID=your-expo-project-id
EAS_PROJECT_ID=your-eas-project-id
```

### Custom Configurations
- **Multi-tenancy**: Configure tenant resolution in `config/multitenancy.php`
- **WorkOS**: Set up authentication providers in `config/workos.php`
- **Typesense**: Configure search collections in `config/typesense.php`
- **FilamentPHP**: Configure super admin panel in `config/filament.php`
- **AI Services**: Configure AI providers in `config/ai.php`
- **Mobile**: Configure app settings in `mobile/app.config.js`

## 🧪 Testing Strategy

### Testing Stack
- **Backend**: Pest PHP with Feature and Unit tests
- **Frontend**: Vitest with React Testing Library
- **E2E**: Playwright for end-to-end testing
- **Mobile**: Detox for React Native testing
- **API**: Postman/Insomnia collections

### Test Categories
```bash
# Run all backend tests
php artisan test

# Run with coverage
php artisan test --coverage

# Run frontend tests
npm run test

# Run mobile tests
cd mobile && npm run test

# Run E2E tests
npm run test:e2e
```

## 🚀 Deployment Guide

### Production Deployment

#### Web Platform
```bash
# Server setup
composer install --no-dev --optimize-autoloader
npm ci && npm run build
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

#### Mobile App Deployment
```bash
# Build for production
cd mobile
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 📊 Performance Optimization

### API Performance
- **Database Optimization**: Proper indexing and query optimization
- **Caching Strategy**: Redis-based caching for frequent queries
- **Rate Limiting**: API throttling per tenant and user
- **Response Optimization**: Efficient JSON serialization

### Mobile Performance
- **Bundle Optimization**: Code splitting and lazy loading
- **Offline Caching**: Strategic data caching for offline use
- **Image Optimization**: Automatic image compression and caching
- **Navigation Optimization**: Smooth transitions and preloading

## 🔒 Security Best Practices

### API Security
- **Authentication**: Multi-layer auth with Sanctum
- **Authorization**: Tenant-scoped permissions
- **Rate Limiting**: Prevent abuse and DDoS
- **Input Validation**: Comprehensive request validation

### Mobile Security
- **Secure Storage**: Encrypted local data storage
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Biometric Auth**: Secure device-level authentication
- **App Transport Security**: Enforced HTTPS communication

## 📈 Monitoring & Analytics

### Application Monitoring
- **Laravel Pulse**: Real-time performance monitoring
- **Error Tracking**: Sentry integration for error reporting
- **API Analytics**: Request tracking and performance metrics
- **Mobile Analytics**: Crash reporting and user engagement

### Business Analytics
- **Tenant Analytics**: Usage patterns and feature adoption
- **Revenue Tracking**: Subscription and billing analytics
- **User Behavior**: Cross-platform user journey tracking
- **Performance Metrics**: KPI dashboards and alerts

## 🌍 Internationalization & Compliance

### Multi-language Support
- **Laravel Localization**: Backend translation support
- **React i18n**: Frontend internationalization
- **Mobile Localization**: Native app translations
- **Tenant-specific Locales**: Per-organization language preferences

### Compliance & Security
- **Data Privacy**: GDPR, CCPA compliance built-in
- **Audit Logging**: Complete audit trail across platforms
- **Security Standards**: SOC 2, ISO 27001 compliance ready
- **Mobile Compliance**: App store security requirements

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Run the test suite: `php artisan test && npm run test`
5. Test mobile changes: `cd mobile && npm run test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Code Standards
- **PSR-12**: PHP coding standards
- **Laravel Conventions**: Follow Laravel naming conventions
- **ESLint/Prettier**: JavaScript/TypeScript code formatting
- **React Native Standards**: Follow Expo and React Native best practices

## 📚 Resources & Documentation

### Laravel Resources
- [Laravel Documentation](https://laravel.com/docs)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Laravel Reverb](https://laravel.com/docs/reverb)
- [Filament](https://filamentphp.com/docs)
- [Stancl/Tenancy](https://tenancyforlaravel.com/docs)

### Frontend & Mobile Resources
- [Inertia.js](https://inertiajs.com)
- [React Documentation](https://react.dev)
- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)
- [Tailwind CSS](https://tailwindcss.com)

### API & Integration Resources
- [WorkOS Documentation](https://workos.com/docs)
- [Typesense Documentation](https://typesense.org/docs)
- [OpenAI API](https://platform.openai.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Join community discussions
- **Discord**: Real-time chat with the community

### Commercial Support
- **Priority Support**: Get faster response times for paid customers
- **Custom Development**: Tailored features for your specific needs
- **Implementation Services**: Complete project setup and deployment
- **Training & Consulting**: Team training and architecture guidance

### Professional Services
- **White-Label Development**: Custom branded solutions
- **Enterprise Implementation**: Large-scale deployment assistance
- **Mobile App Store Management**: App submission and maintenance
- **Performance Optimization**: Scalability and performance tuning

---

Built with ❤️ for the SaaS community. Ready to ship your next big idea? 🚀
