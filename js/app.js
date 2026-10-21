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

    // 3. Hiệu ứng phát sáng bàn thờ
    if (altarBox) {
      altarBox.classList.add("glowing");
      setTimeout(() => {
        altarBox.classList.remove("glowing");
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
      <div class="card-media-box" style="background: radial-gradient(circle, #FFFBEB 0%, #FEF3C7 100%);">
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
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            <div><strong>Quê quán:</strong> ${mother.hometown}</div>
          </div>
          <div class="card-info-row">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
            <div><strong>Thân nhân Liệt sĩ:</strong> ${mother.relatives.map(r => `LS ${r.name} (${r.relation})`).join(", ")}</div>
          </div>
          <div class="card-info-row">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            <div><strong>${mother.worship_type}:</strong> ${mother.worship_address}</div>
          </div>
        </div>
      </div>

      <div class="card-footer">
        <button class="btn-view-card" type="button">
          Xem Hồ Sơ Ký Ức &rarr;
        </button>
        <button class="btn-altar-card" type="button" title="Thắp nén hương dâng Mẹ ${mother.name}">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2c-.5 0-1 .4-1 .9 0 .2.1.4.2.6C10.5 4.6 9 7.2 9 10c0 1.7.7 3.2 1.8 4.2C10.3 14.5 10 15 10 15.5c0 .8.7 1.5 1.5 1.5s1.5-.7 1.5-1.5c0-.5-.3-1-.8-1.3 1.1-1 1.8-2.5 1.8-4.2 0-2.8-1.5-5.4-2.2-6.5.1-.2.2-.4.2-.6 0-.5-.5-.9-1-.9zm-7 16v4h14v-4H5z"/></svg>
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
    mailBtn.href = `mailto:doanphuonghungphu@gmail.com?subject=${subject}&body=${body}`;
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
