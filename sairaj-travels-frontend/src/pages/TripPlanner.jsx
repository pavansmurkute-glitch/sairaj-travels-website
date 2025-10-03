// src/pages/TripPlanner.jsx
import React, { useState, useEffect, useCallback } from "react";
import api, { apiMethods } from "../services/api";
import { MapContainer, TileLayer, Polyline, Marker, Tooltip, useMap } from "react-leaflet";
import { AsyncPaginate } from "react-select-async-paginate";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import emailjs from '@emailjs/browser';
import { emailConfig } from '../config/email';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  DollarSign, 
  Fuel, 
  Route, 
  Save, 
  Share2, 
  Download,
  AlertCircle,
  CheckCircle,
  Loader2,
  Car,
  Users,
  Calendar,
  Phone
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

function FitBounds({ route }) {
  const map = useMap();
  if (route && route.length > 0) map.fitBounds(route);
  return null;
}

// Fix for Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function TripPlanner() {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Removed savedTrips functionality - was incomplete

  const [tripDetails, setTripDetails] = useState({
    passengers: 1,
    vehicleType: "",
    departureDate: "",
    returnDate: "",
    specialRequests: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    departureTime: "",
    pickupLocation: "",
    dropLocation: ""
  });

  // State for customer details validation
  const [customerDetailsComplete, setCustomerDetailsComplete] = useState(false);

  // Validate customer details
  const validateCustomerDetails = useCallback(() => {
    const isValid = tripDetails.customerName.trim() !== '' && 
                   tripDetails.customerPhone.trim() !== '' && 
                   tripDetails.customerEmail.trim() !== '' &&
                   /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tripDetails.customerEmail) &&
                   /^[6-9]\d{9}$/.test(tripDetails.customerPhone);
    setCustomerDetailsComplete(isValid);
    return isValid;
  }, [tripDetails.customerName, tripDetails.customerPhone, tripDetails.customerEmail]);

  // Update validation when customer details change
  useEffect(() => {
    validateCustomerDetails();
  }, [validateCustomerDetails]);

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState(null);
  const [vehiclePricing, setVehiclePricing] = useState(null);
  const [vehicleCharges, setVehicleCharges] = useState(null);
  const [vehicleDetailsLoading, setVehicleDetailsLoading] = useState(false);
  const [vehicleDetailsError, setVehicleDetailsError] = useState(null);

  const [extras, setExtras] = useState({
    food: 500,
    snacks: 200,
    hotel: 0,
    parking: 0,
    driver: 0,
    misc: 0,
    roundTrip: false,
  });

  // Checkbox states for optional charges
  const [includeDriverAllowance, setIncludeDriverAllowance] = useState(false);
  const [includeNightStay, setIncludeNightStay] = useState(false);
  
  // Tab state for better organization
  const [activeTab, setActiveTab] = useState('route');

  // Auto-calculate night stay based on dates
  const calculateNightStay = useCallback(() => {
    if (tripDetails.departureDate && tripDetails.returnDate) {
      const departureDate = new Date(tripDetails.departureDate);
      const returnDate = new Date(tripDetails.returnDate);
      
      // Calculate the difference in days
      const timeDifference = returnDate.getTime() - departureDate.getTime();
      const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
      
      // Return number of nights without setting state here
      return daysDifference > 1 ? daysDifference - 1 : 0;
    }
    return 0;
  }, [tripDetails.departureDate, tripDetails.returnDate]);

  // Auto-update night stay when dates change - separate effect to avoid infinite loop
  useEffect(() => {
    if (tripDetails.departureDate && tripDetails.returnDate) {
      const nights = calculateNightStay();
      const shouldIncludeNightStay = nights > 0;
      
      // Only update state if it's different to prevent infinite loop
      if (includeNightStay !== shouldIncludeNightStay) {
        setIncludeNightStay(shouldIncludeNightStay);
      }
    }
  }, [tripDetails.departureDate, tripDetails.returnDate, calculateNightStay, includeNightStay]);
  
  // Additional Expenses State
  const [additionalExpenses, setAdditionalExpenses] = useState({
    // Fuel & Vehicle Related
    fuelCharges: 0, // Extra fuel/diesel/petrol (if not in package)
    tollCharges: 0,
    parkingCharges: 0,
    interstatePermitCharges: 0,
    greenTaxCharges: 0,
    
    // Driver Related (excluding database items)
    driverFoodExpenses: 0,
    
    // Passenger Related
    hotelStayCharges: 0,
    passengerMealCharges: 0,
    
    // Sightseeing & Activities
    sightseeingCharges: 0,
    guideCharges: 0,
    
    // Transport & Logistics
    airportPickupCharges: 0,
    luggageHandlingCharges: 0,
    
    // Special & Emergency
    specialZoneCharges: 0,
    emergencyExpenses: 0,
    
    // Insurance & Documentation
    travelInsuranceCharges: 0,
    documentationCharges: 0,
    
    // Miscellaneous
    miscellaneousCharges: 0,
    
    // Custom Expenses
    customExpense1Name: '',
    customExpense1Amount: 0,
    customExpense2Name: '',
    customExpense2Amount: 0
  });

  // Removed localStorage loading for saved trips

  // Optimized change handlers
  const handlePassengersChange = useCallback((e) => {
    setTripDetails(prev => ({ ...prev, passengers: parseInt(e.target.value) }));
  }, []);

  const handleVehicleTypeChange = useCallback((e) => {
    setTripDetails(prev => ({ ...prev, vehicleType: e.target.value }));
  }, []);

  // Fetch vehicle details when vehicle type changes
  const fetchVehicleDetails = useCallback(async (vehicleId) => {
    if (!vehicleId) {
      setVehicleDetails(null);
      setVehiclePricing(null);
      setVehicleCharges(null);
      setVehicleDetailsError(null);
      return;
    }

    setVehicleDetailsLoading(true);
    setVehicleDetailsError(null);

    try {
      const [vehicleResponse, pricingResponse, chargesResponse] = await Promise.all([
        apiMethods.get(`/vehicles/${vehicleId}`),
        apiMethods.get(`/vehicle-pricing/vehicle/${vehicleId}`),
        apiMethods.get(`/vehicle-charges/vehicle/${vehicleId}`)
      ]);

      setVehicleDetails(vehicleResponse.data);
      setVehiclePricing(pricingResponse.data);
      setVehicleCharges(chargesResponse.data);

      // Check if we have the required pricing data
      if (!pricingResponse.data || pricingResponse.data.length === 0) {
        setVehicleDetailsError("Vehicle pricing details not available. Please contact support.");
      }
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
      setVehicleDetailsError("Unable to load vehicle details. Please try again or contact support.");
    } finally {
      setVehicleDetailsLoading(false);
    }
  }, []);

  // Fetch vehicle details when vehicle type changes
  useEffect(() => {
    if (tripDetails.vehicleType) {
      fetchVehicleDetails(tripDetails.vehicleType);
    }
  }, [tripDetails.vehicleType, fetchVehicleDetails]);

  const handleDepartureDateChange = useCallback((e) => {
    setTripDetails(prev => ({ ...prev, departureDate: e.target.value }));
  }, []);

  const handleReturnDateChange = useCallback((e) => {
    setTripDetails(prev => ({ ...prev, returnDate: e.target.value }));
  }, []);

  const handleSpecialRequestsChange = useCallback((e) => {
    setTripDetails(prev => ({ ...prev, specialRequests: e.target.value }));
  }, []);

  const handleExtrasChange = useCallback((field, value) => {
    setExtras(prev => ({ ...prev, [field]: value }));
  }, []);

  // Load vehicle types from database
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setLoadingVehicles(true);
      try {
        const response = await apiMethods.get('/vehicles/types');
        setVehicleTypes(response.data);
        // Set default vehicle type to first one if available
        if (response.data.length > 0 && !tripDetails.vehicleType) {
          setTripDetails(prev => ({ ...prev, vehicleType: response.data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch vehicle types:', err);
        // Fallback to default options if API fails
        setVehicleTypes([
          { id: 'urbania', name: 'Urbania (17-seater)', capacity: 17, perKmRate: 30, perDayPackageKm: 100 },
          { id: 'sedan', name: 'Sedan (4-seater)', capacity: 4, perKmRate: 25, perDayPackageKm: 80 },
          { id: 'suv', name: 'SUV (6-seater)', capacity: 6, perKmRate: 28, perDayPackageKm: 90 },
          { id: 'bus', name: 'Bus (40+ seater)', capacity: 40, perKmRate: 35, perDayPackageKm: 120 }
        ]);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  // 🔎 Autocomplete (Nominatim) with fallback for common cities
  const loadOptions = async (inputValue) => {
    if (!inputValue || inputValue.length < 2) return { options: [] };
    
    // Common Indian cities fallback
    const commonCities = [
      { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
      { name: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
      { name: 'Delhi', state: 'Delhi', lat: 28.7041, lng: 77.1025 },
      { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
      { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
      { name: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
      { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
      { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
      { name: 'Surat', state: 'Gujarat', lat: 21.1702, lng: 72.8311 },
      { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
      { name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.4499, lng: 80.3319 },
      { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lng: 79.0882 },
      { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
      { name: 'Thane', state: 'Maharashtra', lat: 19.2183, lng: 72.9781 },
      { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lng: 77.4126 },
      { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lng: 83.2185 },
      { name: 'Pimpri-Chinchwad', state: 'Maharashtra', lat: 18.6298, lng: 73.7997 },
      { name: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
      { name: 'Vadodara', state: 'Gujarat', lat: 22.3072, lng: 73.1812 },
      { name: 'Ghaziabad', state: 'Uttar Pradesh', lat: 28.6692, lng: 77.4538 },
      { name: 'Ludhiana', state: 'Punjab', lat: 30.9010, lng: 75.8573 },
      { name: 'Agra', state: 'Uttar Pradesh', lat: 27.1767, lng: 78.0081 },
      { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lng: 73.7898 },
      { name: 'Faridabad', state: 'Haryana', lat: 28.4089, lng: 77.3178 },
      { name: 'Meerut', state: 'Uttar Pradesh', lat: 28.9845, lng: 77.7064 },
      { name: 'Rajkot', state: 'Gujarat', lat: 22.3039, lng: 70.8022 },
      { name: 'Kalyan-Dombivli', state: 'Maharashtra', lat: 19.2403, lng: 73.1305 },
      { name: 'Vasai-Virar', state: 'Maharashtra', lat: 19.4914, lng: 72.8054 },
      { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lng: 82.9739 },
      { name: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 },
      { name: 'Aurangabad', state: 'Maharashtra', lat: 19.8762, lng: 75.3433 },
      { name: 'Dhanbad', state: 'Jharkhand', lat: 23.7957, lng: 86.4304 },
      { name: 'Amritsar', state: 'Punjab', lat: 31.6340, lng: 74.8723 },
      { name: 'Navi Mumbai', state: 'Maharashtra', lat: 19.0330, lng: 73.0297 },
      { name: 'Allahabad', state: 'Uttar Pradesh', lat: 25.4358, lng: 81.8463 },
      { name: 'Ranchi', state: 'Jharkhand', lat: 23.3441, lng: 85.3096 },
      { name: 'Howrah', state: 'West Bengal', lat: 22.5958, lng: 88.2636 },
      { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lng: 76.9558 },
      { name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1815, lng: 79.9864 },
      { name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2183, lng: 78.1828 },
      { name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5062, lng: 80.6480 },
      { name: 'Jodhpur', state: 'Rajasthan', lat: 26.2389, lng: 73.0243 },
      { name: 'Madurai', state: 'Tamil Nadu', lat: 9.9252, lng: 78.1198 },
      { name: 'Raipur', state: 'Chhattisgarh', lat: 21.2514, lng: 81.6296 },
      { name: 'Kota', state: 'Rajasthan', lat: 25.2138, lng: 75.8648 },
      { name: 'Chandigarh', state: 'Chandigarh', lat: 30.7333, lng: 76.7794 },
      { name: 'Gurgaon', state: 'Haryana', lat: 28.4595, lng: 77.0266 },
      { name: 'Solapur', state: 'Maharashtra', lat: 17.6599, lng: 75.9064 },
      { name: 'Hubli-Dharwad', state: 'Karnataka', lat: 15.3647, lng: 75.1240 },
      { name: 'Bareilly', state: 'Uttar Pradesh', lat: 28.3670, lng: 79.4304 }
    ];

    // Filter cities based on input
    const filteredCities = commonCities.filter(city => 
      city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
      city.state.toLowerCase().includes(inputValue.toLowerCase())
    );

    // Create fallback options
    const fallbackOptions = filteredCities.slice(0, 6).map(city => ({
      label: `${city.name}, ${city.state}, India`,
      value: { lat: city.lat, lng: city.lng }
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=6&q=${encodeURIComponent(
          inputValue
        )}`
      );
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const apiOptions = data.map((p) => ({
          label: p.display_name,
          value: { lat: parseFloat(p.lat), lng: parseFloat(p.lon) },
      }));
      
      // Combine API results with fallback, removing duplicates
      const combinedOptions = [...apiOptions, ...fallbackOptions];
      const uniqueOptions = combinedOptions.filter((option, index, self) => 
        index === self.findIndex(o => o.label === option.label)
      );
      
      return { options: uniqueOptions.slice(0, 6) };
    } catch (err) {
      console.warn("Nominatim API unavailable, using fallback cities:", err.message);
      // Return fallback options when API fails
      return { options: fallbackOptions };
    }
  };

  // Derived values (placed before callbacks that reference them)
  // Use fallback distance calculation if tripData is not available
  // Apply a road distance multiplier to account for actual driving routes vs straight-line distance
  const straightLineDistance = start && end ? 
    Math.sqrt(
      Math.pow((end.value.lng - start.value.lng) * 111.32 * Math.cos((start.value.lat + end.value.lat) / 2 * Math.PI / 180), 2) +
      Math.pow((end.value.lat - start.value.lat) * 111.32, 2)
    ) : 0;
  
  // Apply road distance multiplier (typically 1.2-1.4 for actual driving distance)
  // For Pune-Mumbai route, Google shows ~154km vs ~120km straight line, so ~1.28 multiplier
  const roadDistanceMultiplier = 1.35; // 35% more than straight line distance to match Google Maps
  const estimatedRoadDistance = straightLineDistance * roadDistanceMultiplier;
  
  const distanceKm = tripData?.distance ? tripData.distance / 1000 : estimatedRoadDistance;
  const durationHrs = tripData?.duration ? tripData.duration / 3600 : 0;
  
  // Debug distance calculation
  console.log('=== DISTANCE DEBUG ===');
  console.log('tripData:', tripData);
  console.log('start:', start);
  console.log('end:', end);
  console.log('straightLineDistance:', straightLineDistance);
  console.log('roadDistanceMultiplier:', roadDistanceMultiplier);
  console.log('estimatedRoadDistance:', estimatedRoadDistance);
  console.log('finalDistanceKm:', distanceKm);
  console.log('========================');
  
  // Calculate fuel cost based on distance if not provided by backend
  const fuelCost = tripData?.fuelCost || (distanceKm > 0 ? Math.round(distanceKm * 8) : 0); // ₹8 per km
  
  // Calculate toll cost based on distance if not provided by backend  
  const tollCost = tripData?.tollCost || (distanceKm > 0 ? Math.round(distanceKm * 2) : 0); // ₹2 per km
  
  // Use the same corrected distance calculation for all displays
  const finalDistanceKm = distanceKm;
  const finalFuelCost = tripData?.fuelCost || (finalDistanceKm > 0 ? Math.round(finalDistanceKm * 8) : 0);
  const finalTollCost = tripData?.tollCost || (finalDistanceKm > 0 ? Math.round(finalDistanceKm * 2) : 0);
  
  // Debug: Log cost information
  if (tripData) {
    console.log('Cost calculation:', {
      distanceKm,
      fuelCostFromBackend: tripData?.fuelCost,
      tollCostFromBackend: tripData?.tollCost,
      calculatedFuelCost: distanceKm > 0 ? Math.round(distanceKm * 8) : 0,
      calculatedTollCost: distanceKm > 0 ? Math.round(distanceKm * 2) : 0,
      finalFuelCost: fuelCost,
      finalTollCost: tollCost
    });
  }

  // Get selected vehicle data for fare calculation
  const selectedVehicle = vehicleTypes.find(v => v.id === tripDetails.vehicleType);
  
  // Debug vehicle selection
  console.log('=== VEHICLE SELECTION DEBUG ===');
  console.log('vehicleTypes:', vehicleTypes);
  console.log('tripDetails.vehicleType:', tripDetails.vehicleType);
  console.log('selectedVehicle:', selectedVehicle);
  console.log('================================');
  
  // New fare calculation logic using database values
  // Handle additional expenses changes
  const handleAdditionalExpenseChange = (field, value) => {
    setAdditionalExpenses(prev => ({
      ...prev,
      [field]: field.includes('Amount') || !field.includes('Name') ? parseFloat(value) || 0 : value
    }));
  };

  // Direct frontend routing as backup (using multiple routing services)
  const getDirectRoute = async (startCoords, endCoords) => {
    // Try multiple routing services for better reliability
    const routingServices = [
      {
        name: 'OSRM',
        url: `https://router.project-osrm.org/route/v1/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson`
      },
      {
        name: 'MapBox (Demo)',
        url: `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.lng},${startCoords.lat};${endCoords.lng},${endCoords.lat}?overview=full&geometries=geojson&access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`
      }
    ];

    for (const service of routingServices) {
      try {
        console.log(`Attempting ${service.name} routing...`);
        
        const response = await fetch(service.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          console.warn(`${service.name} responded with status:`, response.status);
          continue;
        }
        
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
          console.log(`${service.name} routing success:`, route);
        
        return {
          geometry: route.geometry,
          distance: route.distance,
          duration: route.duration,
          fallback: false,
            message: `Direct frontend routing via ${service.name}`
        };
      }
    } catch (error) {
        console.warn(`${service.name} routing failed:`, error);
      }
    }
    
    // If all routing services fail, create a simple straight-line route for visualization
    console.log('All routing services failed, creating straight-line route for visualization');
    return {
      geometry: {
        type: "LineString",
        coordinates: [
          [startCoords.lng, startCoords.lat],
          [endCoords.lng, endCoords.lat]
        ]
      },
      distance: calculateStraightLineDistance(startCoords, endCoords) * 1000, // Convert to meters
      duration: (calculateStraightLineDistance(startCoords, endCoords) / 60) * 3600, // Assume 60 km/h
      fallback: true,
      message: "Straight-line route (routing services unavailable)"
    };
  };

  // Helper function to calculate straight-line distance
  const calculateStraightLineDistance = (start, end) => {
    const R = 6371; // Earth's radius in km
    const dLat = (end.lat - start.lat) * Math.PI / 180;
    const dLon = (end.lng - start.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start.lat * Math.PI / 180) * Math.cos(end.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calculate total additional expenses
  const calculateAdditionalExpenses = () => {
    const {
      fuelCharges,
      tollCharges,
      parkingCharges,
      interstatePermitCharges,
      greenTaxCharges,
      driverFoodExpenses,
      hotelStayCharges,
      passengerMealCharges,
      sightseeingCharges,
      guideCharges,
      airportPickupCharges,
      luggageHandlingCharges,
      specialZoneCharges,
      emergencyExpenses,
      travelInsuranceCharges,
      documentationCharges,
      miscellaneousCharges,
      customExpense1Amount,
      customExpense2Amount
    } = additionalExpenses;
    
    return fuelCharges + tollCharges + parkingCharges + interstatePermitCharges + 
           greenTaxCharges + driverFoodExpenses + hotelStayCharges + passengerMealCharges +
           sightseeingCharges + guideCharges + airportPickupCharges + luggageHandlingCharges +
           specialZoneCharges + emergencyExpenses + travelInsuranceCharges + documentationCharges +
           miscellaneousCharges + customExpense1Amount + customExpense2Amount;
  };

  const calculateFare = () => {
    console.log('=== CALCULATE FARE DEBUG ===');
    console.log('selectedVehicle:', selectedVehicle);
    console.log('distanceKm:', distanceKm);
    console.log('vehiclePricing:', vehiclePricing);
    console.log('vehicleCharges:', vehicleCharges);
    
    if (!selectedVehicle || !distanceKm || distanceKm <= 0) {
      console.log('Returning zero - no vehicle or distance');
      return {
        baseFare: 0,
        tollCharges: 0,
        nightStayAmt: 0,
        driverStayAmt: 0,
        totalAmount: 0
      };
    }

    // Get pricing data from database
    const pricing = vehiclePricing && vehiclePricing.length > 0 ? vehiclePricing[0] : null;
    const charges = vehicleCharges && vehicleCharges.length > 0 ? vehicleCharges[0] : null;

    if (!pricing) {
      console.log('Using fallback calculation - no pricing data');
      // Fallback calculation when database is not available
      const fallbackRatePerKm = 30;
      const fallbackMinKmPerDay = 100;
      const fallbackExtraKmRate = 30;
      const fallbackDriverAllowance = 500;
      const fallbackNightStayAllowance = 300;
      
      let baseFare;
      if (distanceKm < fallbackMinKmPerDay) {
        baseFare = fallbackMinKmPerDay * fallbackRatePerKm;
        console.log('Fallback Rule 1: distance < minKm, baseFare =', baseFare);
      } else {
        const extraKm = distanceKm - fallbackMinKmPerDay;
        baseFare = (fallbackMinKmPerDay * fallbackRatePerKm) + (extraKm * fallbackExtraKmRate);
        console.log('Fallback Rule 2: distance >= minKm, extraKm =', extraKm, 'baseFare =', baseFare);
      }
      
      const finalDriverAllowance = includeDriverAllowance ? fallbackDriverAllowance : 0;
      
      // Calculate night stay based on number of nights for fallback
      let finalNightStayAllowance = 0;
      if (includeNightStay && fallbackNightStayAllowance > 0) {
        const nights = tripDetails.departureDate && tripDetails.returnDate ? (() => {
          const departureDate = new Date(tripDetails.departureDate);
          const returnDate = new Date(tripDetails.returnDate);
          const timeDifference = returnDate.getTime() - departureDate.getTime();
          const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
          return daysDifference > 1 ? daysDifference - 1 : 0;
        })() : 1;
        finalNightStayAllowance = fallbackNightStayAllowance * Math.max(nights, 1);
      }
      
      const totalAmount = baseFare + finalDriverAllowance + finalNightStayAllowance;
      console.log('Fallback totalAmount =', totalAmount);
      
      return {
        baseFare,
        driverAllowance: fallbackDriverAllowance,
        nightStayAllowance: fallbackNightStayAllowance,
        finalDriverAllowance,
        finalNightStayAllowance,
        totalAmount,
        ratePerKm: fallbackRatePerKm,
        minKmPerDay: fallbackMinKmPerDay,
        extraKmRate: fallbackExtraKmRate,
        extraKm: distanceKm > fallbackMinKmPerDay ? distanceKm - fallbackMinKmPerDay : 0,
        isFallback: true
      };
    }

    const ratePerKm = parseFloat(pricing.ratePerKm) || 0;
    const minKmPerDay = pricing.minKmPerDay || 0;
    const extraKmRate = parseFloat(pricing.extraKmRate) || 0;
    
    let baseFare;
    if (distanceKm < minKmPerDay) {
      // Rule 1: If TotalKm < MinKmPerDay: BaseFare = MinKmPerDay * RatePerKm
      baseFare = minKmPerDay * ratePerKm;
    } else {
      // Rule 2: Else: BaseFare = (MinKmPerDay * RatePerKm) + ((TotalKm - MinKmPerDay) * ExtraKmRate)
      const extraKm = distanceKm - minKmPerDay;
      baseFare = (minKmPerDay * ratePerKm) + (extraKm * extraKmRate);
    }
    
    // Get charges from database
    const driverAllowance = charges ? parseFloat(charges.driverAllowance) || 0 : 0;
    const nightStayAllowance = charges ? parseFloat(charges.nightCharge) || 0 : 0;
    
    // Rule 3: TotalAmount = BaseFare + (optional charges based on checkboxes)
    const finalDriverAllowance = includeDriverAllowance ? driverAllowance : 0;
    
    // Calculate night stay based on number of nights
    let finalNightStayAllowance = 0;
    if (includeNightStay && nightStayAllowance > 0) {
      const nights = tripDetails.departureDate && tripDetails.returnDate ? (() => {
        const departureDate = new Date(tripDetails.departureDate);
        const returnDate = new Date(tripDetails.returnDate);
        const timeDifference = returnDate.getTime() - departureDate.getTime();
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        return daysDifference > 1 ? daysDifference - 1 : 0;
      })() : 1;
      finalNightStayAllowance = nightStayAllowance * Math.max(nights, 1);
    }
    
    const totalAmount = baseFare + finalDriverAllowance + finalNightStayAllowance;
    
    return {
      baseFare,
      driverAllowance,
      nightStayAllowance,
      finalDriverAllowance,
      finalNightStayAllowance,
      totalAmount,
      ratePerKm,
      minKmPerDay,
      extraKmRate,
      extraKm: distanceKm > minKmPerDay ? distanceKm - minKmPerDay : 0
    };
  };

  const fareCalculation = calculateFare();
  const additionalExpensesTotal = calculateAdditionalExpenses();
  const finalTotal = (fareCalculation?.totalAmount || 0) + additionalExpensesTotal;

  // Debug: Log calculation details for testing
  console.log('=== FARE CALCULATION DEBUG ===');
  console.log('Selected Vehicle:', selectedVehicle);
  console.log('Distance Km:', distanceKm);
  console.log('Vehicle Pricing:', vehiclePricing);
  console.log('Vehicle Charges:', vehicleCharges);
  console.log('Vehicle Details Loading:', vehicleDetailsLoading);
  console.log('Vehicle Details Error:', vehicleDetailsError);
  console.log('Fare Calculation Result:', fareCalculation);
  console.log('Final Total:', finalTotal);
  console.log('================================');


  // Download trip details as professional PDF
  const downloadTripDetails = useCallback(async () => {
    if (!tripData || !start || !end) return;

    try {
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Professional Color Scheme - Single Blue Theme
      const primaryBlue = [25, 118, 210]; // Professional blue
      const darkBlue = [13, 71, 161];     // Darker blue for contrast
      const lightBlue = [227, 242, 253];  // Light blue background
      const darkGray = [33, 33, 33];      // Professional dark gray
      const lightGray = [250, 250, 250];  // Light gray background
      const white = [255, 255, 255];      // Pure white

      // Professional Header Section - Clean Design
      pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.rect(0, 0, pageWidth, 50, 'F');
      
      // Company Information - Centered and Clean
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(28);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SAIRAJ TRAVELS', 25, 22);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Your Trusted Travel Partner', 25, 32);
      pdf.text('Phone: +91 98507 48273 | Email: info@sairaj-travels.com', 25, 42);
      
      // Quote Reference - Professional
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.roundedRect(pageWidth - 65, 15, 50, 20, 2, 2, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('QUOTE', pageWidth - 60, 22);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`ST-${Date.now().toString().slice(-6)}`, pageWidth - 60, 30);

      yPosition = 70;

      // Customer Details Section - Professional Style
      pdf.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, 35, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CUSTOMER INFORMATION', 25, yPosition + 7);
      
      // Customer Information
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(10);
      
      const customerInfo = [
        { label: 'Customer Name:', value: tripDetails.customerName || 'Not provided' },
        { label: 'Phone Number:', value: tripDetails.customerPhone || 'Not provided' },
        { label: 'Email Address:', value: tripDetails.customerEmail || 'Not provided' },
        { label: 'Quote Generated:', value: new Date().toLocaleString('en-IN') }
      ];
      
      customerInfo.forEach((info, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, 25, yPosition + 15 + (index * 5));
        pdf.setFont('helvetica', 'normal');
        pdf.text(info.value, 80, yPosition + 15 + (index * 5));
      });

      yPosition += 45;

      // Route Details Section - Professional Style
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, 40, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ROUTE DETAILS', 25, yPosition + 7);
      
      // Route Information
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const routeInfo = [
        { label: 'From:', value: start.label },
        { label: 'To:', value: end.label },
        { label: 'Distance:', value: `${(tripData.distance / 1000).toFixed(1)} km` },
        { label: 'Duration:', value: tripData.duration > 0 ? `${Math.round(tripData.duration / 60)} minutes` : 'N/A' }
      ];
      
      routeInfo.forEach((info, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, 25, yPosition + 15 + (index * 6));
        pdf.setFont('helvetica', 'normal');
        pdf.text(info.value, 50, yPosition + 15 + (index * 6));
      });

      yPosition += 50;

      // Vehicle Details Section (if available) - Professional Style
      if (selectedVehicle) {
        const vehicleSectionHeight = 45;
        pdf.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
        pdf.roundedRect(15, yPosition - 5, pageWidth - 30, vehicleSectionHeight, 2, 2, 'F');
        
        // Section Header
        pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
        pdf.setTextColor(white[0], white[1], white[2]);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('VEHICLE & TRIP DETAILS', 25, yPosition + 7);
        
        // Vehicle Information
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        pdf.setFontSize(10);
        
        const vehicleInfo = [
          { label: 'Vehicle Type:', value: selectedVehicle.name },
          { label: 'Seating Capacity:', value: `${selectedVehicle.capacity} seater` },
          { label: 'Passengers Booked:', value: tripDetails.passengers.toString() },
          { label: 'Trip Type:', value: extras.roundTrip ? 'Round Trip' : 'One Way' },
          { label: 'Rate per KM:', value: fareCalculation?.ratePerKm ? `Rs ${fareCalculation.ratePerKm}/km` : 'N/A' },
          { label: 'Minimum KM/Day:', value: fareCalculation?.minKmPerDay ? `${fareCalculation.minKmPerDay} km` : 'N/A' }
        ];
        
        vehicleInfo.forEach((info, index) => {
          pdf.setFont('helvetica', 'bold');
          pdf.text(info.label, 25, yPosition + 15 + (index * 5));
          pdf.setFont('helvetica', 'normal');
          pdf.text(info.value, 80, yPosition + 15 + (index * 5));
        });

        yPosition += vehicleSectionHeight + 5;
      }

      // Cost Breakdown Section - Complete and Comprehensive
      // Calculate all costs properly
      const baseFare = fareCalculation?.baseFare || 0;
      const driverAllowance = fareCalculation?.finalDriverAllowance || 0;
      const nightStay = fareCalculation?.finalNightStayAllowance || 0;
      const vehicleSubtotal = baseFare + driverAllowance + nightStay;
      
      // Get all additional expenses
      const allAdditionalExpenses = [
        { name: 'Toll Charges', value: additionalExpenses.tollCharges || 0 },
        { name: 'Parking Charges', value: additionalExpenses.parkingCharges || 0 },
        { name: 'Extra Fuel', value: additionalExpenses.fuelCharges || 0 },
        { name: 'Passenger Meals', value: additionalExpenses.passengerMealCharges || 0 },
        { name: 'Hotel Stay', value: additionalExpenses.hotelStayCharges || 0 },
        { name: 'Sightseeing', value: additionalExpenses.sightseeingCharges || 0 },
        { name: 'Guide Charges', value: additionalExpenses.guideCharges || 0 },
        { name: 'Airport Pickup/Drop', value: additionalExpenses.airportPickupCharges || 0 },
        { name: 'Emergency Expenses', value: additionalExpenses.emergencyExpenses || 0 },
        { name: 'Interstate Permit', value: additionalExpenses.interstatePermitCharges || 0 },
        { name: 'Green Tax', value: additionalExpenses.greenTaxCharges || 0 },
        { name: 'Driver Food', value: additionalExpenses.driverFoodExpenses || 0 },
        { name: 'Luggage Handling', value: additionalExpenses.luggageHandlingCharges || 0 },
        { name: 'Special Zone', value: additionalExpenses.specialZoneCharges || 0 },
        { name: 'Travel Insurance', value: additionalExpenses.travelInsuranceCharges || 0 },
        { name: 'Documentation', value: additionalExpenses.documentationCharges || 0 },
        { name: 'Miscellaneous', value: additionalExpenses.miscellaneousCharges || 0 }
      ];
      
      // Add custom expenses if they exist
      if (additionalExpenses.customExpense1Amount > 0 && additionalExpenses.customExpense1Name) {
        allAdditionalExpenses.push({ 
          name: additionalExpenses.customExpense1Name, 
          value: additionalExpenses.customExpense1Amount 
        });
      }
      if (additionalExpenses.customExpense2Amount > 0 && additionalExpenses.customExpense2Name) {
        allAdditionalExpenses.push({ 
          name: additionalExpenses.customExpense2Name, 
          value: additionalExpenses.customExpense2Amount 
        });
      }
      
      const nonZeroExpenses = allAdditionalExpenses.filter(item => item.value > 0);
      
      // Calculate proper section height - more conservative approach
      let costSectionHeight = 80; // Base height
      if (vehicleSubtotal > 0) costSectionHeight += 45; // Vehicle section with padding
      if (nonZeroExpenses.length > 0) {
        costSectionHeight += 35 + (nonZeroExpenses.length * 7) + 20; // Additional expenses with subtotal
      }
      // Grand total will be handled separately with page break if needed
      
      // Check if cost section fits on current page, if not start new page
      if (yPosition + costSectionHeight > pageHeight - 50) {
        pdf.addPage();
        yPosition = 30;
      }
      
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, costSectionHeight, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 12, 1, 1, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DETAILED COST BREAKDOWN', 25, yPosition + 8);
      
      let currentY = yPosition + 25;
      
      // Vehicle Charges Section
      if (vehicleSubtotal > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.text('VEHICLE CHARGES:', 25, currentY);
        currentY += 8;
        
        pdf.setFontSize(11);
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        if (baseFare > 0) {
          pdf.setFont('helvetica', 'normal');
          pdf.text('Base Fare (Distance + Time):', 30, currentY);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Rs ${baseFare.toFixed(2)}`, 155, currentY);
          currentY += 6;
        }
        
        if (driverAllowance > 0) {
          pdf.setFont('helvetica', 'normal');
          pdf.text('Driver Allowance:', 30, currentY);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Rs ${driverAllowance.toFixed(2)}`, 155, currentY);
          currentY += 6;
        }
        
        if (nightStay > 0) {
          pdf.setFont('helvetica', 'normal');
          pdf.text('Night Stay Allowance:', 30, currentY);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Rs ${nightStay.toFixed(2)}`, 155, currentY);
          currentY += 6;
        }
        
        // Vehicle Subtotal with line
        pdf.setDrawColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.setLineWidth(0.8);
        pdf.line(30, currentY + 2, pageWidth - 30, currentY + 2);
        currentY += 6;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.text('Vehicle Subtotal:', 30, currentY);
        pdf.text(`Rs ${vehicleSubtotal.toFixed(2)}`, 155, currentY);
        currentY += 12;
      }
      
      // Additional Expenses Section
      if (nonZeroExpenses.length > 0) {
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.text('ADDITIONAL EXPENSES:', 25, currentY);
        currentY += 10;
        
        pdf.setFontSize(11);
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        
        nonZeroExpenses.forEach((expense) => {
          pdf.setFont('helvetica', 'normal');
          pdf.text(`${expense.name}:`, 30, currentY);
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Rs ${expense.value.toFixed(2)}`, 155, currentY);
          currentY += 7; // Increased spacing
        });
        
        // Additional Expenses Subtotal with line
        currentY += 3; // Extra space before line
        pdf.setDrawColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.setLineWidth(0.8);
        pdf.line(30, currentY, pageWidth - 30, currentY);
        currentY += 8;
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
        pdf.text('Additional Subtotal:', 30, currentY);
        pdf.text(`Rs ${additionalExpensesTotal.toFixed(2)}`, 155, currentY);
        currentY += 15; // More space before Grand Total
      }
      
      // GRAND TOTAL - Most Important Section - ENSURE IT'S ALWAYS VISIBLE
      // Check if we need a new page for Grand Total
      if (currentY + 30 > pageHeight - 50) {
        pdf.addPage();
        currentY = 30;
      }
      
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.roundedRect(20, currentY, pageWidth - 40, 20, 3, 3, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('GRAND TOTAL:', 30, currentY + 12);
      pdf.text(`Rs ${finalTotal.toFixed(2)}`, 120, currentY + 12);
      
      currentY += 30;
      
      // Tax and Additional Information
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'italic');
      pdf.text('* All prices are inclusive of applicable taxes where mentioned', 25, currentY);
      pdf.text('* Toll, parking, and permit charges are extra as per actual usage', 25, currentY + 5);
      pdf.text('* Final amount may vary based on actual distance and additional services', 25, currentY + 10);

      yPosition = currentY + 20;

      // Check if we need a new page for remaining sections
      if (yPosition + 150 > pageHeight - 50) {
        pdf.addPage();
        yPosition = 30;
      }

      // Travel Information Section - Professional Style
      const travelSectionHeight = 60;
      pdf.setFillColor(lightBlue[0], lightBlue[1], lightBlue[2]);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, travelSectionHeight, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TRAVEL INFORMATION', 25, yPosition + 7);
      
      // Travel Information
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(11);
      
      let travelY = yPosition + 20;
      
      const travelInfo = [
        { label: 'Departure Date:', value: tripDetails.departureDate || 'To be confirmed' },
        { label: 'Return Date:', value: tripDetails.returnDate || 'To be confirmed' },
        { label: 'Departure Time:', value: tripDetails.departureTime || 'To be confirmed' },
        { label: 'Pickup Location:', value: tripDetails.pickupLocation || start?.label || 'As per route' },
        { label: 'Drop Location:', value: tripDetails.dropLocation || end?.label || 'As per route' },
        { label: 'Estimated Duration:', value: tripData.duration > 0 ? `${Math.round(tripData.duration / 60)} minutes (${(tripData.duration / 3600).toFixed(1)} hours)` : 'N/A' },
        { label: 'Route Type:', value: tripData.fallback ? 'Approximate Route' : 'Optimized Route' }
      ];
      
      travelInfo.forEach((info, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, 25, travelY + (index * 6));
        pdf.setFont('helvetica', 'normal');
        const maxWidth = pageWidth - 100;
        const lines = pdf.splitTextToSize(info.value, maxWidth);
        pdf.text(lines[0], 85, travelY + (index * 6));
      });

      yPosition += travelSectionHeight + 15;

      // Booking Summary Section - Professional Style
      const bookingSummaryHeight = 45;
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, bookingSummaryHeight, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(darkBlue[0], darkBlue[1], darkBlue[2]);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
      pdf.setTextColor(white[0], white[1], white[2]);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('BOOKING SUMMARY', 25, yPosition + 7);
      
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(11);
      
      let bookingY = yPosition + 20;
      
      const bookingSummaryInfo = [
        { label: 'Quote Generated:', value: new Date().toLocaleString('en-IN') },
        { label: 'Quote Valid Until:', value: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') },
        { label: 'Booking Status:', value: 'Quote/Estimate Only' },
        { label: 'Payment Terms:', value: '50% Advance, 50% on Completion' },
        { label: 'Quote Reference:', value: `ST-${Date.now().toString().slice(-6)}` }
      ];
      
      bookingSummaryInfo.forEach((info, index) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(info.label, 25, bookingY + (index * 5));
        pdf.setFont('helvetica', 'normal');
        pdf.text(info.value, 85, bookingY + (index * 5));
      });

      yPosition += bookingSummaryHeight + 15;

      // Special Requests Section (if any)
      if (tripDetails.specialRequests && tripDetails.specialRequests.trim() !== '') {
        const requestHeight = 30;
        pdf.setFillColor(253, 230, 138);
        pdf.roundedRect(15, yPosition - 5, pageWidth - 30, requestHeight, 2, 2, 'F');
        
        // Section Header
        pdf.setFillColor(217, 119, 6);
        pdf.roundedRect(20, yPosition, pageWidth - 40, 8, 1, 1, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('SPECIAL REQUESTS & NOTES', 25, yPosition + 5.5);
        
        pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Split long text into multiple lines
        const maxWidth = pageWidth - 50;
        const lines = pdf.splitTextToSize(tripDetails.specialRequests, maxWidth);
        lines.forEach((line, index) => {
          pdf.text(line, 25, yPosition + 18 + (index * 5));
        });

        yPosition += requestHeight + 5;
      }

      // Duplicate booking section removed - already handled above

      // Map Screenshot Section
      const mapContainer = document.querySelector('.leaflet-container');
      if (mapContainer) {
        try {
          const canvas = await html2canvas(mapContainer, {
            useCORS: true,
            allowTaint: true,
            scale: 0.8,
            width: mapContainer.offsetWidth,
            height: mapContainer.offsetHeight
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.9);
          const imgWidth = pageWidth - 30;
          const imgHeight = Math.min((canvas.height * imgWidth) / canvas.width, 120);
          
          // Add new page if needed for map
          if (yPosition + imgHeight + 30 > pageHeight - 50) {
            pdf.addPage();
            yPosition = 30;
          }
          
          // Map Section Header
          pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
          pdf.roundedRect(15, yPosition - 5, pageWidth - 30, imgHeight + 25, 2, 2, 'F');
          
          pdf.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
          pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(14);
          pdf.setFont('helvetica', 'bold');
          pdf.text('ROUTE MAP', 25, yPosition + 7);
          
          pdf.addImage(imgData, 'JPEG', 20, yPosition + 15, imgWidth - 10, imgHeight);
          yPosition += imgHeight + 35;
        } catch (error) {
          console.warn('Could not capture map screenshot:', error);
          yPosition += 20;
        }
      }

      // Terms and Conditions Section
      const termsY = Math.max(yPosition, pageHeight - 100);
      if (termsY > pageHeight - 100) {
        pdf.addPage();
        yPosition = 20;
      } else {
        yPosition = termsY;
      }
      
      const termsHeight = 75;
      pdf.setFillColor(254, 242, 242);
      pdf.roundedRect(15, yPosition - 5, pageWidth - 30, termsHeight, 2, 2, 'F');
      
      // Section Header
      pdf.setFillColor(185, 28, 28);
      pdf.roundedRect(20, yPosition, pageWidth - 40, 10, 1, 1, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('TERMS & CONDITIONS', 25, yPosition + 7);
      
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      let currentTermsY = yPosition + 18;
      
      // Important Notice
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(185, 28, 28);
      pdf.text('IMPORTANT NOTICE:', 20, currentTermsY);
      currentTermsY += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      const importantText = 'This quote is generated using free mapping services and is for estimation only.';
      pdf.text(importantText, 20, currentTermsY);
      currentTermsY += 8;
      
      // Terms list with better spacing
      const terms = [
        'Actual distance, route, and travel time may vary significantly from this estimate.',
        'Final charges will be calculated based on actual kilometers traveled and time taken.',
        'Route calculations are approximate - actual route may differ due to road conditions.',
        'Toll charges, parking fees, interstate permits, and fuel surcharges are extra as per actual.',
        'Driver allowance includes food and accommodation for outstation trips.',
        'Cancellation charges apply as per company policy.',
        'Payment terms: 50% advance, balance on completion based on actual usage.',
        'Vehicle is subject to availability at the time of booking confirmation.',
        'Sairaj Travels reserves the right to adjust pricing based on actual trip requirements.'
      ];
      
      terms.forEach((term, index) => {
        // Add bullet point
        pdf.setFont('helvetica', 'bold');
        pdf.text('•', 20, currentTermsY);
        
        // Add term text with proper wrapping
        pdf.setFont('helvetica', 'normal');
        const maxWidth = pageWidth - 50;
        const lines = pdf.splitTextToSize(term, maxWidth);
        
        lines.forEach((line, lineIndex) => {
          pdf.text(line, 25, currentTermsY + (lineIndex * 4));
        });
        
        currentTermsY += (lines.length * 4) + 2;
      });

      // Footer Section
      const footerY = pageHeight - 30;
      pdf.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      pdf.rect(0, footerY, pageWidth, 30, 'F');
      
      // Footer line
      pdf.setDrawColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.setLineWidth(1);
      pdf.line(15, footerY + 5, pageWidth - 15, footerY + 5);
      
      pdf.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      
      const currentDate = new Date().toLocaleString('en-IN');
      pdf.text(`Generated on: ${currentDate}`, 15, footerY + 12);
      pdf.text('Contact: +91 98507 48273', 15, footerY + 18);
      pdf.text('Email: info@sairaj-travels.com', 15, footerY + 24);
      
      pdf.setTextColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text('SAIRAJ TRAVELS', pageWidth - 50, footerY + 18);

      // Save PDF
      const fileName = `Sairaj_Travels_Trip_${start.label.split(',')[0].replace(/\s+/g, '_')}_to_${end.label.split(',')[0].replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  }, [tripData, start, end, selectedVehicle, fareCalculation, additionalExpensesTotal, finalTotal, tripDetails]);

  // Send trip details to Sairaj team via Email
  const sendTripToSairajTeam = useCallback(async () => {
    if (!tripData || !start || !end || !customerDetailsComplete) return;

    try {
      // Create formatted trip summary for email
      const emailSubject = `New Trip Inquiry - ${tripDetails.customerName} (${start.label.split(',')[0]} to ${end.label.split(',')[0]})`;
      
      const emailBody = `SAIRAJ TRAVELS - NEW TRIP INQUIRY

CUSTOMER DETAILS:
Name: ${tripDetails.customerName}
Phone: ${tripDetails.customerPhone}
Email: ${tripDetails.customerEmail}

ROUTE DETAILS:
From: ${start.label}
To: ${end.label}
Distance: ${(tripData.distance / 1000).toFixed(1)} km
Duration: ${tripData.duration > 0 ? `${Math.round(tripData.duration / 60)} minutes` : 'N/A'}
Route Type: ${tripData.fallback ? 'Approximate Route' : 'Optimized Route'}

VEHICLE DETAILS:${selectedVehicle ? `
Vehicle: ${selectedVehicle.name}
Capacity: ${selectedVehicle.capacity} seater
Passengers: ${tripDetails.passengers}` : `
Not selected yet`}

COST BREAKDOWN:${fareCalculation?.baseFare ? `
Base Fare: Rs ${fareCalculation.baseFare.toFixed(2)}` : ''}${fareCalculation?.finalDriverAllowance > 0 ? `
Driver Allowance: Rs ${fareCalculation.finalDriverAllowance.toFixed(2)}` : ''}${fareCalculation?.finalNightStayAllowance > 0 ? `
Night Stay: Rs ${fareCalculation.finalNightStayAllowance.toFixed(2)}` : ''}${additionalExpensesTotal > 0 ? `
Additional Expenses: Rs ${additionalExpensesTotal.toFixed(2)}` : ''}
GRAND TOTAL: Rs ${finalTotal.toFixed(2)}

TRAVEL DATES:
Departure Date: ${tripDetails.departureDate || 'Not specified'}
Return Date: ${tripDetails.returnDate || 'Not specified'}
Departure Time: ${tripDetails.departureTime || 'Not specified'}
Pickup Location: ${tripDetails.pickupLocation || start?.label || 'As per route'}
Drop Location: ${tripDetails.dropLocation || end?.label || 'As per route'}

SPECIAL REQUESTS:
${tripDetails.specialRequests || 'None'}

ADDITIONAL EXPENSES BREAKDOWN:${additionalExpenses.tollCharges > 0 ? `
- Toll Charges: Rs ${additionalExpenses.tollCharges}` : ''}${additionalExpenses.parkingCharges > 0 ? `
- Parking Charges: Rs ${additionalExpenses.parkingCharges}` : ''}${additionalExpenses.fuelCharges > 0 ? `
- Extra Fuel: Rs ${additionalExpenses.fuelCharges}` : ''}${additionalExpenses.passengerMealCharges > 0 ? `
- Passenger Meals: Rs ${additionalExpenses.passengerMealCharges}` : ''}${additionalExpenses.hotelStayCharges > 0 ? `
- Hotel Stay: Rs ${additionalExpenses.hotelStayCharges}` : ''}${additionalExpenses.emergencyExpenses > 0 ? `
- Emergency Expenses: Rs ${additionalExpenses.emergencyExpenses}` : ''}

INQUIRY GENERATED ON: ${new Date().toLocaleString('en-IN')}

Please confirm availability and provide final quote.

Best regards,
Sairaj Travels Website System`;

      // Use EmailJS or mailto approach
      const sairajEmail = emailConfig.sairajEmail;
      
      // Try EmailJS first (if configured), otherwise use mailto
      try {
        // Check if EmailJS is properly configured
        if (emailConfig.publicKey !== 'YOUR_PUBLIC_KEY_HERE' && 
            emailConfig.serviceId !== 'YOUR_SERVICE_ID_HERE' && 
            emailConfig.templateId !== 'YOUR_TEMPLATE_ID_HERE') {
          
          // EmailJS approach - Initialize if not already done
          emailjs.init(emailConfig.publicKey);
          
          const templateParams = {
            to_email: sairajEmail,
            from_name: tripDetails.customerName,
            from_email: tripDetails.customerEmail,
            subject: emailSubject,
            message: emailBody,
            customer_phone: tripDetails.customerPhone,
            route_from: start.label,
            route_to: end.label,
            total_cost: finalTotal.toFixed(2)
          };

          await emailjs.send(emailConfig.serviceId, emailConfig.templateId, templateParams);
          alert('Trip details sent successfully to Sairaj team via email! They will contact you soon.');
        } else {
          throw new Error('EmailJS not configured');
        }
      } catch (emailjsError) {
        // Fallback to mailto
        console.log('EmailJS failed, using mailto fallback:', emailjsError);
        const encodedSubject = encodeURIComponent(emailSubject);
        const encodedBody = encodeURIComponent(emailBody);
        const mailtoURL = `mailto:${sairajEmail}?subject=${encodedSubject}&body=${encodedBody}`;
        
        // Open default email client
        window.location.href = mailtoURL;
        
        // Show success message
        alert('Email client opened with trip details! Please send the email to complete your inquiry to Sairaj team.');
      }
      
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Final fallback - copy to clipboard
      const tripText = `SAIRAJ TRAVELS INQUIRY
Customer: ${tripDetails.customerName}
Phone: ${tripDetails.customerPhone}
Email: ${tripDetails.customerEmail}
Route: ${start.label} to ${end.label}
Total Cost: Rs ${finalTotal.toFixed(2)}
Generated: ${new Date().toLocaleString('en-IN')}`;
      
      try {
        await navigator.clipboard.writeText(tripText);
        alert('Could not send email automatically. Trip details copied to clipboard! Please email them to info@sairaj-travels.com or call +91 98507 48273');
      } catch (clipboardError) {
        alert('Could not send email. Please contact Sairaj team directly at +91 98507 48273 or info@sairaj-travels.com');
      }
    }
  }, [tripData, start, end, selectedVehicle, fareCalculation, additionalExpensesTotal, finalTotal, tripDetails, customerDetailsComplete, additionalExpenses]);

  // Removed saveTrip and loadSavedTrip functions - functionality was incomplete

  // Share trip
  const shareTrip = useCallback(() => {
    if (!tripData || !start || !end) return;
    
    const shareText = `Check out this trip from ${start.label} to ${end.label}!\n\nDistance: ${finalDistanceKm.toFixed(2)} km\nDuration: ${durationHrs.toFixed(2)} hours\nTotal Cost: ₹${finalTotal.toFixed(2)}\n\nBook with Sairaj Travels: +91 9850748273`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Trip Plan - Sairaj Travels',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Trip details copied to clipboard!');
    }
  }, [tripData, start, end, finalTotal]);

  // ✅ Safe routePositions block (prevents blank screen crashes)
  const routePositions = (() => {
    console.log('=== ROUTE POSITIONS DEBUG ===');
    console.log('tripData:', tripData);
    console.log('tripData?.geometry:', tripData?.geometry);
    
    if (!tripData?.geometry) {
      console.log('No geometry in tripData');
      return null;
    }
    if (tripData.geometry.coordinates && Array.isArray(tripData.geometry.coordinates) && tripData.geometry.coordinates.length > 0) {
      const positions = tripData.geometry.coordinates.map((c) => [c[1], c[0]]); // [lat, lng]
      console.log('Route positions calculated:', positions.length, 'points');
      console.log('First position:', positions[0]);
      console.log('Last position:', positions[positions.length - 1]);
      return positions;
    }
    console.log('No valid coordinates in geometry');
    console.log('Coordinates:', tripData.geometry.coordinates);
    return null;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Navigation className="mr-3 text-blue-600" />
                Trip Planner
              </h1>
              <p className="text-gray-600 mt-1 text-sm">Plan your perfect journey with Sairaj Travels</p>
            </div>
            {/* Removed Save Trip buttons - functionality was incomplete */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Modern Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('route')}
                  className={`${
                    activeTab === 'route'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center`}
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Route Details
                </button>
                <button
                  onClick={() => setActiveTab('trip')}
                  className={`${
                    activeTab === 'trip'
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center`}
                >
                  <Car className="mr-2 h-5 w-5" />
                  Trip Details
                </button>
                <button
                  onClick={() => customerDetailsComplete && setActiveTab('fare')}
                  disabled={!customerDetailsComplete}
                  className={`${
                    activeTab === 'fare' && customerDetailsComplete
                      ? 'border-green-500 text-green-600 bg-green-50'
                      : customerDetailsComplete 
                        ? 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        : 'border-transparent text-gray-400 cursor-not-allowed'
                  } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200 flex items-center`}
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Trip Fare & Expenses
                  {finalTotal > 0 && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      ₹{finalTotal.toFixed(0)}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Route Details Tab */}
              {activeTab === 'route' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="mr-2 text-blue-600" />
                    Plan Your Route
                  </h3>
              
                  {/* Customer Details Form - Mandatory */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <h4 className="text-md font-semibold text-yellow-800 mb-3 flex items-center">
                      <Phone className="mr-2 h-5 w-5" />
                      Customer Details (Required)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={tripDetails.customerName}
                          onChange={(e) => setTripDetails(prev => ({...prev, customerName: e.target.value}))}
                          placeholder="Enter your full name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          value={tripDetails.customerPhone}
                          onChange={(e) => setTripDetails(prev => ({...prev, customerPhone: e.target.value}))}
                          placeholder="10-digit mobile number"
                          maxLength="10"
                          pattern="[6-9][0-9]{9}"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          value={tripDetails.customerEmail}
                          onChange={(e) => setTripDetails(prev => ({...prev, customerEmail: e.target.value}))}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    {!customerDetailsComplete && (tripDetails.customerName || tripDetails.customerPhone || tripDetails.customerEmail) && (
                      <div className="mt-3 text-sm text-red-600 flex items-center">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        Please fill all customer details with valid information to proceed
                      </div>
                    )}
                    {customerDetailsComplete && (
                      <div className="mt-3 text-sm text-green-600 flex items-center">
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Customer details verified. You can now plan your route.
                      </div>
                    )}
                  </div>
              
              <div className={`space-y-4 ${!customerDetailsComplete ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Location
                  </label>
                  <AsyncPaginate
                    value={start}
                    loadOptions={loadOptions}
                    onChange={setStart}
                    placeholder="Enter start location"
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.25rem'
                      })
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Location
                  </label>
                  <AsyncPaginate
                    value={end}
                    loadOptions={loadOptions}
                    onChange={setEnd}
                    placeholder="Enter end location"
                    className="text-sm"
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: '1px solid #d1d5db',
                        borderRadius: '0.5rem',
                        padding: '0.25rem'
                      })
                    }}
                  />
                </div>
              </div>

              <button
                onClick={async () => {
                  if (!start || !end) return;
                  setLoading(true);
                  setError(null);
                  try {
                    const directRoute = await getDirectRoute(start.value, end.value);
                    if (directRoute) {
                      setTripData({
                        ...directRoute,
                        message: directRoute.message
                      });
                    } else {
                      setError('Unable to get route. Please check your internet connection.');
                    }
                  } catch (err) {
                    setError('Route test failed. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading || !start || !end}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Route...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Show Map Route
                  </>
                )}
              </button>
                </motion.div>
              )}

              {/* Trip Details Tab */}
              {activeTab === 'trip' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Car className="mr-2 text-blue-600" />
                    Configure Your Trip
                  </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers
                  </label>
                  <select
                    value={tripDetails.passengers}
                    onChange={handlePassengersChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {(() => {
                      const selectedVehicle = vehicleTypes.find(v => v.id === tripDetails.vehicleType);
                      const maxPassengers = selectedVehicle?.capacity || 17;
                      const passengerOptions = Array.from({ length: maxPassengers }, (_, i) => i + 1);
                      
                      return passengerOptions.map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                      ));
                    })()}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Vehicle Type
                    {loadingVehicles && <Loader2 className="ml-2 h-4 w-4 animate-spin text-blue-600" />}
                  </label>
                  <select
                    value={tripDetails.vehicleType}
                    onChange={handleVehicleTypeChange}
                    disabled={loadingVehicles}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    {loadingVehicles ? (
                      <option value="">Loading vehicle types...</option>
                    ) : vehicleTypes.length === 0 ? (
                      <option value="">No vehicles available</option>
                    ) : (
                      vehicleTypes.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.name} {vehicle.capacity ? `(${vehicle.capacity} seater)` : ''}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departure
                    </label>
                    <input
                      type="date"
                      value={tripDetails.departureDate}
                      onChange={handleDepartureDateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return
                    </label>
                    <input
                      type="date"
                      value={tripDetails.returnDate}
                      onChange={handleReturnDateChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Night Stay Auto-Calculation Info */}
                {tripDetails.departureDate && tripDetails.returnDate && (() => {
                  const nights = calculateNightStay();
                  return nights > 0 ? (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center text-sm text-green-800">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <strong>Night Stay Auto-Calculated:</strong> {nights} night{nights > 1 ? 's' : ''} detected. Night stay charges will be automatically included.
                      </div>
                    </div>
                  ) : null;
                })()}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    value={tripDetails.specialRequests}
                    onChange={handleSpecialRequestsChange}
                    placeholder="Any special requirements..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
                </motion.div>
              )}

              {/* Trip Fare & Expenses Tab */}
              {activeTab === 'fare' && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="mr-2 text-green-600" />
                    Trip Fare & Additional Expenses
                  </h3>
              
              <div className="space-y-4">
                {/* Show error message if vehicle details not available */}
                {vehicleDetailsError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800">Vehicle Details Not Available</h3>
                        <p className="text-sm text-red-600 mt-1">{vehicleDetailsError}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show loading state */}
                {vehicleDetailsLoading && (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Loading vehicle details...</p>
                  </div>
                )}

                {/* Show only Total Amount as per requirements */}
                {!vehicleDetailsLoading && !vehicleDetailsError && (
                  <div className="text-center bg-green-50 rounded-lg p-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      ₹{finalTotal.toFixed(2)}
                    </div>
                    <div className="text-gray-600 text-lg">
                      Total Amount
                    </div>
                    {selectedVehicle && distanceKm > 0 && (
                      <div className="mt-3 text-sm text-gray-500">
                        {selectedVehicle.name} • {distanceKm.toFixed(1)} km
                      </div>
                    )}
                    {fareCalculation?.ratePerKm && (
                      <div className="mt-2 text-xs text-gray-400">
                        Rate: ₹{fareCalculation.ratePerKm}/km • Min: {fareCalculation.minKmPerDay}km
                        {fareCalculation.extraKmRate > 0 && (
                          <span> • Extra Km: ₹{fareCalculation.extraKmRate}/km</span>
                        )}
                        {fareCalculation.extraKm > 0 && (
                          <span> • Extra: {fareCalculation.extraKm}km</span>
                        )}
                        {fareCalculation.isFallback && (
                          <span className="text-orange-500"> • Using fallback rates</span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Charges Checkboxes */}
                {!vehicleDetailsLoading && !vehicleDetailsError && (fareCalculation?.driverAllowance > 0 || fareCalculation?.nightStayAllowance > 0) && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-3">Optional Charges</h4>
                    <div className="space-y-2">
                      {fareCalculation?.driverAllowance > 0 && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeDriverAllowance}
                            onChange={(e) => setIncludeDriverAllowance(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Driver Allowance: ₹{fareCalculation.driverAllowance.toFixed(2)}
                          </span>
                        </label>
                      )}
                      {fareCalculation?.nightStayAllowance > 0 && (
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeNightStay}
                            onChange={(e) => setIncludeNightStay(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">
                            Night Stay: ₹{(() => {
                              const nights = calculateNightStay();
                              const totalNightStay = fareCalculation.nightStayAllowance * Math.max(nights, 1);
                              return totalNightStay.toFixed(2);
                            })()}
                            {(() => {
                              const nights = calculateNightStay();
                              return nights > 0 ? ` (₹${fareCalculation.nightStayAllowance}/night × ${nights} night${nights > 1 ? 's' : ''} - Auto-calculated)` : '';
                            })()}
                          </span>
                        </label>
                      )}
                    </div>
                  </div>
                )}

                {/* Additional Expenses Section - Organized in Expandable Cards */}
                {!vehicleDetailsLoading && !vehicleDetailsError && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <DollarSign className="mr-2 h-5 w-5 text-yellow-600" />
                    Additional Travel Expenses
                  </h4>
                  
                  {/* Quick Add Common Expenses */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <label className="block text-xs font-medium text-blue-800 mb-1">Toll Charges (₹)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.tollCharges}
                          onChange={(e) => handleAdditionalExpenseChange('tollCharges', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                          placeholder="0"
                        />
                    <button
                      onClick={() => handleAdditionalExpenseChange('tollCharges', 400)}
                          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                    >
                          +400
                    </button>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <label className="block text-xs font-medium text-green-800 mb-1">Parking (₹)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="20"
                          value={additionalExpenses.parkingCharges}
                          onChange={(e) => handleAdditionalExpenseChange('parkingCharges', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-green-300 rounded focus:outline-none focus:ring-1 focus:ring-green-500"
                          placeholder="0"
                        />
                    <button
                      onClick={() => handleAdditionalExpenseChange('parkingCharges', 200)}
                          className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                    >
                          +200
                    </button>
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <label className="block text-xs font-medium text-purple-800 mb-1">Meals (₹)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.passengerMealCharges}
                          onChange={(e) => handleAdditionalExpenseChange('passengerMealCharges', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                          placeholder="0"
                        />
                    <button
                      onClick={() => handleAdditionalExpenseChange('passengerMealCharges', 800)}
                          className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                    >
                          +800
                    </button>
                      </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <label className="block text-xs font-medium text-red-800 mb-1">Emergency (₹)</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.emergencyExpenses}
                          onChange={(e) => handleAdditionalExpenseChange('emergencyExpenses', e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-red-300 rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                          placeholder="0"
                        />
                    <button
                      onClick={() => handleAdditionalExpenseChange('emergencyExpenses', 500)}
                          className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                    >
                          +500
                    </button>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Transport Expenses */}
                  <details 
                    className="bg-blue-50 rounded-lg border border-blue-200"
                    open={additionalExpenses.fuelCharges > 0 || additionalExpenses.tollCharges > 0 || additionalExpenses.parkingCharges > 0 || additionalExpenses.interstatePermitCharges > 0 || additionalExpenses.greenTaxCharges > 0 || additionalExpenses.driverFoodExpenses > 0}
                  >
                    <summary className="cursor-pointer p-4 font-medium text-blue-800 hover:bg-blue-100 rounded-lg transition-colors flex items-center">
                      <span className="mr-2">🚗</span>
                      Vehicle & Transport Expenses
                      <span className="ml-auto text-sm">Click to expand</span>
                    </summary>
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Extra Fuel/Diesel/Petrol (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.fuelCharges}
                          onChange={(e) => handleAdditionalExpenseChange('fuelCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Toll Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.tollCharges}
                          onChange={(e) => handleAdditionalExpenseChange('tollCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Parking Fees (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="20"
                          value={additionalExpenses.parkingCharges}
                          onChange={(e) => handleAdditionalExpenseChange('parkingCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Interstate Permit Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.interstatePermitCharges}
                          onChange={(e) => handleAdditionalExpenseChange('interstatePermitCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Green Tax / Entry Tax (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.greenTaxCharges}
                          onChange={(e) => handleAdditionalExpenseChange('greenTaxCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Airport Pickup/Drop Fees (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.airportPickupCharges}
                          onChange={(e) => handleAdditionalExpenseChange('airportPickupCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Accommodation & Meals */}
                  <details 
                    className="bg-green-50 rounded-lg border border-green-200"
                    open={additionalExpenses.hotelStayCharges > 0 || additionalExpenses.passengerMealCharges > 0}
                  >
                    <summary className="cursor-pointer p-4 font-medium text-green-800 hover:bg-green-100 rounded-lg transition-colors flex items-center">
                      <span className="mr-2">🏨</span>
                      Accommodation & Meals
                      <span className="ml-auto text-sm">Click to expand</span>
                    </summary>
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Hotel Stay Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="500"
                          value={additionalExpenses.hotelStayCharges}
                          onChange={(e) => handleAdditionalExpenseChange('hotelStayCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Passenger Meal Expenses (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.passengerMealCharges}
                          onChange={(e) => handleAdditionalExpenseChange('passengerMealCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Driver Food Expenses (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.driverFoodExpenses}
                          onChange={(e) => handleAdditionalExpenseChange('driverFoodExpenses', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Activities & Services */}
                  <details 
                    className="bg-purple-50 rounded-lg border border-purple-200"
                    open={additionalExpenses.sightseeingCharges > 0 || additionalExpenses.guideCharges > 0 || additionalExpenses.airportPickupCharges > 0 || additionalExpenses.luggageHandlingCharges > 0}
                  >
                    <summary className="cursor-pointer p-4 font-medium text-purple-800 hover:bg-purple-100 rounded-lg transition-colors flex items-center">
                      <span className="mr-2">🎯</span>
                      Activities & Services
                      <span className="ml-auto text-sm">Click to expand</span>
                    </summary>
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Sightseeing / Entry Tickets (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.sightseeingCharges}
                          onChange={(e) => handleAdditionalExpenseChange('sightseeingCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Guide Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="200"
                          value={additionalExpenses.guideCharges}
                          onChange={(e) => handleAdditionalExpenseChange('guideCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Luggage Handling / Porter (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.luggageHandlingCharges}
                          onChange={(e) => handleAdditionalExpenseChange('luggageHandlingCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Emergency & Miscellaneous */}
                  <details 
                    className="bg-red-50 rounded-lg border border-red-200"
                    open={additionalExpenses.specialZoneCharges > 0 || additionalExpenses.emergencyExpenses > 0 || additionalExpenses.travelInsuranceCharges > 0 || additionalExpenses.documentationCharges > 0 || additionalExpenses.miscellaneousCharges > 0}
                  >
                    <summary className="cursor-pointer p-4 font-medium text-red-800 hover:bg-red-100 rounded-lg transition-colors flex items-center">
                      <span className="mr-2">🚨</span>
                      Emergency & Miscellaneous
                      <span className="ml-auto text-sm">Click to expand</span>
                    </summary>
                    <div className="p-4 pt-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Special Zone Charges (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="200"
                          value={additionalExpenses.specialZoneCharges}
                          onChange={(e) => handleAdditionalExpenseChange('specialZoneCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Hill stations, wildlife sanctuaries"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Emergency Expenses (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="100"
                          value={additionalExpenses.emergencyExpenses}
                          onChange={(e) => handleAdditionalExpenseChange('emergencyExpenses', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Breakdown, medical, tyre puncture"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Miscellaneous (₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.miscellaneousCharges}
                          onChange={(e) => handleAdditionalExpenseChange('miscellaneousCharges', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </details>

                  {/* Custom Expenses */}
                  <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    <h5 className="font-medium text-gray-800 mb-3 flex items-center">
                      <span className="mr-2">✏️</span>
                      Custom Expenses
                    </h5>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={additionalExpenses.customExpense1Name}
                          onChange={(e) => handleAdditionalExpenseChange('customExpense1Name', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Shopping, Tips"
                        />
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.customExpense1Amount}
                          onChange={(e) => handleAdditionalExpenseChange('customExpense1Amount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount (₹)"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={additionalExpenses.customExpense2Name}
                          onChange={(e) => handleAdditionalExpenseChange('customExpense2Name', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Emergency Fund"
                        />
                        <input
                          type="number"
                          min="0"
                          step="50"
                          value={additionalExpenses.customExpense2Amount}
                          onChange={(e) => handleAdditionalExpenseChange('customExpense2Amount', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Amount (₹)"
                        />
                      </div>
                    </div>
                  </div>
                  </div>
                )}

                {/* Additional Expenses Summary */}
                {additionalExpensesTotal > 0 && (
                  <div className="mt-4 p-4 bg-yellow-100 rounded-lg border border-yellow-300">
                    <div className="flex justify-between items-center text-lg font-semibold text-yellow-800">
                      <span>Total Additional Expenses:</span>
                      <span>₹{additionalExpensesTotal.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {/* Show calculation breakdown if available */}
                {fareCalculation?.baseFare > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Complete Cost Breakdown</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <div>Base Fare: ₹{fareCalculation.baseFare.toFixed(2)}</div>
                      {fareCalculation.finalDriverAllowance > 0 && (
                        <div>Driver Allowance: ₹{fareCalculation.finalDriverAllowance.toFixed(2)} ✓</div>
                      )}
                      {fareCalculation.finalNightStayAllowance > 0 && (
                        <div>Night Stay: ₹{fareCalculation.finalNightStayAllowance.toFixed(2)} ✓</div>
                      )}
                      <div className="border-t border-gray-300 pt-1 mt-2">
                        <div className="font-medium text-gray-700">Vehicle Total: ₹{fareCalculation.totalAmount.toFixed(2)}</div>
                      </div>
                      {additionalExpensesTotal > 0 && (
                        <>
                          <div className="text-gray-500 mt-2 mb-1">Additional Expenses:</div>
                          {additionalExpenses.fuelCharges > 0 && (
                            <div>• Extra Fuel: ₹{additionalExpenses.fuelCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.tollCharges > 0 && (
                            <div>• Toll: ₹{additionalExpenses.tollCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.parkingCharges > 0 && (
                            <div>• Parking: ₹{additionalExpenses.parkingCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.interstatePermitCharges > 0 && (
                            <div>• Interstate Permit: ₹{additionalExpenses.interstatePermitCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.greenTaxCharges > 0 && (
                            <div>• Green Tax: ₹{additionalExpenses.greenTaxCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.driverFoodExpenses > 0 && (
                            <div>• Driver Food: ₹{additionalExpenses.driverFoodExpenses.toFixed(2)}</div>
                          )}
                          {additionalExpenses.hotelStayCharges > 0 && (
                            <div>• Hotel Stay: ₹{additionalExpenses.hotelStayCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.passengerMealCharges > 0 && (
                            <div>• Passenger Meals: ₹{additionalExpenses.passengerMealCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.sightseeingCharges > 0 && (
                            <div>• Sightseeing: ₹{additionalExpenses.sightseeingCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.guideCharges > 0 && (
                            <div>• Guide: ₹{additionalExpenses.guideCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.airportPickupCharges > 0 && (
                            <div>• Airport Pickup/Drop: ₹{additionalExpenses.airportPickupCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.luggageHandlingCharges > 0 && (
                            <div>• Luggage Handling: ₹{additionalExpenses.luggageHandlingCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.specialZoneCharges > 0 && (
                            <div>• Special Zone: ₹{additionalExpenses.specialZoneCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.emergencyExpenses > 0 && (
                            <div>• Emergency: ₹{additionalExpenses.emergencyExpenses.toFixed(2)}</div>
                          )}
                          {additionalExpenses.travelInsuranceCharges > 0 && (
                            <div>• Travel Insurance: ₹{additionalExpenses.travelInsuranceCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.documentationCharges > 0 && (
                            <div>• Documentation: ₹{additionalExpenses.documentationCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.miscellaneousCharges > 0 && (
                            <div>• Miscellaneous: ₹{additionalExpenses.miscellaneousCharges.toFixed(2)}</div>
                          )}
                          {additionalExpenses.customExpense1Amount > 0 && additionalExpenses.customExpense1Name && (
                            <div>• {additionalExpenses.customExpense1Name}: ₹{additionalExpenses.customExpense1Amount.toFixed(2)}</div>
                          )}
                          {additionalExpenses.customExpense2Amount > 0 && additionalExpenses.customExpense2Name && (
                            <div>• {additionalExpenses.customExpense2Name}: ₹{additionalExpenses.customExpense2Amount.toFixed(2)}</div>
                          )}
                          <div className="border-t border-gray-300 pt-1 mt-2">
                            <div className="font-medium text-gray-700">Additional Total: ₹{additionalExpensesTotal.toFixed(2)}</div>
                          </div>
                        </>
                      )}
                      <div className="border-t-2 border-gray-400 pt-2 mt-2">
                        <div className="font-bold text-gray-800 text-sm">Grand Total: ₹{finalTotal.toFixed(2)}</div>
                      </div>
                      
                      {/* Download Cost Breakdown Button */}
                      {(start && end) && (
                        <div className="mt-4 pt-3 border-t border-gray-200">
                          <button
                            onClick={downloadTripDetails}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center mb-2"
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF Report
                          </button>
                          <button
                            onClick={sendTripToSairajTeam}
                            disabled={!customerDetailsComplete}
                            className={`w-full ${customerDetailsComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center`}
                          >
                            <Phone className="mr-2 h-4 w-4" />
                            Send to Sairaj Team
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
                </motion.div>
              )}

              {/* Share, Download and Book Buttons */}
              {tripData && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={shareTrip}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </button>
                  <button
                    onClick={downloadTripDetails}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={sendTripToSairajTeam}
                    disabled={!customerDetailsComplete}
                    className={`flex-1 ${customerDetailsComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center`}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Send to Sairaj Team
                  </button>
                  <button
                    onClick={() => window.open('https://wa.me/919850748273?text=Hi, I want to book this trip', '_blank')}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Trip Results and Status */}
          <div className="space-y-6">
            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4"
                >
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show Map Route Button */}
            {!tripData && start && end && (
              <div className="flex justify-center mb-6">
                <button
                  onClick={async () => {
                    if (!start || !end || !customerDetailsComplete) return;
                    setLoading(true);
                    setError(null);
                    try {
                      const directRoute = await getDirectRoute(start.value, end.value);
                      if (directRoute) {
                        setTripData({
                          ...directRoute,
                          message: directRoute.message
                        });
                      } else {
                        setError('Unable to get route. Please check your internet connection.');
                      }
                    } catch (err) {
                      setError('Route test failed. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading || !customerDetailsComplete}
                  className={`${customerDetailsComplete ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'} disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center shadow-lg`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading Route...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      Show Map Route
                    </>
                  )}
                </button>
                {!customerDetailsComplete && (
                  <div className="text-center mt-2 text-sm text-red-600 flex items-center justify-center">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Complete customer details to show route
                  </div>
                )}
              </div>
            )}

            {/* Map Display */}
            {tripData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="bg-gray-50 px-4 py-3 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="mr-2 text-blue-600" />
                      Route Map
                    </h3>
                    {tripData.message && (
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tripData.fallback 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {tripData.message}
                      </span>
                    )}
                  </div>
                  {start && end && (
                    <div className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">{start.label}</span> → <span className="font-medium">{end.label}</span>
                    </div>
                  )}
                </div>
                <div className="h-96 lg:h-[600px] relative">
                  <MapContainer
                    center={routePositions && routePositions.length > 0 
                      ? [routePositions[Math.floor(routePositions.length / 2)][0], routePositions[Math.floor(routePositions.length / 2)][1]]
                      : [20.5937, 78.9629]
                    }
                    zoom={routePositions && routePositions.length > 0 ? 8 : 5}
                    style={{ height: "100%", width: "100%" }}
                    className="rounded-b-xl"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />

                    {routePositions && routePositions.length > 0 && (
                      <>
                        <Polyline 
                          positions={routePositions} 
                          color={tripData.fallback ? "#ef4444" : "#3b82f6"} 
                          weight={5}
                          opacity={0.8}
                        />
                        <Marker position={routePositions[0]}>
                          <Tooltip permanent direction="top" offset={[0, -10]}>
                            <div className="text-xs font-medium">
                              Start: {start?.label?.split(',')[0] || 'Origin'}
                            </div>
                          </Tooltip>
                        </Marker>
                        <Marker position={routePositions[routePositions.length - 1]}>
                          <Tooltip permanent direction="top" offset={[0, -10]}>
                            <div className="text-xs font-medium">
                              End: {end?.label?.split(',')[0] || 'Destination'}
                            </div>
                          </Tooltip>
                        </Marker>
                        <FitBounds route={routePositions} />
                      </>
                    )}
                    {(!routePositions || routePositions.length === 0) && (
                      <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-800 px-3 py-2 rounded z-[1000]">
                        <div className="font-medium">Unable to display route</div>
                        <div className="text-xs mt-1">Route data is not available. Please try again.</div>
                      </div>
                    )}
                  </MapContainer>
                  
                  {/* Route Info Overlay */}
                  {routePositions && routePositions.length > 0 && (
                    <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${tripData.fallback ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                          <span className="font-medium">
                            {tripData.fallback ? 'Approximate Route' : 'Actual Route'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Distance: {(tripData.distance / 1000).toFixed(1)} km
                        </div>
                        {tripData.duration > 0 && (
                          <div className="text-xs text-gray-600">
                            Duration: {Math.round(tripData.duration / 60)} mins
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
