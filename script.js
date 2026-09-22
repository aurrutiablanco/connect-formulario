document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Iconos Lucide
    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // LÓGICA DE FILTRADO DE PORTAFOLIO
    // ==========================================
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            // Activar botón clickeado
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const filterValue = btn.getAttribute("data-filter");

            // Mostrar / Ocultar tarjetas según el filtro
            projectCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === category) {
                    card.classList.remove("hidden-card");
                } else {
                    card.classList.add("hidden-card");
                }
            });
        });
    });

    // ==========================================
    // SCROLL SUAVE DESDE EL BOTÓN REBOTANDO
    // ==========================================
    const btnScrollToForm = document.getElementById("btnScrollToForm");
    const formSection = document.getElementById("formSection");

    btnScrollToForm.addEventListener("click", () => {
        formSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    // ==========================================
    // LÓGICA DEL FORMULARIO PROGRESIVO
    // ==========================================
    const form = document.getElementById("requirementsForm");
    const inputNombre = document.getElementById("nombre");
    const confirmationCard = document.getElementById("confirmationCard");

    // Paso 2 (Ubicación)
    const wantLocationCheckbox = document.getElementById("wantLocation");
    const locationContainer = document.getElementById("locationContainer");
    const btnLocation = document.getElementById("btnLocation");
    const locationStatus = document.getElementById("locationStatus");
    const inputUbicacion = document.getElementById("ubicacion");
    const btnStep2Next = document.getElementById("btnStep2Next");

    // Paso 5 (Referencia)
    const hasReferenceCheckbox = document.getElementById("hasReference");
    const referenceContainer = document.getElementById("referenceContainer");
    const referenciaInput = document.getElementById("referenciaInput");
    const btnStep5Next = document.getElementById("btnStep5Next");

    // Pasos del formulario
    const step2 = document.getElementById("step-2");
    const step3 = document.getElementById("step-3");
    const step4 = document.getElementById("step-4");
    const step5 = document.getElementById("step-5");
    const step6 = document.getElementById("step-6");
    const stepSubmit = document.getElementById("step-submit");

    // Función auxiliar para activar/mostrar pasos
    function activateStep(stepElement) {
        if (stepElement && !stepElement.classList.contains("active")) {
            stepElement.classList.add("active");
            setTimeout(() => {
                stepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }

    // PASO 1 -> PASO 2: Escribir Nombre
    inputNombre.addEventListener("input", (e) => {
        if (e.target.value.trim().length >= 2) {
            activateStep(step2);
        }
    });

    // PASO 2: Toggle Checkbox Ubicación
    wantLocationCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            locationContainer.classList.add("show");
        } else {
            locationContainer.classList.remove("show");
            inputUbicacion.value = "No especificada";
            locationStatus.textContent = "";
        }
    });

    // PASO 2: Obtener Geolocalización por GPS
    btnLocation.addEventListener("click", () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = "Geolocalización no soportada en este navegador.";
            inputUbicacion.value = "No especificada";
            return;
        }

        locationStatus.textContent = "Obteniendo tu ubicación...";

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();
                    
                    const ciudad = data.address.city || data.address.town || data.address.state || "Ubicación detectada";
                    const pais = data.address.country || "";
                    const ubicacionTexto = `${ciudad}, ${pais}`.trim();
                    
                    inputUbicacion.value = ubicacionTexto;
                    locationStatus.textContent = `📍 Ubicación: ${ubicacionTexto}`;
                } catch (error) {
                    inputUbicacion.value = `Lat: ${latitude.toFixed(2)}, Lon: ${longitude.toFixed(2)}`;
                    locationStatus.textContent = "📍 Ubicación detectada por coordenadas";
                }
            },
            (error) => {
                console.warn(error);
                locationStatus.textContent = "No se pudo obtener acceso a la ubicación.";
                inputUbicacion.value = "No especificada";
            },
            { timeout: 8000 }
        );
    });

    // PASO 2 -> PASO 3: Botón Continuar
    btnStep2Next.addEventListener("click", () => {
        if (!wantLocationCheckbox.checked) {
            inputUbicacion.value = "No especificada";
        }
        activateStep(step3);
    });

    // PASO 3 -> PASO 4: Selección Objetivo
    const radiosObjetivo = document.querySelectorAll('input[name="objetivo"]');
    radiosObjetivo.forEach(radio => {
        radio.addEventListener("change", () => {
            activateStep(step4);
        });
    });

    // PASO 4 -> PASO 5: Selección Tipo de Web
    const radiosTipo = document.querySelectorAll('input[name="tipo_pagina"]');
    radiosTipo.forEach(radio => {
        radio.addEventListener("change", () => {
            activateStep(step5);
        });
    });

    // PASO 5: Toggle Checkbox Referencia
    hasReferenceCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
            referenceContainer.classList.add("show");
            referenciaInput.focus();
        } else {
            referenceContainer.classList.remove("show");
            referenciaInput.value = "";
        }
    });

    // PASO 5 -> PASO 6: Botón Continuar Referencia
    btnStep5Next.addEventListener("click", () => {
        activateStep(step6);
    });

    // PASO 6 -> PASO FINAL: Selección Sector
    const radiosSector = document.querySelectorAll('input[name="sector"]');
    radiosSector.forEach(radio => {
        radio.addEventListener("change", () => {
            activateStep(stepSubmit);
        });
    });

    // ENVÍO DEL FORMULARIO A WHATSAPP Y ANIMACIÓN DE SALIDA
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const nombre = inputNombre.value.trim() || "Cliente";
        const ubicacion = inputUbicacion.value || "No especificada";
        
        const objetivoRadio = document.querySelector('input[name="objetivo"]:checked');
        const objetivo = objetivoRadio ? objetivoRadio.value : "No especificado";

        const tipoRadio = document.querySelector('input[name="tipo_pagina"]:checked');
        const tipoPagina = tipoRadio ? tipoRadio.value : "No especificado";

        const tieneReferencia = hasReferenceCheckbox.checked;
        const textoReferencia = referenciaInput.value.trim();
        const referencia = (tieneReferencia && textoReferencia.length > 0) ? textoReferencia : "No especificada";

        const sectorRadio = document.querySelector('input[name="sector"]:checked');
        const sector = sectorRadio ? sectorRadio.value : "No especificado";

        // Mensaje formateado para WhatsApp
        const mensaje = `Hola! Soy *${nombre}* y estoy interesado en realizar un proyecto web con los siguientes requerimientos:

📍 *Ubicación:* ${ubicacion}
🎯 *Objetivo:* ${objetivo}
💻 *Tipo de Web:* ${tipoPagina}
🔗 *Referencia:* ${referencia}
💼 *Sector:* ${sector}`;

        // Número destino en formato internacional
        const telefono = "584120700903";
        const urlWhatsapp = `https://api.whatsapp.com/send?phone=${telefono}&text=${encodeURIComponent(mensaje)}`;

        // Abrir ventana de WhatsApp
        window.open(urlWhatsapp, "_blank");

        // Animación de salida del formulario
        form.classList.add("fade-out");

        setTimeout(() => {
            form.style.display = "none";
            confirmationCard.classList.add("show");
            
            if (window.lucide) {
                lucide.createIcons();
            }

            setTimeout(() => {
                if (!confirmationCard.classList.contains("active")) {
                    confirmationCard.classList.add("active");
                }
            }, 50);
        }, 500);
    });
});