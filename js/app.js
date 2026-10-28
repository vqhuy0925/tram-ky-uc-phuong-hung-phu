/**
 * TRẠM KÝ ỨC - MẸ VIỆT NAM ANH HÙNG PHƯỜNG HƯNG PHÚ, THÀNH PHỐ CẦN THƠ
 * CONTROLLER CHÍNH (Audio, Altar Canvas, Web Audio API Bell, Gallery, Modal, Guestbook)
 */

document.addEventListener("DOMContentLoaded", async () => {
  // 1. Khởi tạo dịch vụ dữ liệu
  if (window.memoryService) {
    await window.memoryService.init();
  }

  // 2. Khởi tạo các module
  initAudioPlayer();
  initAltarInteractions();
  initTaglineReveal();
  initScrollReveals();
  initMothersGallery();
  initMotherModal();
  initGuestbook();
});

/* ==========================================================================
   MODULE 1: TRÌNH PHÁT NHẠC NỀN "HUYỀN THOẠI MẸ"
   ========================================================================== */
function initAudioPlayer() {
  const audio = document.getElementById("bgAudio");
  const toggleBtn = document.getElementById("musicToggleBtn");
  const musicLabel = document.getElementById("musicLabel");

  if (!audio || !toggleBtn) return;

  audio.volume = 0.45;
  let isPlaying = false;

  const updateUI = (playing) => {
    isPlaying = playing;
    if (playing) {
      toggleBtn.classList.add("playing");
      if (musicLabel) musicLabel.textContent = "Huyền thoại Mẹ (Đang phát)";
    } else {
      toggleBtn.classList.remove("playing");
      if (musicLabel) musicLabel.textContent = "Bật nhạc tưởng niệm";
    }
  };

  toggleBtn.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      updateUI(false);
    } else {
      audio.play().then(() => {
        updateUI(true);
      }).catch((err) => {
        console.warn("Trình duyệt hạn chế autoplay:", err);
      });
    }
  });

  // Tự động phát khi người dùng chạm lần đầu vào trang
  const enableAudioOnFirstGesture = () => {
    if (!isPlaying) {
      audio.play().then(() => {
        updateUI(true);
      }).catch(() => {});
    }
    document.removeEventListener("click", enableAudioOnFirstGesture);
    document.removeEventListener("touchstart", enableAudioOnFirstGesture);
  };

  document.addEventListener("click", enableAudioOnFirstGesture, { once: true });
  document.addEventListener("touchstart", enableAudioOnFirstGesture, { once: true });
}

/* ==========================================================================
   MODULE 2: 120% MARQUEE HERO DETAIL - BÀN THỜ ẢO & CHUÔNG CHÙA NGÂN TRẦM
   ========================================================================== */
function initAltarInteractions() {
  const lightBtn = document.getElementById("lightCandleBtn");
  const candleCountElem = document.getElementById("candleCounter");
  const altarBox = document.querySelector(".tribute-altar-box");

  // Hiển thị số lượt nén hiện tại
  if (window.memoryService) {
    window.memoryService.getCandleCount().then((count) => {
      if (candleCountElem) {
        candleCountElem.textContent = Number(count).toLocaleString("vi-VN");
      }
    });
  }

  // Khởi động Canvas khói hương bay
  initSmokeCanvas();

  if (!lightBtn) return;

  lightBtn.addEventListener("click", async () => {
    // 1. Âm thanh chuông ngân thanh tịnh (Web Audio API Synthesizer)
    playTempleSingingBell();

    // 2. Tăng số đếm
    let newCount = 1975;
    if (window.memoryService) {
      newCount = await window.memoryService.lightCandle();
    }
    if (candleCountElem) {
      candleCountElem.textContent = Number(newCount).toLocaleString("vi-VN");
    }

    // 3. Hiệu ứng phát sáng bàn thờ & vầng sáng đài sen
    const heroSection = document.getElementById("hero");
    if (altarBox) {
      altarBox.classList.add("glowing");
      if (heroSection) heroSection.classList.add("glowing-aura");
      setTimeout(() => {
        altarBox.classList.remove("glowing");
        if (heroSection) heroSection.classList.remove("glowing-aura");
      }, 1200);
    }

    // 4. Rung nhẹ haptic trên điện thoại (nếu thiết bị hỗ trợ)
    if (navigator.vibrate) {
      navigator.vibrate([40, 60, 40]);
    }
  });
}

