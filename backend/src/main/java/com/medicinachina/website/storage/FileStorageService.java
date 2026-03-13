package com.medicinachina.website.storage;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final Set<String> ALLOWED_IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp", "image/gif");
    private static final String PUBLIC_PREFIX = "/uploads/";

    private final Path uploadRoot;

    public FileStorageService(@Value("${app.upload-dir:uploads}") String uploadDir) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
    }

    public String storeImage(MultipartFile file, String category) {
        if (file == null || file.isEmpty()) {
            return null;
        }

        String contentType = file.getContentType();
        if (!StringUtils.hasText(contentType) || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new IllegalArgumentException("Solo se permiten imagenes JPG, PNG, WEBP o GIF");
        }

        String extension = resolveExtension(file.getOriginalFilename(), contentType);
        String fileName = UUID.randomUUID() + extension;
        Path categoryPath = uploadRoot.resolve(category).normalize();
        Path destination = categoryPath.resolve(fileName).normalize();

        try {
            Files.createDirectories(categoryPath);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException exception) {
            throw new IllegalArgumentException("No se pudo guardar la imagen");
        }

        return PUBLIC_PREFIX + category + "/" + fileName;
    }

    public void deleteIfManaged(String publicPath) {
        if (!StringUtils.hasText(publicPath) || !publicPath.startsWith(PUBLIC_PREFIX)) {
            return;
        }

        String relativePath = publicPath.substring(PUBLIC_PREFIX.length());
        Path target = uploadRoot.resolve(relativePath).normalize();

        if (!target.startsWith(uploadRoot)) {
            return;
        }

        try {
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
        }
    }

    public Path getUploadRoot() {
        return uploadRoot;
    }

    private String resolveExtension(String originalFileName, String contentType) {
        String extension = StringUtils.getFilenameExtension(originalFileName);
        if (StringUtils.hasText(extension)) {
            return "." + extension.toLowerCase();
        }

        return switch (contentType.toLowerCase()) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
    }
}
