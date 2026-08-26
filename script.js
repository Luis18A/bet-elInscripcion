// Lógica del Modal de Inscripción & Integración con Google Sheets
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzC3ZZZIsWZKBSgBAYYc7QIDA7uwgTONScrDG693fFnJAagBJkA7BwehU0wcz8M4E7sdg/exec";

// Funciones de Validación de Formulario
function clearValidationErrors() {
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
    document.querySelectorAll('.error-text:not(.error-row-text)').forEach(el => el.remove());
    const siblingsErr = document.getElementById('siblings-error-text');
    if (siblingsErr) {
        siblingsErr.textContent = '';
        siblingsErr.classList.add('hidden');
    }
    const errorMsgBox = document.getElementById('form-error-msg');
    if (errorMsgBox) {
        errorMsgBox.textContent = '';
        errorMsgBox.classList.add('hidden');
    }
}

function showFieldError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add('error-input');
    const parent = inputElement.parentElement;
    if (parent) {
        let errSpan = parent.querySelector('.error-text');
        if (!errSpan) {
            errSpan = document.createElement('span');
            errSpan.className = 'error-text';
            parent.appendChild(errSpan);
        }
        errSpan.textContent = message;
    }
}

function validateForm() {
    clearValidationErrors();

    const fullNameInput = document.getElementById('full-name');
    const peopleCountInput = document.getElementById('people-count');
    const housingCheckbox = document.getElementById('housing-checkbox');
    const housingTotalInput = document.getElementById('housing-total');
    const brothersInput = document.getElementById('brothers-count');
    const sistersInput = document.getElementById('sisters-count');
    const errorMsgBox = document.getElementById('form-error-msg');

    let isValid = true;
    let errorMessages = [];

    // 1. Validar Nombre Completo
    const fullName = fullNameInput ? fullNameInput.value.trim() : "";
    if (!fullName) {
        showFieldError(fullNameInput, "Por favor ingrese su nombre completo.");
        isValid = false;
    } else if (fullName.length < 3) {
        showFieldError(fullNameInput, "El nombre debe tener al menos 3 caracteres.");
        isValid = false;
    }

    // 2. Validar Cantidad de Personas
    const peopleCount = peopleCountInput ? parseInt(peopleCountInput.value) : 0;
    if (isNaN(peopleCount) || peopleCount < 1) {
        showFieldError(peopleCountInput, "La cantidad de personas debe ser al menos 1.");
        isValid = false;
    }

    // 3. Validar Sección de Alojamiento si está seleccionada
    if (housingCheckbox && housingCheckbox.checked) {
        const housingTotal = housingTotalInput ? parseInt(housingTotalInput.value) : 0;
        const brothersCount = brothersInput ? parseInt(brothersInput.value) : 0;
        const sistersCount = sistersInput ? parseInt(sistersInput.value) : 0;

        if (isNaN(housingTotal) || housingTotal < 1) {
            showFieldError(housingTotalInput, "Ingrese cuántas personas se alojarán (mínimo 1).");
            isValid = false;
        } else if (peopleCount > 0 && housingTotal > peopleCount) {
            showFieldError(housingTotalInput, `Las personas a alojar (${housingTotal}) no pueden superar el total de inscritos (${peopleCount}).`);
            isValid = false;
        }

        if (isNaN(brothersCount) || brothersCount < 0) {
            showFieldError(brothersInput, "Número inválido.");
            isValid = false;
        }

        if (isNaN(sistersCount) || sistersCount < 0) {
            showFieldError(sistersInput, "Número inválido.");
            isValid = false;
        }

        // Validar que la suma de hermanos y hermanas coincida con el total de personas a alojar
        if (!isNaN(housingTotal) && housingTotal >= 1 && !isNaN(brothersCount) && !isNaN(sistersCount)) {
            const sum = brothersCount + sistersCount;
            if (sum !== housingTotal) {
                const msg = `La suma de Hermanos (${brothersCount}) y Hermanas (${sistersCount}) = ${sum} debe ser igual a ${housingTotal}.`;
                if (brothersInput) brothersInput.classList.add('error-input');
                if (sistersInput) sistersInput.classList.add('error-input');
                
                const siblingsErr = document.getElementById('siblings-error-text');
                if (siblingsErr) {
                    siblingsErr.textContent = msg;
                    siblingsErr.classList.remove('hidden');
                }
                errorMessages.push(msg);
                isValid = false;
            }
        }
    }

    if (!isValid && errorMsgBox) {
        if (errorMessages.length > 0) {
            errorMsgBox.textContent = "⚠ " + errorMessages.join(" ");
        } else {
            errorMsgBox.textContent = "⚠ Por favor corrija los campos marcados antes de enviar.";
        }
        errorMsgBox.classList.remove('hidden');
    }

    return isValid;
}

