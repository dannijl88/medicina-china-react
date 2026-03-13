package com.medicinachina.website.training;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.medicinachina.website.config.StripeProperties;
import com.medicinachina.website.storage.FileStorageService;
import com.medicinachina.website.training.dto.CheckoutSessionResponse;
import com.medicinachina.website.training.dto.AdminTrainingRequest;
import com.medicinachina.website.training.dto.TrainingDetailResponse;
import com.medicinachina.website.training.dto.TrainingPurchaseResponse;
import com.medicinachina.website.training.dto.TrainingSummaryResponse;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

@Service
public class TrainingService {

    private final TrainingRepository trainingRepository;
    private final TrainingPurchaseRepository trainingPurchaseRepository;
    private final UserRepository userRepository;
    private final StripeProperties stripeProperties;
    private final ObjectMapper objectMapper;
    private final RestClient restClient;
    private final String frontendBaseUrl;
    private final FileStorageService fileStorageService;

    public TrainingService(
        TrainingRepository trainingRepository,
        TrainingPurchaseRepository trainingPurchaseRepository,
        UserRepository userRepository,
        StripeProperties stripeProperties,
        ObjectMapper objectMapper,
        FileStorageService fileStorageService,
        @Value("${app.frontend-base-url}") String frontendBaseUrl
    ) {
        this.trainingRepository = trainingRepository;
        this.trainingPurchaseRepository = trainingPurchaseRepository;
        this.userRepository = userRepository;
        this.stripeProperties = stripeProperties;
        this.objectMapper = objectMapper;
        this.fileStorageService = fileStorageService;
        this.frontendBaseUrl = frontendBaseUrl;
        this.restClient = RestClient.builder().baseUrl("https://api.stripe.com/v1").build();
    }

    public List<TrainingSummaryResponse> getActiveTrainings(String userEmail) {
        Optional<AppUser> user = resolveUser(userEmail);

        return trainingRepository.findByActiveTrueOrderByIdAsc().stream()
            .map(training -> toSummary(training, user.orElse(null)))
            .toList();
    }

    public List<TrainingDetailResponse> getAdminTrainings(String userEmail) {
        ensureAdmin(userEmail);
        return trainingRepository.findAll().stream()
            .map(training -> toDetail(training, null))
            .toList();
    }

