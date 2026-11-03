/**
 * ============================================================================
 * MAIN.JS - 100% Pure Client-Side JavaScript
 * Special 23rd Birthday Website for Riki Baihaki (HTML + CSS + JS Murni)
 * Fitur: Multi-Page Stepper (Click-Based), Foto Permanen Hosting, Virtual Cake, Wish Box
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. STAR & SHOOTING STAR CANVAS BACKGROUND
  // --------------------------------------------------------------------------
  const initStarCanvas = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    });

    let mouseX = width / 2;
    let mouseY = height / 2;
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const stars = [];
    const starCount = Math.floor((width * height) / 7000);

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.8 + 0.5;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
        this.parallaxFactor = (this.size / 2) * 0.015;
        this.color = Math.random() > 0.7 ? '#ffd166' : Math.random() > 0.4 ? '#caf0f8' : '#ffffff';
      }
      update() {
        this.alpha += this.twinkleSpeed * this.twinkleDir;
        if (this.alpha > 1) {
          this.alpha = 1;
          this.twinkleDir = -1;
        } else if (this.alpha < 0.2) {
          this.alpha = 0.2;
          this.twinkleDir = 1;
        }
      }
      draw() {
        const px = this.x + (mouseX - width / 2) * this.parallaxFactor;
        const py = this.y + (mouseY - height / 2) * this.parallaxFactor;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(px, py, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * (height * 0.4);
        this.length = Math.random() * 80 + 40;
        this.speed = Math.random() * 6 + 4;
        this.size = Math.random() * 1.5 + 1;
        this.angle = Math.PI / 4;
        this.active = false;
        this.opacity = 1;
        this.wait = Math.random() * 400 + 100;
      }
      update() {
        if (!this.active) {
          this.wait--;
          if (this.wait <= 0) {
            this.active = true;
          }
          return;
        }

        this.x += this.speed * Math.cos(this.angle);
        this.y += this.speed * Math.sin(this.angle);
        this.opacity -= 0.015;

        if (this.opacity <= 0 || this.x > width || this.y > height) {
          this.reset();
        }
      }
      draw() {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.opacity);
        const grad = ctx.createLinearGradient(
          this.x,
          this.y,
          this.x - this.length * Math.cos(this.angle),
          this.y - this.length * Math.sin(this.angle)
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.5, '#90e0ef');
        grad.addColorStop(1, 'transparent');

        ctx.strokeStyle = grad;
        ctx.lineWidth = this.size;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - this.length * Math.cos(this.angle),
          this.y - this.length * Math.sin(this.angle)
        );
        ctx.stroke();
        ctx.restore();
      }
    }

    const createStars = () => {
      stars.length = 0;
      for (let i = 0; i < starCount; i++) {
        stars.push(new Star());
      }
    };

    createStars();
    const shootingStars = [new ShootingStar(), new ShootingStar()];

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.update();
        s.draw();
      });

      shootingStars.forEach((ss) => {
        ss.update();
        ss.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  };

  initStarCanvas();

  // --------------------------------------------------------------------------
  // 2. AUDIO ENGINE & SYNTHESIZER FALLBACK (PURE WEB AUDIO API)
  // --------------------------------------------------------------------------
  const audioElement = document.getElementById('bgm-audio');
  const audioWidget = document.getElementById('floating-audio');
  const btnAudioToggle = document.getElementById('btn-audio-toggle');
  const audioDisc = document.getElementById('audio-disc');
  let isPlaying = false;
  let synthInterval = null;
  let audioCtx = null;

  const startSynthPianoMelody = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      if (!audioCtx) audioCtx = new AudioContext();

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      // Melodi nada romantis
      const notes = [
        261.63, 329.63, 392.0, 523.25, // C4, E4, G4, C5
        293.66, 349.23, 440.0, 587.33, // D4, F4, A4, D5
        329.63, 392.0, 493.88, 659.25, // E4, G4, B4, E5
        261.63, 329.63, 392.0, 523.25
      ];
      let noteIndex = 0;

      const playTone = (freq) => {
        if (!isPlaying || !audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 1.3);
      };

      if (synthInterval) clearInterval(synthInterval);
      synthInterval = setInterval(() => {
        if (!isPlaying) return;
        playTone(notes[noteIndex]);
        noteIndex = (noteIndex + 1) % notes.length;
      }, 600);
    } catch (e) {
      console.warn('Synth audio fallback warning:', e);
    }
  };

  const stopSynthPianoMelody = () => {
    if (synthInterval) {
      clearInterval(synthInterval);
      synthInterval = null;
    }
  };

  const updateAudioUI = (playing) => {
    isPlaying = playing;
    if (!audioWidget || !audioDisc || !btnAudioToggle) return;
    if (playing) {
      audioWidget.classList.add('playing');
      audioDisc.classList.add('spinning');
      btnAudioToggle.innerHTML = '<i class="fa-solid fa-pause"></i>';
      btnAudioToggle.setAttribute('title', 'Pause Musik');
    } else {
      audioWidget.classList.remove('playing');
      audioDisc.classList.remove('spinning');
      btnAudioToggle.innerHTML = '<i class="fa-solid fa-play"></i>';
      btnAudioToggle.setAttribute('title', 'Play Musik');
    }
  };

  const playMusic = () => {
    if (audioElement && audioElement.src && !audioElement.error) {
      audioElement
        .play()
        .then(() => {
          updateAudioUI(true);
        })
        .catch(() => {
          updateAudioUI(true);
          startSynthPianoMelody();
        });
    } else {
      updateAudioUI(true);
      startSynthPianoMelody();
    }
  };

  const pauseMusic = () => {
    if (audioElement) {
      audioElement.pause();
    }
    stopSynthPianoMelody();
    updateAudioUI(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  if (btnAudioToggle) btnAudioToggle.addEventListener('click', toggleMusic);
  if (audioDisc) audioDisc.addEventListener('click', toggleMusic);

  // --------------------------------------------------------------------------
  // 3. CURTAIN OPENING & SURPRISE TRIGGER
  // --------------------------------------------------------------------------
  const curtain = document.getElementById('welcome-curtain');
  const btnOpenSurprise = document.getElementById('btn-open-surprise');
  const typewriterTarget = document.getElementById('typewriter-title');

  const runTypewriter = (text, element, speed = 75) => {
    if (!element) return;
    element.textContent = '';
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  };

  if (btnOpenSurprise && curtain) {
    btnOpenSurprise.addEventListener('click', () => {
      curtain.classList.add('hidden');
      playMusic();
      fireGrandConfetti();
      goToPage(1);
      setTimeout(() => {
        runTypewriter('Happy 23rd Birthday, Riki Baihaki! 💙', typewriterTarget, 65);
      }, 500);
    });
  }

  // --------------------------------------------------------------------------
  // 4. CONFETTI GENERATORS (Menggunakan Canvas Confetti)
  // --------------------------------------------------------------------------
  const fireGrandConfetti = () => {
    if (typeof confetti !== 'function') return;

    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#0077b6', '#48cae4', '#90e0ef', '#ffd166', '#ffffff']
    };

    const fire = (particleRatio, opts) => {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        })
      );
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const fireStarConfetti = () => {
    if (typeof confetti !== 'function') return;
    confetti({
      shapes: ['star'],
      colors: ['#ffd166', '#ffe6a7', '#90e0ef', '#ffffff'],
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  // --------------------------------------------------------------------------
  // 5. STORY STEPPER & PAGINATION ENGINE (Click-Based Multi-Step Navigation)
  // Tidak perlu scroll ke bawah, navigasi sepenuhnya melalui tombol klik!
  // --------------------------------------------------------------------------
  const storyPages = document.querySelectorAll('.story-page');
  const storyTabs = document.querySelectorAll('.story-tab');
  const currentPageText = document.getElementById('current-page-text');
  let currentPage = 1;
  const totalPages = storyPages.length || 5;

  const goToPage = (pageNum) => {
    if (pageNum < 1) pageNum = 1;
    if (pageNum > totalPages) pageNum = totalPages;
    currentPage = pageNum;

    // Aktifkan slide yang sesuai
    storyPages.forEach((page, index) => {
      const pageIndex = index + 1;
      if (pageIndex === pageNum) {
        page.classList.add('active');
      } else {
        page.classList.remove('active');
      }
    });

    // Perbarui tab atas
    storyTabs.forEach((tab) => {
      const tabNum = parseInt(tab.dataset.page);
      if (tabNum === pageNum) {
        tab.classList.add('active');
        tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        tab.classList.remove('active');
      }
    });

    // Perbarui badge nomor halaman
    if (currentPageText) {
      currentPageText.textContent = `Halaman ${pageNum} / ${totalPages}`;
    }

    // Scroll mulus ke bagian atas halaman
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Efek khusus jika masuk ke halaman Lilin atau Galeri
    if (pageNum === 3 && candlesBlown) {
      fireStarConfetti();
    }
  };

  // Klik tab di navbar atas
  storyTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const pageNum = parseInt(tab.dataset.page);
      if (!isNaN(pageNum)) goToPage(pageNum);
    });
  });

  // Klik tombol navigasi (Halaman Selanjutnya / Halaman Sebelumnya)
  document.querySelectorAll('[data-goto]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetPage = parseInt(btn.dataset.goto);
      if (!isNaN(targetPage)) goToPage(targetPage);
    });
  });

  // Navigasi keyboard (Panah Kanan = Selanjutnya, Panah Kiri = Sebelumnya)
  document.addEventListener('keydown', (e) => {
    // Abaikan jika user sedang mengetik di input / textarea
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea') return;

    if (e.key === 'ArrowRight') {
      if (currentPage < totalPages) goToPage(currentPage + 1);
    } else if (e.key === 'ArrowLeft') {
      if (currentPage > 1) goToPage(currentPage - 1);
    }
  });

  // --------------------------------------------------------------------------
  // 6. INTERACTIVE VIRTUAL BIRTHDAY CAKE & TIUP LILIN
  // --------------------------------------------------------------------------
  const btnBlowCandle = document.getElementById('btn-blow-candle');
  const flames = document.querySelectorAll('.candle-flame');
  const smokePuffs = document.querySelectorAll('.smoke-puff');
  const cakeWishBanner = document.getElementById('cake-wish-banner');
  let candlesBlown = false;

  if (btnBlowCandle) {
    btnBlowCandle.addEventListener('click', () => {
      if (!candlesBlown) {
        flames.forEach((flame) => flame.classList.add('blown-out'));
        smokePuffs.forEach((smoke) => {
          smoke.classList.add('active');
          setTimeout(() => smoke.classList.remove('active'), 1800);
        });

        fireGrandConfetti();
        setTimeout(fireStarConfetti, 400);

        if (cakeWishBanner) cakeWishBanner.style.display = 'block';
        btnBlowCandle.innerHTML = '<i class="fa-solid fa-fire-flame-curved"></i> Nyalakan Lilin Lagi';
        btnBlowCandle.classList.add('re-light');
        candlesBlown = true;
      } else {
        flames.forEach((flame) => flame.classList.remove('blown-out'));
        if (cakeWishBanner) cakeWishBanner.style.display = 'none';

        btnBlowCandle.innerHTML = '<i class="fa-solid fa-wind"></i> Tiup Lilin Sekarang';
        btnBlowCandle.classList.remove('re-light');
        candlesBlown = false;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. DYNAMIC GALLERY ENGINE (PERMANENT PHOTOS FOR HOSTING + INDEXEDDB)
  // Foto & Deskripsi permanen disimpan langsung sebagai aset fisik file gambar
  // Tidak akan pernah hilang saat dihosting di server / dibuka di perangkat Riki!
  // --------------------------------------------------------------------------
  const permanentMoments = [
    {
      id: 'permanent_1',
      image: 'assets/img/photo1.jpg',
      badge: 'Kencan Manis',
      title: 'Kencan Makan Terindah',
      desc: 'Ini foto kita berdua disela ketika kita sedang menunggu makanan datang yaitu pecel ayam , momen ini lah makanan terasa menjadi enak karena makan nya bersama mu',
      is_permanent: true
    },
    {
      id: 'permanent_2',
      image: 'assets/img/photo2.jpg',
      badge: 'Nonton Date Romantis',
      title: 'Nonton',
      desc: 'Di hari libur kita ber dua menyempatkan nonton bioskop bersama dengan bahagia dan romatis',
      is_permanent: true
    },
    {
      id: 'permanent_3',
      image: 'assets/img/photo3.jpg',
      badge: 'Idul Fitri coupel 2',
      title: 'Idul Fitri 2',
      desc: 'Ini adalah momen dimana kita merayakan idul fitri coupel ke 2 kalinya bersama kamu love',
      is_permanent: true
    },
    {
      id: 'permanent_4',
      image: 'assets/img/photo4.jpg',
      badge: 'Idul Fitri Coupel 1',
      title: 'Lebaran Idul Fitri 1',
      desc: 'ini foto momen kita berdua memakai baju coupel waktu lebaran pertama kali nya , lucu kan kitaaa',
      is_permanent: true
    }
  ];

  // Helper IndexedDB untuk menyimpan foto kapasitas besar (hingga ratusan MB)
  const DB_NAME = 'RikiBirthdayGalleryDB';
  const DB_VERSION = 1;
  const STORE_NAME = 'moments';

  const openGalleryDB = () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  };

  const getCustomMoments = async () => {
    try {
      const db = await openGalleryDB();
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });
    } catch (e) {
      console.warn('IndexedDB read fallback:', e);
      return [];
    }
  };

  const getMomentById = async (id) => {
    try {
      const db = await openGalleryDB();
      return new Promise((resolve) => {
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => resolve(null);
      });
    } catch (e) {
      return null;
    }
  };

  const saveCustomMoment = async (moment) => {
    try {
      const db = await openGalleryDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put(moment);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IndexedDB save error:', e);
      return false;
    }
  };

  const deleteCustomMoment = async (id) => {
    try {
      const db = await openGalleryDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(id);
        request.onsuccess = () => resolve(true);
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      console.error('IndexedDB delete error:', e);
      return false;
    }
  };

  const galleryGrid = document.getElementById('gallery-grid');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  const closeLightbox = () => {
    if (lightboxModal) lightboxModal.classList.remove('active');
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  const bindGalleryCard = (card) => {
    if (!card) return;

    // 3D Tilt Perspective on Mousemove
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });

    // Buka Lightbox saat diklik (kecuali klik tombol action Ubah/Hapus)
    card.addEventListener('click', (e) => {
      if (e.target.closest('.gallery-card-actions')) return;

      const img = card.querySelector('.gallery-thumb');
      const title = card.querySelector('.gallery-title')?.textContent || '';
      const desc = card.querySelector('.gallery-desc')?.textContent || '';

      if (img && lightboxModal) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="opacity:0.85;font-size:0.9em;">${desc}</span>`;
        lightboxModal.classList.add('active');
      }
    });

    // Tombol Ubah / Edit Foto pada kartu
    const editBtn = card.querySelector('.gallery-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const photoId = editBtn.dataset.id || card.dataset.id;
        openEditModal(photoId);
      });
    }

    // Tombol Hapus Pigura (hanya untuk foto tambahan baru)
    const deleteBtn = card.querySelector('.gallery-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const photoId = deleteBtn.dataset.id || card.dataset.id;
        const photoTitle = card.querySelector('.gallery-title')?.textContent || 'foto ini';

        if (!confirm(`Hapus pigura "${photoTitle}" dari galeri?`)) return;

        await deleteCustomMoment(photoId);
        await renderGallery();
      });
    }
  };

  const createCardElement = (item) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.dataset.id = item.id;
    const isPermanent = item.id.startsWith('permanent_') || item.is_permanent;

    card.innerHTML = `
      <div class="gallery-card-actions">
        <button type="button" class="gallery-action-btn gallery-edit-btn" title="Ubah / Edit Foto &amp; Cerita" data-id="${item.id}">
          <i class="fa-solid fa-pen-to-square"></i> Ubah
        </button>
        ${
          !isPermanent
            ? `<button type="button" class="gallery-action-btn gallery-delete-btn" title="Hapus Pigura Ini" data-id="${item.id}">
                 <i class="fa-solid fa-trash-can"></i>
               </button>`
            : ''
        }
      </div>
      <div class="gallery-thumb-wrap">
        <img src="${item.image}" alt="${escapeHtml(item.title)}" class="gallery-thumb" loading="lazy">
        <span class="gallery-overlay-badge"><i class="fa-solid fa-star"></i> ${escapeHtml(item.badge)}</span>
      </div>
      <div class="gallery-info">
        <h3 class="gallery-title">${escapeHtml(item.title)}</h3>
        <p class="gallery-desc">${escapeHtml(item.desc)}</p>
      </div>
    `;
    bindGalleryCard(card);
    return card;
  };

  // Render Galeri:
  // Selalu menampilkan 4 foto permanen asli + menggabungkan foto baru yang ditambahkan user
  const renderGallery = async () => {
    if (!galleryGrid) return;

    const customMoments = await getCustomMoments();

    // 1. Ambil 4 momen permanen (jika user pernah mengeditnya, gunakan data editan dari IndexedDB)
    const displayPermanent = permanentMoments.map((pm) => {
      const custom = customMoments.find((cm) => cm.id === pm.id);
      return custom ? custom : pm;
    });

    // 2. Tambahkan pigura foto kenangan baru yang ditambahkan user via "+ Tambah Foto Kenangan Baru"
    const extraMoments = customMoments.filter((cm) => !cm.id.startsWith('permanent_'));

    const allMoments = [...displayPermanent, ...extraMoments];

    galleryGrid.innerHTML = '';
    allMoments.forEach((item) => {
      galleryGrid.appendChild(createCardElement(item));
    });
  };

  // Jalankan render awal galeri
  renderGallery();

  // --------------------------------------------------------------------------
  // 8. MODAL UPLOAD & EDIT FOTO (Dynamic Add / In-Place Edit)
  // --------------------------------------------------------------------------
  const uploadModal = document.getElementById('upload-modal');
  const btnOpenUpload = document.getElementById('btn-open-upload-modal');
  const uploadModalClose = document.getElementById('upload-modal-close');
  const uploadForm = document.getElementById('upload-photo-form');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const fileInput = document.getElementById('input-photo-file');
  const dropzone = document.getElementById('upload-dropzone');
  const dropzoneIdle = document.getElementById('dropzone-idle');
  const dropzonePreview = document.getElementById('dropzone-preview');
  const previewImgTag = document.getElementById('preview-img-tag');
  const btnRemovePreview = document.getElementById('btn-remove-preview');
  const btnSubmitPhoto = document.getElementById('btn-submit-photo');
  const uploadFeedback = document.getElementById('upload-feedback');
  let currentBase64Image = '';
  let editingMomentId = null;

  // Buka modal untuk mode TAMBAH foto baru (pigura bertambah otomatis)
  const openAddModal = () => {
    if (!uploadModal) return;
    editingMomentId = null;

    if (modalTitle) modalTitle.textContent = 'Tambah Foto Kenangan Baru 📸';
    if (modalDesc) modalDesc.textContent = 'Unggah foto baru bersama Riki, pigura foto baru akan otomatis bertambah ke galeri!';
    if (btnSubmitPhoto) btnSubmitPhoto.innerHTML = '<i class="fa-solid fa-plus-circle"></i> Tambah Pigura Baru';

    resetUploadForm();
    uploadModal.classList.add('active');
  };

  // Buka modal untuk mode UBAH foto yang sudah ada di kartu
  const openEditModal = async (photoId) => {
    if (!uploadModal) return;
    editingMomentId = photoId;

    if (modalTitle) modalTitle.textContent = 'Ubah Foto / Cerita Momen ✏️';
    if (modalDesc) modalDesc.textContent = 'Perbarui foto, judul, atau cerita pada pigura kenangan ini.';
    if (btnSubmitPhoto) btnSubmitPhoto.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';

    resetUploadForm();

    let moment = await getMomentById(photoId);
    if (!moment) {
      moment = permanentMoments.find((d) => d.id === photoId);
    }

    if (moment) {
      const titleInput = document.getElementById('input-photo-title');
      const badgeInput = document.getElementById('input-photo-badge');
      const descInput = document.getElementById('input-photo-desc');

      if (titleInput) titleInput.value = moment.title || '';
      if (badgeInput) badgeInput.value = moment.badge || '';
      if (descInput) descInput.value = moment.desc || '';

      if (moment.image) {
        currentBase64Image = moment.image;
        previewImgTag.src = currentBase64Image;
        if (dropzoneIdle && dropzonePreview) {
          dropzoneIdle.style.display = 'none';
          dropzonePreview.style.display = 'flex';
        }
      }
    }

    uploadModal.classList.add('active');
  };

  const closeUploadModal = () => {
    if (uploadModal) {
      uploadModal.classList.remove('active');
      resetUploadForm();
      editingMomentId = null;
    }
  };

  const resetUploadForm = () => {
    if (uploadForm) uploadForm.reset();
    currentBase64Image = '';
    if (dropzoneIdle && dropzonePreview) {
      dropzoneIdle.style.display = 'block';
      dropzonePreview.style.display = 'none';
      previewImgTag.src = '';
    }
    if (uploadFeedback) {
      uploadFeedback.style.display = 'none';
      uploadFeedback.className = 'form-feedback';
    }
  };

  if (btnOpenUpload) {
    btnOpenUpload.addEventListener('click', openAddModal);
  }

  if (uploadModalClose) uploadModalClose.addEventListener('click', closeUploadModal);

  if (uploadModal) {
    uploadModal.addEventListener('click', (e) => {
      if (e.target === uploadModal) closeUploadModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (lightboxModal && lightboxModal.classList.contains('active')) closeLightbox();
      if (uploadModal && uploadModal.classList.contains('active')) closeUploadModal();
    }
  });

  const showFilePreview = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WEBP, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      currentBase64Image = e.target.result;
      previewImgTag.src = currentBase64Image;
      if (dropzoneIdle && dropzonePreview) {
        dropzoneIdle.style.display = 'none';
        dropzonePreview.style.display = 'flex';
      }
    };
    reader.readAsDataURL(file);
  };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        showFilePreview(e.target.files[0]);
      }
    });
  }

  if (btnRemovePreview) {
    btnRemovePreview.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (fileInput) fileInput.value = '';
      currentBase64Image = '';
      if (dropzoneIdle && dropzonePreview) {
        dropzoneIdle.style.display = 'block';
        dropzonePreview.style.display = 'none';
        previewImgTag.src = '';
      }
    });
  }

  if (dropzone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach((eventName) => {
      dropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
      });
    });
    dropzone.addEventListener('drop', (e) => {
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        if (fileInput) fileInput.files = e.dataTransfer.files;
        showFilePreview(e.dataTransfer.files[0]);
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!currentBase64Image) {
        showUploadFeedback('Silakan pilih foto terlebih dahulu!', 'error');
        return;
      }

      const titleInput = document.getElementById('input-photo-title');
      const badgeInput = document.getElementById('input-photo-badge');
      const descInput = document.getElementById('input-photo-desc');

      const titleVal = titleInput ? titleInput.value.trim() : '';
      const badgeVal = badgeInput && badgeInput.value.trim() ? badgeInput.value.trim() : 'Kenangan Indah';
      const descVal =
        descInput && descInput.value.trim()
          ? descInput.value.trim()
          : 'Momen tak terlupakan bersama Riki Baihaki 💙';

      if (!titleVal) {
        showUploadFeedback('Judul momen tidak boleh kosong!', 'error');
        return;
      }

      const originalBtnHtml = btnSubmitPhoto.innerHTML;
      btnSubmitPhoto.disabled = true;
      btnSubmitPhoto.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan Foto...';

      if (editingMomentId) {
        // Mode EDIT: Perbarui pigura yang sudah ada
        const updatedMoment = {
          id: editingMomentId,
          image: currentBase64Image,
          badge: badgeVal,
          title: titleVal,
          desc: descVal,
          is_permanent: editingMomentId.startsWith('permanent_'),
          updated_at: new Date().toISOString()
        };
        await saveCustomMoment(updatedMoment);
        showUploadFeedback('✨ Pigura foto berhasil diperbarui!', 'success');
      } else {
        // Mode TAMBAH: Tambahkan pigura baru ke galeri
        const newMoment = {
          id: 'moment_' + Date.now(),
          image: currentBase64Image,
          badge: badgeVal,
          title: titleVal,
          desc: descVal,
          is_permanent: false,
          created_at: new Date().toISOString()
        };
        await saveCustomMoment(newMoment);
        showUploadFeedback('✨ Pigura foto baru berhasil ditambahkan!', 'success');
      }

      fireGrandConfetti();

      // Perbarui tampilan seluruh pigura galeri
      await renderGallery();

      setTimeout(() => {
        closeUploadModal();
      }, 900);

      btnSubmitPhoto.disabled = false;
      btnSubmitPhoto.innerHTML = originalBtnHtml;
    });
  }

  const showUploadFeedback = (msg, type) => {
    if (!uploadFeedback) return;
    uploadFeedback.textContent = msg;
    uploadFeedback.className = `form-feedback ${type}`;
    uploadFeedback.style.display = 'block';
  };

  // --------------------------------------------------------------------------
  // 9. WISH BOX & PRAYER WALL (100% Client-Side LocalStorage Persistence)
  // --------------------------------------------------------------------------
  function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showFeedback(msg, type) {
    const formFeedback = document.getElementById('form-feedback');
    if (!formFeedback) return;
    formFeedback.textContent = msg;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
  }

  const defaultWishes = [
    {
      id: 'wish_default_1',
      name: 'Your Love 💙',
      message:
        'Selamat ulang tahun yang ke-23, Riki Baihaki! Semoga di usia baru ini kamu selalu diberikan kesehatan, kelapangan rezeki, dan jalan yang dimudahkan untuk menggapai mimpi-mimpimu. Terima kasih sudah selalu jadi tempat ternyaman dan alasan untuk tersenyum setiap hari. Always proud of you, today and forever! ✨',
      reaction: '💙',
      created_at: '29 Okt 2026, 00:01 WIB'
    },
    {
      id: 'wish_default_2',
      name: 'Bagas & Teman-teman',
      message:
        'Happy 23rd birthday Riki! Panjang umur, makin bersinar kariernya, dan traktirannya jangan lupa ya bro! 🥳🎂',
      reaction: '🎂',
      created_at: '29 Okt 2026, 08:15 WIB'
    }
  ];

  const WISHES_STORAGE_KEY = 'riki_birthday_wishes_storage';
  let inMemoryWishes = [...defaultWishes];

  const getStoredWishes = () => {
    try {
      if (typeof window.localStorage !== 'undefined') {
        const data = localStorage.getItem(WISHES_STORAGE_KEY);
        if (data) {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed) && parsed.length > 0) {
            inMemoryWishes = parsed;
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage read fallback:', e);
    }
    // Jika belum ada di localStorage, simpan defaultWishes
    saveStoredWishes(defaultWishes);
    return inMemoryWishes;
  };

  const saveStoredWishes = (wishes) => {
    inMemoryWishes = wishes;
    try {
      if (typeof window.localStorage !== 'undefined') {
        localStorage.setItem(WISHES_STORAGE_KEY, JSON.stringify(wishes));
      }
    } catch (e) {
      console.warn('LocalStorage save fallback:', e);
    }
  };

  const wishForm = document.getElementById('wish-form');
  const wishList = document.getElementById('wish-list');
  const wishCountBadge = document.getElementById('wish-count-badge');

  const renderWishes = () => {
    if (!wishList) return;
    const wishes = getStoredWishes();

    if (wishCountBadge) {
      wishCountBadge.textContent = `${wishes.length} Ucapan`;
    }

    if (wishes.length === 0) {
      wishList.innerHTML = `
        <div class="empty-wishes">
          <i class="fa-regular fa-comment-dots" style="font-size: 2rem; margin-bottom: 0.8rem; display:block; opacity:0.5;"></i>
          Belum ada ucapan yang masuk. Jadilah yang pertama mengirimkan doa untuk Riki!
        </div>
      `;
      return;
    }

    wishList.innerHTML = '';
    wishes.forEach((item) => {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.innerHTML = `
        <div class="wish-meta">
          <div class="wish-author">
            <span class="wish-emoji">${escapeHtml(item.reaction || '💙')}</span>
            <span class="wish-name">${escapeHtml(item.name)}</span>
          </div>
          <span class="wish-time">${escapeHtml(item.created_at)}</span>
        </div>
        <p class="wish-text">${escapeHtml(item.message)}</p>
      `;
      wishList.appendChild(wishItem);
    });
  };

  // Jalankan render awal ucapan
  renderWishes();

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('wish-name');
      const messageInput = document.getElementById('wish-message');
      const reactionRadio = document.querySelector('input[name="reaction"]:checked');

      const nameVal = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'Seseorang yang Menyayangimu';
      const messageVal = messageInput ? messageInput.value.trim() : '';
      const reactionVal = reactionRadio ? reactionRadio.value : '💙';

      if (!messageVal) {
        showFeedback('Pesan ucapan tidak boleh kosong!', 'error');
        return;
      }

      // Format tanggal lokal Indonesia
      const now = new Date();
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = String(now.getDate()).padStart(2, '0');
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedDate = `${day} ${month} ${year}, ${hours}:${minutes} WIB`;

      const newWish = {
        id: 'wish_' + Date.now(),
        name: nameVal,
        message: messageVal,
        reaction: reactionVal,
        created_at: formattedDate
      };

      const currentWishes = getStoredWishes();
      currentWishes.unshift(newWish);
      saveStoredWishes(currentWishes);

      showFeedback('✨ Doa dan ucapan manismu berhasil terkirim!', 'success');
      wishForm.reset();
      renderWishes();
      fireStarConfetti();
    });
  }

  // --------------------------------------------------------------------------
  // 10. INTERACTIVE FLOATING HEARTS (FOOTER EASTER EGG)
  // --------------------------------------------------------------------------
  const footerHeart = document.getElementById('footer-heart');
  if (footerHeart) {
    footerHeart.addEventListener('click', (e) => {
      const heartCount = 12;
      for (let i = 0; i < heartCount; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = ['💙', '✨', '💖', '🤍'][Math.floor(Math.random() * 4)];
        heart.style.position = 'fixed';
        heart.style.left = `${e.clientX + (Math.random() * 60 - 30)}px`;
        heart.style.top = `${e.clientY + (Math.random() * 30 - 15)}px`;
        heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
        heart.style.pointerEvents = 'none';
        heart.style.zIndex = '99999';
        heart.style.transition = 'all 1.5s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.appendChild(heart);

        setTimeout(() => {
          heart.style.transform = `translateY(-${Math.random() * 180 + 100}px) scale(1.4)`;
          heart.style.opacity = '0';
        }, 30);

        setTimeout(() => heart.remove(), 1600);
      }
    });
  }
});
