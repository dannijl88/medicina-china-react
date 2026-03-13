package com.medicinachina.website.content;

import com.medicinachina.website.content.dto.HeroContent;
import com.medicinachina.website.content.dto.HomeContentResponse;
import com.medicinachina.website.content.dto.ProductItem;
import com.medicinachina.website.content.dto.TherapyItem;
import com.medicinachina.website.content.dto.WorkshopItem;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
public class PublicContentController {

    @GetMapping("/home")
    public HomeContentResponse getHomeContent() {
        return new HomeContentResponse(
            new HeroContent(
                "Bienestar holistico",
                "Espacios de calma, energia y reconexion",
                "Una web corporativa para terapias naturales, talleres vivenciales y productos artesanales pensados para cuerpo, mente y ritual.",
                "Reservar terapia",
                "Ver talleres"
            ),
            List.of(
                new TherapyItem("Acupuntura energetica", "Sesiones personalizadas para armonizar bloqueos, aliviar tension y recuperar equilibrio interno.", "60 min", "Tradicional"),
                new TherapyItem("Masaje relajante", "Ritual corporal con aceites esenciales para soltar cansancio fisico y mental.", "75 min", "Corporal"),
                new TherapyItem("Tarot terapeutico", "Lecturas enfocadas en claridad emocional, procesos vitales y toma de decisiones conscientes.", "45 min", "Guia")
            ),
            List.of(
                new WorkshopItem("Taller de autocuidado energetico", "Sabados - 10:00", "Practicas suaves de respiracion, digitopuntura y limpieza energetica para el dia a dia."),
                new WorkshopItem("Iniciacion al tarot intuitivo", "Jueves - 18:30", "Un recorrido practico para conectar con simbolos, intuicion y lectura consciente."),
                new WorkshopItem("Rituales con velas y aromas", "Domingos - 11:30", "Creacion de pequenos rituales para intencion, calma y apertura del hogar.")
            ),
            List.of(
                new ProductItem("Velas artesanales", "Velas vegetales creadas a mano para meditacion, descanso y ritual.", "Lavanda y jazmin", "Tarro"),
                new ProductItem("Perfumes vibracionales", "Brumas aromaticas ligeras para espacios y momentos de reconexion.", "Rosa blanca", "Spray"),
                new ProductItem("Rolones botanicos", "Aceites de bolsillo para aplicar en sienes, cuello o munecas.", "Citricos suaves", "Roll-on")
            )
        );
    }
}
