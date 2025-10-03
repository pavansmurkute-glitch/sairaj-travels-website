# Sairaj Travels Admin Panel

A comprehensive admin panel for managing the Sairaj Travels website, built with React and integrated with the Spring Boot backend.

## 🚀 Features

### 🔐 Authentication & Security
- **Secure Login System**: Simple admin authentication with session management
- **Route Protection**: All admin routes are protected and require authentication
- **Session Management**: Automatic logout on token expiration

### 📊 Dashboard & Analytics
- **Overview Dashboard**: Real-time statistics and key metrics
- **Business Insights**: Revenue tracking, booking trends, and performance metrics
- **Quick Actions**: Fast access to all management features
- **Visual Reports**: Charts and graphs for better data visualization

### 📋 Booking Management
- **View All Bookings**: Complete list of all vehicle bookings
- **Status Management**: Confirm, cancel, or update booking status
- **Customer Details**: Full customer information and trip details
- **Search & Filter**: Advanced filtering by status, date, customer, etc.
- **Bulk Actions**: Manage multiple bookings at once

### 💬 Enquiry Management
- **Enquiry Dashboard**: All customer enquiries in one place
- **Status Tracking**: Pending, resolved, and cancelled enquiries
- **WhatsApp Integration**: Direct WhatsApp communication with customers
- **Response Management**: Mark enquiries as resolved with notes
- **Search & Filter**: Find specific enquiries quickly

### 📦 Package Management
- **Create Packages**: Add new travel packages with pricing and details
- **Edit Packages**: Update package information, pricing, and features
- **Status Control**: Activate/deactivate packages
- **Featured Packages**: Mark packages as featured for homepage
- **Image Management**: Upload and manage package images
- **Category Management**: Organize packages by categories

### 🚌 Vehicle Management
- **Fleet Overview**: Complete vehicle inventory management
- **Add Vehicles**: Add new vehicles with specifications
- **Edit Vehicles**: Update vehicle details, capacity, and features
- **Status Management**: Activate/deactivate vehicles
- **Image Upload**: Manage vehicle images and galleries
- **Specifications**: Track capacity, AC, type, and other details

### 👨‍💼 Driver Management
- **Driver Database**: Complete driver information management
- **Verification Status**: Track police and Aadhaar verification
- **Experience Tracking**: Monitor driver experience and ratings
- **License Management**: Track license numbers and expiry dates
- **Safety Training**: Record safety training completion
- **Emergency Contacts**: Store emergency contact information

### 📈 Reports & Analytics
- **Business Metrics**: Revenue, bookings, and growth statistics
- **Performance Tracking**: Monthly and yearly comparisons
- **Fleet Analytics**: Vehicle utilization and performance
- **Driver Analytics**: Driver performance and verification status
- **Export Options**: Download reports in various formats

## 🛠️ Technical Features

### Frontend Architecture
- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Framer Motion**: Smooth animations and transitions
- **Axios**: HTTP client for API communication

### State Management
- **Local State**: React hooks for component state
- **Context API**: Global state management for overlays
- **Local Storage**: Persistent authentication and user data

### API Integration
- **RESTful APIs**: Full integration with Spring Boot backend
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: User-friendly loading indicators
- **Success Messages**: Confirmation messages for actions

## 📱 Responsive Design

### Mobile-First Approach
- **Responsive Grid**: Adapts to all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Mobile Navigation**: Collapsible navigation for mobile devices
- **Touch Gestures**: Swipe and touch interactions

### Cross-Platform Compatibility
- **Desktop**: Full-featured desktop experience
- **Tablet**: Optimized tablet layout
- **Mobile**: Mobile-optimized interface
- **Progressive Web App**: PWA capabilities for mobile installation

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- React 18+
- Spring Boot backend running
- Modern web browser

