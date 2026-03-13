package com.medicinachina.website.config;

import com.medicinachina.website.catalog.CatalogItem;
import com.medicinachina.website.catalog.CatalogItemRepository;
import com.medicinachina.website.catalog.CatalogType;
import com.medicinachina.website.training.Training;
import com.medicinachina.website.training.TrainingRepository;
import com.medicinachina.website.review.Review;
import com.medicinachina.website.review.ReviewRepository;
import com.medicinachina.website.review.ReviewStatus;
import com.medicinachina.website.review.ReviewableType;
import com.medicinachina.website.user.AppUser;
import com.medicinachina.website.user.UserRepository;
import com.medicinachina.website.user.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedUsers(
        UserRepository userRepository,
        CatalogItemRepository catalogItemRepository,
        TrainingRepository trainingRepository,
        ReviewRepository reviewRepository,
        PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!userRepository.existsByEmail("admin@medicinachina.com")) {
                AppUser admin = new AppUser();
                admin.setFullName("Equipo Medicina China");
                admin.setEmail("admin@medicinachina.com");
                admin.setPasswordHash(passwordEncoder.encode("Relax2026!"));
                admin.setRole(UserRole.ROLE_ADMIN);
                admin.setPhone("600123456");
                userRepository.save(admin);
            }

            if (!userRepository.existsByEmail("cliente@medicinachina.com")) {
                AppUser client = new AppUser();
                client.setFullName("Cliente Bienestar");
                client.setEmail("cliente@medicinachina.com");
                client.setPasswordHash(passwordEncoder.encode("Bienestar2026!"));
                client.setRole(UserRole.ROLE_USER);
                client.setPhone("600654321");
                userRepository.save(client);
            }

            if (catalogItemRepository.countByType(CatalogType.THERAPY) == 0) {
                catalogItemRepository.save(buildCatalogItem(CatalogType.THERAPY, "Masaje descontracturante y relajante",
                    "masaje-descontracturante-relajante",
                    "Regalate un momento de cuidado y relajacion con masajes adaptados a tus necesidades.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/masaje-descontracturante-scaled-q7eyqynk9ehs94nnwug5y4wfna3vfcczv48xjlgpeo.webp",
                    "Masaje terapeutico", "Terapias", 1));
                catalogItemRepository.save(buildCatalogItem(CatalogType.THERAPY, "Equilibrio de Chakras",
                    "equilibrio-de-chakras",
                    "Experiencia disenada para armonizar tus centros energeticos y reconectar con tu esencia.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/pexels-cup-of-couple-6634238-scaled-rbphwchn5hc98kfu9dhkalj472m2yewonog3weqgtc.webp",
                    "Presencial u online", "Energia", 2));
                catalogItemRepository.save(buildCatalogItem(CatalogType.THERAPY, "Velas canalizadas",
                    "velas-canalizadas",
                    "Terapia energetica personalizada con lectura y acompanamiento de sanacion.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/Imagen-de-WhatsApp-2024-05-20-a-las-15.05.02_25ac3e3e-qog1p3rbhv7pxifns8tgc5z84pvkyn86wzjtcg48tc.webp",
                    "Lectura energetica", "Ritual", 3));
                catalogItemRepository.save(buildCatalogItem(CatalogType.THERAPY, "Acupuntura",
                    "acupuntura",
                    "Tecnicas milenarias y naturales para equilibrar la energia vital y aliviar tensiones.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/acupuntura-scaled-qepxiz4u8dhuknt9u9770fhw26i6hio4qdb2szyffk.webp",
                    "Sesion personalizada", "Tradicional", 4));
                catalogItemRepository.save(buildCatalogItem(CatalogType.THERAPY, "Tarot Canalizador - 30 minutos",
                    "tarot-canalizador-30-minutos",
                    "Lectura directa, profunda y enfocada para consultas puntuales y claridad en decisiones.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/pexels-los-muertos-crew-8391232-scaled-qepxjrbzxekg8yob9le038dpvqn6wfs2u8vn7asm8w.webp",
                    "30 min", "Tarot", 5));
            }

            if (catalogItemRepository.countByType(CatalogType.WORKSHOP) == 0) {
                catalogItemRepository.save(buildCatalogItem(CatalogType.WORKSHOP, "Meditaciones diferentes tematicas",
                    "meditaciones-diferentes-tematicas",
                    "Explora dinamicas para una mente mas tranquila y un bienestar duradero.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/IMG-20240715-WA0003-qr5degilci9mwyp7l2xe1uq28mmmepwfz4lr2wxp5s.jpg",
                    "Taller grupal", null, 1));
                catalogItemRepository.save(buildCatalogItem(CatalogType.WORKSHOP, "Baby Shower Espiritual",
                    "baby-shower-espiritual",
                    "Evento unico y emotivo con rituales de amor, meditacion y conexion.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/IMG-20240821-WA0016-qtly6zpurq2fn2bwgiipvcj59h4kv06j17phguyzds.webp",
                    "Evento especial", null, 2));
                catalogItemRepository.save(buildCatalogItem(CatalogType.WORKSHOP, "Tarot Grupal",
                    "tarot-grupal",
                    "Lecturas compartidas en grupo en un ambiente de conexion y apoyo.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/tarotgrupal-scaled-qtm7oo1v1psnwa0zb7en84l2tp1su6m00cpfjsd5ls.webp",
                    "Lectura compartida", null, 3));
                catalogItemRepository.save(buildCatalogItem(CatalogType.WORKSHOP, "Cumpleanos holistico",
                    "cumpleanos-holistico",
                    "Celebracion holistica personalizada con actividades de bienestar, meditacion y energia.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/cumple-holistico-1-scaled-qtm7iti0itsfnmitgoe7plptrdvkxze4jeko1t1cbk.webp",
                    "Celebracion personalizada", null, 4));
                catalogItemRepository.save(buildCatalogItem(CatalogType.WORKSHOP, "Circulo de mujeres",
                    "circulo-de-mujeres",
                    "Espacio intimo para compartir experiencias, fortalecer conexiones y renovarte.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/circulomujeres-scaled-qtm7jaf3xuflglu8pvphyhg4gbk6sj9alqbeosc97k.webp",
                    "Encuentro grupal", null, 5));
            }

            if (catalogItemRepository.countByType(CatalogType.PRODUCT) == 0) {
                catalogItemRepository.save(buildCatalogItem(CatalogType.PRODUCT, "Velas Horoscopo",
                    "velas-horoscopo",
                    "Velas ritualizadas segun cada signo zodiacal, alineadas con su energia y aprendizajes.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-01-31-at-20.51.28-rikl2r4q8t5ehzptyi0y62vdwpexf2jmp8fl2lulk0.jpeg",
                    "Zodiacales", "Vela ritualizada", 1));
                catalogItemRepository.save(buildCatalogItem(CatalogType.PRODUCT, "Vela Ansiedad",
                    "vela-ansiedad",
                    "Disenada para calmar la mente, reducir la ansiedad y aportar sensacion de paz.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/vela-ansiedad-rikl2ob7ob1jj5txeyt2gll04jstrz8fouh4mrys2o.jpeg",
                    "Calma y paz", "Vela ritualizada", 2));
                catalogItemRepository.save(buildCatalogItem(CatalogType.PRODUCT, "Vela Amor y Conexion",
                    "vela-amor-y-conexion",
                    "Trabaja la apertura del corazon, el amor propio y la conexion consciente.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/vela-amor-rikl2ob7ob1jj5txeyt2gll04jstrz8fouh4mrys2o.jpeg",
                    "Corazon y amor propio", "Vela ritualizada", 3));
                catalogItemRepository.save(buildCatalogItem(CatalogType.PRODUCT, "Velas Personalizadas",
                    "velas-personalizadas",
                    "Velas creadas especificamente con la energia de la persona y su intencion.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-02-01-at-03.26.25-rikl2t0emh7z57n3niu7b2eb3h5nugr3dhqk15rt7k.jpeg",
                    "Personalizada", "Canalizada", 4));
                catalogItemRepository.save(buildCatalogItem(CatalogType.PRODUCT, "Rolon Relajante",
                    "rolon-relajante",
                    "Ideal para momentos de estres, ansiedad o sobrecarga emocional.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/WhatsApp-Image-2026-01-15-at-13.23.27-rhp2tte9plxr0pu4mqls6mngp3ric3m5oykfej93mo.jpeg",
                    "Relajante", "Rolon energetico", 5));
            }

            if (!trainingRepository.existsBySlug("tu-tarot-tu-guia")) {
                trainingRepository.save(buildTraining(
                    "Tu Tarot, tu Guia",
                    "tu-tarot-tu-guia",
                    "Curso descargable para aprender a leer el tarot desde una mirada simbolica, practica e intuitiva.",
                    "Una formacion pensada para introducirte en el tarot como herramienta de autoconocimiento. Trabaja arcanos mayores, estructura de tiradas y criterios para interpretar con claridad.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/tarotgrupal-scaled-qtm7oo1v1psnwa0zb7en84l2tp1su6m00cpfjsd5ls.webp",
                    4900,
                    "6 horas",
                    "Descargable",
                    "Inicial",
                    "Fundamentos del tarot|Arcanos mayores y simbolismo|Como formular preguntas|Tiradas basicas|Lectura intuitiva y practica",
                    "tu-tarot-tu-guia.txt"
                ));
            }

            if (!trainingRepository.existsBySlug("chakras-y-autoequilibrio")) {
                trainingRepository.save(buildTraining(
                    "Chakras y Autoequilibrio",
                    "chakras-y-autoequilibrio",
                    "Formacion descargable para comprender chakras, bloqueos energeticos y practicas de armonizacion.",
                    "Recorrido formativo para estudiar los centros energeticos, sus manifestaciones emocionales y tecnicas practicas de equilibrado con respiracion, meditacion e intencion.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/pexels-cup-of-couple-6634238-scaled-rbphwchn5hc98kfu9dhkalj472m2yewonog3weqgtc.webp",
                    5900,
                    "8 horas",
                    "Descargable",
                    "Intermedio",
                    "Mapa de chakras|Bloqueos energeticos frecuentes|Practicas de respiracion|Meditaciones guiadas|Rutina de autoequilibrio",
                    "chakras-y-autoequilibrio.txt"
                ));
            }

            if (!trainingRepository.existsBySlug("introduccion-a-la-medicina-energetica")) {
                trainingRepository.save(buildTraining(
                    "Introduccion a la Medicina Energetica",
                    "introduccion-a-la-medicina-energetica",
                    "Base teorica y practica para empezar a entender energia, autocuidado y acompanamiento consciente.",
                    "Formacion de entrada a conceptos clave de bienestar energetico: presencia, observacion corporal, enfoque holistico y pequenos rituales de cuidado aplicables al dia a dia.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/acupuntura-scaled-qepxiz4u8dhuknt9u9770fhw26i6hio4qdb2szyffk.webp",
                    6900,
                    "10 horas",
                    "Descargable",
                    "Inicial",
                    "Vision holistica del bienestar|Energia y cuerpo|Rutinas de autocuidado|Herramientas de observacion|Integracion practica",
                    "introduccion-medicina-energetica.txt"
                ));
            }

            if (!trainingRepository.existsBySlug("rituales-con-velas-y-aromaterapia")) {
                trainingRepository.save(buildTraining(
                    "Rituales con Velas y Aromaterapia",
                    "rituales-con-velas-y-aromaterapia",
                    "Guia descargable para trabajar intencion, preparacion de espacios y pequenos rituales con velas y aromas.",
                    "Formacion enfocada en el uso consciente de velas, aromas y preparacion energetica del espacio. Incluye estructura de rituales sencillos, seguridad basica y trabajo de intencion.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/Imagen-de-WhatsApp-2024-05-20-a-las-15.05.02_25ac3e3e-qog1p3rbhv7pxifns8tgc5z84pvkyn86wzjtcg48tc.webp",
                    5400,
                    "7 horas",
                    "Descargable",
                    "Inicial",
                    "Preparacion del espacio|Tipos de velas y usos|Aceites y aromas|Rituales sencillos|Buenas practicas",
                    "rituales-velas-aromaterapia.txt"
                ));
            }

            if (!trainingRepository.existsBySlug("lectura-intuitiva-y-arquetipos")) {
                trainingRepository.save(buildTraining(
                    "Lectura Intuitiva y Arquetipos",
                    "lectura-intuitiva-y-arquetipos",
                    "Curso para profundizar en simbolos, arquetipos y lectura intuitiva aplicada a procesos personales.",
                    "Formacion para trabajar lectura simbolica, observacion de patrones y desarrollo de una interpretacion mas afinada en procesos de acompanamiento y autoconocimiento.",
                    "https://medicina-tradicionalchina.es/wp-content/uploads/elementor/thumbs/lecturadiosas-rhp26scm9qeuknad3s8u3fuwr99rr26wiz664hec2o.jpeg",
                    7900,
                    "12 horas",
                    "Descargable",
                    "Intermedio",
                    "Arquetipos principales|Lectura simbolica|Contexto emocional|Practicas guiadas|Integracion personal",
                    "lectura-intuitiva-arquetipos.txt"
                ));
            }

            AppUser client = userRepository.findByEmail("cliente@medicinachina.com").orElse(null);
            if (client != null && reviewRepository.count() == 0) {
                reviewRepository.save(buildReview(client, ReviewableType.THERAPY, "acupuntura", "Acupuntura", 5,
                    "Muy buena experiencia", "Me ayudo a bajar tension y salir mucho mas equilibrada.", ReviewStatus.APPROVED));
                reviewRepository.save(buildReview(client, ReviewableType.WORKSHOP, "tarot-grupal", "Tarot Grupal", 5,
                    "Taller muy bonito", "Muy bien guiado y con un ambiente muy cuidado de principio a fin.", ReviewStatus.APPROVED));
                reviewRepository.save(buildReview(client, ReviewableType.PRODUCT, "velas-horoscopo", "Velas Horoscopo", 4,
                    "Muy especial", "La vela llego con mucho detalle y se nota que esta hecha con intencion.", ReviewStatus.APPROVED));
                reviewRepository.save(buildReview(client, ReviewableType.TRAINING, "tu-tarot-tu-guia", "Tu Tarot, tu Guia", 5,
                    "Material claro", "La estructura esta muy ordenada y sirve para empezar a practicar enseguida.", ReviewStatus.APPROVED));
            }
        };
    }

    private Training buildTraining(
        String title,
        String slug,
        String summary,
        String description,
        String imageUrl,
        int priceCents,
        String durationLabel,
        String modality,
        String level,
        String syllabus,
        String filePath
    ) {
        Training training = new Training();
        training.setTitle(title);
        training.setSlug(slug);
        training.setSummary(summary);
        training.setDescription(description);
        training.setImageUrl(imageUrl);
        training.setPriceCents(priceCents);
        training.setCurrency("eur");
        training.setDurationLabel(durationLabel);
        training.setModality(modality);
        training.setLevel(level);
        training.setSyllabus(syllabus);
        training.setDownloadFilePath(filePath);
        training.setActive(true);
        return training;
    }

    private Review buildReview(
        AppUser user,
        ReviewableType type,
        String itemKey,
        String itemLabel,
        int rating,
        String title,
        String comment,
        ReviewStatus status
    ) {
        Review review = new Review();
        review.setUser(user);
        review.setReviewableType(type);
        review.setItemKey(itemKey);
        review.setItemLabel(itemLabel);
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setStatus(status);
        return review;
    }

    private CatalogItem buildCatalogItem(
        CatalogType type,
        String title,
        String slug,
        String description,
        String imageUrl,
        String metaPrimary,
        String metaSecondary,
        int sortOrder
    ) {
        CatalogItem item = new CatalogItem();
        item.setType(type);
        item.setTitle(title);
        item.setSlug(slug);
        item.setDescription(description);
        item.setImageUrl(imageUrl);
        item.setMetaPrimary(metaPrimary);
        item.setMetaSecondary(metaSecondary);
        item.setSortOrder(sortOrder);
        item.setActive(true);
        return item;
    }
}
