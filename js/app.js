/**
 * PROTOTIPO RUTA SIN FRONTERAS - LÓGICA DE INTERACCIÓN FRONT-END
 * Universidad del Magdalena - Programa de Negocios Internacionales
 * Proyecto: Incubación Pre-Aduanera para Medianas Empresas de Santa Marta
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. NAVEGACIÓN SPA ENTRE PÁGINAS Y MENÚ NAVBAR
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-link, .brand-link');
  const pages = document.querySelectorAll('.page-view');
  const mobileToggleBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  const btnIniciarRecorrido = document.getElementById('btnIniciarRecorrido');

  // Función para cambiar de página
  function switchPage(targetPageId) {
    if (!targetPageId) return;

    // Ocultar todas las páginas y mostrar solo la seleccionada
    pages.forEach(page => {
      if (page.id === targetPageId) {
        page.classList.add('active-page');
      } else {
        page.classList.remove('active-page');
      }
    });

    // Actualizar clase activa en enlaces del Navbar
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
      if (link.getAttribute('data-target') === targetPageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Cerrar menú móvil si estuviera abierto
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }

    // Scroll suave hacia arriba
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event listener para los enlaces del Navbar
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      if (target) {
        switchPage(target);
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          history.pushState(null, '', href);
        }
      }
    });
  });

  // Botón "Iniciar Recorrido" en el Hero -> Lleva a la Página 2 (Glocalización)
  if (btnIniciarRecorrido) {
    btnIniciarRecorrido.addEventListener('click', () => {
      switchPage('pagina-glocalizacion');
      history.pushState(null, '', '#glocalizacion');
    });
  }

  // Menú hamburguesa móvil
  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });
  }

  // Soporte de navegación por Hash (URL directa: #inicio, #glocalizacion, #cultura, #simulador)
  function handleHashNavigation() {
    const hash = window.location.hash;
    const hashMap = {
      '#inicio': 'pagina-inicio',
      '#glocalizacion': 'pagina-glocalizacion',
      '#cultura': 'pagina-cultura',
      '#simulador': 'pagina-simulador'
    };
    if (hash && hashMap[hash]) {
      switchPage(hashMap[hash]);
    }
  }

  window.addEventListener('popstate', handleHashNavigation);
  if (window.location.hash) {
    handleHashNavigation();
  }


  // =========================================================================
  // 2. PÁGINA 2: CLÍNICA DE GLOCALIZACIÓN TÉCNICA (SELECTOR DE SECTOR)
  // =========================================================================
  const btnSectorAlimentos = document.getElementById('btnSectorAlimentos');
  const btnSectorMadera = document.getElementById('btnSectorMadera');
  const resultBoxAlimentos = document.getElementById('resultBoxAlimentos');
  const resultBoxMadera = document.getElementById('resultBoxMadera');

  if (btnSectorAlimentos && btnSectorMadera) {
    // Clic en Alimentos y Bebidas
    btnSectorAlimentos.addEventListener('click', () => {
      btnSectorAlimentos.classList.add('active');
      btnSectorMadera.classList.remove('active');
      
      resultBoxAlimentos.classList.add('visible');
      resultBoxMadera.classList.remove('visible');

      resultBoxAlimentos.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    // Clic en Manufacturas en Madera (Caso empírico documentado en la investigación)
    btnSectorMadera.addEventListener('click', () => {
      btnSectorMadera.classList.add('active');
      btnSectorAlimentos.classList.remove('active');

      resultBoxMadera.classList.add('visible');
      resultBoxAlimentos.classList.remove('visible');

      resultBoxMadera.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }


  // =========================================================================
  // 3. PÁGINA 4: SIMULADOR ADUANERO (BLOQUE 1 - ADJUNTAR ARCHIVOS REALES CON SIMULACIÓN)
  // =========================================================================
  
  // Configuración de los 3 slots de documentos soporte
  const uploadConfigs = [
    {
      id: 1,
      defaultName: 'Factura_Comercial_INV-8492.pdf',
      defaultSize: '245 KB',
      statusMsgs: [
        'Extrayendo datos de emisor y comprador...',
        'Validando firma digital DIAN...',
        'Cotejando valores y subpartidas...'
      ]
    },
    {
      id: 2,
      defaultName: 'Lista_de_Empaque_Contenedor_20ft.pdf',
      defaultSize: '180 KB',
      statusMsgs: [
        'Inspeccionando pesos brutos y netos...',
        'Conciliando cubicaje y número de bultos...',
        'Verificando sellos de seguridad...'
      ]
    },
    {
      id: 3,
      defaultName: 'Vistos_Buenos_INVIMA_FDA_Miami.pdf',
      defaultSize: '512 KB',
      statusMsgs: [
        'Consultando registro sanitario INVIMA...',
        'Comprobando código de establecimiento FDA...',
        'Certificación de inocuidad validada...'
      ]
    }
  ];

  // Estado de los archivos adjuntos cargados
  const uploadedFiles = {
    1: null,
    2: null,
    3: null
  };

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  // Simulación de carga realista con barra de progreso
  function simulateFileUpload(slotId, fileObj) {
    const card = document.getElementById(`uploadCard${slotId}`);
    const button = document.getElementById(`btnUpload${slotId}`);
    const progressContainer = document.getElementById(`progressContainer${slotId}`);
    const progressBar = document.getElementById(`progressBar${slotId}`);
    const filenameTxt = document.getElementById(`filenameTxt${slotId}`);
    const percentTxt = document.getElementById(`percentTxt${slotId}`);
    const statusTxt = document.getElementById(`statusTxt${slotId}`);
    const completedBadge = document.getElementById(`completedBadge${slotId}`);
    const badgeName = document.getElementById(`badgeName${slotId}`);
    const badgeSize = document.getElementById(`badgeSize${slotId}`);
    const fileInput = document.getElementById(`fileInput${slotId}`);

    const config = uploadConfigs[slotId - 1];
    const fileName = fileObj ? fileObj.name : config.defaultName;
    const fileSize = fileObj ? formatBytes(fileObj.size) : config.defaultSize;

    // Guardar en el estado global
    uploadedFiles[slotId] = {
      name: fileName,
      size: fileSize
    };

    // Preparar UI para la carga
    button.style.display = 'none';
    if (completedBadge) completedBadge.style.display = 'none';
    progressContainer.classList.add('active');
    filenameTxt.innerText = fileName;
    percentTxt.innerText = '0%';
    progressBar.style.width = '0%';
    statusTxt.innerText = config.statusMsgs[0];

    let progress = 0;
    const interval = setInterval(() => {
      // Incrementos variados para sensación de procesamiento orgánico
      const step = Math.floor(Math.random() * 18) + 12;
      progress += step;

      if (progress >= 35 && progress < 70) {
        statusTxt.innerText = config.statusMsgs[1];
      } else if (progress >= 70 && progress < 98) {
        statusTxt.innerText = config.statusMsgs[2];
      }

      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        progressBar.style.width = '100%';
        percentTxt.innerText = '100%';
        statusTxt.innerText = '¡Documento verificado y seguro!';

        // Pequeña pausa antes de mostrar el estado final verde
        setTimeout(() => {
          progressContainer.classList.remove('active');
          button.style.display = 'flex';
          button.classList.add('uploaded');
          button.innerHTML = '<span>Cargado exitosamente ✅</span>';
          card.classList.add('uploaded');

          badgeName.innerText = fileName;
          badgeSize.innerText = `(${fileSize})`;
          completedBadge.style.display = 'flex';
        }, 350);
      } else {
        progressBar.style.width = `${progress}%`;
        percentTxt.innerText = `${progress}%`;
      }
    }, 70);
  }

  // Inicializar cada slot de carga
  [1, 2, 3].forEach(slotId => {
    const card = document.getElementById(`uploadCard${slotId}`);
    const button = document.getElementById(`btnUpload${slotId}`);
    const fileInput = document.getElementById(`fileInput${slotId}`);
    const btnReupload = document.getElementById(`btnReupload${slotId}`);

    if (!card || !fileInput) return;

    // Evento al seleccionar archivo desde el explorador del sistema operativo
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        simulateFileUpload(slotId, e.target.files[0]);
      }
    });

    // Soporte Drag and Drop
    card.addEventListener('dragover', (e) => {
      e.preventDefault();
      card.classList.add('dragover');
    });

    card.addEventListener('dragleave', () => {
      card.classList.remove('dragover');
    });

    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        simulateFileUpload(slotId, e.dataTransfer.files[0]);
      } else {
        simulateFileUpload(slotId, null);
      }
    });

    // Clic en el botón si no se escogió archivo específico
    button.addEventListener('click', (e) => {
      // Si aún no está cargado o si el usuario quiere simular con 1 clic
      if (!button.classList.contains('uploaded')) {
        // Intentar abrir el selector nativo; si se cancela o no hay interacción, simula archivo de prueba
        simulateFileUpload(slotId, null);
      }
    });

    // Botón "Cambiar" para reintentar la subida
    if (btnReupload) {
      btnReupload.addEventListener('click', (e) => {
        e.stopPropagation();
        card.classList.remove('uploaded');
        button.classList.remove('uploaded');
        const defaultText = button.getAttribute('data-default') || '[ 📎 Cargar Documento ]';
        button.innerHTML = `<span>${defaultText}</span>`;
        const completedBadge = document.getElementById(`completedBadge${slotId}`);
        if (completedBadge) completedBadge.style.display = 'none';
        fileInput.value = '';
        uploadedFiles[slotId] = null;
        // Abrir selector nativo
        fileInput.click();
      });
    }
  });


  // =========================================================================
  // 4. PÁGINA 4: AUTOCOMPLETAR CASO DE PRUEBA (ASISTENCIA SUSTENTACIÓN EN VIVO)
  // =========================================================================
  const btnAutofill = document.getElementById('btnAutofill');
  const inputNIT = document.getElementById('empresaNIT');
  const inputSubpartida = document.getElementById('subpartida');
  const inputPesos = document.getElementById('pesos');
  const inputValorFOB = document.getElementById('valorFOB');
  const selectIncoterm = document.getElementById('incotermSelect');

  if (btnAutofill) {
    btnAutofill.addEventListener('click', () => {
      // Cargar escalonadamente los 3 archivos con animación
      [1, 2, 3].forEach((slotId, index) => {
        const button = document.getElementById(`btnUpload${slotId}`);
        if (button && !button.classList.contains('uploaded')) {
          setTimeout(() => {
            simulateFileUpload(slotId, null);
          }, index * 200);
        }
      });

      // Llenar campos con el caso real de la tesis (panificación orgánica de Santa Marta hacia Miami)
      if (inputNIT) inputNIT.value = '900.548.712-4';
      if (inputSubpartida) inputSubpartida.value = '1905900000';
      if (inputPesos) inputPesos.value = '1500 kg';
      if (inputValorFOB) inputValorFOB.value = '5000';
      if (selectIncoterm) selectIncoterm.value = 'FOB';

      // Efecto visual de retroalimentación
      const originalText = btnAutofill.innerText;
      btnAutofill.innerText = '✓ Caso de Prueba Cargado';
      btnAutofill.style.backgroundColor = '#107C41';
      btnAutofill.style.color = '#FFFFFF';
      setTimeout(() => {
        btnAutofill.innerText = originalText;
        btnAutofill.style.backgroundColor = '';
        btnAutofill.style.color = '';
      }, 2000);
    });
  }


  // =========================================================================
  // 5. PÁGINA 4: BLOQUE 3 - PROCESO DE CRUCE DE DATOS Y MODAL DE BLINDAJE
  // =========================================================================
  const btnEjecutarCruce = document.getElementById('btnEjecutarCruce');
  const processingModal = document.getElementById('processingModal');
  const processingMainBar = document.getElementById('processingMainBar');
  const processingPercentLabel = document.getElementById('processingPercentLabel');
  const processingStepLabel = document.getElementById('processingStepLabel');

  const validationModal = document.getElementById('validationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const btnModalAceptar = document.getElementById('btnModalAceptar');
  const btnModalReiniciar = document.getElementById('btnModalReiniciar');

  // Elementos de la tabla resumen del modal final
  const modalResumenNIT = document.getElementById('modalResumenNIT');
  const modalResumenSubpartida = document.getElementById('modalResumenSubpartida');
  const modalResumenIncoterm = document.getElementById('modalResumenIncoterm');
  const modalResumenArchivos = document.getElementById('modalResumenArchivos');

  function openValidationModal() {
    // Si los campos están vacíos, autocompletar con valores representativos
    const nitVal = (inputNIT && inputNIT.value.trim()) ? inputNIT.value.trim() : '900.123.456-7';
    const subpartidaVal = (inputSubpartida && inputSubpartida.value.trim()) ? inputSubpartida.value.trim() : '1905900000';
    const incotermVal = (selectIncoterm && selectIncoterm.value) ? selectIncoterm.value : 'FOB';

    // Lista de archivos para la tabla
    const file1 = uploadedFiles[1] ? uploadedFiles[1].name : uploadConfigs[0].defaultName;
    const file2 = uploadedFiles[2] ? uploadedFiles[2].name : uploadConfigs[1].defaultName;
    const file3 = uploadedFiles[3] ? uploadedFiles[3].name : uploadConfigs[2].defaultName;

    // Actualizar tabla en el modal
    if (modalResumenNIT) modalResumenNIT.innerText = `${nitVal} (RUT Código 22 Verificado)`;
    if (modalResumenSubpartida) modalResumenSubpartida.innerText = `${subpartidaVal} (Bromatología EE. UU. Validada)`;
    if (modalResumenIncoterm) modalResumenIncoterm.innerText = `${incotermVal} (Puerto de Santa Marta)`;
    if (modalResumenArchivos) {
      modalResumenArchivos.innerHTML = `
        <strong>${file1}</strong>, 
        <strong>${file2}</strong> y 
        <strong>${file3}</strong> (100% conciliados)
      `;
    }

    // Asegurar que los botones queden en verde
    [1, 2, 3].forEach(slotId => {
      const btn = document.getElementById(`btnUpload${slotId}`);
      if (btn && !btn.classList.contains('uploaded')) {
        btn.classList.add('uploaded');
        btn.innerHTML = '<span>Cargado exitosamente ✅</span>';
      }
    });

    // Mostrar modal final
    if (validationModal) {
      validationModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeValidationModal() {
    if (validationModal) {
      validationModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Ejecución del cruce con barra de progreso y auditoría paso a paso
  if (btnEjecutarCruce) {
    btnEjecutarCruce.addEventListener('click', () => {
      // Asegurar que los archivos soporte estén iniciados si el usuario no los subió
      [1, 2, 3].forEach(slotId => {
        if (!uploadedFiles[slotId]) {
          uploadedFiles[slotId] = {
            name: uploadConfigs[slotId - 1].defaultName,
            size: uploadConfigs[slotId - 1].defaultSize
          };
        }
      });

      // Mostrar modal de procesamiento
      if (processingModal) {
        processingModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }

      // Reiniciar checklist
      const auditSteps = [
        document.getElementById('auditStep1'),
        document.getElementById('auditStep2'),
        document.getElementById('auditStep3'),
        document.getElementById('auditStep4'),
        document.getElementById('auditStep5')
      ];

      auditSteps.forEach(step => {
        if (step) {
          step.className = 'audit-manifest-row';
          const icon = step.querySelector('.audit-icon');
          if (icon) icon.innerText = '⏳';
        }
      });

      // Secuencia animada de 5 pasos con barra de progreso
      const timeline = [
        { progress: 20, label: 'Conciliando Factura vs. Lista de Empaque...', stepIndex: 0 },
        { progress: 45, label: 'Auditando Subpartida y Vistos Buenos...', stepIndex: 1 },
        { progress: 65, label: 'Verificando Código 22 en base de datos DIAN...', stepIndex: 2 },
        { progress: 85, label: 'Cotejando Pesos, Valor FOB e Incoterm acordado...', stepIndex: 3 },
        { progress: 100, label: 'Control de contingencia Decreto Ley 920 finalizado', stepIndex: 4 }
      ];

      timeline.forEach((item, idx) => {
        setTimeout(() => {
          if (processingMainBar) processingMainBar.style.width = `${item.progress}%`;
          if (processingPercentLabel) processingPercentLabel.innerText = `${item.progress}%`;
          if (processingStepLabel) processingStepLabel.innerText = item.label;

          // Marcar el paso actual como completado
          const currentStep = auditSteps[item.stepIndex];
          if (currentStep) {
            currentStep.className = 'audit-manifest-row done';
            const icon = currentStep.querySelector('.audit-icon');
            if (icon) icon.innerText = '✅';
          }
        }, idx * 450);
      });

      // Al terminar toda la secuencia, cerrar procesamiento y abrir modal final
      setTimeout(() => {
        if (processingModal) processingModal.classList.remove('active');
        openValidationModal();
      }, 5 * 450 + 250);
    });
  }

  // Cerrar modales
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeValidationModal);
  
  if (btnModalAceptar) {
    btnModalAceptar.addEventListener('click', () => {
      alert('Transmisión exitosa: Declaración de Exportación (DEX) blindada y radicada satisfactoriamente ante el sistema de la DIAN.');
      closeValidationModal();
    });
  }

  if (btnModalReiniciar) {
    btnModalReiniciar.addEventListener('click', () => {
      // Limpiar formulario
      if (inputNIT) inputNIT.value = '';
      if (inputSubpartida) inputSubpartida.value = '';
      if (inputPesos) inputPesos.value = '';
      if (inputValorFOB) inputValorFOB.value = '';
      if (selectIncoterm) selectIncoterm.selectedIndex = 0;

      // Limpiar archivos cargados
      [1, 2, 3].forEach(slotId => {
        const card = document.getElementById(`uploadCard${slotId}`);
        const button = document.getElementById(`btnUpload${slotId}`);
        const fileInput = document.getElementById(`fileInput${slotId}`);
        const completedBadge = document.getElementById(`completedBadge${slotId}`);

        if (card) card.classList.remove('uploaded');
        if (button) {
          button.classList.remove('uploaded');
          const defaultText = button.getAttribute('data-default') || '[ 📎 Cargar Documento ]';
          button.innerHTML = `<span>${defaultText}</span>`;
        }
        if (completedBadge) completedBadge.style.display = 'none';
        if (fileInput) fileInput.value = '';
        uploadedFiles[slotId] = null;
      });

      closeValidationModal();
    });
  }

  // Cerrar al hacer clic en el backdrop oscuro
  if (validationModal) {
    validationModal.addEventListener('click', (e) => {
      if (e.target === validationModal) {
        closeValidationModal();
      }
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (validationModal && validationModal.classList.contains('active')) {
        closeValidationModal();
      }
      if (processingModal && processingModal.classList.contains('active')) {
        processingModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });


  // =========================================================================
  // 6. PANEL DE AUTORES EN EL FOOTER (CRÉDITOS ACADÉMICOS)
  // =========================================================================
  const authorsToggleBtn = document.getElementById('authorsToggleBtn');
  const authorsPanel = document.getElementById('authorsPanel');

  if (authorsToggleBtn && authorsPanel) {
    authorsToggleBtn.addEventListener('click', () => {
      authorsPanel.classList.toggle('visible');
      const isVisible = authorsPanel.classList.contains('visible');
      authorsToggleBtn.innerText = isVisible
        ? '✖ Ocultar ficha académica'
        : 'ℹ️ Ver equipo de investigación y ficha académica';
    });
  }

});
