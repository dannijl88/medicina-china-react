package com.medicinachina.website.catalog;

import com.medicinachina.website.catalog.dto.CatalogItemRequest;
import com.medicinachina.website.catalog.dto.CatalogItemResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public List<CatalogItemResponse> getPublicCatalog(@RequestParam CatalogType type) {
        return catalogService.getPublicByType(type);
    }

    @GetMapping("/admin")
    public List<CatalogItemResponse> getAdminCatalog(@RequestParam CatalogType type, Authentication authentication) {
        return catalogService.getAdminByType(type, authentication.getName());
    }

    @PostMapping(value = "/admin", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CatalogItemResponse create(
        @Valid @ModelAttribute CatalogItemRequest request,
        @RequestParam(name = "image", required = false) MultipartFile image,
        Authentication authentication
    ) {
        return catalogService.create(authentication.getName(), request, image);
    }

    @PutMapping(value = "/admin/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CatalogItemResponse update(
        @PathVariable Long id,
        @Valid @ModelAttribute CatalogItemRequest request,
        @RequestParam(name = "image", required = false) MultipartFile image,
        Authentication authentication
    ) {
        return catalogService.update(id, authentication.getName(), request, image);
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication) {
        catalogService.delete(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
