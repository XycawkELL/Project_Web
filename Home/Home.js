// --- STATE MANAGEMENT ---
let favorites = JSON.parse(localStorage.getItem('temutrip_favs')) || [];
let currentMood = 'all';
let searchQuery = '';
let sortMode = 'default';
let ratingFilter = 'all';
let activeModalId = null;

// Daftar gambar untuk Slider Hero Banner
const heroBgImages = [
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80', 
  'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?auto=format&fit=crop&w=1600&q=80', 
  'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=1600&q=80', 
  'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?auto=format&fit=crop&w=1600&q=80'  
];
let currentHeroSlide = 0;
let heroSlideInterval;

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  updateNavStyle();
  updateFavBadge();
  initHeroSlider(); 
  renderHome();
  renderAllDestinations();

  const hash = window.location.hash.replace('#', '');
  if (['home', 'destinations', 'favorites', 'about'].includes(hash)) {
    showPage(hash);
  }

  // SINKRONISASI OTOMATIS PROFIL
  const displayName = document.getElementById("profile-display-name");
  if (displayName && localStorage.getItem("p_name")) {
    displayName.textContent = localStorage.getItem("p_name");
  }

  const displayHandle = document.getElementById("profile-display-handle");
  if (displayHandle && localStorage.getItem("p_name")) {
    const cleanHandle = localStorage.getItem("p_name").toLowerCase().replace(/\s+/g, '_');
    displayHandle.textContent = `@${cleanHandle}_traveler`;
  }
  
  const savedAvatar = localStorage.getItem("user_avatar");
  if (savedAvatar) {
    const profileImg = document.getElementById("profileAvatar");
    if (profileImg) profileImg.src = savedAvatar;
    
    const navProfileImg = document.getElementById("navProfileAvatar");
    if (navProfileImg) navProfileImg.src = savedAvatar;

    document.querySelectorAll(".nav-profile-img, .navbar-avatar").forEach(img => {
      img.src = savedAvatar;
    });
  }
});

// --- HERO SLIDER LOGIC ---
function initHeroSlider() {
  const sliderContainer = document.getElementById('hero-slider');
  if (!sliderContainer) return; 

  sliderContainer.innerHTML = heroBgImages.map((src, index) =>
    `<img src="${src}" class="hero-slide-img ${index === 0 ? 'active' : ''}" alt="Hero ${index+1}">`
  ).join('');

  startHeroAutoSlide();
}

function changeHeroSlide(direction) {
  clearInterval(heroSlideInterval); 
  currentHeroSlide = (currentHeroSlide + direction + heroBgImages.length) % heroBgImages.length;
  updateHeroDOM();
  startHeroAutoSlide(); 
}

function startHeroAutoSlide() {
  heroSlideInterval = setInterval(() => {
    currentHeroSlide = (currentHeroSlide + 1) % heroBgImages.length;
    updateHeroDOM();
  }, 5000); 
}

function updateHeroDOM() {
  const slides = document.querySelectorAll('.hero-slide-img');
  if (slides.length === 0) return;
  slides.forEach((slide, i) => {
    if (i === currentHeroSlide) slide.classList.add('active');
    else slide.classList.remove('active');
  });
}

// --- NAVBAR EFFECT ---
window.addEventListener('scroll', updateNavStyle);
function updateNavStyle() {
  const nav = document.getElementById('navbar');
  const topBtn = document.getElementById('scrollToTopBtn');
  if (!nav || !topBtn) return;
  
  if (window.scrollY > 20) nav.classList.add('glass-nav');
  else nav.classList.remove('glass-nav');

  if (window.scrollY > 300) topBtn.classList.add('visible');
  else topBtn.classList.remove('visible');
}

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- NAVIGATION & TABS ---
function showPage(pageId) {
  const pageSections = document.querySelectorAll('.page-section');
  if (pageSections.length === 0) return;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    if(btn.dataset.target === pageId) btn.classList.add('active');
    else btn.classList.remove('active');
  });

  pageSections.forEach(page => page.classList.remove('page-active'));
  
  const targetPage = document.getElementById(`page-${pageId}`);
  if(targetPage) targetPage.classList.add('page-active');
  
  window.scrollTo(0, 0);

  if(pageId === 'destinations') renderAllDestinations();
  if(pageId === 'favorites') renderFavorites();
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  if(menu) menu.classList.toggle('active');
}

