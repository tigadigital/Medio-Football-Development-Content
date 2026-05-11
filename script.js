import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

const firebaseConfig = {
  databaseURL:
    "https://medio-football-development-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

const FIREBASE_CONTENT_PATH = "contentCalendar/contents";
const LOCAL_BACKUP_KEY = "medioFootballContentCalendarBackup";

const pages = document.querySelectorAll(".page");
const appLayout = document.getElementById("appLayout");
const sidebarToggleBtn = document.getElementById("sidebarToggleBtn");
const sidebarCloseBtn = document.getElementById("sidebarCloseBtn");
const sidebarBackdrop = document.getElementById("sidebarBackdrop");

const navLinks = document.querySelectorAll(".nav-item a");
const pageHeading = document.getElementById("pageHeading");
const pageDescription = document.getElementById("pageDescription");

const contentTableBody = document.getElementById("contentTableBody");
const mobileContentList = document.getElementById("mobileContentList");
const emptyState = document.getElementById("emptyState");

const contentModal = document.getElementById("contentModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTitle = document.getElementById("modalTitle");

const detailModal = document.getElementById("detailModal");
const closeDetailModalBtn = document.getElementById("closeDetailModalBtn");
const closeDetailBtn = document.getElementById("closeDetailBtn");
const editFromDetailBtn = document.getElementById("editFromDetailBtn");
const copyCaptionBtn = document.getElementById("copyCaptionBtn");
const copyFeedback = document.getElementById("copyFeedback");

const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailType = document.getElementById("detailType");
const detailPlatform = document.getElementById("detailPlatform");
const detailDate = document.getElementById("detailDate");
const detailShootingRow = document.getElementById("detailShootingRow");
const detailShootingDate = document.getElementById("detailShootingDate");
const detailShootingStatusRow = document.getElementById("detailShootingStatusRow");
const detailShootingStatus = document.getElementById("detailShootingStatus");
const detailPillar = document.getElementById("detailPillar");
const detailStatus = document.getElementById("detailStatus");
const detailPic = document.getElementById("detailPic");
const detailCaption = document.getElementById("detailCaption");

const firebaseStatus = document.getElementById("firebaseStatus");

let selectedDetailId = null;

const contentForm = document.getElementById("contentForm");
const contentIdInput = document.getElementById("contentId");
const titleInput = document.getElementById("title");
const pillarInput = document.getElementById("pillar");
const typeInput = document.getElementById("type");
const platformInput = document.getElementById("platform");
const dateInput = document.getElementById("date");
const statusInput = document.getElementById("status");
const picInput = document.getElementById("pic");
const captionInput = document.getElementById("caption");

const saveContentBtn = document.getElementById("saveContentBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const clearDataBtn = document.getElementById("clearDataBtn");

const exportCsvBtn = document.getElementById("exportCsvBtn");
const backupJsonBtn = document.getElementById("backupJsonBtn");
const importJsonInput = document.getElementById("importJsonInput");

const totalContent = document.getElementById("totalContent");
const scheduledContent = document.getElementById("scheduledContent");
const reviewContent = document.getElementById("reviewContent");
const postedContent = document.getElementById("postedContent");

const calendarTitle = document.getElementById("calendarTitle");
const calendarGrid = document.getElementById("calendarGrid");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const todayBtn = document.getElementById("todayBtn");

const shootingCalendarTitle = document.getElementById("shootingCalendarTitle");
const shootingCalendarGrid = document.getElementById("shootingCalendarGrid");
const prevShootingMonthBtn = document.getElementById("prevShootingMonthBtn");
const nextShootingMonthBtn = document.getElementById("nextShootingMonthBtn");
const todayShootingBtn = document.getElementById("todayShootingBtn");

const kanbanBoard = document.getElementById("kanbanBoard");

const platformAnalytics = document.getElementById("platformAnalytics");
const typeAnalytics = document.getElementById("typeAnalytics");
const pillarAnalytics = document.getElementById("pillarAnalytics");

const upcomingContentList = document.getElementById("upcomingContentList");
const attentionList = document.getElementById("attentionList");
const mainFocusText = document.getElementById("mainFocusText");
const dominantPlatformText = document.getElementById("dominantPlatformText");
const dominantTypeText = document.getElementById("dominantTypeText");

const pageMeta = {
  dashboard: {
    title: "Dashboard",
    description:
      "Pantau ringkasan aktivitas content calendar Medio Football Development."
  },
  database: {
    title: "Database Konten",
    description: "Kelola seluruh data konten dari satu tempat."
  },
  calendar: {
    title: "Content Calendar",
    description: "Lihat jadwal posting konten dalam tampilan kalender."
  },
  shooting: {
    title: "Shooting Calendar",
    description:
      "Lihat jadwal shooting otomatis H-4 dari plan posting untuk konten video."
  },
  kanban: {
    title: "Kanban Workflow",
    description: "Pantau proses produksi konten berdasarkan status kerja."
  },
  analytics: {
    title: "Analytics",
    description:
      "Analisis distribusi konten berdasarkan platform, jenis, dan pilar."
  },
  settings: {
    title: "Settings",
    description: "Kelola export, backup, import, dan reset data aplikasi."
  }
};

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember"
];

const dayNames = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const STATUS_OPTIONS = ["Draft", "Review", "Scheduled", "Posted"];

const SHOOTING_OFFSET_DAYS = 4;
const DEFAULT_SHOOTING_HOUR = 9;
const DEFAULT_SHOOTING_MINUTE = 0;
const KANBAN_ITEMS_PER_PAGE = 3;

let contentData = [];
let currentCalendarDate = new Date();
let currentShootingCalendarDate = new Date();

const kanbanPageState = {
  Draft: 1,
  Review: 1,
  Scheduled: 1,
  Posted: 1
};

const contentsRef = ref(database, FIREBASE_CONTENT_PATH);
const connectionRef = ref(database, ".info/connected");

function setFirebaseStatus(type, text) {
  if (!firebaseStatus) return;

  firebaseStatus.classList.remove("online", "loading", "offline");
  firebaseStatus.classList.add(type);
  firebaseStatus.textContent = text;
}

function generateId() {
  if (window.crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `content-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function makeFirebaseSafeKey(value) {
  return String(value || generateId()).replace(/[.#$\/\[\]]/g, "-");
}

function getContentRef(id) {
  const safeId = makeFirebaseSafeKey(id);
  return ref(database, `${FIREBASE_CONTENT_PATH}/${safeId}`);
}

function isVideoContentType(type) {
  const videoTypes = ["Reels", "TikTok Video", "YouTube Shorts"];
  return videoTypes.includes(type);
}

function isCaptionRequiredStatus(status) {
  return status === "Scheduled" || status === "Posted";
}

function formatDateToInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getAutoShootingDate(postingDateValue, type) {
  if (!postingDateValue || !isVideoContentType(type)) {
    return "";
  }

  const shootingDate = new Date(postingDateValue);

  if (Number.isNaN(shootingDate.getTime())) {
    return "";
  }

  shootingDate.setDate(shootingDate.getDate() - SHOOTING_OFFSET_DAYS);
  shootingDate.setHours(DEFAULT_SHOOTING_HOUR, DEFAULT_SHOOTING_MINUTE, 0, 0);

  return formatDateToInputValue(shootingDate);
}

function buildShootingFields({ type, postingDate, existingContent = {} }) {
  if (!isVideoContentType(type)) {
    return {
      shootingDate: "",
      shootingStatus: "",
      shootingLocation: "",
      talent: "",
      equipment: "",
      shotList: "",
      shootingNotes: ""
    };
  }

  return {
    shootingDate: getAutoShootingDate(postingDate, type),
    shootingStatus: existingContent.shootingStatus || "Planned",
    shootingLocation: existingContent.shootingLocation || "",
    talent: existingContent.talent || "",
    equipment: existingContent.equipment || "",
    shotList: existingContent.shotList || "",
    shootingNotes: existingContent.shootingNotes || ""
  };
}

function normalizeContentForApp(item) {
  const type = item.type || "";
  const postingDate = item.date || "";

  if (!isVideoContentType(type)) {
    return {
      ...item,
      shootingDate: "",
      shootingStatus: "",
      shootingLocation: "",
      talent: "",
      equipment: "",
      shotList: "",
      shootingNotes: ""
    };
  }

  return {
    ...item,
    shootingDate: item.shootingDate || getAutoShootingDate(postingDate, type),
    shootingStatus: item.shootingStatus || "Planned",
    shootingLocation: item.shootingLocation || "",
    talent: item.talent || "",
    equipment: item.equipment || "",
    shotList: item.shotList || "",
    shootingNotes: item.shootingNotes || ""
  };
}

function saveLocalBackup() {
  localStorage.setItem(LOCAL_BACKUP_KEY, JSON.stringify(contentData));
}

function loadLocalBackup() {
  const backup = localStorage.getItem(LOCAL_BACKUP_KEY);

  if (!backup) return [];

  try {
    return JSON.parse(backup);
  } catch (error) {
    return [];
  }
}

function parseFirebaseData(data) {
  if (!data) return [];

  return Object.values(data)
    .filter(Boolean)
    .map(normalizeContentForApp)
    .sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return dateA - dateB;
    });
}

function startConnectionListener() {
  onValue(connectionRef, (snapshot) => {
    const isConnected = snapshot.val() === true;

    if (isConnected) {
      setFirebaseStatus("online", "Firebase: realtime aktif");
    } else {
      setFirebaseStatus("offline", "Firebase: offline");
    }
  });
}

function startRealtimeContentListener() {
  setFirebaseStatus("loading", "Firebase: memuat...");

  onValue(
    contentsRef,
    (snapshot) => {
      const firebaseData = snapshot.val();

      contentData = parseFirebaseData(firebaseData);
      saveLocalBackup();
      renderAll();

      if (firebaseStatus && !firebaseStatus.classList.contains("offline")) {
        setFirebaseStatus("online", "Firebase: realtime aktif");
      }
    },
    (error) => {
      console.error(error);

      contentData = loadLocalBackup();
      renderAll();

      setFirebaseStatus("offline", "Firebase: akses ditolak/gagal");
      alert(
        "Gagal membaca data realtime dari Firebase. Cek Rules Realtime Database."
      );
    }
  );
}

async function saveContentToFirebase(content) {
  const safeId = makeFirebaseSafeKey(content.id);

  const normalizedContent = {
    ...content,
    id: safeId
  };

  await set(getContentRef(safeId), normalizedContent);
}

async function deleteContentFromFirebase(id) {
  await remove(getContentRef(id));
}

async function replaceAllFirebaseData(dataArray) {
  const dataObject = dataArray.reduce((result, item) => {
    const safeId = makeFirebaseSafeKey(item.id);

    result[safeId] = {
      ...item,
      id: safeId
    };

    return result;
  }, {});

  await set(contentsRef, dataObject);
}

async function clearFirebaseData() {
  await remove(contentsRef);
}

function isMobileView() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function closeSidebar() {
  if (isMobileView()) {
    document.body.classList.remove("sidebar-open");
    return;
  }

  appLayout.classList.add("sidebar-collapsed");
}

function toggleSidebar() {
  if (isMobileView()) {
    document.body.classList.toggle("sidebar-open");
    return;
  }

  appLayout.classList.toggle("sidebar-collapsed");
}

function switchPage(pageName) {
  pages.forEach((page) => page.classList.remove("active"));

  const targetPage = document.getElementById(`page-${pageName}`);

  if (targetPage) {
    targetPage.classList.add("active");
  }

  navLinks.forEach((link) => {
    link.parentElement.classList.remove("active");

    if (link.dataset.page === pageName) {
      link.parentElement.classList.add("active");
    }
  });

  pageHeading.textContent = pageMeta[pageName].title;
  pageDescription.textContent = pageMeta[pageName].description;

  updateTopbarByPage(pageName);
}

function updateTopbarByPage(pageName) {
  const searchVisiblePages = ["database"];
  const addButtonVisiblePages = [
    "dashboard",
    "database",
    "calendar",
    "shooting",
    "kanban"
  ];

  const shouldShowSearch = searchVisiblePages.includes(pageName);
  const shouldShowAddButton = addButtonVisiblePages.includes(pageName);

  searchInput.classList.toggle("is-hidden", !shouldShowSearch);
  openModalBtn.classList.toggle("is-hidden", !shouldShowAddButton);

  if (!shouldShowSearch) {
    searchInput.value = "";
    renderTable();
  }
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStatusOptions(selectedStatus) {
  return STATUS_OPTIONS.map((status) => {
    const selected = status === selectedStatus ? "selected" : "";
    return `<option value="${status}" ${selected}>${status}</option>`;
  }).join("");
}

function renderStatusSelect(contentId, selectedStatus) {
  return `
    <select
      class="status-select"
      onclick="event.stopPropagation()"
      onmousedown="event.stopPropagation()"
      onkeydown="event.stopPropagation()"
      onchange="event.stopPropagation(); updateContentStatus('${contentId}', this.value)"
    >
      ${renderStatusOptions(selectedStatus)}
    </select>
  `;
}

function openModal(mode = "add") {
  contentModal.classList.add("show");
  document.body.classList.add("modal-open");

  if (mode === "add") {
    modalTitle.textContent = "Tambah Konten";
    saveContentBtn.textContent = "Simpan Konten";
  }

  setTimeout(() => titleInput.focus(), 80);
}

function closeModal() {
  contentModal.classList.remove("show");
  document.body.classList.remove("modal-open");
  resetForm();
}

function openDetailModal(id) {
  const selectedContent = contentData.find((content) => content.id === id);

  if (!selectedContent) return;

  selectedDetailId = id;

  const formattedDate = formatDateTime(selectedContent.date);

  detailTitle.textContent = selectedContent.title;
  detailMeta.textContent = `${selectedContent.platform} • ${selectedContent.type}`;

  detailType.textContent = selectedContent.type;
  detailPlatform.textContent = selectedContent.platform;
  detailDate.textContent = `${formattedDate.dateText} - ${formattedDate.timeText} WIB`;

  if (isVideoContentType(selectedContent.type) && selectedContent.shootingDate) {
    const formattedShootingDate = formatDateTime(selectedContent.shootingDate);

    detailShootingRow.style.display = "grid";
    detailShootingStatusRow.style.display = "grid";
    detailShootingDate.textContent = `${formattedShootingDate.dateText} - ${formattedShootingDate.timeText} WIB`;
    detailShootingStatus.textContent = selectedContent.shootingStatus || "Planned";
  } else {
    detailShootingRow.style.display = "none";
    detailShootingStatusRow.style.display = "none";
    detailShootingDate.textContent = "-";
    detailShootingStatus.textContent = "-";
  }

  detailPillar.textContent = selectedContent.pillar;
  detailStatus.textContent = selectedContent.status;
  detailPic.textContent = selectedContent.pic || "Admin MFD";
  detailCaption.textContent =
    selectedContent.caption || "Belum ada isi konten atau caption.";

  if (copyFeedback) {
    copyFeedback.classList.remove("show");
  }

  detailModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeDetailModal() {
  detailModal.classList.remove("show");
  document.body.classList.remove("modal-open");
  selectedDetailId = null;

  if (copyFeedback) {
    copyFeedback.classList.remove("show");
  }
}

function editSelectedDetail() {
  if (!selectedDetailId) return;

  const contentId = selectedDetailId;

  closeDetailModal();
  editContent(contentId);
}

async function copySelectedCaption() {
  if (!selectedDetailId) return;

  const selectedContent = contentData.find((content) => content.id === selectedDetailId);

  if (!selectedContent) return;

  const caption = selectedContent.caption || "";

  if (!caption.trim()) {
    alert("Caption masih kosong, tidak ada yang bisa disalin.");
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(caption);
    } else {
      const tempTextArea = document.createElement("textarea");
      tempTextArea.value = caption;
      document.body.appendChild(tempTextArea);
      tempTextArea.select();
      document.execCommand("copy");
      tempTextArea.remove();
    }

    if (copyFeedback) {
      copyFeedback.textContent = "Caption berhasil disalin.";
      copyFeedback.classList.add("show");

      setTimeout(() => {
        copyFeedback.classList.remove("show");
      }, 1800);
    }
  } catch (error) {
    console.error(error);
    alert("Gagal menyalin caption. Silakan copy manual dari detail konten.");
  }
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return {
      dateText: "-",
      timeText: "-"
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      dateText: "-",
      timeText: "-"
    };
  }

  const dateText = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  const timeText = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return {
    dateText,
    timeText
  };
}

function getTypeBadgeClass(type) {
  const lowerType = String(type || "").toLowerCase();

  if (lowerType.includes("reels")) return "gold";
  if (lowerType.includes("feeds")) return "white";
  if (lowerType.includes("story")) return "gray";
  if (lowerType.includes("tiktok")) return "black";
  if (lowerType.includes("shorts")) return "soft";

  return "soft";
}

function getStatusBadgeClass(status) {
  if (status === "Scheduled") return "black";
  if (status === "Review") return "gray";
  if (status === "Posted") return "gold";
  if (status === "Draft") return "soft";
  if (status === "Planned") return "soft";
  if (status === "Shooting") return "gray";
  if (status === "Done") return "gold";

  return "soft";
}

function getEventClass(type) {
  const lowerType = String(type || "").toLowerCase();

  if (lowerType.includes("reels")) return "reels";
  if (lowerType.includes("feeds")) return "feeds";
  if (lowerType.includes("story")) return "story";
  if (lowerType.includes("tiktok")) return "tiktok";
  if (lowerType.includes("shorts")) return "shorts";

  return "story";
}

function getFilteredData() {
  const keyword = searchInput.value.toLowerCase().trim();
  const selectedStatus = statusFilter.value;

  return contentData.filter((content) => {
    const searchableText = `
      ${content.title}
      ${content.pillar}
      ${content.type}
      ${content.platform}
      ${content.status}
      ${content.pic}
      ${content.caption}
      ${content.shootingDate}
      ${content.shootingStatus}
    `.toLowerCase();

    const matchKeyword = searchableText.includes(keyword);
    const matchStatus =
      selectedStatus === "all" || content.status === selectedStatus;

    return matchKeyword && matchStatus;
  });
}

function renderStats() {
  totalContent.textContent = contentData.length;

  scheduledContent.textContent = contentData.filter(
    (content) => content.status === "Scheduled"
  ).length;

  reviewContent.textContent = contentData.filter(
    (content) => content.status === "Review"
  ).length;

  postedContent.textContent = contentData.filter(
    (content) => content.status === "Posted"
  ).length;
}

function renderTable() {
  const filteredData = getFilteredData();

  contentTableBody.innerHTML = "";
  mobileContentList.innerHTML = "";

  emptyState.style.display = filteredData.length === 0 ? "block" : "none";

  filteredData.forEach((content) => {
    const formattedDate = formatDateTime(content.date);
    const typeBadgeClass = getTypeBadgeClass(content.type);

    const shootingInfo =
      isVideoContentType(content.type) && content.shootingDate
        ? formatDateTime(content.shootingDate)
        : null;

    const row = document.createElement("tr");

    row.innerHTML = `
      <td class="content-title-cell">
        <strong class="content-row-title">${escapeHTML(content.title)}</strong>
        <small class="content-row-caption">
          ${escapeHTML(content.caption || "Belum ada detail isi konten.")}
        </small>
        ${
          shootingInfo
            ? `<small class="content-row-shooting">Shooting Plan: ${shootingInfo.dateText} - ${shootingInfo.timeText} WIB</small>`
            : ""
        }
      </td>
      <td>
        <span class="badge ${typeBadgeClass}">${escapeHTML(content.type)}</span>
      </td>
      <td>${escapeHTML(content.platform)}</td>
      <td>
        ${formattedDate.dateText}<br />
        <small>${formattedDate.timeText} WIB</small>
      </td>
      <td>${escapeHTML(content.pillar)}</td>
      <td>
        ${renderStatusSelect(content.id, content.status)}
      </td>
      <td>${escapeHTML(content.pic || "Admin MFD")}</td>
      <td>
        <div class="table-action">
          <button class="action-btn" onclick="openDetailModal('${content.id}')">Detail</button>
          <button class="action-btn" onclick="editContent('${content.id}')">✏ Edit</button>
          <button class="action-btn delete" onclick="deleteContent('${content.id}')">🗑 Hapus</button>
        </div>
      </td>
    `;

    contentTableBody.appendChild(row);

    const mobileCard = document.createElement("article");
    mobileCard.className = "mobile-content-card";

    mobileCard.innerHTML = `
      <div class="mobile-card-head">
        <div>
          <h4>${escapeHTML(content.title)}</h4>
          <p>${escapeHTML(content.platform)} • ${escapeHTML(content.type)}</p>
        </div>

        <span class="badge ${getStatusBadgeClass(content.status)}">${escapeHTML(content.status)}</span>
      </div>

      <div class="mobile-card-meta">
        <div>
          <span>Plan Posting</span>
          <strong>${formattedDate.dateText} - ${formattedDate.timeText} WIB</strong>
        </div>

        ${
          shootingInfo
            ? `
              <div>
                <span>Shooting Plan</span>
                <strong>${shootingInfo.dateText} - ${shootingInfo.timeText} WIB</strong>
              </div>
            `
            : ""
        }

        <div>
          <span>Status</span>
          ${renderStatusSelect(content.id, content.status)}
        </div>

        <div>
          <span>Pilar</span>
          <strong>${escapeHTML(content.pillar)}</strong>
        </div>

        <div>
          <span>PIC</span>
          <strong>${escapeHTML(content.pic || "Admin MFD")}</strong>
        </div>
      </div>

      <p class="mobile-card-caption">
        ${escapeHTML(content.caption || "Belum ada detail isi konten.")}
      </p>

      <div class="mobile-card-actions">
        <button class="action-btn" onclick="openDetailModal('${content.id}')">Lihat Detail</button>
        <button class="action-btn" onclick="editContent('${content.id}')">✏ Edit</button>
        <button class="action-btn delete" onclick="deleteContent('${content.id}')">🗑 Hapus</button>
      </div>
    `;

    mobileContentList.appendChild(mobileCard);
  });
}

function renderCalendar() {
  calendarGrid.innerHTML = "";

  dayNames.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "day-name";
    dayElement.textContent = day;
    calendarGrid.appendChild(dayElement);
  });

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  calendarTitle.textContent = `Content Calendar - ${monthNames[month]} ${year}`;

  renderCalendarCells({
    targetGrid: calendarGrid,
    calendarDate: currentCalendarDate,
    dateKey: "date",
    eventPrefix: "Posting"
  });
}

function renderShootingCalendar() {
  shootingCalendarGrid.innerHTML = "";

  dayNames.forEach((day) => {
    const dayElement = document.createElement("div");
    dayElement.className = "day-name";
    dayElement.textContent = day;
    shootingCalendarGrid.appendChild(dayElement);
  });

  const year = currentShootingCalendarDate.getFullYear();
  const month = currentShootingCalendarDate.getMonth();

  shootingCalendarTitle.textContent = `Shooting Calendar - ${monthNames[month]} ${year}`;

  renderCalendarCells({
    targetGrid: shootingCalendarGrid,
    calendarDate: currentShootingCalendarDate,
    dateKey: "shootingDate",
    onlyVideoContent: true,
    eventPrefix: "Shooting"
  });
}

function renderCalendarCells({
  targetGrid,
  calendarDate,
  dateKey,
  onlyVideoContent = false,
  eventPrefix
}) {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  let firstDayIndex = firstDayOfMonth.getDay();
  firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

  const totalDaysInMonth = lastDayOfMonth.getDate();
  const previousMonthLastDate = new Date(year, month, 0).getDate();

  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "date-cell";

    let dayNumber;
    let cellMonth = month;
    let cellYear = year;

    if (i < firstDayIndex) {
      dayNumber = previousMonthLastDate - firstDayIndex + i + 1;
      cell.classList.add("muted");
      cellMonth = month - 1;

      if (cellMonth < 0) {
        cellMonth = 11;
        cellYear = year - 1;
      }
    } else if (i >= firstDayIndex + totalDaysInMonth) {
      dayNumber = i - (firstDayIndex + totalDaysInMonth) + 1;
      cell.classList.add("muted");
      cellMonth = month + 1;

      if (cellMonth > 11) {
        cellMonth = 0;
        cellYear = year + 1;
      }
    } else {
      dayNumber = i - firstDayIndex + 1;
    }

    const today = new Date();
    const isToday =
      dayNumber === today.getDate() &&
      cellMonth === today.getMonth() &&
      cellYear === today.getFullYear();

    if (isToday) {
      cell.classList.add("today");
    }

    const dateNumber = document.createElement("div");
    dateNumber.className = "date-number";
    dateNumber.textContent = dayNumber;
    cell.appendChild(dateNumber);

    const events = contentData.filter((content) => {
      if (onlyVideoContent && !isVideoContentType(content.type)) return false;
      if (!content[dateKey]) return false;

      const contentDate = new Date(content[dateKey]);

      return (
        contentDate.getDate() === dayNumber &&
        contentDate.getMonth() === cellMonth &&
        contentDate.getFullYear() === cellYear
      );
    });

    events.forEach((content) => {
      const formattedDate = formatDateTime(content[dateKey]);
      const event = document.createElement("div");
      event.className = `event ${getEventClass(content.type)}`;

      event.setAttribute("role", "button");
      event.setAttribute("tabindex", "0");
      event.setAttribute("title", content.title);

      event.innerHTML = `
        ${formattedDate.timeText} • ${escapeHTML(eventPrefix)}
        <span class="event-title">${escapeHTML(content.title)}</span>
      `;

      event.addEventListener("click", () => {
        openDetailModal(content.id);
      });

      event.addEventListener("keydown", (keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          openDetailModal(content.id);
        }
      });

      cell.appendChild(event);
    });

    targetGrid.appendChild(cell);
  }
}

function renderKanban() {
  const statuses = ["Draft", "Review", "Scheduled", "Posted"];

  kanbanBoard.innerHTML = "";

  statuses.forEach((status) => {
    const contents = contentData.filter((content) => content.status === status);
    const totalPages = Math.max(
      1,
      Math.ceil(contents.length / KANBAN_ITEMS_PER_PAGE)
    );

    if (!kanbanPageState[status]) {
      kanbanPageState[status] = 1;
    }

    if (kanbanPageState[status] > totalPages) {
      kanbanPageState[status] = totalPages;
    }

    if (kanbanPageState[status] < 1) {
      kanbanPageState[status] = 1;
    }

    const currentPage = kanbanPageState[status];
    const startIndex = (currentPage - 1) * KANBAN_ITEMS_PER_PAGE;
    const endIndex = startIndex + KANBAN_ITEMS_PER_PAGE;
    const visibleContents = contents.slice(startIndex, endIndex);

    const column = document.createElement("div");
    column.className = "kanban-column";

    column.innerHTML = `
      <h4>${status} <span>${contents.length}</span></h4>
    `;

    if (contents.length > 0) {
      const pageMeta = document.createElement("div");
      pageMeta.className = "kanban-page-meta";
      pageMeta.textContent = `${startIndex + 1}-${Math.min(
        endIndex,
        contents.length
      )} dari ${contents.length} konten`;
      column.appendChild(pageMeta);
    }

    if (contents.length === 0) {
      const emptyTask = document.createElement("div");
      emptyTask.className = "task empty-task";
      emptyTask.innerHTML = `
        <strong>Belum ada konten</strong>
        <p>Konten dengan status ${status} akan muncul di sini.</p>
      `;
      column.appendChild(emptyTask);
    }

    visibleContents.forEach((content) => {
      const formattedDate = formatDateTime(content.date);
      const typeBadgeClass = getTypeBadgeClass(content.type);
      const shootingInfo =
        isVideoContentType(content.type) && content.shootingDate
          ? formatDateTime(content.shootingDate)
          : null;

      const task = document.createElement("div");
      task.className = "task compact-task";
      task.setAttribute("role", "button");
      task.setAttribute("tabindex", "0");
      task.setAttribute("title", content.title);

      task.innerHTML = `
        <div class="task-top">
          <span class="badge ${typeBadgeClass}">${escapeHTML(content.type)}</span>
          <span class="task-date">${formattedDate.dateText}</span>
        </div>

        <strong>${escapeHTML(content.title)}</strong>

        <p>${escapeHTML(content.caption || "Belum ada detail konten.")}</p>

        ${
          shootingInfo
            ? `<p>Shooting: ${shootingInfo.dateText} - ${shootingInfo.timeText} WIB</p>`
            : ""
        }

        <div class="task-meta">
          <span>${escapeHTML(content.platform)}</span>
          <span>${escapeHTML(content.pic || "Admin MFD")}</span>
        </div>

        <div class="task-status-update" onclick="event.stopPropagation()" onmousedown="event.stopPropagation()">
          <span>Ubah Status</span>
          ${renderStatusSelect(content.id, content.status)}
        </div>

        <div class="task-actions">
          <button class="action-btn" type="button" onclick="event.stopPropagation(); openDetailModal('${content.id}')">
            Detail
          </button>
          <button class="action-btn" type="button" onclick="event.stopPropagation(); editContent('${content.id}')">
            ✏ Edit
          </button>
        </div>
      `;

      task.addEventListener("click", () => {
        openDetailModal(content.id);
      });

      task.addEventListener("keydown", (keyboardEvent) => {
        if (keyboardEvent.key === "Enter" || keyboardEvent.key === " ") {
          keyboardEvent.preventDefault();
          openDetailModal(content.id);
        }
      });

      column.appendChild(task);
    });

    if (contents.length > KANBAN_ITEMS_PER_PAGE) {
      const pagination = document.createElement("div");
      pagination.className = "kanban-pagination";

      pagination.innerHTML = `
        <button
          class="action-btn"
          type="button"
          ${currentPage === 1 ? "disabled" : ""}
          onclick="event.stopPropagation(); changeKanbanPage('${status}', -1)"
        >
          ← Prev
        </button>

        <span>Page ${currentPage} / ${totalPages}</span>

        <button
          class="action-btn"
          type="button"
          ${currentPage === totalPages ? "disabled" : ""}
          onclick="event.stopPropagation(); changeKanbanPage('${status}', 1)"
        >
          Next →
        </button>
      `;

      column.appendChild(pagination);
    }

    kanbanBoard.appendChild(column);
  });
}

function changeKanbanPage(status, direction) {
  const contents = contentData.filter((content) => content.status === status);
  const totalPages = Math.max(
    1,
    Math.ceil(contents.length / KANBAN_ITEMS_PER_PAGE)
  );

  const currentPage = kanbanPageState[status] || 1;
  const nextPage = currentPage + direction;

  kanbanPageState[status] = Math.min(Math.max(nextPage, 1), totalPages);

  renderKanban();
}

function countByKey(data, key) {
  return data.reduce((result, item) => {
    const value = item[key] || "Tidak Ada";
    result[value] = (result[value] || 0) + 1;
    return result;
  }, {});
}

function getDominantValue(data, key) {
  const map = countByKey(data, key);
  const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) return "-";

  return entries[0][0];
}

function renderAnalyticsGroup(container, dataMap) {
  const entries = Object.entries(dataMap).sort((a, b) => b[1] - a[1]);
  const total = contentData.length || 1;

  container.innerHTML = "";

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="analytics-item">
        <div class="analytics-line">
          <span>Belum ada data</span>
          <span>0</span>
        </div>
        <div class="analytics-bar">
          <div class="analytics-fill" style="width: 0%"></div>
        </div>
      </div>
    `;
    return;
  }

  entries.forEach(([label, count]) => {
    const percentage = Math.round((count / total) * 100);

    const item = document.createElement("div");
    item.className = "analytics-item";

    item.innerHTML = `
      <div class="analytics-line">
        <span>${escapeHTML(label)}</span>
        <span>${count}</span>
      </div>
      <div class="analytics-bar">
        <div class="analytics-fill" style="width: ${percentage}%"></div>
      </div>
    `;

    container.appendChild(item);
  });
}

function renderAnalytics() {
  renderAnalyticsGroup(platformAnalytics, countByKey(contentData, "platform"));
  renderAnalyticsGroup(typeAnalytics, countByKey(contentData, "type"));
  renderAnalyticsGroup(pillarAnalytics, countByKey(contentData, "pillar"));
}

function isSameDate(dateA, dateB) {
  return (
    dateA.getDate() === dateB.getDate() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getFullYear() === dateB.getFullYear()
  );
}

function renderAttentionList() {
  const today = new Date();

  const todayContents = contentData.filter((content) => {
    if (!content.date) return false;

    const contentDate = new Date(content.date);
    return isSameDate(contentDate, today);
  });

  const todayShootingContents = contentData.filter((content) => {
    if (!content.shootingDate || !isVideoContentType(content.type)) return false;

    const shootingDate = new Date(content.shootingDate);
    return isSameDate(shootingDate, today);
  });

  const draftContents = contentData.filter(
    (content) => content.status === "Draft"
  );

  const reviewContents = contentData.filter(
    (content) => content.status === "Review"
  );

  const noCaptionContents = contentData.filter((content) => {
    return !content.caption || content.caption.trim().length === 0;
  });

  const overdueContents = contentData.filter((content) => {
    if (!content.date) return false;

    const contentDate = new Date(content.date);
    return contentDate < today && content.status !== "Posted";
  });

  const attentionItems = [];

  if (todayContents.length > 0) {
    attentionItems.push({
      title: `${todayContents.length} konten dijadwalkan posting hari ini`,
      description: "Pastikan konten sudah final, approved, dan siap diposting.",
      badge: "Posting",
      type: "warning"
    });
  }

  if (todayShootingContents.length > 0) {
    attentionItems.push({
      title: `${todayShootingContents.length} konten masuk jadwal shooting hari ini`,
      description: "Pastikan talent, lokasi, dan kebutuhan produksi sudah siap.",
      badge: "Shooting",
      type: "warning"
    });
  }

  if (overdueContents.length > 0) {
    attentionItems.push({
      title: `${overdueContents.length} konten melewati jadwal`,
      description:
        "Ada konten yang tanggal postingnya sudah lewat tetapi belum berstatus Posted.",
      badge: "Overdue",
      type: "danger"
    });
  }

  if (draftContents.length > 0) {
    attentionItems.push({
      title: `${draftContents.length} konten masih Draft`,
      description:
        "Konten masih perlu dilengkapi sebelum masuk tahap review atau scheduled.",
      badge: "Draft",
      type: "warning"
    });
  }

  if (reviewContents.length > 0) {
    attentionItems.push({
      title: `${reviewContents.length} konten menunggu Review`,
      description: "Konten perlu dicek agar tidak menghambat jadwal produksi.",
      badge: "Review",
      type: "warning"
    });
  }

  if (noCaptionContents.length > 0) {
    attentionItems.push({
      title: `${noCaptionContents.length} konten belum punya caption`,
      description:
        "Lengkapi caption agar konten siap diproduksi dan diposting.",
      badge: "Caption",
      type: "warning"
    });
  }

  attentionList.innerHTML = "";

  if (attentionItems.length === 0) {
    attentionList.innerHTML = `
      <div class="attention-empty">
        Semua aman. Belum ada konten yang membutuhkan perhatian khusus.
      </div>
    `;
    return;
  }

  attentionItems.forEach((item) => {
    const attentionItem = document.createElement("div");

    attentionItem.className = `attention-item ${item.type}`;

    attentionItem.innerHTML = `
      <div class="attention-info">
        <strong>${escapeHTML(item.title)}</strong>
        <span>${escapeHTML(item.description)}</span>
      </div>

      <div class="attention-badge">${escapeHTML(item.badge)}</div>
    `;

    attentionList.appendChild(attentionItem);
  });
}

function renderDashboard() {
  const now = new Date();

  const upcomingData = [...contentData]
    .filter((content) => {
      if (!content.date) return false;
      if (content.status === "Posted") return false;

      const postingDate = new Date(content.date);

      if (Number.isNaN(postingDate.getTime())) return false;

      return postingDate >= now;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  upcomingContentList.innerHTML = "";

  if (upcomingData.length === 0) {
    upcomingContentList.innerHTML = `
      <div class="mini-item">
        <div>
          <strong>Belum ada jadwal aktif</strong>
          <span>Konten yang sudah Posted tidak ditampilkan di daftar ini.</span>
        </div>
      </div>
    `;
  } else {
    upcomingData.forEach((content) => {
      const formattedDate = formatDateTime(content.date);
      const item = document.createElement("div");

      item.className = "mini-item";

      item.innerHTML = `
        <div>
          <strong>${escapeHTML(content.title)}</strong>
          <span>${escapeHTML(content.platform)} • ${escapeHTML(content.type)} • ${escapeHTML(content.status)}</span>
        </div>
        <div class="mini-date">
          ${formattedDate.dateText}<br />
          <span>${formattedDate.timeText}</span>
        </div>
      `;

      upcomingContentList.appendChild(item);
    });
  }

  mainFocusText.textContent = getDominantValue(contentData, "pillar");
  dominantPlatformText.textContent = getDominantValue(contentData, "platform");
  dominantTypeText.textContent = getDominantValue(contentData, "type");

  renderAttentionList();
}

function renderAll() {
  renderStats();
  renderTable();
  renderCalendar();
  renderShootingCalendar();
  renderKanban();
  renderAnalytics();
  renderDashboard();
}

function validateForm() {
  if (!titleInput.value.trim()) {
    alert("Judul konten wajib diisi.");
    titleInput.focus();
    return false;
  }

  if (!dateInput.value) {
    alert("Plan posting wajib diisi.");
    dateInput.focus();
    return false;
  }

  if (!picInput.value.trim()) {
    alert("PIC wajib diisi.");
    picInput.focus();
    return false;
  }

  if (isCaptionRequiredStatus(statusInput.value) && !captionInput.value.trim()) {
    alert("Caption wajib diisi jika status konten adalah Scheduled atau Posted.");
    captionInput.focus();
    return false;
  }

  return true;
}

function resetForm() {
  contentIdInput.value = "";
  titleInput.value = "";
  pillarInput.selectedIndex = 0;
  typeInput.selectedIndex = 0;
  platformInput.selectedIndex = 0;
  dateInput.value = "";
  statusInput.value = "Draft";
  picInput.value = "";
  captionInput.value = "";

  modalTitle.textContent = "Tambah Konten";
  saveContentBtn.textContent = "Simpan Konten";
  saveContentBtn.disabled = false;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  const contentId = contentIdInput.value;
  const selectedType = typeInput.value;
  const postingDate = dateInput.value;

  const existingContent = contentId
    ? contentData.find((content) => content.id === contentId) || {}
    : {};

  const payload = {
    id: makeFirebaseSafeKey(contentId || generateId()),
    title: titleInput.value.trim(),
    pillar: pillarInput.value,
    type: selectedType,
    platform: platformInput.value,
    date: postingDate,
    status: statusInput.value,
    pic: picInput.value.trim(),
    caption: captionInput.value.trim(),

    ...buildShootingFields({
      type: selectedType,
      postingDate,
      existingContent
    })
  };

  const previousButtonText = saveContentBtn.textContent;
  saveContentBtn.disabled = true;
  saveContentBtn.textContent = "Menyimpan...";

  try {
    await saveContentToFirebase(payload);

    closeModal();

    if (contentId) {
      alert("Konten berhasil diperbarui.");
    } else {
      alert("Konten berhasil ditambahkan.");
    }
  } catch (error) {
    console.error(error);
    alert("Gagal menyimpan konten ke Firebase. Cek Rules atau koneksi internet.");
    setFirebaseStatus("offline", "Firebase: gagal menyimpan");
  } finally {
    saveContentBtn.disabled = false;
    saveContentBtn.textContent = previousButtonText;
  }
}

async function updateContentStatus(id, newStatus) {
  const selectedContent = contentData.find((content) => content.id === id);

  if (!selectedContent) return;

  if (selectedContent.status === newStatus) return;

  if (isCaptionRequiredStatus(newStatus) && !selectedContent.caption?.trim()) {
    alert("Caption wajib diisi sebelum status diubah menjadi Scheduled atau Posted.");
    renderAll();
    return;
  }

  const updatedContent = {
    ...selectedContent,
    status: newStatus
  };

  try {
    await saveContentToFirebase(updatedContent);
  } catch (error) {
    console.error(error);
    alert("Gagal mengubah status konten.");
    renderAll();
    setFirebaseStatus("offline", "Firebase: gagal update status");
  }
}

function editContent(id) {
  const selectedContent = contentData.find((content) => content.id === id);

  if (!selectedContent) return;

  contentIdInput.value = selectedContent.id;
  titleInput.value = selectedContent.title;
  pillarInput.value = selectedContent.pillar;
  typeInput.value = selectedContent.type;
  platformInput.value = selectedContent.platform;
  dateInput.value = selectedContent.date;
  statusInput.value = selectedContent.status;
  picInput.value = selectedContent.pic;
  captionInput.value = selectedContent.caption;

  modalTitle.textContent = "Edit Konten";
  saveContentBtn.textContent = "Update Konten";

  openModal("edit");
}

async function deleteContent(id) {
  const isConfirmed = confirm("Yakin ingin menghapus konten ini?");

  if (!isConfirmed) return;

  try {
    await deleteContentFromFirebase(id);
    alert("Konten berhasil dihapus.");
  } catch (error) {
    console.error(error);
    alert("Gagal menghapus konten dari Firebase.");
    setFirebaseStatus("offline", "Firebase: gagal menghapus");
  }
}

async function resetAllData() {
  const isConfirmed = confirm("Yakin ingin reset semua data konten?");

  if (!isConfirmed) return;

  try {
    await clearFirebaseData();

    localStorage.removeItem(LOCAL_BACKUP_KEY);
    resetForm();

    alert("Semua data berhasil direset.");
  } catch (error) {
    console.error(error);
    alert("Gagal reset data Firebase.");
    setFirebaseStatus("offline", "Firebase: gagal reset");
  }
}

function goToPreviousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
}

function goToNextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
}

function goToCurrentMonth() {
  currentCalendarDate = new Date();
  renderCalendar();
}

function goToPreviousShootingMonth() {
  currentShootingCalendarDate.setMonth(
    currentShootingCalendarDate.getMonth() - 1
  );
  renderShootingCalendar();
}

function goToNextShootingMonth() {
  currentShootingCalendarDate.setMonth(
    currentShootingCalendarDate.getMonth() + 1
  );
  renderShootingCalendar();
}

function goToCurrentShootingMonth() {
  currentShootingCalendarDate = new Date();
  renderShootingCalendar();
}

function convertToCsv(data) {
  const headers = [
    "Judul Konten",
    "Pilar Konten",
    "Jenis Konten",
    "Platform",
    "Tanggal Posting",
    "Shooting Plan",
    "Status Shooting",
    "Status Konten",
    "PIC",
    "Caption"
  ];

  const rows = data.map((content) => {
    const formattedDate = formatDateTime(content.date);
    const formattedShootingDate = formatDateTime(content.shootingDate);

    return [
      content.title,
      content.pillar,
      content.type,
      content.platform,
      `${formattedDate.dateText} ${formattedDate.timeText} WIB`,
      content.shootingDate
        ? `${formattedShootingDate.dateText} ${formattedShootingDate.timeText} WIB`
        : "",
      content.shootingStatus || "",
      content.status,
      content.pic,
      content.caption
    ];
  });

  return [headers, ...rows]
    .map((row) =>
      row
        .map((value) => {
          const safeValue = String(value || "").replaceAll('"', '""');
          return `"${safeValue}"`;
        })
        .join(",")
    )
    .join("\n");
}

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], {
    type: mimeType
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function exportCsv() {
  if (contentData.length === 0) {
    alert("Belum ada data untuk diexport.");
    return;
  }

  const csvContent = convertToCsv(contentData);

  downloadFile(
    csvContent,
    "medio-football-content-calendar.csv",
    "text/csv;charset=utf-8;"
  );
}

function backupJson() {
  if (contentData.length === 0) {
    alert("Belum ada data untuk dibackup.");
    return;
  }

  const backupData = {
    app: "Medio Football Development Content Calendar",
    version: "2.4-status-spacing-kanban-fix",
    exportedAt: new Date().toISOString(),
    totalData: contentData.length,
    data: contentData
  };

  downloadFile(
    JSON.stringify(backupData, null, 2),
    "medio-football-content-calendar-backup.json",
    "application/json"
  );
}

function importJson(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async function (readerEvent) {
    try {
      const importedFile = JSON.parse(readerEvent.target.result);

      let importedData = [];

      if (Array.isArray(importedFile)) {
        importedData = importedFile;
      } else if (Array.isArray(importedFile.data)) {
        importedData = importedFile.data;
      } else {
        alert("Format file JSON tidak sesuai.");
        return;
      }

      const normalizedData = importedData.map((item) => {
        const selectedType = item.type;
        const postingDate = item.date;

        return {
          id: makeFirebaseSafeKey(item.id || generateId()),
          title: item.title,
          pillar: item.pillar,
          type: selectedType,
          platform: item.platform,
          date: postingDate,
          status: item.status,
          pic: item.pic,
          caption: item.caption || "",

          ...buildShootingFields({
            type: selectedType,
            postingDate,
            existingContent: item
          })
        };
      });

      const isValidData = normalizedData.every((item) => {
        return (
          item.id &&
          item.title &&
          item.pillar &&
          item.type &&
          item.platform &&
          item.date &&
          item.status &&
          item.pic
        );
      });

      if (!isValidData) {
        alert(
          "Data JSON tidak valid. Pastikan file berasal dari backup aplikasi ini."
        );
        return;
      }

      const isConfirmed = confirm(
        "Import JSON akan mengganti semua data yang ada sekarang. Lanjutkan?"
      );

      if (!isConfirmed) return;

      await replaceAllFirebaseData(normalizedData);

      alert("Data berhasil diimport ke Firebase.");
    } catch (error) {
      console.error(error);
      alert("Gagal membaca atau mengimport file JSON.");
      setFirebaseStatus("offline", "Firebase: gagal import");
    } finally {
      importJsonInput.value = "";
    }
  };

  reader.readAsText(file);
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    switchPage(link.dataset.page);

    if (isMobileView()) {
      closeSidebar();
    }
  });
});

