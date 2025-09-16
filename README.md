# The Barber Book - Multi-Tenant Appointment Management System

A modern, scalable barber shop website with multi-tenant support, appointment booking, and admin management system.

## 🎨 Features

### Customer Features
- **Multi-Tenant Architecture** - Support for multiple barber shops with unique themes
- **Dynamic Theming** - Each tenant has customizable colors, fonts, and branding
- **Service Booking** - Easy appointment scheduling with service selection
- **Real-time Availability** - See available time slots up to 2 weeks in advance
- **Service Customization** - Choose haircut + add-ons (design, beard trimming, eyebrows)
- **Booking Confirmation** - Detailed confirmation page with appointment details
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices

### Admin Features
- **Secure Admin Login** - JWT-based authentication
- **Appointment Dashboard** - View, cancel, and reschedule appointments
- **Automatic Cleanup** - Past appointments automatically marked as completed
- **Manual Cleanup** - Button to manually mark past appointments as completed
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **CSS3** - Custom styling with gradients and animations
- **Google Fonts** - Dancing Script for elegant typography

### Backend
- **ASP.NET Core 7.0** - High-performance web API
- **Entity Framework Core** - Database ORM with migrations and seeding
- **PostgreSQL** - Relational database (hosted on Railway)
- **JWT Authentication** - Secure admin access
- **CORS** - Cross-origin resource sharing enabled
- **Multi-Tenant Support** - Tenant-specific data isolation

## 📁 Project Structure

```
TheBarberBook/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Header.jsx      # Navigation header
│   │   └── Footer.jsx      # Site footer
│   ├── pages/              # Main application pages
│   │   ├── BarberProfile.jsx # Barber information (home page)
│   │   ├── Services.jsx    # Service catalog
│   │   ├── Reviews.jsx     # Customer reviews
│   │   ├── Booker.jsx      # Appointment booking
│   │   ├── Confirmation.jsx # Booking confirmation
│   │   ├── AdminLogin.jsx  # Admin authentication
│   │   └── AdminDashboard.jsx # Admin management
│   ├── css/                # Stylesheets
│   │   ├── unified-theme.css # Centralized theming system
│   │   ├── layout-*.css    # Page-specific structural styles
│   │   └── App.css         # Global styles
│   └── utils/              # Utility functions
│       └── apiHelper.js    # API calls and tenant detection
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- .NET 7.0 SDK
- PostgreSQL (or use Railway for cloud hosting)

### Frontend Setup
1. Clone the frontend repository:
   ```bash
   git clone [https://github.com/codeus21/TheBarberBook]
   cd TheBarberBook
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Backend Setup
1. Clone the backend repository:
   ```bash
   git clone [https://github.com/codeus21/BarberShopAPI]
   cd BarberShopAPI.Server
   ```

2. Set up user secrets:
   ```bash
   dotnet user-secrets init
   dotnet user-secrets set "Jwt:Key" "YOUR_JWT_SECRET_KEY"
   dotnet user-secrets set "ConnectionStrings:DefaultConnection" "YOUR_POSTGRESQL_CONNECTION_STRING"
   ```

3. Run database migrations:
   ```bash
   dotnet ef database update
   ```

4. The database will be automatically seeded with sample data for "Clean Cuts" and "Elite Cuts" tenants

5. Start the API:
   ```bash
   dotnet run
   ```

6. The API will be available at [https://localhost:7074](https://localhost:7074)

## 🏢 Multi-Tenant System

### Supported Tenants
- **Clean Cuts** (Default) - Blue theme with classic styling
- **Elite Cuts** - Purple theme with premium styling
- **Vintage Cuts** - Gold theme with retro styling

### Tenant Access
Access different tenants by adding `?tenant=<tenant-name>` to the URL:
- `http://localhost:5173/?tenant=elite` - Elite Cuts
- `http://localhost:5173/?tenant=vintage` - Vintage Cuts
- `http://localhost:5173/` - Clean Cuts (default)

### CSS Architecture
The theming system uses a centralized approach:
- **`unified-theme.css`** - Contains all theme-specific colors, fonts, and effects
- **`layout-*.css`** - Page-specific structural styles (no colors)
- **CSS Variables** - Dynamic theming based on tenant selection
- **No Hardcoded Colors** - All styling uses CSS variables for consistency

## 🔗 API Configuration

The frontend is configured to connect to:
- **Development**: `https://localhost:7074/api`
- **Production**: [Your production API URL when deployed]

## 📋 API Endpoints

### Public Endpoints
- `GET /api/Services?tenant=<tenant>` - Get services for specific tenant
- `GET /api/BarberShops?tenant=<tenant>` - Get barber shop info for tenant
- `POST /api/Appointments` - Create new appointment
- `GET /api/Appointments/available-slots/{date}?tenant=<tenant>` - Get available time slots

### Admin Endpoints (JWT Required)
- `POST /api/Auth/login` - Admin authentication
- `GET /api/Admin/appointments` - Get all appointments
- `PUT /api/Admin/appointments/{id}/cancel` - Cancel appointment
- `PUT /api/Admin/appointments/{id}/reschedule` - Reschedule appointment
- `POST /api/Admin/cleanup-completed` - Mark past appointments as completed

## 🎨 Design Features

### Multi-Tenant Theming
- **Dynamic Color Schemes** - Each tenant has unique primary, secondary, and accent colors
- **Custom Typography** - Tenant-specific font families (Dancing Script, etc.)
- **Consistent Branding** - Unified layout with tenant-specific styling
- **Scalable Architecture** - Easy to add new tenants with custom themes

### Visual Design
- **Responsive Design** - Works on all device sizes
- **Smooth Animations** - Hover effects and transitions
- **Professional Layout** - Clean, organized interface
- **Interactive Elements** - Glowing effects on buttons and form inputs
- **Modern UI/UX** - Contemporary design patterns

## 🔒 Security Features

- **JWT Authentication** - Secure admin access
- **User Secrets** - Sensitive data stored locally
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side data validation
- **SQL Injection Protection** - Entity Framework safeguards

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🚀 Recent Improvements

### CSS Architecture Refactor
- **Centralized Theming** - Moved from individual CSS files to unified system
- **CSS Variables** - Dynamic theming using CSS custom properties
- **Layout Separation** - Structural styles separated from theme colors
- **Scalable Design** - Easy to add new tenants without code duplication

### Multi-Tenant Features
- **Tenant Detection** - Automatic tenant identification from URL parameters
- **Dynamic Styling** - Real-time theme switching based on tenant
- **Data Isolation** - Each tenant has separate data and styling
- **Consistent UX** - Unified user experience across all tenants

### Performance Optimizations
- **CSS Specificity** - Optimized CSS selectors for better performance
- **Removed Dead Code** - Cleaned up unused CSS files and components
- **Efficient Theming** - CSS-based theming instead of JavaScript manipulation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email [amazedave15@gmail.com] or create an issue in the repository.

---

**Built with ❤️ for barber shops everywhere**
