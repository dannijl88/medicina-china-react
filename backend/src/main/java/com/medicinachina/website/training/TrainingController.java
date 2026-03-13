package com.medicinachina.website.training;

import com.medicinachina.website.training.dto.CheckoutSessionResponse;
import com.medicinachina.website.training.dto.AdminTrainingRequest;
import com.medicinachina.website.training.dto.TrainingDetailResponse;
import com.medicinachina.website.training.dto.TrainingPurchaseResponse;
import com.medicinachina.website.training.dto.TrainingSummaryResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class TrainingController {

    private final TrainingService trainingService;

    public TrainingController(TrainingService trainingService) {
        this.trainingService = trainingService;
    }

    @GetMapping("/trainings")
    public List<TrainingSummaryResponse> getTrainings(Authentication authentication) {
        return trainingService.getActiveTrainings(authentication != null ? authentication.getName() : null);
    }

    @GetMapping("/trainings/{slug}")
    public TrainingDetailResponse getTraining(@PathVariable String slug, Authentication authentication) {
        return trainingService.getTrainingBySlug(slug, authentication != null ? authentication.getName() : null);
    }

    @GetMapping("/admin/trainings")
    public List<TrainingDetailResponse> getAdminTrainings(Authentication authentication) {
        return trainingService.getAdminTrainings(authentication.getName());
    }

    @PostMapping(value = "/admin/trainings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TrainingDetailResponse createAdminTraining(
        @Valid @ModelAttribute AdminTrainingRequest request,
        @RequestParam(name = "image", required = false) MultipartFile image,
        Authentication authentication
    ) {
        return trainingService.createAdminTraining(authentication.getName(), request, image);
    }

    @PutMapping(value = "/admin/trainings/{trainingId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public TrainingDetailResponse updateAdminTraining(
        @PathVariable Long trainingId,
        @Valid @ModelAttribute AdminTrainingRequest request,
        @RequestParam(name = "image", required = false) MultipartFile image,
        Authentication authentication
    ) {
        return trainingService.updateAdminTraining(trainingId, authentication.getName(), request, image);
    }

    @DeleteMapping("/admin/trainings/{trainingId}")
    public ResponseEntity<Void> deleteAdminTraining(@PathVariable Long trainingId, Authentication authentication) {
        trainingService.deleteAdminTraining(trainingId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/trainings/{trainingId}/checkout")
    public CheckoutSessionResponse createCheckout(@PathVariable Long trainingId, Authentication authentication) {
        return trainingService.createCheckout(trainingId, authentication.getName());
    }

    @GetMapping("/trainings/purchases/me")
    public List<TrainingPurchaseResponse> getMyTrainingPurchases(Authentication authentication) {
        return trainingService.getUserPurchases(authentication.getName());
    }

    @PostMapping("/trainings/purchases/{purchaseId}/simulate-success")
    public TrainingPurchaseResponse simulatePurchase(@PathVariable Long purchaseId, Authentication authentication) {
        return trainingService.simulateSuccessfulPayment(purchaseId, authentication.getName());
    }

    @GetMapping("/trainings/{trainingId}/download")
    public ResponseEntity<InputStreamResource> downloadTraining(@PathVariable Long trainingId, Authentication authentication) throws IOException {
        Resource resource = trainingService.getDownloadableResource(trainingId, authentication.getName());
        String fileName = trainingService.getDownloadFileName(trainingId);

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
            .contentType(MediaType.TEXT_PLAIN)
            .body(new InputStreamResource(resource.getInputStream()));
    }

    @PostMapping("/stripe/webhook")
    public ResponseEntity<Void> handleStripeWebhook(HttpServletRequest request, @RequestHeader(name = "Stripe-Signature", required = false) String signature)
        throws IOException {
        String payload = new String(request.getInputStream().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
        trainingService.handleStripeWebhook(payload, signature);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