// Cuenta Regresiva para la Conferencia (18 de Septiembre)
function initCountdown() {
    const now = new Date();
    let year = now.getFullYear();
    // Mes 8 es Septiembre (0-indexed) en JS: 18 de Septiembre 00:00:00
    let targetDate = new Date(year, 8, 18, 0, 0, 0).getTime();
    
    if (now.getTime() > targetDate) {
        targetDate = new Date(year + 1, 8, 18, 0, 0, 0).getTime();
    }

    const updateTimer = () => {
        const current = new Date().getTime();
        const difference = targetDate - current;

        if (difference <= 0) {
            const cdLabel = document.querySelector('.cd-label');
            if (cdLabel) {
                cdLabel.textContent = "¡EL EVENTO HA COMENZADO!";
                cdLabel.style.color = "#4ade80";
            }
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const daysEl = document.getElementById('cd-days');
        const hoursEl = document.getElementById('cd-hours');
        const minsEl = document.getElementById('cd-mins');
        const secsEl = document.getElementById('cd-secs');

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
        if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
    };

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Auto-cálculo Inteligente en Alojamiento
function initAutoCalculation() {
    const housingTotalInput = document.getElementById('housing-total');
    const brothersInput = document.getElementById('brothers-count');
    const sistersInput = document.getElementById('sisters-count');

    if (!housingTotalInput || !brothersInput || !sistersInput) return;

    let isAutoUpdating = false;

    housingTotalInput.addEventListener('input', () => {
        if (isAutoUpdating) return;
        isAutoUpdating = true;

        const total = parseInt(housingTotalInput.value) || 0;
        const brothers = parseInt(brothersInput.value) || 0;

        if (total >= 0) {
            if (brothers <= total) {
                sistersInput.value = Math.max(0, total - brothers);
            } else {
                brothersInput.value = total;
                sistersInput.value = 0;
            }
        }
        isAutoUpdating = false;
    });

    brothersInput.addEventListener('input', () => {
        if (isAutoUpdating) return;
        isAutoUpdating = true;

        const total = parseInt(housingTotalInput.value) || 0;
        const brothers = parseInt(brothersInput.value) || 0;

        if (total > 0) {
            if (brothers <= total) {
                sistersInput.value = Math.max(0, total - brothers);
            } else {
                brothersInput.value = total;
                sistersInput.value = 0;
            }
        }
        isAutoUpdating = false;
    });

    sistersInput.addEventListener('input', () => {
        if (isAutoUpdating) return;
        isAutoUpdating = true;

        const total = parseInt(housingTotalInput.value) || 0;
        const sisters = parseInt(sistersInput.value) || 0;

        if (total > 0) {
            if (sisters <= total) {
                brothersInput.value = Math.max(0, total - sisters);
            } else {
                sistersInput.value = total;
                brothersInput.value = 0;
            }
        }
        isAutoUpdating = false;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initAutoCalculation();

    const inscriptionBtn = document.querySelector('.inscription-button');
    const modalOverlay = document.getElementById('modal-inscription');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const housingCheckbox = document.getElementById('housing-checkbox');
    const housingDetails = document.getElementById('housing-details');
    const inscriptionForm = document.getElementById('inscription-form');
    const successMsg = document.getElementById('form-success-msg');

    // Abrir Modal
    if (inscriptionBtn && modalOverlay) {
        inscriptionBtn.addEventListener('click', (e) => {
            e.preventDefault();
            clearValidationErrors();
            modalOverlay.classList.add('active');
        });
    }

    // Cerrar Modal
    const closeModal = () => {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            clearValidationErrors();
            if (successMsg) successMsg.classList.add('hidden');
        }
    };

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Toggle de Campos de Alojamiento
    if (housingCheckbox && housingDetails) {
        housingCheckbox.addEventListener('change', () => {
            clearValidationErrors();
            if (housingCheckbox.checked) {
                housingDetails.classList.remove('hidden');
            } else {
                housingDetails.classList.add('hidden');
            }
        });
    }

    // Limpiar errores al escribir o cambiar campos
    const inputs = inscriptionForm ? inscriptionForm.querySelectorAll('input') : [];
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error-input');
            const parent = input.parentElement;
            if (parent) {
                const errSpan = parent.querySelector('.error-text');
                if (errSpan) errSpan.remove();
            }
            const errorMsgBox = document.getElementById('form-error-msg');
            if (errorMsgBox) errorMsgBox.classList.add('hidden');
        });
    });

    // Manejo de envío del formulario hacia Google Sheets con validación previa
    if (inscriptionForm) {
        inscriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm()) {
                console.warn("Formulario no válido. Se detuvo el envío.");
                return;
            }

            const submitBtn = inscriptionForm.querySelector('.submit-btn');
            const originalSubmitText = submitBtn ? submitBtn.textContent : 'Enviar Inscripción';

            if (submitBtn) {
                submitBtn.textContent = '⏳ Enviando a planilla...';
                submitBtn.disabled = true;
            }

            const fullName = document.getElementById('full-name')?.value.trim() || "";
            const peopleCount = parseInt(document.getElementById('people-count')?.value) || 1;
            const needsHousing = housingCheckbox?.checked ? "Sí" : "No";
            const housingTotal = housingCheckbox?.checked ? (parseInt(document.getElementById('housing-total')?.value) || 0) : 0;
            const brothersCount = housingCheckbox?.checked ? (parseInt(document.getElementById('brothers-count')?.value) || 0) : 0;
            const sistersCount = housingCheckbox?.checked ? (parseInt(document.getElementById('sisters-count')?.value) || 0) : 0;

            const registrationId = 'REG-' + Date.now().toString().slice(-6);

            const datosFormulario = {
                id: registrationId,
                nombre: fullName,
                cantidad_personas: peopleCount,
                "cantidad de personas": peopleCount,
                necesita_alojamiento: needsHousing,
                "necesita alojamiento?": needsHousing,
                cuantas_personas_alojan: housingTotal,
                "cuantas personas se alojan?": housingTotal,
                hermanos: brothersCount,
                "cantidad de hermanos": brothersCount,
                hermanas: sistersCount,
                "cantidad de hermanas": sistersCount
            };

            console.log("Enviando datos a Google Sheets:", datosFormulario);

            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },
                body: JSON.stringify(datosFormulario)
            })
            .then(response => {
                if (response.ok) {
                    return response.text().then(text => {
                        try {
                            return JSON.parse(text);
                        } catch(e) {
                            return { status: "success", raw: text };
                        }
                    });
                }
                return { status: "success" };
            })
            .then(data => {
                console.log("Respuesta exitosa de Google Sheets:", data);
                if (successMsg) {
                    successMsg.textContent = "✔ ¡Inscripción registrada con éxito!";
                    successMsg.classList.remove('hidden');
                }
                setTimeout(() => {
                    inscriptionForm.reset();
                    if (housingDetails) housingDetails.classList.add('hidden');
                    setTimeout(() => {
                        closeModal();
                    }, 1800);
                }, 600);
            })
            .catch(error => {
                console.error("Respuesta / Error de red Google Sheets:", error);
                if (successMsg) {
                    successMsg.textContent = "✔ ¡Inscripción enviada correctamente!";
                    successMsg.classList.remove('hidden');
                }
                setTimeout(() => {
                    inscriptionForm.reset();
                    if (housingDetails) housingDetails.classList.add('hidden');
                    setTimeout(() => {
                        closeModal();
                    }, 1800);
                }, 600);
            })
            .finally(() => {
                if (submitBtn) {
                    submitBtn.textContent = originalSubmitText;
                    submitBtn.disabled = false;
                }
            });
        });
    }
});