// --- HTML RENDERERS ---
function createCardHTML(dest, delayIndex = 0) {
  const isFav = favorites.includes(dest.id);
  // Modifikasi: Mengubah koma menjadi titik peluru (bullet) yang estetik
  const displayMood = dest.mood.replace(/,/g, ' • ');
  return `
    <div class="dest-card" onclick="openModal(${dest.id})">
      <div class="dest-card-img-wrap">
        <img src="${dest.img}" alt="${dest.name}" class="dest-card-img" loading="lazy">
        <div class="dest-card-overlay"></div>
        <span class="dest-card-tag">${displayMood}</span>
        <button class="dest-card-fav ${isFav ? 'is-fav' : ''}" onclick="event.stopPropagation(); toggleFav(${dest.id})">
          <i class="${isFav ? 'ph-fill' : 'ph'} ph-bookmark-simple"></i>
        </button>
      </div>
      <div class="dest-card-body">
        <div class="dest-card-header">
          <h3 class="dest-card-title">${dest.name}</h3>
          <span class="dest-card-rating"><i class="ph-fill ph-star"></i> ${dest.rating}</span>
        </div>
        <p class="dest-card-loc"><i class="ph-fill ph-map-pin"></i> ${dest.loc}</p>
        <div class="dest-card-action">Lihat Detail <i class="ph ph-arrow-right"></i></div>
      </div>
    </div>
  `;
}

function createTrendingHTML(dest, index) {
  return `
    <div class="trending-card" onclick="openModal(${dest.id})">
      <img src="${dest.img}" alt="${dest.name}" loading="lazy">
      <div class="trending-card-overlay"></div>
      <div class="trending-card-info">
        <h3 class="trending-card-title">${dest.name}</h3>
        <p class="trending-card-meta"><i class="ph-fill ph-map-pin"></i> ${dest.loc} • ⭐ ${dest.rating}</p>
      </div>
    </div>
  `;
}

// --- SLIDER TRENDING ---
function slideTrending(direction) {
  const row = document.getElementById('trendingRow');
  if(!row) return;
  const scrollAmount = 304; 
  if (direction === 'left') row.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
  else row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}

function renderHome() {
  const trendingRow = document.getElementById('trendingRow');
  const featuredGrid = document.getElementById('featuredGrid');
  if(!trendingRow || !featuredGrid) return;

  const trendingData = [...destinations].sort((a,b) => b.popular - a.popular).slice(0, 5);
  trendingRow.innerHTML = trendingData.map((d, i) => createTrendingHTML(d, i)).join('');
  featuredGrid.innerHTML = destinations.slice(0, 9).map((d, i) => createCardHTML(d, i)).join('');
}

function renderAllDestinations() {
  const grid = document.getElementById('allGrid');
  const noResult = document.getElementById('noResult');
  if(!grid || !noResult) return;

  let filtered = destinations;
  if (searchQuery) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(searchQuery) || 
      d.loc.toLowerCase().includes(searchQuery) || 
      d.mood.toLowerCase().includes(searchQuery)
    );
  }
  
  // Modifikasi: Menggunakan .includes() agar bisa membaca gabungan genre
  if (currentMood !== 'all') {
    filtered = filtered.filter(d => d.mood.toLowerCase().includes(currentMood.toLowerCase()));
  }
  
  if (ratingFilter !== 'all') filtered = filtered.filter(d => d.rating >= parseFloat(ratingFilter));
  
  if (sortMode === 'rating') filtered.sort((a,b) => b.rating - a.rating);
  else if (sortMode === 'name') filtered.sort((a,b) => a.name.localeCompare(b.name));
  else if (sortMode === 'popular') filtered.sort((a,b) => b.popular - a.popular);

  if (filtered.length === 0) {
    grid.innerHTML = '';
    noResult.classList.remove('result-hidden');
  } else {
    noResult.classList.add('result-hidden');
    grid.innerHTML = filtered.map((d, i) => createCardHTML(d, i)).join('');
  }
}

function renderFavorites() {
  const grid = document.getElementById('favGrid');
  const emptyState = document.getElementById('favEmpty');
  if(!grid || !emptyState) return;

  const favData = destinations.filter(d => favorites.includes(d.id));
  if(favData.length === 0) {
    grid.innerHTML = '';
    emptyState.classList.remove('result-hidden');
  } else {
    emptyState.classList.add('result-hidden');
    grid.innerHTML = favData.map((d, i) => createCardHTML(d, i)).join('');
  }
}

