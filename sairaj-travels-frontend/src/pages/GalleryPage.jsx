import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Search, 
  Filter, 
  Download, 
  Share2, 
  Heart,
  Eye,
  MapPin,
  Calendar,
  Users,
  Star,
  Camera,
  Video
} from "lucide-react";
import { apiMethods } from '../services/api';

const categories = [
  { name: "All", icon: "📸", count: 0 },
  { name: "Fleet", icon: "🚗", count: 0 },
  { name: "Luxury", icon: "✨", count: 0 },
  { name: "Destinations", icon: "🗺️", count: 0 },
  { name: "Happy Customers", icon: "😊", count: 0 },
  { name: "Interiors", icon: "🛋️", count: 0 },
  { name: "Drivers", icon: "👨‍✈️", count: 0 }
];

// Real images from the project
const images = [
  // Fleet Images
  { id: 1, src: "/benzbus1.jpg", category: "Fleet", caption: "Mercedes Benz Luxury Bus", description: "Premium comfort and safety for your journey", featured: true },
  { id: 2, src: "/ertiga.avif", category: "Fleet", caption: "Maruti Suzuki Ertiga", description: "Spacious and fuel-efficient family vehicle" },
  { id: 3, src: "/innova1.avif", category: "Fleet", caption: "Toyota Innova", description: "Reliable and comfortable for group travel" },
  { id: 4, src: "/Kia_carnival.avif", category: "Fleet", caption: "Kia Carnival", description: "Luxury MPV with premium features" },
  { id: 5, src: "/urbania1.avif", category: "Fleet", caption: "Force Urbania", description: "Perfect for large group transportation" },
  
  // Luxury Images
  { id: 6, src: "/ecitaro-teaser-propulsion-02.jpg", category: "Luxury", caption: "Mercedes eCitaro Electric Bus", description: "Eco-friendly luxury travel experience", featured: true },
  { id: 7, src: "/Mercedes-Van-Interior.jpg", category: "Luxury", caption: "Mercedes Van Interior", description: "Premium interior with modern amenities" },
  
  // Interior Images
  { id: 8, src: "/urbania_del_1.jpg", category: "Interiors", caption: "Urbania Deluxe Interior", description: "Comfortable seating with modern design" },
  { id: 9, src: "/urbania_del_2.jpg", category: "Interiors", caption: "Spacious Interior View", description: "Ample legroom and storage space" },
  { id: 10, src: "/urbania_del_3.jpg", category: "Interiors", caption: "Premium Seating", description: "Ergonomic design for long journeys" },
  
  // Driver Images
  { id: 11, src: "/driver_1.jpg", category: "Drivers", caption: "Professional Driver", description: "Experienced and skilled driver team" },
  { id: 12, src: "/driver_2.jpg", category: "Drivers", caption: "Expert Driver", description: "Well-trained and courteous staff" },
  
  // Service Images
  { id: 13, src: "/serv_airport_trans.avif", category: "Destinations", caption: "Airport Transfer Service", description: "Reliable airport pickup and drop service" },
  { id: 14, src: "/serv_bus.jpg", category: "Fleet", caption: "Bus Transportation", description: "Comfortable bus services for all occasions" },
  { id: 15, src: "/Serv_corp.avif", category: "Happy Customers", caption: "Corporate Travel", description: "Professional corporate transportation" },
  { id: 16, src: "/Serv_driver.avif", category: "Drivers", caption: "Professional Driver Service", description: "Experienced drivers for all your needs" },
  { id: 17, src: "/Serv_family.avif", category: "Happy Customers", caption: "Family Travel", description: "Safe and comfortable family journeys" },
  { id: 18, src: "/serv_pilgrimage.avif", category: "Destinations", caption: "Pilgrimage Tours", description: "Sacred journey transportation" },
  { id: 19, src: "/Serv_rent_car.avif", category: "Fleet", caption: "Car Rental Service", description: "Flexible car rental options" },
  
  // Gallery Images
  { id: 20, src: "/gallery02-646x405.jpg", category: "Destinations", caption: "Beautiful Journey", description: "Scenic routes and memorable destinations" },
  { id: 21, src: "/design-feature-large01.jpg", category: "Luxury", caption: "Premium Design Features", description: "Modern design and comfort" },
  { id: 22, src: "/design-feature-large02.jpg", category: "Luxury", caption: "Advanced Features", description: "Cutting-edge technology and comfort" },
  { id: 23, src: "/unmatched-safety-banner1600x1000.jpg", category: "Fleet", caption: "Safety First", description: "Unmatched safety standards", featured: true },
  { id: 24, src: "/unrivaled-performance-banner1600x1000.jpg", category: "Fleet", caption: "Performance Excellence", description: "Unrivaled performance and reliability" },
  
  // Additional Images
  { id: 25, src: "/available_cars.jpg", category: "Fleet", caption: "Available Fleet", description: "Wide range of vehicles for every need" },
  { id: 26, src: "/Available_Rental_Vehicles.jpg", category: "Fleet", caption: "Rental Vehicles", description: "Flexible rental options available" },
  { id: 27, src: "/select_car.jpg", category: "Fleet", caption: "Vehicle Selection", description: "Choose the perfect vehicle for your journey" },
  { id: 28, src: "/our_services.jpg", category: "Happy Customers", caption: "Our Services", description: "Comprehensive travel solutions" },
  { id: 29, src: "/coachbusdriver.jpg", category: "Drivers", caption: "Professional Coach Driver", description: "Experienced coach drivers" },
  { id: 30, src: "/driver_skill.jpg", category: "Drivers", caption: "Driver Expertise", description: "Skilled and professional drivers" },
];

