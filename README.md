# Inventory Management System - Frontend

A modern, responsive Angular application for managing inventory operations with role-based access control, real-time authentication, and intuitive user interface built with TailwindCSS.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with automatic token management
- **Role-Based Dashboard**: Different interfaces for Admin and Staff users
- **Responsive Design**: Mobile-friendly interface built with TailwindCSS
- **Real-Time Updates**: Reactive programming with RxJS observables
- **Route Protection**: Secure navigation with authentication guards
- **HTTP Interceptors**: Automatic token injection and error handling
- **Form Validation**: Comprehensive client-side validation
- **User Management**: Admin interface for managing users and roles

## 🏗️ Architecture

### Core Components

- **Authentication System**: Centralized auth service with JWT token management
- **Dashboard**: Role-based main interface with navigation
- **Guards**: Route protection for authenticated areas
- **Interceptors**: HTTP middleware for authentication and error handling
- **Services**: API communication and state management
- **Models**: TypeScript interfaces for type safety

### Technology Stack

- **Framework**: Angular 20.1.0
- **Styling**: TailwindCSS 3.4.17
- **HTTP Client**: Angular HttpClient with interceptors
- **State Management**: RxJS BehaviorSubjects and Observables
- **Authentication**: JWT tokens with localStorage persistence
- **Build Tool**: Angular CLI with Vite

## 🔐 Test Accounts

The application works with pre-configured test accounts from the backend:

### Admin Account
- **Email**: `admin@inventory.com`
- **Password**: `Admin123!`
- **Access**: Full system access including:
  - User management
  - Product management (CRUD)
  - Supplier management (CRUD)
  - Stock movement tracking
  - Reports and analytics
  - Database backup/restore

### Staff Account
- **Email**: `staff1@inventory.com`
- **Password**: `Staff1`
- **Access**: Limited access including:
  - View products and suppliers
  - Create stock movements
  - View reports
  - Limited dashboard features

## 🛠️ Setup Instructions

### Prerequisites

- **Node.js**: Version 18.0 or later
- **npm**: Version 9.0 or later (comes with Node.js)
- **Angular CLI**: Version 20.1.0 or later

### Installation Steps

1. **Install Node.js**
   
   Download and install from [nodejs.org](https://nodejs.org/)
   
   Verify installation:
   ```bash
   node --version
   npm --version
   ```

2. **Install Angular CLI** (if not already installed)
   ```bash
   npm install -g @angular/cli@20.1.0
   ```

3. **Clone the repository**
   ```bash
   git clone https://github.com/DeividasDub/Inventory-Management-System-Task-front-end.git
   cd Inventory-Management-System-Task-front-end
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Configure API endpoint** (if needed)
   
   The application is configured to connect to the backend API at `https://localhost:44372/api/auth`. If your backend runs on a different port, update the API URL in:
   ```typescript
   // src/app/services/auth.service.ts
   private readonly API_URL = 'https://localhost:YOUR_PORT/api/auth';
   ```

6. **Start the development server**
   ```bash
   ng serve
   ```

7. **Access the application**
   
   Open your browser and navigate to `http://localhost:4200/`

## 🎯 Usage Guide

### First Time Setup

1. **Start the backend API** first (see backend README for instructions)
2. **Start the frontend** with `ng serve`
3. **Navigate** to `http://localhost:4200/`
4. **Login** with one of the test accounts

### Navigation Flow

```
Login Page → Dashboard (Role-based) → Feature Pages
    ↓
Authentication Guard → JWT Token → API Calls
```

### Role-Based Features

#### Admin Dashboard
- **User Management**: Create, update, delete users and manage roles
- **Product Management**: Full CRUD operations for inventory items
- **Supplier Management**: Manage supplier information and relationships
- **Stock Movements**: Track and create inventory movements
- **Reports**: View low stock alerts and movement history
- **Database Operations**: Backup and restore database

#### Staff Dashboard
- **Product Viewing**: Browse and search products
- **Supplier Information**: View supplier details
- **Stock Movements**: Create inventory movements
- **Reports**: View reports and analytics
- **Limited Access**: Read-only access to most features

### Key Features

#### Authentication
- **Automatic Login**: Remembers user session
- **Token Management**: Automatic token refresh and validation
- **Secure Logout**: Clears all authentication data
- **Route Protection**: Redirects unauthorized users

#### Dashboard
- **Role Detection**: Shows different interfaces based on user role
- **Quick Stats**: Overview cards with key metrics
- **Navigation Menu**: Role-based menu items
- **User Profile**: Current user information display

#### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive layout for tablets
- **Desktop**: Full-featured desktop interface
- **Touch-Friendly**: Large buttons and touch targets

## 🔧 Development

### Project Structure

```
src/
├── app/
│   ├── components/          # UI components
│   │   ├── dashboard/       # Main dashboard component
│   │   ├── login/          # Login form component
│   │   └── register/       # Registration form component
│   ├── guards/             # Route guards
│   │   └── auth.guard.ts   # Authentication guard
│   ├── interceptors/       # HTTP interceptors
│   │   └── auth.interceptor.ts # Auth token interceptor
│   ├── models/             # TypeScript interfaces
│   │   └── auth.interface.ts # Authentication models
│   ├── services/           # Angular services
│   │   └── auth.service.ts # Authentication service
│   ├── app.config.ts       # App configuration
│   ├── app.routes.ts       # Route configuration
│   └── main.ts            # Bootstrap file
├── styles/                 # Global styles
└── assets/                # Static assets
```

### Key Files

#### Authentication Service (`src/app/services/auth.service.ts`)
- **Purpose**: Manages user authentication and JWT tokens
- **Key Methods**:
  - `login()`: Authenticate user and store token
  - `logout()`: Clear authentication data
  - `isAuthenticated()`: Check if user is logged in
  - `hasRole()`: Check user permissions
  - `getCurrentUser()`: Get current user information

#### Authentication Guard (`src/app/guards/auth.guard.ts`)
- **Purpose**: Protects routes from unauthorized access
- **Functionality**: Redirects unauthenticated users to login

#### Auth Interceptor (`src/app/interceptors/auth.interceptor.ts`)
- **Purpose**: Automatically adds JWT tokens to HTTP requests
- **Features**: Handles authentication headers and error responses

### Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build

# Run tests
ng test

# Run linting
ng lint

# Generate new component
ng generate component component-name

# Generate new service
ng generate service service-name

# Generate new guard
ng generate guard guard-name
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (configured for Angular templates)
- **TailwindCSS**: Utility-first CSS framework

### Adding New Features

1. **Create Component**: `ng generate component feature-name`
2. **Add Route**: Update `app.routes.ts`
3. **Add Service**: Create service for API communication
4. **Add Guard**: Protect route if authentication required
5. **Update Navigation**: Add menu items to dashboard

## 🎨 Styling

### TailwindCSS Configuration

The application uses TailwindCSS for styling with custom configuration:

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      // Custom theme extensions
    }
  },
  plugins: []
}
```

### Design System

- **Colors**: Professional blue and gray palette
- **Typography**: Clean, readable fonts
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components
- **Responsive**: Mobile-first responsive design

### Custom Styles

Global styles are defined in:
- `src/styles.css`: Global TailwindCSS imports
- Component-specific styles in component files

## 🚀 Building and Deployment

### Development Build

```bash
ng build
```

### Production Build

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

### Deployment Options

1. **Static Hosting**: Deploy `dist/` folder to any static hosting service
2. **CDN**: Upload to CDN for global distribution
3. **Docker**: Containerize with nginx for production
4. **Cloud Platforms**: Deploy to AWS, Azure, or Google Cloud

### Environment Configuration

Create environment-specific configurations:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:44372/api'
};

// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://your-production-api.com/api'
};
```