// --- FILTER & SEARCH LOGIC ---
function liveSearch(val) {
  searchQuery = val.toLowerCase();
  renderAllDestinations();
  
  const destPage = document.getElementById('page-destinations');
  if (val && destPage && destPage.classList.contains('page-active') === false) {
    showPage('destinations');
  }
}

function syncSearch(val) {
  searchQuery = val.toLowerCase();
  const ids = ['heroSearch', 'destSearch'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value !== val) el.value = val;
  });
}

function filterMood(mood, btnElement = null) {
  currentMood = mood;
  if (btnElement) {
    document.querySelectorAll('.filter-chip').forEach(btn => btn.classList.remove('active'));
    btnElement.classList.add('active');
  }
  renderAllDestinations();
}

// --- SETTING NOTIFIKASI PROFILE ---
document.addEventListener("DOMContentLoaded", function() {
  const checkWisata = document.getElementById("toggleWisata");
  const checkAkun = document.getElementById("toggleAkun");

  if (checkWisata && checkAkun) {
    if (localStorage.getItem("notif_wisata") !== null) {
      checkWisata.checked = localStorage.getItem("notif_wisata") === "true";
    }
    if (localStorage.getItem("notif_akun") !== null) {
      checkAkun.checked = localStorage.getItem("notif_akun") === "true";
    }
  }
});

