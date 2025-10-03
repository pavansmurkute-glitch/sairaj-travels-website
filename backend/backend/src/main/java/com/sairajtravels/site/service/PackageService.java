package com.sairajtravels.site.service;

import com.sairajtravels.site.dto.PackageDTO;
import com.sairajtravels.site.entity.TravelPackage;
import com.sairajtravels.site.repository.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    // Get all active packages (for public use)
    public List<PackageDTO> getAllPackages() {
        List<TravelPackage> packages = packageRepository.findByIsActiveTrueOrderBySortOrderAsc();
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get all packages including inactive ones (for admin use)
    public List<PackageDTO> getAllPackagesForAdmin() {
        System.out.println("=== PACKAGE SERVICE: getAllPackagesForAdmin called ===");
        List<TravelPackage> packages = packageRepository.findAll();
        System.out.println("Found " + packages.size() + " packages in database");
        
        // Sort by sortOrder and then by packageId for consistent ordering
        packages.sort((p1, p2) -> {
            if (p1.getSortOrder() != null && p2.getSortOrder() != null) {
                return p1.getSortOrder().compareTo(p2.getSortOrder());
            } else if (p1.getSortOrder() != null) {
                return -1;
            } else if (p2.getSortOrder() != null) {
                return 1;
            } else {
                return p1.getPackageId().compareTo(p2.getPackageId());
            }
        });
        
        List<PackageDTO> result = packages.stream().map(this::convertToDTO).collect(Collectors.toList());
        System.out.println("Returning " + result.size() + " package DTOs");
        return result;
    }

    // Get packages by category
    public List<PackageDTO> getPackagesByCategory(String categoryId) {
        List<TravelPackage> packages = packageRepository.findByPackageCategoryIdAndIsActiveTrueOrderBySortOrderAsc(categoryId);
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get featured packages
    public List<PackageDTO> getFeaturedPackages() {
        List<TravelPackage> packages = packageRepository.findByIsFeaturedTrueAndIsActiveTrueOrderBySortOrderAsc();
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Search packages
    public List<PackageDTO> searchPackages(String searchTerm) {
        List<TravelPackage> packages = packageRepository.searchPackages(searchTerm);
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get packages by price range
    public List<PackageDTO> getPackagesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<TravelPackage> packages = packageRepository.findByPriceRange(minPrice, maxPrice);
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get packages by category and price range
    public List<PackageDTO> getPackagesByCategoryAndPriceRange(String categoryId, BigDecimal minPrice, BigDecimal maxPrice) {
        List<TravelPackage> packages = packageRepository.findByCategoryAndPriceRange(categoryId, minPrice, maxPrice);
        return packages.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    // Get package by ID
    public PackageDTO getPackageById(Integer packageId) {
        Optional<TravelPackage> packageOpt = packageRepository.findById(packageId);
        return packageOpt.map(this::convertToDTO).orElse(null);
    }

    // Create new package
    public PackageDTO createPackage(PackageDTO packageDTO) {
        TravelPackage packageEntity = convertToEntity(packageDTO);
        TravelPackage savedPackage = packageRepository.save(packageEntity);
        return convertToDTO(savedPackage);
    }

    // Update package
    public PackageDTO updatePackage(Integer packageId, PackageDTO packageDTO) {
        Optional<TravelPackage> packageOpt = packageRepository.findById(packageId);
        if (packageOpt.isPresent()) {
            TravelPackage packageEntity = packageOpt.get();
            updateEntityFromDTO(packageEntity, packageDTO);
            TravelPackage savedPackage = packageRepository.save(packageEntity);
            return convertToDTO(savedPackage);
        }
        return null;
    }

    // Delete package (soft delete)
    public boolean deletePackage(Integer packageId) {
        Optional<TravelPackage> packageOpt = packageRepository.findById(packageId);
        if (packageOpt.isPresent()) {
            TravelPackage packageEntity = packageOpt.get();
            packageEntity.setIsActive(false);
            packageRepository.save(packageEntity);
            return true;
        }
        return false;
    }

    // Convert Entity to DTO
    private PackageDTO convertToDTO(TravelPackage packageEntity) {
        PackageDTO dto = new PackageDTO();
        dto.setPackageId(packageEntity.getPackageId());
        dto.setPackageName(packageEntity.getPackageName());
        dto.setPackageCategory(packageEntity.getPackageCategory());
        dto.setPackageCategoryId(packageEntity.getPackageCategoryId());
        dto.setPackageDescription(packageEntity.getPackageDescription());
        dto.setPackageDuration(packageEntity.getPackageDuration());
        dto.setPackagePrice(packageEntity.getPackagePrice());
        dto.setOriginalPrice(packageEntity.getOriginalPrice());
        dto.setDiscountPercentage(packageEntity.getDiscountPercentage());
        dto.setPackageImageUrl(packageEntity.getPackageImageUrl());
        
        // Convert JSON strings to Lists (you might want to use a JSON library like Jackson)
        // For now, we'll handle this in the controller or use a proper JSON converter
        dto.setPackageFeatures(parseJsonToList(packageEntity.getPackageFeatures()));
        dto.setPackageHighlights(parseJsonToList(packageEntity.getPackageHighlights()));
        
        dto.setRating(packageEntity.getRating());
        dto.setReviewsCount(packageEntity.getReviewsCount());
        dto.setIsActive(packageEntity.getIsActive());
        dto.setIsFeatured(packageEntity.getIsFeatured());
        dto.setSortOrder(packageEntity.getSortOrder());
        dto.setCreatedAt(packageEntity.getCreatedAt());
        dto.setUpdatedAt(packageEntity.getUpdatedAt());
        
        return dto;
    }

    // Convert DTO to Entity
    private TravelPackage convertToEntity(PackageDTO packageDTO) {
        TravelPackage packageEntity = new TravelPackage();
        packageEntity.setPackageName(packageDTO.getPackageName());
        packageEntity.setPackageCategory(packageDTO.getPackageCategory());
        packageEntity.setPackageCategoryId(packageDTO.getPackageCategoryId());
        packageEntity.setPackageDescription(packageDTO.getPackageDescription());
        packageEntity.setPackageDuration(packageDTO.getPackageDuration());
        packageEntity.setPackagePrice(packageDTO.getPackagePrice());
        packageEntity.setOriginalPrice(packageDTO.getOriginalPrice());
        packageEntity.setDiscountPercentage(packageDTO.getDiscountPercentage());
        packageEntity.setPackageImageUrl(packageDTO.getPackageImageUrl());
        
        // Convert Lists to JSON strings
        packageEntity.setPackageFeatures(convertListToJson(packageDTO.getPackageFeatures()));
        packageEntity.setPackageHighlights(convertListToJson(packageDTO.getPackageHighlights()));
        
        packageEntity.setRating(packageDTO.getRating());
        packageEntity.setReviewsCount(packageDTO.getReviewsCount());
        packageEntity.setIsActive(packageDTO.getIsActive() != null ? packageDTO.getIsActive() : true);
        packageEntity.setIsFeatured(packageDTO.getIsFeatured() != null ? packageDTO.getIsFeatured() : false);
        packageEntity.setSortOrder(packageDTO.getSortOrder());
        
        return packageEntity;
    }

    // Update entity from DTO
    private void updateEntityFromDTO(TravelPackage packageEntity, PackageDTO packageDTO) {
        if (packageDTO.getPackageName() != null) {
            packageEntity.setPackageName(packageDTO.getPackageName());
        }
        if (packageDTO.getPackageCategory() != null) {
            packageEntity.setPackageCategory(packageDTO.getPackageCategory());
        }
        if (packageDTO.getPackageCategoryId() != null) {
            packageEntity.setPackageCategoryId(packageDTO.getPackageCategoryId());
        }
        if (packageDTO.getPackageDescription() != null) {
            packageEntity.setPackageDescription(packageDTO.getPackageDescription());
        }
        if (packageDTO.getPackageDuration() != null) {
            packageEntity.setPackageDuration(packageDTO.getPackageDuration());
        }
        if (packageDTO.getPackagePrice() != null) {
            packageEntity.setPackagePrice(packageDTO.getPackagePrice());
        }
        if (packageDTO.getOriginalPrice() != null) {
            packageEntity.setOriginalPrice(packageDTO.getOriginalPrice());
        }
        if (packageDTO.getDiscountPercentage() != null) {
            packageEntity.setDiscountPercentage(packageDTO.getDiscountPercentage());
        }
        if (packageDTO.getPackageImageUrl() != null) {
            packageEntity.setPackageImageUrl(packageDTO.getPackageImageUrl());
        }
        if (packageDTO.getPackageFeatures() != null) {
            packageEntity.setPackageFeatures(convertListToJson(packageDTO.getPackageFeatures()));
        }
        if (packageDTO.getPackageHighlights() != null) {
            packageEntity.setPackageHighlights(convertListToJson(packageDTO.getPackageHighlights()));
        }
        if (packageDTO.getRating() != null) {
            packageEntity.setRating(packageDTO.getRating());
        }
        if (packageDTO.getReviewsCount() != null) {
            packageEntity.setReviewsCount(packageDTO.getReviewsCount());
        }
        if (packageDTO.getIsActive() != null) {
            packageEntity.setIsActive(packageDTO.getIsActive());
        }
        if (packageDTO.getIsFeatured() != null) {
            packageEntity.setIsFeatured(packageDTO.getIsFeatured());
        }
        if (packageDTO.getSortOrder() != null) {
            packageEntity.setSortOrder(packageDTO.getSortOrder());
        }
    }

    // Helper methods for JSON conversion (simplified - you might want to use Jackson)
    private List<String> parseJsonToList(String jsonString) {
        // Simple JSON array parsing - you might want to use a proper JSON library
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return List.of();
        }
        // Remove brackets and split by comma
        String cleanJson = jsonString.replaceAll("[\\[\\]\"]", "").trim();
        if (cleanJson.isEmpty()) {
            return List.of();
        }
        return List.of(cleanJson.split(","));
    }

    private String convertListToJson(List<String> list) {
        if (list == null || list.isEmpty()) {
            return "[]";
        }
        return "[\"" + String.join("\",\"", list) + "\"]";
    }
}