// Updated Videos with better titles and descriptions
const videos = [
  { 
    id: 1, 
    url: "https://www.youtube.com/embed/Scxs7L0vhZ4", 
    title: "Luxury Bus Tour Experience", 
    description: "Experience the comfort and luxury of our premium bus services",
    thumbnail: "/benzbus1.jpg"
  },
  { 
    id: 2, 
    url: "https://www.youtube.com/embed/tgbNymZ7vqY", 
    title: "Happy Customers Journey", 
    description: "See what our satisfied customers have to say about their travel experience",
    thumbnail: "/Serv_family.avif"
  },
  { 
    id: 3, 
    url: "https://player.vimeo.com/video/76979871", 
    title: "Mountain Adventure Ride", 
    description: "Adventure awaits with our reliable mountain transportation services",
    thumbnail: "/gallery02-646x405.jpg"
  },
  { 
    id: 4, 
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ", 
    title: "Corporate Travel Solutions", 
    description: "Professional transportation for your business needs",
    thumbnail: "/Serv_corp.avif"
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visibleCount, setVisibleCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // grid, masonry
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Dynamic data state
  const [galleryData, setGalleryData] = useState([]);
  const [galleryStats, setGalleryStats] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Load gallery data from API
  const loadGalleryData = async () => {
    try {
      setDataLoading(true);
      const [galleryResponse, statsResponse] = await Promise.all([
        apiMethods.get('/gallery/active'),
        apiMethods.get('/gallery/stats')
      ]);
      
      setGalleryData(galleryResponse.data || []);
      setGalleryStats(statsResponse.data);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      // Fallback to hardcoded data if API fails
      setGalleryData(images);
      setGalleryStats({
        totalItems: images.length,
        fleetCount: images.filter(img => img.category === 'Fleet').length,
        luxuryCount: images.filter(img => img.category === 'Luxury').length,
        destinationsCount: images.filter(img => img.category === 'Destinations').length,
        happyCustomersCount: images.filter(img => img.category === 'Happy Customers').length,
        interiorsCount: images.filter(img => img.category === 'Interiors').length,
        driversCount: images.filter(img => img.category === 'Drivers').length
      });
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadGalleryData();
  }, []);

  // Calculate category counts from dynamic data (only images, not videos)
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: cat.name === "All" 
      ? galleryData.filter(item => item.imagePath && item.imagePath.trim() !== '').length
      : galleryData.filter(item => item.category === cat.name && item.imagePath && item.imagePath.trim() !== '').length
  }));

  const filteredImages = galleryData.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    // Only show items that have images (not videos) in the main gallery
    const hasImage = item.imagePath && item.imagePath.trim() !== '';
    return matchesCategory && matchesSearch && hasImage;
  });

  // Sort images
  const sortedImages = [...filteredImages].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return a.sortOrder - b.sortOrder;
    }
  });

  const visibleImages = sortedImages.slice(0, visibleCount);

  // Infinite Scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
      ) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) =>
            prev + 12 <= sortedImages.length ? prev + 12 : prev
          );
          setIsLoading(false);
        }, 500);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sortedImages]);

  // Toggle favorite
  const toggleFavorite = (imageId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      return newFavorites;
    });
  };

  const nextImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev + 1) % sortedImages.length));
  }, [sortedImages.length]);

  const prevImage = useCallback(() => {
    setSelectedIndex((prev) => (prev === null ? 0 : (prev - 1 + sortedImages.length) % sortedImages.length));
  }, [sortedImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        nextImage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevImage();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, nextImage, prevImage]);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Consistent with App theme */}
      <div className="relative h-96 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
        
        <div className="relative z-10 flex items-center justify-center h-full text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-2xl">
              Our Journey Gallery
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-6 drop-shadow-lg">
              Discover our fleet, destinations & memorable journeys
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <Camera className="inline w-4 h-4 mr-2" />
                {images.length} Photos
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <Video className="inline w-4 h-4 mr-2" />
                {videos.length} Videos
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
                <Users className="inline w-4 h-4 mr-2" />
                Happy Customers
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search photos and videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
              </select>
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "masonry" : "grid")}
                className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                {viewMode === "grid" ? "Masonry" : "Grid"}
              </button>
            </div>
          </div>

          {/* Enhanced Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categoriesWithCounts.map((cat) => (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                key={cat.name}
                onClick={() => {
                  setActiveCategory(cat.name);
                  setVisibleCount(12);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-md transition-all duration-300 ${
                  activeCategory === cat.name
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-blue-50 hover:shadow-lg"
                }`}
              >
                <span className="text-lg">{cat.icon}</span>
                <span className="font-medium">{cat.name}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeCategory === cat.name 
                    ? "bg-white/20" 
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {cat.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {visibleImages.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-600 mb-2">No images found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <motion.div 
            layout
            className={`grid gap-6 ${
              viewMode === "masonry" 
                ? "columns-1 md:columns-2 lg:columns-3 xl:columns-4" 
                : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
            }`}
          >
            {visibleImages.map((img, idx) => (
              <motion.div
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative rounded-2xl overflow-hidden shadow-lg cursor-pointer group ${
                  viewMode === "masonry" ? "break-inside-avoid mb-6" : ""
                }`}
                onClick={() => setSelectedIndex(idx)}
              >
                <div className="relative">
                  {img.imagePath ? (
                    <img
                      src={img.imagePath.startsWith('http') ? img.imagePath : `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${img.imagePath}`}
                      alt={img.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = '/images/placeholder1.svg';
                      }}
                    />
                  ) : img.videoUrl ? (
                    <div className="w-full h-64 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 hover:bg-red-700 transition-colors cursor-pointer">
                          <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                        <p className="text-white font-semibold mb-1">{img.title}</p>
                        <p className="text-gray-300 text-sm">Click to watch</p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">No Media</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Featured Badge */}
                  {img.isFeatured && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(img.id);
                    }}
                    className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        favorites.has(img.id) ? "fill-red-500 text-red-500" : ""
                      }`} 
                    />
                  </button>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                    <div className="text-white">
                      <h3 className="text-lg font-semibold mb-1">{img.title}</h3>
                      <p className="text-sm text-gray-200 mb-2">{img.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="bg-white/20 px-2 py-1 rounded-full">{img.category}</span>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <div className="flex items-center gap-2 text-blue-600">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading more images...</span>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {visibleCount < sortedImages.length && !isLoading && (
          <div className="text-center py-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount((prev) => prev + 12)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
            >
              Load More Images
            </motion.button>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-6xl max-h-[90vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                aria-label="Previous"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all"
                aria-label="Next"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <img
                src={sortedImages[selectedIndex].src}
                alt={sortedImages[selectedIndex].caption}
                className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-2xl">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">{sortedImages[selectedIndex].caption}</h3>
                  <p className="text-gray-200 mb-3">{sortedImages[selectedIndex].description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">{sortedImages[selectedIndex].category}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {selectedIndex + 1} of {sortedImages.length}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Video Gallery Section */}
      <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Travel Moments in Motion
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto">
              Experience our services through these captivating videos showcasing our fleet, destinations, and happy customers
            </p>
          </motion.div>

          {dataLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-blue-200">Loading videos...</p>
            </div>
          ) : galleryData.filter(item => item.videoUrl).length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No videos available</h3>
              <p className="text-blue-200">Check back later for exciting video content!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {galleryData.filter(item => item.videoUrl).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
                  <div className="aspect-w-16 aspect-h-9">
                    {video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={video.videoUrl.includes('youtu.be') 
                          ? `https://www.youtube.com/embed/${video.videoUrl.split('youtu.be/')[1].split('?')[0]}`
                          : video.videoUrl.includes('watch?v=') 
                            ? `https://www.youtube.com/embed/${video.videoUrl.split('watch?v=')[1].split('&')[0]}`
                            : video.videoUrl
                        }
                        title={video.title}
                        className="w-full h-80"
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-80 bg-gray-800 flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-white mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          <p className="text-white text-lg font-semibold mb-2">{video.title}</p>
                          <p className="text-gray-300 text-sm">{video.description}</p>
                          <a 
                            href={video.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Watch Video
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Overlay Info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                    <div className="text-white">
                      <h3 className="text-xl font-bold mb-2">{video.title}</h3>
                      <p className="text-gray-200 text-sm">{video.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-300">{video.description}</p>
                </div>
              </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}