sidebarToggleBtn.addEventListener("click", toggleSidebar);
sidebarCloseBtn.addEventListener("click", closeSidebar);
sidebarBackdrop.addEventListener("click", closeSidebar);

window.addEventListener("resize", () => {
  document.body.classList.remove("sidebar-open");
});

contentForm.addEventListener("submit", handleSubmit);

openModalBtn.addEventListener("click", () => {
  resetForm();
  openModal("add");
});

closeModalBtn.addEventListener("click", closeModal);
cancelEditBtn.addEventListener("click", closeModal);

closeDetailModalBtn.addEventListener("click", closeDetailModal);
closeDetailBtn.addEventListener("click", closeDetailModal);
editFromDetailBtn.addEventListener("click", editSelectedDetail);
copyCaptionBtn.addEventListener("click", copySelectedCaption);

contentModal.addEventListener("click", (event) => {
  if (event.target === contentModal) {
    closeModal();
  }
});

detailModal.addEventListener("click", (event) => {
  if (event.target === detailModal) {
    closeDetailModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (document.body.classList.contains("sidebar-open")) {
    closeSidebar();
    return;
  }

  if (detailModal.classList.contains("show")) {
    closeDetailModal();
    return;
  }

  if (contentModal.classList.contains("show")) {
    closeModal();
  }
});

searchInput.addEventListener("input", renderTable);
statusFilter.addEventListener("change", renderTable);
clearDataBtn.addEventListener("click", resetAllData);

exportCsvBtn.addEventListener("click", exportCsv);
backupJsonBtn.addEventListener("click", backupJson);
importJsonInput.addEventListener("change", importJson);

prevMonthBtn.addEventListener("click", goToPreviousMonth);
nextMonthBtn.addEventListener("click", goToNextMonth);
todayBtn.addEventListener("click", goToCurrentMonth);

prevShootingMonthBtn.addEventListener("click", goToPreviousShootingMonth);
nextShootingMonthBtn.addEventListener("click", goToNextShootingMonth);
todayShootingBtn.addEventListener("click", goToCurrentShootingMonth);

window.editContent = editContent;
window.deleteContent = deleteContent;
window.openDetailModal = openDetailModal;
window.changeKanbanPage = changeKanbanPage;
window.updateContentStatus = updateContentStatus;

renderAll();
updateTopbarByPage("dashboard");
startConnectionListener();
startRealtimeContentListener();