    public TrainingDetailResponse getTrainingBySlug(String slug, String userEmail) {
        Training training = trainingRepository.findBySlugAndActiveTrue(slug)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));

        return toDetail(training, resolveUser(userEmail).orElse(null));
    }

    public List<TrainingPurchaseResponse> getUserPurchases(String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        return trainingPurchaseRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
            .map(this::toPurchaseResponse)
            .toList();
    }

    @Transactional
    public CheckoutSessionResponse createCheckout(Long trainingId, String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        Training training = trainingRepository.findById(trainingId)
            .filter(Training::isActive)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));

        if (hasAccess(user, training)) {
            return new CheckoutSessionResponse(
                frontendBaseUrl + "/formaciones/" + training.getSlug(),
                isMockMode(),
                true,
                "La formacion ya esta comprada"
            );
        }

        TrainingPurchase purchase = new TrainingPurchase();
        purchase.setUser(user);
        purchase.setTraining(training);
        purchase.setStatus(PurchaseStatus.PENDING);
        purchase.setAmountCents(training.getPriceCents());
        purchase.setCurrency(training.getCurrency());
        purchase = trainingPurchaseRepository.save(purchase);

        if (isMockMode()) {
            return new CheckoutSessionResponse(
                frontendBaseUrl + "/formaciones/checkout-simulado?purchase=" + purchase.getId(),
                true,
                false,
                "Modo simulado activo"
            );
        }

        String checkoutUrl = createStripeCheckoutUrl(training, user, purchase);
        return new CheckoutSessionResponse(checkoutUrl, false, false, "Checkout creado");
    }

    @Transactional
    public TrainingPurchaseResponse simulateSuccessfulPayment(Long purchaseId, String userEmail) {
        TrainingPurchase purchase = trainingPurchaseRepository.findById(purchaseId)
            .orElseThrow(() -> new IllegalArgumentException("La compra no existe"));

        if (!purchase.getUser().getEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalArgumentException("No puedes confirmar una compra de otro usuario");
        }

        markPurchaseAsPaid(purchase, "mock-session-" + purchaseId, "mock-payment-" + purchaseId);
        return toPurchaseResponse(purchase);
    }

    public Resource getDownloadableResource(Long trainingId, String userEmail) {
        AppUser user = getUserByEmail(userEmail);
        Training training = trainingRepository.findById(trainingId)
            .filter(Training::isActive)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));

        if (!hasAccess(user, training)) {
            throw new IllegalArgumentException("Debes comprar esta formacion antes de descargarla");
        }

        return new ClassPathResource("downloads/" + training.getDownloadFilePath());
    }

    public String getDownloadFileName(Long trainingId) {
        Training training = trainingRepository.findById(trainingId)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));
        return training.getSlug() + ".txt";
    }

    @Transactional
    public void handleStripeWebhook(String payload, String signatureHeader) {
        if (!StringUtils.hasText(stripeProperties.getWebhookSecret())) {
            throw new IllegalArgumentException("Falta configurar STRIPE_WEBHOOK_SECRET");
        }

        verifyStripeSignature(payload, signatureHeader);

        try {
            JsonNode root = objectMapper.readTree(payload);
            String eventType = root.path("type").asText();

            if (!"checkout.session.completed".equals(eventType)) {
                return;
            }

            JsonNode session = root.path("data").path("object");
            String stripeSessionId = session.path("id").asText();
            String paymentIntentId = session.path("payment_intent").asText(null);
            String purchaseId = session.path("metadata").path("purchaseId").asText(null);

            TrainingPurchase purchase = trainingPurchaseRepository.findByStripeSessionId(stripeSessionId)
                .orElseGet(() -> purchaseId != null
                    ? trainingPurchaseRepository.findById(Long.valueOf(purchaseId)).orElseThrow(() -> new IllegalArgumentException("Compra no encontrada"))
                    : null);

            if (purchase == null) {
                throw new IllegalArgumentException("No se encontro la compra asociada al webhook");
            }

            markPurchaseAsPaid(purchase, stripeSessionId, paymentIntentId);
        } catch (IOException exception) {
            throw new IllegalArgumentException("No se pudo procesar el webhook de Stripe");
        }
    }

    public TrainingDetailResponse createAdminTraining(String userEmail, AdminTrainingRequest request, MultipartFile image) {
        ensureAdmin(userEmail);
        if (trainingRepository.existsBySlug(request.getSlug().trim())) {
            throw new IllegalArgumentException("Ya existe una formacion con ese slug");
        }
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Debes subir una imagen");
        }
        Training training = new Training();
        applyTraining(training, request, image);
        return toDetail(trainingRepository.save(training), null);
    }

    public TrainingDetailResponse updateAdminTraining(Long id, String userEmail, AdminTrainingRequest request, MultipartFile image) {
        ensureAdmin(userEmail);
        Training training = trainingRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));
        applyTraining(training, request, image);
        return toDetail(trainingRepository.save(training), null);
    }

    public void deleteAdminTraining(Long id, String userEmail) {
        ensureAdmin(userEmail);
        Training training = trainingRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("La formacion no existe"));
        fileStorageService.deleteIfManaged(training.getImageUrl());
        trainingRepository.delete(training);
    }

    private TrainingSummaryResponse toSummary(Training training, AppUser user) {
        return new TrainingSummaryResponse(
            training.getId(),
            training.getTitle(),
            training.getSlug(),
            training.getSummary(),
            training.getImageUrl(),
            training.getPriceCents(),
            training.getCurrency(),
            training.getDurationLabel(),
            training.getModality(),
            user != null && hasAccess(user, training)
        );
    }

    private TrainingDetailResponse toDetail(Training training, AppUser user) {
        return new TrainingDetailResponse(
            training.getId(),
            training.getTitle(),
            training.getSlug(),
            training.getSummary(),
            training.getDescription(),
            training.getImageUrl(),
            training.getPriceCents(),
            training.getCurrency(),
            training.getDurationLabel(),
            training.getModality(),
            training.getLevel(),
            splitSyllabus(training.getSyllabus()),
            user != null && hasAccess(user, training),
            training.getDownloadFilePath(),
            training.isActive()
        );
    }

    private List<String> splitSyllabus(String syllabus) {
        if (!StringUtils.hasText(syllabus)) {
            return List.of();
        }

        return Arrays.stream(syllabus.split("\\|"))
            .map(String::trim)
            .filter(StringUtils::hasText)
            .toList();
    }

    private TrainingPurchaseResponse toPurchaseResponse(TrainingPurchase purchase) {
        return new TrainingPurchaseResponse(
            purchase.getId(),
            purchase.getTraining().getId(),
            purchase.getTraining().getTitle(),
            purchase.getTraining().getSlug(),
            purchase.getStatus().name(),
            purchase.getAmountCents(),
            purchase.getCurrency(),
            purchase.getCreatedAt(),
            purchase.getCompletedAt()
        );
    }

    private AppUser getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private void ensureAdmin(String email) {
        AppUser user = getUserByEmail(email);
        if (user.getRole() != UserRole.ROLE_ADMIN) {
            throw new IllegalArgumentException("Solo administracion puede gestionar formaciones");
        }
    }

    private Optional<AppUser> resolveUser(String email) {
        if (!StringUtils.hasText(email)) {
            return Optional.empty();
        }

        return userRepository.findByEmail(email);
    }

    private boolean hasAccess(AppUser user, Training training) {
        return trainingPurchaseRepository.existsByUserIdAndTrainingIdAndStatus(user.getId(), training.getId(), PurchaseStatus.PAID);
    }

    private void applyTraining(Training training, AdminTrainingRequest request, MultipartFile image) {
        training.setTitle(request.getTitle().trim());
        training.setSlug(request.getSlug().trim());
        training.setSummary(request.getSummary().trim());
        training.setDescription(request.getDescription().trim());
        training.setPriceCents(request.getPriceCents());
        training.setCurrency(request.getCurrency().trim().toLowerCase());
        training.setDurationLabel(request.getDurationLabel().trim());
        training.setModality(request.getModality().trim());
        training.setLevel(request.getLevel().trim());
        training.setSyllabus(request.getSyllabus());
        training.setDownloadFilePath(request.getDownloadFilePath().trim());
        training.setActive(request.getActive() == null || request.getActive());

        if (image != null && !image.isEmpty()) {
            fileStorageService.deleteIfManaged(training.getImageUrl());
            training.setImageUrl(fileStorageService.storeImage(image, "trainings"));
        } else if (!StringUtils.hasText(training.getImageUrl())) {
            throw new IllegalArgumentException("Debes subir una imagen");
        }
    }

    private boolean isMockMode() {
        return !StringUtils.hasText(stripeProperties.getSecretKey());
    }

    private String createStripeCheckoutUrl(Training training, AppUser user, TrainingPurchase purchase) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("mode", "payment");
        form.add("success_url", frontendBaseUrl + "/formaciones/exito?session_id={CHECKOUT_SESSION_ID}");
        form.add("cancel_url", frontendBaseUrl + "/formaciones/cancelada");
        form.add("customer_email", user.getEmail());
        form.add("client_reference_id", String.valueOf(purchase.getId()));
        form.add("metadata[purchaseId]", String.valueOf(purchase.getId()));
        form.add("metadata[trainingId]", String.valueOf(training.getId()));
        form.add("line_items[0][quantity]", "1");
        form.add("line_items[0][price_data][currency]", training.getCurrency());
        form.add("line_items[0][price_data][unit_amount]", String.valueOf(training.getPriceCents()));
        form.add("line_items[0][price_data][product_data][name]", training.getTitle());
        form.add("line_items[0][price_data][product_data][description]", training.getSummary());

        Map<?, ?> response = restClient.post()
            .uri("/checkout/sessions")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .header("Authorization", "Bearer " + stripeProperties.getSecretKey())
            .body(form)
            .retrieve()
            .body(Map.class);

        if (response == null || response.get("url") == null || response.get("id") == null) {
            throw new IllegalArgumentException("No se pudo crear la sesion de Stripe");
        }

        purchase.setStripeSessionId(String.valueOf(response.get("id")));
        trainingPurchaseRepository.save(purchase);

        return String.valueOf(response.get("url"));
    }

    private void markPurchaseAsPaid(TrainingPurchase purchase, String stripeSessionId, String paymentIntentId) {
        purchase.setStatus(PurchaseStatus.PAID);
        purchase.setStripeSessionId(stripeSessionId);
        purchase.setStripePaymentIntentId(paymentIntentId);
        purchase.setCompletedAt(LocalDateTime.now());
        trainingPurchaseRepository.save(purchase);
    }

    private void verifyStripeSignature(String payload, String signatureHeader) {
        if (!StringUtils.hasText(signatureHeader)) {
            throw new IllegalArgumentException("Firma Stripe ausente");
        }

        String[] parts = signatureHeader.split(",");
        String timestamp = null;
        String signature = null;

        for (String part : parts) {
            String[] entry = part.split("=", 2);
            if (entry.length != 2) {
                continue;
            }
            if ("t".equals(entry[0])) {
                timestamp = entry[1];
            }
            if ("v1".equals(entry[0])) {
                signature = entry[1];
            }
        }

        if (!StringUtils.hasText(timestamp) || !StringUtils.hasText(signature)) {
            throw new IllegalArgumentException("Cabecera Stripe-Signature invalida");
        }

        String signedPayload = timestamp + "." + payload;
        String expectedSignature = hmacSha256(signedPayload, stripeProperties.getWebhookSecret());

        if (!expectedSignature.equals(signature)) {
            throw new IllegalArgumentException("Firma Stripe invalida");
        }
    }

    private String hmacSha256(String payload, String secret) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] digest = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte value : digest) {
                builder.append(String.format("%02x", value));
            }
            return builder.toString();
        } catch (Exception exception) {
            throw new IllegalArgumentException("No se pudo verificar la firma de Stripe");
        }
    }
}
