/**
 * TRẠM KÝ ỨC - ĐOÀN TNCS HỒ CHÍ MINH PHƯỜNG HƯNG PHÚ, THÀNH PHỐ CẦN THƠ
 * CẤU HÌNH CLOUD FIRESTORE & DỰ PHÒNG LOCALSTORAGE
 */

const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const isFirebaseConfigured = () => {
  return FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY";
};

// Dữ liệu mẫu lưu bút tri ân ban đầu
const INITIAL_GUESTBOOK_ENTRIES = [
  {
    id: "init-hp-1",
    author: "Bí thư Đoàn Thanh niên",
    org: "Đoàn TNCS Hồ Chí Minh Phường Hưng Phú",
    content: "Đời đời khắc ghi công ơn trời biển của các Mẹ Việt Nam Anh hùng! Tuổi trẻ Phường Hưng Phú nguyện ra sức rèn đức luyện tài, xung kích xây dựng quê hương Cần Thơ ngày càng văn minh, giàu đẹp để xứng đáng với sự hy sinh cao cả của các Mẹ và các Anh hùng Liệt sĩ.",
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: "init-hp-2",
    author: "Lê Nguyễn Thảo My",
    org: "Đoàn viên Phường Hưng Phú",
    content: "Thắp nén tâm hương dâng lên các Mẹ với lòng biết ơn sâu sắc nhất. Tấm lòng bao la và sự hy sinh thầm lặng của các Mẹ là tượng đài bất tử trong lòng các thế hệ hôm nay và mai sau.",
    createdAt: new Date(Date.now() - 3600000 * 16).toISOString()
  },
  {
    id: "init-hp-3",
    author: "Trần Minh Quân",
    org: "Chi đoàn Thanh niên",
    content: "Kính cẩn nghiêng mình trước anh linh các Mẹ. Chúng con mãi mãi tự hào về truyền thống anh hùng, kiên trung của quê hương Hưng Phú, Thành phố Cần Thơ!",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

class MemoryStationService {
  constructor() {
    this.useFirebase = isFirebaseConfigured();
    this.candleCount = 1975; // Khởi đầu với mốc son lịch sử năm 1975 thống nhất non sông
    this.storageKeyCandle = "tramkyuc_hungphu_candle_count";
    this.storageKeyGuestbook = "tramkyuc_hungphu_guestbook";
    this.listeners = [];
  }

  async init() {
    if (this.useFirebase && window.firebaseApp) {
      console.log("Đã kết nối Firebase Cloud Firestore thành công.");
      this.initFirestore();
    } else {
      console.log("Đang vận hành chế độ Lưu trữ Cục bộ (LocalStorage).");
      this.initLocalStorage();
    }
  }

  initLocalStorage() {
    const savedCandles = localStorage.getItem(this.storageKeyCandle);
    if (savedCandles) {
      this.candleCount = parseInt(savedCandles, 10);
    } else {
      localStorage.setItem(this.storageKeyCandle, this.candleCount.toString());
    }

    const savedEntries = localStorage.getItem(this.storageKeyGuestbook);
    if (!savedEntries) {
      localStorage.setItem(this.storageKeyGuestbook, JSON.stringify(INITIAL_GUESTBOOK_ENTRIES));
    }
  }

  async getCandleCount() {
    if (this.useFirebase && window.firebaseDb) {
      try {
        const docRef = window.firebaseDb.collection("counters").doc("hungphu_candles");
        const doc = await docRef.get();
        if (doc.exists) {
          return doc.data().count || this.candleCount;
        }
      } catch (err) {
        console.warn("Lỗi đọc Firebase, fallback LocalStorage:", err);
      }
    }
    const val = localStorage.getItem(this.storageKeyCandle);
    return val ? parseInt(val, 10) : this.candleCount;
  }

  async lightCandle() {
    this.candleCount++;
    localStorage.setItem(this.storageKeyCandle, this.candleCount.toString());

    if (this.useFirebase && window.firebaseDb) {
      try {
        const docRef = window.firebaseDb.collection("counters").doc("hungphu_candles");
        await docRef.set({
          count: firebase.firestore.FieldValue.increment(1),
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn("Lỗi ghi Firestore:", err);
      }
    }

    return this.candleCount;
  }

  async getGuestbookEntries() {
    if (this.useFirebase && window.firebaseDb) {
      try {
        const snapshot = await window.firebaseDb.collection("hungphu_guestbook")
          .orderBy("createdAt", "desc")
          .limit(50)
          .get();
        const entries = [];
        snapshot.forEach(doc => {
          entries.push({ id: doc.id, ...doc.data() });
        });
        if (entries.length > 0) return entries;
      } catch (err) {
        console.warn("Lỗi đọc guestbook Firebase, fallback LocalStorage:", err);
      }
    }
    const val = localStorage.getItem(this.storageKeyGuestbook);
    return val ? JSON.parse(val) : INITIAL_GUESTBOOK_ENTRIES;
  }

  async addGuestbookEntry(entry) {
    const newEntry = {
      id: "entry_" + Date.now(),
      author: entry.author.trim(),
      org: entry.org ? entry.org.trim() : "Đoàn viên",
      content: entry.content.trim(),
      createdAt: new Date().toISOString()
    };

    const entries = await this.getGuestbookEntries();
    entries.unshift(newEntry);
    localStorage.setItem(this.storageKeyGuestbook, JSON.stringify(entries));

    if (this.useFirebase && window.firebaseDb) {
      try {
        await window.firebaseDb.collection("hungphu_guestbook").add(newEntry);
      } catch (err) {
        console.warn("Lỗi lưu Firestore:", err);
      }
    }

    return newEntry;
  }
}

window.memoryService = new MemoryStationService();