## 🧪 Testing

### Unit Tests

```bash
# Run tests once
ng test

# Run tests in watch mode
ng test --watch

# Run tests with coverage
ng test --code-coverage
```

### End-to-End Tests

```bash
# Install e2e testing framework
ng add @angular/e2e

# Run e2e tests
ng e2e
```

### Testing Strategy

- **Unit Tests**: Test individual components and services
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Authentication Tests**: Test login/logout flows

## 🔒 Security

### Authentication Security

- **JWT Tokens**: Secure token-based authentication
- **Token Expiration**: Automatic token validation
- **Secure Storage**: Tokens stored in localStorage
- **Route Protection**: Guards prevent unauthorized access

### Best Practices

- **Input Validation**: Client-side form validation
- **XSS Protection**: Angular's built-in XSS protection
- **CSRF Protection**: Token-based request authentication
- **HTTPS**: Always use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

#### "Cannot connect to backend"
- Verify backend API is running
- Check API URL in auth service
- Ensure CORS is configured in backend

#### "Authentication failed"
- Verify test account credentials
- Check if backend database is seeded
- Clear browser localStorage and try again

#### "Build errors"
- Run `npm install` to ensure dependencies are installed
- Check Node.js and Angular CLI versions
- Clear node_modules and reinstall if needed

#### "Styling issues"
- Verify TailwindCSS is properly configured
- Check if PostCSS configuration is correct
- Rebuild the application

### Debug Mode

Enable debug mode by setting:
```typescript
// In component or service
console.log('Debug info:', data);
```

### Browser Developer Tools

Use browser dev tools to:
- Inspect network requests
- Check console for errors
- Examine localStorage for tokens
- Debug component state

## 📱 Browser Support

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile**: iOS Safari, Chrome Mobile

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Run linting: `ng lint`
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:

1. **Check the console** for error messages
2. **Verify backend connection** is working
3. **Clear browser cache** and localStorage
4. **Check network tab** for failed API requests
5. **Review authentication flow** if login issues occur

### Useful Commands

```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Reset Angular CLI cache
ng cache clean

# Check Angular version
ng version
```

---

**Note**: This frontend application is designed to work with the .NET Core backend API available at: [Inventory-Management-System-Task-back-end](https://github.com/DeividasDub/Inventory-Management-System-Task-back-end)

## 🔗 Related Links

- [Angular Documentation](https://angular.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [RxJS Documentation](https://rxjs.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