/**
 * Chuông chùa ngân vang trầm ấm dùng Web Audio API
 */
function playTempleSingingBell() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Hài âm chuông bát đồng cổ kính
    const harmonics = [
      { freq: 216, gain: 0.8, decay: 4.5 },
      { freq: 432, gain: 0.6, decay: 3.5 },
      { freq: 648, gain: 0.4, decay: 2.8 },
      { freq: 864, gain: 0.25, decay: 2.0 },
      { freq: 1296, gain: 0.15, decay: 1.5 }
    ];

    harmonics.forEach((h) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(h.freq, ctx.currentTime);

      g.gain.setValueAtTime(h.gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + h.decay);

      osc.connect(g);
      g.connect(masterGain);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + h.decay);
    });
  } catch (err) {
    console.warn("Không thể phát chuông Web Audio:", err);
  }
}

/**
 * Canvas khói hương uốn lượn thời gian thực
 */
function initSmokeCanvas() {
  const canvas = document.getElementById("smokeCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const particles = [];
  const maxParticles = 45;

  class SmokeParticle {
    constructor() {
      this.reset();
    }

    reset() {
      // Xuất phát từ 3 que hương ở trung tâm
      const stickOffsets = [-10, 0, 10];
      const offset = stickOffsets[Math.floor(Math.random() * stickOffsets.length)];
      this.x = width / 2 + offset + (Math.random() - 0.5) * 4;
      this.y = height - 70;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = -(0.55 + Math.random() * 0.65);
      this.alpha = 0.45 + Math.random() * 0.25;
      this.size = 2.5 + Math.random() * 3;
      this.maxSize = 24 + Math.random() * 12;
      this.curl = (Math.random() - 0.5) * 0.04;
    }

    update() {
      this.vx += this.curl;
      this.x += this.vx;
      this.y += this.vy;
      this.size += 0.16;
      this.alpha -= 0.0045;

      if (this.alpha <= 0 || this.y <= 0) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
      grad.addColorStop(0, `rgba(235, 230, 220, ${this.alpha * 0.6})`);
      grad.addColorStop(0.6, `rgba(215, 210, 200, ${this.alpha * 0.3})`);
      grad.addColorStop(1, `rgba(200, 195, 185, 0)`);
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < maxParticles; i++) {
    const p = new SmokeParticle();
    p.y = height - 70 - Math.random() * 90;
    particles.push(p);
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   MODULE 3: DANH SÁCH & BỘ LỌC 7 MẸ VNAH PHƯỜNG HƯNG PHÚ
   ========================================================================== */
let activeFilter = "all";
let searchQuery = "";

function initMothersGallery() {
  const searchInput = document.getElementById("searchMother");
  const filterBtns = document.querySelectorAll(".filter-btn");

  renderMothersList();

  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderMothersList();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeFilter = btn.dataset.filter;
      renderMothersList();
    });
  });
}

function renderMothersList() {
  const grid = document.getElementById("mothersGrid");
  if (!grid || !window.MOTHERS_DATA) return;

  const filtered = window.MOTHERS_DATA.filter((m) => {
    // 1. Bộ lọc category
    if (activeFilter === "has-portrait" && !m.has_portrait) return false;
    if (activeFilter === "phong-tang" && m.title !== "Phong tặng") return false;
    if (activeFilter === "truy-tang" && m.title !== "Truy tặng") return false;

    // 2. Tìm kiếm theo chuỗi
    if (searchQuery) {
      const matchName = m.name.toLowerCase().includes(searchQuery);
      const matchHometown = m.hometown.toLowerCase().includes(searchQuery);
      const matchRelatives = (m.relatives_text || "").toLowerCase().includes(searchQuery);
      const matchWorship = (m.worship_address || "").toLowerCase().includes(searchQuery);
      const matchDecision = (m.decision || "").toLowerCase().includes(searchQuery);
      return matchName || matchHometown || matchRelatives || matchWorship || matchDecision;
    }

    return true;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; background: #FFFFFF; border-radius: 16px; border: 1px dashed var(--color-border-gold);">
        <p style="font-size: 1.1rem; color: var(--color-primary-dark); font-weight: 600;">Không tìm thấy hồ sơ Mẹ phù hợp</p>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-top: 0.25rem;">Vui lòng kiểm tra lại từ khóa tìm kiếm hoặc chọn bộ lọc "Tất cả".</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map((mother) => createMotherCardHTML(mother)).join("");

  // Gắn sự kiện mở modal và thắp hương cho từng card
  filtered.forEach((mother) => {
    const card = document.getElementById(`mother-card-${mother.id}`);
    if (card) {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-altar-card")) {
          e.stopPropagation();
          playTempleSingingBell();
          if (window.memoryService) window.memoryService.lightCandle();
          showTributeToast(`Đã thắp nén tâm hương dâng Mẹ ${mother.name}`);
          return;
        }
        openMotherModal(mother);
      });
    }
  });
}