function saveNotificationSettings() {
  const checkWisata = document.getElementById("toggleWisata");
  const checkAkun = document.getElementById("toggleAkun");

  if (checkWisata && checkAkun) {
    localStorage.setItem("notif_wisata", checkWisata.checked);
    localStorage.setItem("notif_akun", checkAkun.checked);
  }

  Swal.fire({
    icon: 'success',
    title: 'Pengaturan Disimpan!',
    text: 'Pengaturan notifikasi berhasil disimpan!',
    confirmButtonColor: '#2F5C4B', 
    background: '#ffffff',
    customClass: { popup: 'swal2-custom-font' }
  }).then((result) => {
    if (result.isConfirmed) {
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = 'profile.html'; }, 350);
    }
  });
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '30px';
    container.style.right = '30px';
    container.style.zIndex = '999999'; 
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';
    container.style.pointerEvents = 'none'; 
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.style.background = '#ffffff';
  toast.style.color = '#1a1a1a';
  toast.style.padding = '14px 24px';
  toast.style.borderRadius = '12px';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '12px';
  toast.style.fontFamily = "'DM Sans', sans-serif";
  toast.style.fontSize = '0.95rem';
  toast.style.fontWeight = '500';
  toast.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'; 
  toast.style.transform = 'translateY(100px)'; 
  toast.style.opacity = '0';

  const iconColor = type === 'success' ? '#2F5C4B' : '#64748b';
  const iconClass = type === 'success' ? 'ph-fill ph-check-circle' : 'ph-fill ph-info';

  toast.innerHTML = `
    <i class="${iconClass}" style="font-size: 1.5rem; color: ${iconColor};"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
    toast.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(50px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// --- FAVORITES LOGIC ---
function toggleFav(id) {
  const targetId = parseInt(id);
  if (favorites.includes(targetId)) {
    favorites = favorites.filter(favId => favId !== targetId);
    showToast(`Dihapus dari favorit`, 'info');
  } else {
    favorites.push(targetId);
    showToast(`Berhasil disimpan ke favorit!`, 'success');
  }
  
  localStorage.setItem('temutrip_favs', JSON.stringify(favorites));
  updateFavBadge();
  
  document.querySelectorAll(`.dest-card[onclick*="openModal(${targetId})"] .dest-card-fav, .trending-card[onclick*="openModal(${targetId})"] .dest-card-fav`).forEach(btn => {
    const isFavNow = favorites.includes(targetId);
    if (isFavNow) {
      btn.classList.add('is-fav');
      btn.innerHTML = `<i class="ph-fill ph-bookmark-simple"></i>`;
    } else {
      btn.classList.remove('is-fav');
      btn.innerHTML = `<i class="ph ph-bookmark-simple"></i>`;
    }
  });
  
  const favPage = document.getElementById('page-favorites');
  if (favPage && favPage.classList.contains('page-active')) {
    renderFavorites();
  }
  if (activeModalId === targetId) updateModalFavBtn();
}

function updateFavBadge() {
  const badge = document.getElementById('fav-badge');
  if(!badge) return;
  if (favorites.length > 0) {
    badge.classList.remove('badge-hidden');
    badge.textContent = favorites.length;
  } else {
    badge.classList.add('badge-hidden');
  }
}

// --- MODAL LOGIC (TRICK SAKTI: MELEBUR BARIS & MENAMPILKAN MULTI-GENRE ESTETIK) ---
function openModal(id) {
  const d = destinations.find(x => x.id === id);
  if (!d) return;
  activeModalId = id;

  if (document.getElementById('modal-img')) document.getElementById('modal-img').src = d.img;
  
  // Modifikasi: Mengembalikan icon bintang kilau di depan multi-genre
  if (document.getElementById('modal-mood-badge')) {
    const displayMood = d.mood.replace(/,/g, ' • ');
    document.getElementById('modal-mood-badge').innerHTML = `<i class="ph-fill ph-sparkle"></i> ${displayMood}`;
  }
  
  if (document.getElementById('modal-title')) document.getElementById('modal-title').textContent = d.name;
  if (document.getElementById('modal-desc')) document.getElementById('modal-desc').textContent = d.desc;
  
  let totalUlasanLokal = d.popular ? (d.popular * 24).toString() : "2400";
  if (parseInt(totalUlasanLokal) > 1000) {
    totalUlasanLokal = (parseInt(totalUlasanLokal) / 1000).toFixed(1) + "k+";
  }

  const locEl = document.getElementById('modal-loc');
  if (locEl) {
    const parentRow = locEl.parentElement;
    if (parentRow) {
      parentRow.innerHTML = `
        <span id=\"modal-loc\" class=\"modal-loc\"><i class=\"ph-fill ph-map-pin\"></i> ${d.loc}</span>
        <span style=\"color: #ddd;\">|</span>
        <span style=\"color: #eab308; font-weight: 700; display: flex; align-items: center; gap: 4px;\">
          <i class=\"ph-fill ph-star\"></i> ${d.rating} 
          <span style=\"color: #999; font-weight: 400; font-size: 0.85rem;\">(${totalUlasanLokal} Ulasan)</span>
        </span>
      `;
    }
  }

  updateModalFavBtn();

  const backdrop = document.getElementById('modal-backdrop');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  const backdrop = document.getElementById('modal-backdrop');
  if (!backdrop) return;
  if (e && e.target !== backdrop && !e.target.closest('.modal-close-btn')) return;
  backdrop.classList.remove('active');
  document.body.style.overflow = '';
  activeModalId = null;
}

function toggleFavFromModal() {
  if (activeModalId) toggleFav(activeModalId);
}

function updateModalFavBtn() {
  const btn = document.getElementById('modal-fav-btn');
  if(!btn) return;
  if (favorites.includes(activeModalId)) {
    btn.innerHTML = `<i class="ph-fill ph-bookmark-simple"></i> Tersimpan`;
    btn.classList.add('active');
  } else {
    btn.innerHTML = `<i class="ph ph-bookmark-simple"></i> Simpan Favorit`;
    btn.classList.remove('active');
  }
}

// --- INTERSEPSI FORM ---
document.addEventListener("DOMContentLoaded", function() {
  const formNotif = document.querySelector("form");
  if (formNotif && !document.getElementById("profileName")) {
    formNotif.removeAttribute("onsubmit");
    formNotif.addEventListener("submit", function(event) {
      event.preventDefault(); 
      Swal.fire({
        icon: 'success',
        title: 'Pengaturan Disimpan!',
        text: 'Pengaturan notifikasi berhasil disimpan!',
        confirmButtonColor: '#2F5C4B', 
        background: '#ffffff',
        customClass: { popup: 'swal2-custom-font' }
      }).then((result) => {
        if (result.isConfirmed) {
          document.body.classList.add('fade-out');
          setTimeout(() => { window.location.href = 'profile.html'; }, 350);
        }
      });
    });
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && activeModalId) closeModal();
});

// --- ANTI LOMPAT PROFILE ---
document.addEventListener("DOMContentLoaded", function() {
    const targetId = sessionStorage.getItem('targetScrollSection');
    if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                sessionStorage.removeItem('targetScrollSection');
            }, 100);
        }
    }
});

function smoothNavigateUrl(event, url) {
  event.preventDefault();
  document.body.classList.add('fade-out');
  setTimeout(() => { window.location.href = url; }, 350);
}

// --- AUTO-FILL PROFILE ---
document.addEventListener("DOMContentLoaded", function() {
  if (document.getElementById("profileName")) {
    if (localStorage.getItem("p_name")) document.getElementById("profileName").value = localStorage.getItem("p_name");
    if (localStorage.getItem("p_email")) document.getElementById("profileEmail").value = localStorage.getItem("p_email");
    if (localStorage.getItem("p_phone")) document.getElementById("profilePhone").value = localStorage.getItem("p_phone");
    if (localStorage.getItem("p_birth")) document.getElementById("profileBirth").value = localStorage.getItem("p_birth");
    if (localStorage.getItem("p_city")) document.getElementById("profileCity").value = localStorage.getItem("p_city");
    
    if (localStorage.getItem("p_gender")) {
      const savedGender = localStorage.getItem("p_gender");
      if (savedGender === "Laki-laki") document.getElementById("genderL").checked = true;
      if (savedGender === "Perempuan") document.getElementById("genderP").checked = true;
    }
  }
});

function saveProfileChanges(event) {
  event.preventDefault(); 
  const name = document.getElementById('profileName').value;
  const email = document.getElementById('profileEmail').value;
  const phone = document.getElementById('profilePhone').value;
  const birth = document.getElementById('profileBirth').value;
  const city = document.getElementById('profileCity').value;
  
  let gender = "Laki-laki";
  if (document.getElementById("genderP").checked) gender = "Perempuan";
  
  localStorage.setItem("p_name", name);
  localStorage.setItem("p_email", email);
  localStorage.setItem("p_phone", phone);
  localStorage.setItem("p_gender", gender);
  localStorage.setItem("p_birth", birth);
  localStorage.setItem("p_city", city);
  
  const activeUser = localStorage.getItem('active_user');
  if (activeUser) {
    localStorage.setItem("p_name_" + activeUser, name);
    localStorage.setItem("p_email_" + activeUser, email);
    localStorage.setItem("p_phone_" + activeUser, phone);
    localStorage.setItem("p_gender_" + activeUser, gender);
    localStorage.setItem("p_birth_" + activeUser, birth);
    localStorage.setItem("p_city_" + activeUser, city);
  }
  
  Swal.fire({
    icon: 'success',
    title: 'Berhasil Diperbarui!',
    text: "Selamat! Data diri untuk " + name + " berhasil diperbarui.",
    confirmButtonColor: '#2F5C4B', 
    background: '#ffffff',
    customClass: { popup: 'swal2-custom-font' }
  }).then((result) => {
    if (result.isConfirmed) {
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = 'profile.html'; }, 350);
    }
  });
}

function logoutAccount(event) {
  event.preventDefault(); 
  Swal.fire({
    title: 'Keluar dari TemuTrip?',
    text: "Kamu bisa masuk kembali menggunakan data akun yang sama.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#34715c', 
    cancelButtonColor: '#64748b',  
    confirmButtonText: 'Ya, Keluar',
    cancelButtonText: 'Batal',
    background: '#ffffff',
    customClass: { popup: 'swal2-custom-font' }
  }).then((result) => {
    if (result.isConfirmed) {
      document.body.classList.add('fade-out');
      setTimeout(() => { window.location.href = '../Login/Login.html'; }, 350);
    }
  });
}

// --- FUNGSI REDIRECT GOOGLE MAPS AKTIF DAN AKURAT 100% ---
function bukaGoogleMapsKeBrowser() {
  const d = destinations.find(x => x.id === activeModalId);
  if (d) {
    const namaTempat = d.name.trim();
    const namaKota = d.loc.trim();
    const kueriPencarian = encodeURIComponent(namaTempat + ', ' + namaKota);
    
    const urlResmiMaps = 'https://www.google.com/maps/search/?api=1&query=' + kueriPencarian;
    window.open(urlResmiMaps, '_blank');
  }
}

function changeAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    Swal.fire({
      icon: 'error',
      title: 'Ukuran Terlalu Besar!',
      text: 'Maksimal ukuran foto profil adalah 2MB.',
      confirmButtonColor: '#2F5C4B'
    });
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const base64Image = e.target.result;
    localStorage.setItem("user_avatar", base64Image);
    
    const activeUser = localStorage.getItem('active_user');
    if (activeUser) {
      localStorage.setItem("user_avatar_" + activeUser, base64Image);
    }
    
    const profileImg = document.getElementById("profileAvatar");
    if (profileImg) profileImg.src = base64Image;

    const navProfileImg = document.getElementById("navProfileAvatar");
    if (navProfileImg) navProfileImg.src = base64Image;

    document.querySelectorAll(".nav-profile-img, .navbar-avatar").forEach(img => {
      img.src = base64Image;
    });
    
    if (typeof showToast === "function") {
      showToast("Foto profil berhasil diperbarui!", "success");
    }
  };
  reader.readAsDataURL(file);
}
