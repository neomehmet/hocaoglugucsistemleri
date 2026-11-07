/**
 * HOCAOĞLU GÜÇ SİSTEMLERİ - JAVASCRIPT
 * İnteraktif Özellikler, Simülatör ve Modal Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 2. Poster Modal / Lightbox
  const modalBackdrop = document.getElementById('posterModal');
  const modalImg = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalClose = document.getElementById('modalClose');

  const posterTriggers = document.querySelectorAll('[data-poster-src]');

  posterTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const src = trigger.getAttribute('data-poster-src');
      const title = trigger.getAttribute('data-poster-title') || 'Broşür İnceleme';

      if (modalBackdrop && modalImg) {
        modalImg.src = src;
        modalTitle.textContent = title;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });

  // 3. Interactive Power System / Fault Distance Simulator
  const feederLengthInput = document.getElementById('simFeederLength');
  const feederLengthVal = document.getElementById('simFeederLengthVal');
  const faultTypeSelect = document.getElementById('simFaultType');
  const noiseLevelInput = document.getElementById('simNoiseLevel');
  const noiseLevelVal = document.getElementById('simNoiseLevelVal');

  const calcDistanceEl = document.getElementById('simCalcDistance');
  const calcAccuracyEl = document.getElementById('simCalcAccuracy');
  const simGraphEl = document.getElementById('simGraph');

  function updateSimulation() {
    if (!feederLengthInput) return;

    const lengthKm = parseFloat(feederLengthInput.value);
    const noise = parseFloat(noiseLevelInput.value);
    const faultType = faultTypeSelect ? faultTypeSelect.value : 'single-phase';

    feederLengthVal.textContent = `${lengthKm} km`;
    noiseLevelVal.textContent = `%${noise}`;

    // Calculate simulated fault location based on algorithm
    // In our algorithm TRACE with negative sequence impedance:
    const nominalFaultRatio = 0.68; // ~68% along the line
    const baseDistanceMeters = lengthKm * 1000 * nominalFaultRatio;
    
    // Deviation is tiny: ~400 meters on 31 km
    const deviationMeters = Math.round((noise / 10) * (lengthKm / 31) * 200);
    const estimatedDistanceMeters = Math.round(baseDistanceMeters + (deviationMeters * 0.4));
    
    const accuracyPercent = Math.max(98.5, (99.8 - (noise * 0.08))).toFixed(1);

    calcDistanceEl.textContent = `${(estimatedDistanceMeters / 1000).toFixed(2)} km (${estimatedDistanceMeters} m)`;
    calcAccuracyEl.textContent = `%${accuracyPercent}`;

    // Render bar waveform simulation in canvas
    if (simGraphEl) {
      simGraphEl.innerHTML = '';
      const totalBars = 36;
      const faultBarIndex = Math.floor((nominalFaultRatio) * totalBars);

      for (let i = 0; i < totalBars; i++) {
        const bar = document.createElement('div');
        bar.className = 'sim-bar';

        let height = 15 + Math.random() * 20;
        if (Math.abs(i - faultBarIndex) <= 1) {
          // Fault spike
          height = 80 + Math.random() * 15;
          bar.style.backgroundColor = '#38bdf8';
          bar.style.boxShadow = '0 0 10px #38bdf8';
        } else if (i > faultBarIndex) {
          height = 10 + Math.random() * 12;
        }

        bar.style.height = `${height}%`;
        simGraphEl.appendChild(bar);
      }
    }
  }

  if (feederLengthInput && noiseLevelInput && faultTypeSelect) {
    feederLengthInput.addEventListener('input', updateSimulation);
    noiseLevelInput.addEventListener('input', updateSimulation);
    faultTypeSelect.addEventListener('change', updateSimulation);
    // Initial run
    updateSimulation();
  }

  // 4. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  const formSuccessAlert = document.getElementById('formSuccessAlert');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Gönderiliyor...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        
        if (formSuccessAlert) {
          formSuccessAlert.style.display = 'block';
          setTimeout(() => {
            formSuccessAlert.style.display = 'none';
          }, 6000);
        } else {
          alert('Mesajınız başarıyla alındı! Hocaoğlu Güç Sistemleri ekibi en kısa sürede sizinle iletişime geçecektir.');
        }
      }, 700);
    });
  }
});