function createMotherCardHTML(mother) {
  const isPhongTang = mother.title === "Phong tặng";
  const badgeClass = isPhongTang ? "phong-tang" : "truy-tang";
  
  // Media box: Nếu có ảnh chân dung thì hiển thị ảnh chân dung nghệ thuật, ngược lại hiển thị Bằng vinh danh
  let mediaHTML = "";
  if (mother.has_portrait) {
    mediaHTML = `
      <div class="card-media-box" style="background-color: #FEF3C7;">
        <div class="card-portrait-wrap">
          <img src="${mother.photo}" alt="Chân dung Mẹ ${mother.name}" loading="lazy" />
        </div>
      </div>
    `;
  } else {
    mediaHTML = `
      <div class="card-media-box">
        <img class="card-media-img" src="${mother.photo}" alt="Bằng vinh danh Mẹ ${mother.name}" loading="lazy" />
      </div>
    `;
  }

  return `
    <article class="mother-card" id="mother-card-${mother.id}" tabindex="0" role="button" aria-label="Xem chi tiết hồ sơ Mẹ ${mother.name}">
      <div class="card-ribbon">
        <span class="card-batch-tag">${mother.batch}</span>
        <span class="card-title-badge ${badgeClass}">${mother.title}</span>
      </div>

      ${mediaHTML}

      <div class="card-body">
        <h3 class="card-mother-name">MẸ ${mother.name}</h3>
        <div class="card-years">${mother.birth_death} • ${mother.status}</div>

        <div class="card-info-list">
          <div class="card-info-row">
            <!-- Phosphor Map Pin -->
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
              <path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"/>
            </svg>
            <div><strong>Quê quán:</strong> ${mother.hometown}</div>
          </div>
          <div class="card-info-row">
            <!-- Phosphor Medal -->
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
              <path d="M216,96a48,48,0,0,0-25.86-42.54l16.27-32.55A8,8,0,0,0,199.25,10L148,35.63V24a8,8,0,0,0-16,0V35.63L80.75,10a8,8,0,0,0-10.74,10.91l16.27,32.55A48,48,0,0,0,40,96c0,27.91,15.65,51.81,38.74,64.21L49.19,219.78a8,8,0,0,0,6.91,12.22H200a8,8,0,0,0,6.91-12.22l-29.55-59.57C200.35,147.81,216,123.91,216,96ZM128,128a32,32,0,1,1,32-32A32,32,0,0,1,128,128Z"/>
            </svg>
            <div><strong>Thân nhân Liệt sĩ:</strong> ${mother.relatives.map(r => `LS ${r.name} (${r.relation})`).join(", ")}</div>
          </div>
          <div class="card-info-row">
            <!-- Phosphor House Line -->
            <svg width="15" height="15" viewBox="0 0 256 256" fill="currentColor">
              <path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H48V117.27L128,41.8l80,75.47V208Z"/>
            </svg>
            <div><strong>${mother.worship_type}:</strong> ${mother.worship_address}</div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-view-card" type="button">
          Xem Hồ Sơ Ký Ức &rarr;
        </button>
        <button class="btn-altar-card" type="button" title="Thắp nén hương dâng Mẹ ${mother.name}">
          <!-- Phosphor Flame -->
          <svg width="14" height="14" viewBox="0 0 256 256" fill="currentColor">
            <path d="M174.14,103.78A79.94,79.94,0,0,0,136,16a8,8,0,0,0-7.39,4.92,128.24,128.24,0,0,0-5.83,31.79C118.23,80.4,99.27,100.83,81.86,119.57,69.57,132.8,56,147.38,56,168a72,72,0,0,0,144,0C200,141.22,189.47,120.25,174.14,103.78ZM128,224a56.06,56.06,0,0,1-56-56c0-15.6,10.66-27.06,23.51-40.9,19.38-20.84,40.49-43.55,40.49-74.87,8.28,6.86,15.65,15.2,21.91,24.81C171.18,97,184,127.35,184,168A56.06,56.06,0,0,1,128,224Z"/>
          </svg>
          Dâng hương
        </button>
      </div>
    </article>
  `;
}