### Frontend Setup
```bash
# Navigate to frontend directory
cd backend/sairaj-travels-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Configuration
Create a `.env` file in the frontend directory:
```env
VITE_API_BASE=http://localhost:8080/api
```

## 🚀 Usage Guide

### Admin Login
1. Navigate to `/admin/login`
2. Use demo credentials:
   - Username: `admin`
   - Password: `admin123`
3. Access the admin dashboard

### Dashboard Overview
- **Statistics Cards**: View key metrics at a glance
- **Recent Activity**: Latest bookings and enquiries
- **Quick Actions**: Fast access to all features
- **Navigation**: Easy access to all admin functions

### Managing Bookings
1. Go to **Bookings** section
2. View all bookings with filters
3. Click on any booking to view details
4. Update status (Confirm/Cancel)
5. Use search to find specific bookings

### Managing Enquiries
1. Navigate to **Enquiries** section
2. View all customer enquiries
3. Use WhatsApp integration for responses
4. Mark enquiries as resolved
5. Filter by status and date

### Package Management
1. Go to **Packages** section
2. Click "Create Package" to add new packages
3. Fill in package details and pricing
4. Upload images and set features
5. Activate/deactivate packages as needed

### Vehicle Management
1. Navigate to **Vehicles** section
2. Add new vehicles with specifications
3. Upload vehicle images
4. Set capacity, AC, and other features
5. Manage vehicle status

### Driver Management
1. Go to **Drivers** section
2. Add new drivers with complete information
3. Track verification status
4. Record experience and training
5. Manage driver status

### Reports & Analytics
1. Navigate to **Reports** section
2. View comprehensive business metrics
3. Analyze performance trends
4. Export data for external analysis
5. Monitor key performance indicators

## 🔒 Security Features

### Authentication
- **Session Management**: Secure session handling
- **Token Storage**: Secure token storage in localStorage
- **Auto-Logout**: Automatic logout on token expiration
- **Route Protection**: Protected admin routes

### Data Protection
- **Input Validation**: Client-side validation for all forms
- **Error Handling**: Secure error handling without data exposure
- **XSS Protection**: Protection against cross-site scripting
- **CSRF Protection**: Cross-site request forgery protection

## 🎨 UI/UX Features

### Design System
- **Consistent Styling**: Unified design language
- **Color Scheme**: Professional blue and gray color palette
- **Typography**: Clear and readable fonts
- **Icons**: Intuitive iconography throughout

### User Experience
- **Intuitive Navigation**: Easy-to-use navigation system
- **Loading States**: Clear loading indicators
- **Success Feedback**: Confirmation messages for actions
- **Error Messages**: Helpful error messages
- **Responsive Design**: Works on all devices

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: High contrast for readability
- **Focus Management**: Clear focus indicators

## 📊 Performance Optimization

### Frontend Optimization
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Optimized bundle sizes
- **Image Optimization**: Compressed and optimized images
- **Caching**: Efficient caching strategies

### API Optimization
- **Request Batching**: Batch multiple API requests
- **Error Retry**: Automatic retry for failed requests
- **Loading States**: User-friendly loading indicators
- **Data Caching**: Client-side data caching

## 🚀 Deployment

### Production Build
```bash
# Create production build
npm run build

# Serve the build
npm run preview
```

### Environment Variables
```env
VITE_API_BASE=https://your-api-domain.com/api
```

## 🔧 Customization

### Adding New Features
1. Create new React components in `/src/pages/`
2. Add routes in `App.jsx`
3. Update navigation in `AdminNav.jsx`
4. Add API endpoints in backend

### Styling Customization
- Modify Tailwind classes in components
- Update color scheme in `tailwind.config.js`
- Add custom CSS in `index.css`

### API Integration
- Update API endpoints in `/src/services/api.js`
- Add new API methods as needed
- Update error handling for new endpoints

## 📝 Maintenance

### Regular Updates
- **Dependencies**: Keep all dependencies updated
- **Security**: Regular security updates
- **Performance**: Monitor and optimize performance
- **User Feedback**: Collect and implement user feedback

### Monitoring
- **Error Tracking**: Monitor for errors and issues
- **Performance Metrics**: Track loading times and user experience
- **Usage Analytics**: Monitor feature usage
- **User Feedback**: Collect user feedback for improvements

## 🤝 Support

### Documentation
- **API Documentation**: Complete API documentation
- **Component Documentation**: React component documentation
- **User Guide**: Comprehensive user guide
- **FAQ**: Frequently asked questions

### Troubleshooting
- **Common Issues**: Solutions to common problems
- **Error Messages**: Understanding error messages
- **Performance Issues**: Performance troubleshooting
- **Browser Compatibility**: Browser-specific issues

## 📈 Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed analytics and reporting
- **Bulk Operations**: Bulk management of bookings and enquiries
- **Email Integration**: Email notifications and communications
- **Mobile App**: Native mobile app for admin functions
- **API Documentation**: Interactive API documentation
- **User Roles**: Multiple admin roles and permissions
- **Audit Logs**: Complete audit trail of all actions
- **Data Export**: Advanced data export options

### Technical Improvements
- **Real-time Updates**: WebSocket integration for real-time updates
- **Offline Support**: Offline functionality for critical features
- **Progressive Web App**: Enhanced PWA capabilities
- **Performance Monitoring**: Advanced performance monitoring
- **Security Enhancements**: Enhanced security features
- **Accessibility**: Improved accessibility features

---

## 🎯 Quick Start Checklist

- [ ] Backend API is running on port 8080
- [ ] Frontend dependencies are installed
- [ ] Environment variables are configured
- [ ] Admin credentials are set up
- [ ] Database is properly configured
- [ ] All API endpoints are working
- [ ] Admin panel is accessible at `/admin/login`

## 📞 Support Contact

For technical support or questions about the admin panel:
- **Email**: admin@sairajtravels.com
- **Phone**: +91 9850748273
- **Documentation**: Check this README for detailed information

---

**Built with ❤️ for Sairaj Travels**
