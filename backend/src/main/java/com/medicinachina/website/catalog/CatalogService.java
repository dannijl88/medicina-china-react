package com.medicinachina.website.catalog;

import com.medicinachina.website.catalog.dto.CatalogItemRequest;
import com.medicinachina.website.catalog.dto.CatalogItemResponse;
import com.medicinachina.website.storage.FileStorageService;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class CatalogService {

    private final CatalogItemRepository catalogItemRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public CatalogService(
        CatalogItemRepository catalogItemRepository,
        UserRepository userRepository,
        FileStorageService fileStorageService
    ) {
        this.catalogItemRepository = catalogItemRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<CatalogItemResponse> getPublicByType(CatalogType type) {
        return catalogItemRepository.findByTypeAndActiveTrueOrderBySortOrderAscIdAsc(type).stream().map(this::toResponse).toList();
    }

    public List<CatalogItemResponse> getAdminByType(CatalogType type, String userEmail) {
        ensureAdmin(userEmail);
        return catalogItemRepository.findByTypeOrderBySortOrderAscIdAsc(type).stream().map(this::toResponse).toList();
    }

    public CatalogItemResponse create(String userEmail, CatalogItemRequest request, MultipartFile image) {
        ensureAdmin(userEmail);
        if (catalogItemRepository.existsByTypeAndSlug(request.getType(), request.getSlug().trim())) {
            throw new IllegalArgumentException("Ya existe un elemento con ese slug");
        }
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Debes subir una imagen");
        }
        CatalogItem item = new CatalogItem();
        apply(item, request, image);
        return toResponse(catalogItemRepository.save(item));
    }

    public CatalogItemResponse update(Long id, String userEmail, CatalogItemRequest request, MultipartFile image) {
        ensureAdmin(userEmail);
        CatalogItem item = catalogItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado"));
        apply(item, request, image);
        return toResponse(catalogItemRepository.save(item));
    }

    public void delete(Long id, String userEmail) {
        ensureAdmin(userEmail);
        CatalogItem item = catalogItemRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Elemento no encontrado"));
        fileStorageService.deleteIfManaged(item.getImageUrl());
        catalogItemRepository.delete(item);
    }

    private void apply(CatalogItem item, CatalogItemRequest request, MultipartFile image) {
        item.setType(request.getType());
        item.setTitle(request.getTitle().trim());
        item.setSlug(request.getSlug().trim());
        item.setDescription(request.getDescription().trim());
        item.setMetaPrimary(request.getMetaPrimary());
        item.setMetaSecondary(request.getMetaSecondary());
        item.setSortOrder(request.getSortOrder() == null ? 0 : request.getSortOrder());
        item.setActive(request.getActive() == null || request.getActive());

        if (image != null && !image.isEmpty()) {
            fileStorageService.deleteIfManaged(item.getImageUrl());
            item.setImageUrl(fileStorageService.storeImage(image, "catalog"));
        } else if (!StringUtils.hasText(item.getImageUrl())) {
            throw new IllegalArgumentException("Debes subir una imagen");
        }
    }

    private CatalogItemResponse toResponse(CatalogItem item) {
        return new CatalogItemResponse(
            item.getId(),
            item.getType().name(),
            item.getTitle(),
            item.getSlug(),
            item.getDescription(),
            item.getImageUrl(),
            item.getMetaPrimary(),
            item.getMetaSecondary(),
            item.isActive(),
            item.getSortOrder()
        );
    }

    private void ensureAdmin(String email) {
        AppUser user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Solo administracion puede gestionar catalogo");
        }
    }
}