/* ==========================================================================
   MODULE 4: MODAL 3-ZONE FLEXBOX CHI TIẾT TIỂU SỬ MẸ VNAH
   ========================================================================== */
let currentModalMother = null;

function initMotherModal() {
  const modal = document.getElementById("motherModal");
  const closeBtn = document.getElementById("modalCloseBtn");
  const dismissBtn = document.getElementById("modalDismissBtn");
  const altarThisMotherBtn = document.getElementById("altarThisMotherBtn");

  const closeModal = () => {
    if (modal) modal.classList.remove("active");
    document.body.style.overflow = "";
  };

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
  if (dismissBtn) dismissBtn.addEventListener("click", closeModal);

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      closeModal();
    }
  });

  if (altarThisMotherBtn) {
    altarThisMotherBtn.addEventListener("click", () => {
      if (!currentModalMother) return;
      playTempleSingingBell();
      if (window.memoryService) window.memoryService.lightCandle();
      showTributeToast(`Đã thắp nén tâm hương dâng Mẹ ${currentModalMother.name}`);
    });
  }
}

function openMotherModal(mother) {
  currentModalMother = mother;
  const modal = document.getElementById("motherModal");
  if (!modal) return;

  // Điền dữ liệu vào Modal
  const fullScanImg = document.getElementById("modalFullScanImg");
  const badge = document.getElementById("modalMotherBadge");
  const name = document.getElementById("modalMotherName");
  const years = document.getElementById("modalMotherYears");
  const ward = document.getElementById("modalMotherWard");
  const hometown = document.getElementById("modalMotherHometown");
  const decision = document.getElementById("modalMotherDecision");
  const relatives = document.getElementById("modalMotherRelatives");
  const worshipLabel = document.getElementById("modalWorshipLabel");
  const worship = document.getElementById("modalMotherWorship");
  const mailBtn = document.getElementById("modalMailContributionBtn");

  if (fullScanImg) fullScanImg.src = mother.full_photo;
  if (badge) {
    badge.textContent = mother.title;
    badge.className = `modal-m-badge card-title-badge ${mother.title === "Phong tặng" ? "phong-tang" : "truy-tang"}`;
  }
  if (name) name.textContent = `MẸ ${mother.name}`;
  if (years) years.textContent = `${mother.birth_death} • ${mother.status}`;
  if (ward) ward.textContent = "Phường Hưng Phú, Thành phố Cần Thơ";
  if (hometown) hometown.textContent = mother.hometown;
  if (decision) decision.textContent = mother.decision;
  if (relatives) relatives.textContent = mother.relatives_text;
  if (worshipLabel) worshipLabel.textContent = mother.worship_type;
  if (worship) worship.textContent = mother.worship_address;

  if (mailBtn) {
    const subject = encodeURIComponent(`[Đóng góp tư liệu Mẹ VNAH ${mother.name}]`);
    const body = encodeURIComponent(
      `Kính gửi: Đoàn TNCS Hồ Chí Minh Phường Hưng Phú, Thành phố Cần Thơ,\n\n` +
      `Tôi xin gửi tư liệu/hình ảnh bổ sung về Mẹ Việt Nam Anh Hùng ${mother.name} (Địa chỉ: ${mother.worship_address}).\n\n` +
      `Nội dung thông tin / Kỷ vật đính kèm:\n...`
    );
    mailBtn.href = `mailto:doanphuonghungphu01072025@gmail.com?subject=${subject}&body=${body}`;
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ==========================================================================
   MODULE 5: SỔ LƯU BÚT TRI ÂN TRỰC TUYẾN
   ========================================================================== */
function initGuestbook() {
  const form = document.getElementById("guestbookForm");
  loadGuestbookEntries();

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const authorInput = document.getElementById("guestAuthor");
      const orgInput = document.getElementById("guestOrg");
      const contentInput = document.getElementById("guestContent");

      if (!authorInput || !contentInput) return;

      const author = authorInput.value.trim();
      const org = orgInput ? orgInput.value.trim() : "";
      const content = contentInput.value.trim();

      if (!author || !content) return;

      if (window.memoryService) {
        await window.memoryService.addGuestbookEntry({ author, org, content });
      }

      form.reset();
      showTributeToast("Cảm ơn bạn! Dòng tri ân đã được ghi vào Sổ lưu bút.");
      await loadGuestbookEntries();
    });
  }
}

async function loadGuestbookEntries() {
  const container = document.getElementById("guestbookEntries");
  if (!container || !window.memoryService) return;

  const entries = await window.memoryService.getGuestbookEntries();
  if (!entries || entries.length === 0) {
    container.innerHTML = `<p style="color: var(--color-text-muted); font-size: 0.9rem;">Chưa có lưu bút nào. Hãy là người đầu tiên gửi lời tri ân!</p>`;
    return;
  }

  container.innerHTML = entries.map((e) => {
    const dateStr = formatEntryDate(e.createdAt);
    return `
      <div class="guest-entry-card">
        <div class="guest-entry-head">
          <div>
            <span class="guest-entry-author">${escapeHTML(e.author)}</span>
            ${e.org ? `<span class="guest-entry-org"> • ${escapeHTML(e.org)}</span>` : ""}
          </div>
          <span class="guest-entry-date">${dateStr}</span>
        </div>
        <div class="guest-entry-body">${escapeHTML(e.content)}</div>
      </div>
    `;
  }).join("");
}

function formatEntryDate(isoStr) {
  if (!isoStr) return "";
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  } catch {
    return "";
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* ==========================================================================
   TOAST NOTIFICATION PHẢN HỒI NHẸ NHÀNG
   ========================================================================== */
function showTributeToast(message) {
  const existing = document.getElementById("tributeToast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.id = "tributeToast";
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: #1C1917;
    color: #F8FAFC;
    border: 1px solid var(--color-gold);
    padding: 0.75rem 1.4rem;
    border-radius: 9999px;
    font-size: 0.88rem;
    font-weight: 600;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 200;
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    text-align: center;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
    setTimeout(() => toast.remove(), 350);
  }, 2800);
}

/* ==========================================================================
   MODULE 6: TAGLINE REVEAL SCROLL OBSERVER (B11 MANDATORY REQUIREMENT)
   Words activate sequentially on scroll from 0.28 opacity to full color
   ========================================================================== */
function initTaglineReveal() {
  const words = document.querySelectorAll(".tagline-word");
  const section = document.getElementById("taglineSection");
  if (!words.length || !section) return;

  let ticking = false;

  const updateWordsOnScroll = () => {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Trigger window: starts when section top is at 80% viewport, completes at 30% viewport
    const triggerStart = windowHeight * 0.82;
    const triggerEnd = windowHeight * 0.26;
    const progress = Math.min(Math.max((triggerStart - rect.top) / (triggerStart - triggerEnd), 0), 1);
    
    const totalWords = words.length;
    const activeCount = Math.floor(progress * (totalWords + 1));

    words.forEach((word, index) => {
      if (index < activeCount) {
        word.classList.add("revealed");
      } else {
        word.classList.remove("revealed");
      }
    });

    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateWordsOnScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial update
  updateWordsOnScroll();
}

/* ==========================================================================
   MODULE 7: SECTION SCROLL ENTRANCE ANIMATIONS (B7 BASE CURVE)
   ========================================================================== */
function initScrollReveals() {
  const targets = document.querySelectorAll(
    ".step-card, .stat-item, .faq-item, .contribution-banner, .filter-search-card, .final-cta-card"
  );
  if (!targets.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed-in-view");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -30px 0px"
  });

  targets.forEach((el) => {
    el.classList.add("scroll-reveal-target");
    observer.observe(el);
  });
}
