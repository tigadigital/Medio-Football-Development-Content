const STORAGE_KEY = "medioFootballContentCalendar";

const pages = document.querySelectorAll(".page");
const appLayout = document.getElementById("appLayout");
const sidebar = document.getElementById("sidebar");
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

const detailTitle = document.getElementById("detailTitle");
const detailMeta = document.getElementById("detailMeta");
const detailType = document.getElementById("detailType");
const detailPlatform = document.getElementById("detailPlatform");
const detailDate = document.getElementById("detailDate");
const detailPillar = document.getElementById("detailPillar");
const detailStatus = document.getElementById("detailStatus");
const detailPic = document.getElementById("detailPic");
const detailCaption = document.getElementById("detailCaption");

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
    description: "Pantau ringkasan aktivitas content calendar Medio Football Development."
  },
  database: {
    title: "Database Konten",
    description: "Kelola seluruh data konten dari satu tempat."
  },
  calendar: {
    title: "Calendar",
    description: "Lihat jadwal posting konten dalam tampilan kalender."
  },
  kanban: {
    title: "Kanban Workflow",
    description: "Pantau proses produksi konten berdasarkan status kerja."
  },
  analytics: {
    title: "Analytics",
    description: "Analisis distribusi konten berdasarkan platform, jenis, dan pilar."
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

let contentData = getInitialData();
let currentCalendarDate = new Date();

function getInitialData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData) {
    return JSON.parse(savedData);
  }

  return [
    {
      id: crypto.randomUUID(),
      title: "3 Kesalahan Pemain Muda Saat First Touch",
      pillar: "Education",
      type: "Reels",
      platform: "Instagram & TikTok",
      date: "2026-05-12T19:00",
      status: "Scheduled",
      pic: "Coach Media",
      caption: "Konten edukasi teknik dasar untuk akademi sepakbola."
    },
    {
      id: crypto.randomUUID(),
      title: "Latihan Passing Triangle untuk U-15",
      pillar: "Training Drill",
      type: "Feeds",
      platform: "Instagram",
      date: "2026-05-14T12:00",
      status: "Review",
      pic: "Admin MFD",
      caption: "Drill sederhana untuk meningkatkan decision making."
    },
    {
      id: crypto.randomUUID(),
      title: "Matchday Recap: MFD U-17 Friendly Game",
      pillar: "Matchday",
      type: "Story",
      platform: "IG Story",
      date: "2026-05-15T20:30",
      status: "Draft",
      pic: "Social Media",
      caption: "Highlight pertandingan, scoreline, dan pemain terbaik."
    }
  ];
}

function isMobileView() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function openSidebar() {
  if (isMobileView()) {
    document.body.classList.add("sidebar-open");
    return;
  }

  appLayout.classList.remove("sidebar-collapsed");
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
  const addButtonVisiblePages = ["dashboard", "database", "calendar", "kanban"];

  const shouldShowSearch = searchVisiblePages.includes(pageName);
  const shouldShowAddButton = addButtonVisiblePages.includes(pageName);

  searchInput.classList.toggle("is-hidden", !shouldShowSearch);
  openModalBtn.classList.toggle("is-hidden", !shouldShowAddButton);

  if (!shouldShowSearch) {
    searchInput.value = "";
    renderTable();
  }
}

function saveToLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contentData));
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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
  detailPillar.textContent = selectedContent.pillar;
  detailStatus.textContent = selectedContent.status;
  detailPic.textContent = selectedContent.pic || "Admin MFD";
  detailCaption.textContent = selectedContent.caption || "Belum ada isi konten atau caption.";

  detailModal.classList.add("show");
  document.body.classList.add("modal-open");
}

function closeDetailModal() {
  detailModal.classList.remove("show");
  document.body.classList.remove("modal-open");
  selectedDetailId = null;
}

function editSelectedDetail() {
  if (!selectedDetailId) return;

  const contentId = selectedDetailId;

  closeDetailModal();
  editContent(contentId);
}

function formatDateTime(dateValue) {
  if (!dateValue) {
    return {
      dateText: "-",
      timeText: "-"
    };
  }

  const date = new Date(dateValue);

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
  const lowerType = type.toLowerCase();

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

  return "soft";
}

function getEventClass(type) {
  const lowerType = type.toLowerCase();

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
    `.toLowerCase();

    const matchKeyword = searchableText.includes(keyword);
    const matchStatus = selectedStatus === "all" || content.status === selectedStatus;

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
    const statusBadgeClass = getStatusBadgeClass(content.status);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        <strong>${escapeHTML(content.title)}</strong>
        <small>${escapeHTML(content.caption || "Belum ada detail isi konten.")}</small>
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
        <span class="badge ${statusBadgeClass}">${escapeHTML(content.status)}</span>
      </td>
      <td>${escapeHTML(content.pic || "Admin MFD")}</td>
      <td>
        <div class="table-action">
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

        <span class="badge ${statusBadgeClass}">${escapeHTML(content.status)}</span>
      </div>

      <div class="mobile-card-meta">
        <div>
          <span>Plan Posting</span>
          <strong>${formattedDate.dateText} - ${formattedDate.timeText} WIB</strong>
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

  calendarTitle.textContent = `Calendar - ${monthNames[month]} ${year}`;

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
      if (!content.date) return false;

      const contentDate = new Date(content.date);

      return (
        contentDate.getDate() === dayNumber &&
        contentDate.getMonth() === cellMonth &&
        contentDate.getFullYear() === cellYear
      );
    });

    events.forEach((content) => {
      const formattedDate = formatDateTime(content.date);
      const event = document.createElement("div");
      event.className = `event ${getEventClass(content.type)}`;

      event.setAttribute("role", "button");
      event.setAttribute("tabindex", "0");
      event.setAttribute("title", content.title);

      event.innerHTML = `
        ${formattedDate.timeText} • ${escapeHTML(content.type)}
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

    calendarGrid.appendChild(cell);
  }
}

function renderKanban() {
  const statuses = ["Draft", "Review", "Scheduled", "Posted"];

  kanbanBoard.innerHTML = "";

  statuses.forEach((status) => {
    const contents = contentData.filter((content) => content.status === status);

    const column = document.createElement("div");
    column.className = "kanban-column";

    column.innerHTML = `
      <h4>${status} <span>${contents.length}</span></h4>
    `;

    if (contents.length === 0) {
      const emptyTask = document.createElement("div");
      emptyTask.className = "task empty-task";
      emptyTask.innerHTML = `
        <strong>Belum ada konten</strong>
        <p>Konten dengan status ${status} akan muncul di sini.</p>
      `;
      column.appendChild(emptyTask);
    }

    contents.forEach((content) => {
      const formattedDate = formatDateTime(content.date);
      const typeBadgeClass = getTypeBadgeClass(content.type);

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

        <div class="task-meta">
          <span>${escapeHTML(content.platform)}</span>
          <span>${escapeHTML(content.pic || "Admin MFD")}</span>
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

    kanbanBoard.appendChild(column);
  });
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

  const draftContents = contentData.filter((content) => content.status === "Draft");
  const reviewContents = contentData.filter((content) => content.status === "Review");

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
      title: `${todayContents.length} konten dijadwalkan hari ini`,
      description: "Pastikan konten sudah final, approved, dan siap diposting.",
      badge: "Hari Ini",
      type: "warning"
    });
  }

  if (overdueContents.length > 0) {
    attentionItems.push({
      title: `${overdueContents.length} konten melewati jadwal`,
      description: "Ada konten yang tanggal postingnya sudah lewat tetapi belum berstatus Posted.",
      badge: "Overdue",
      type: "danger"
    });
  }

  if (draftContents.length > 0) {
    attentionItems.push({
      title: `${draftContents.length} konten masih Draft`,
      description: "Konten masih perlu dilengkapi sebelum masuk tahap review atau scheduled.",
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
      description: "Lengkapi caption agar konten siap diproduksi dan diposting.",
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
  const upcomingData = [...contentData]
    .filter((content) => content.date)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  upcomingContentList.innerHTML = "";

  if (upcomingData.length === 0) {
    upcomingContentList.innerHTML = `
      <div class="mini-item">
        <div>
          <strong>Belum ada jadwal</strong>
          <span>Tambahkan konten baru untuk melihat jadwal terdekat.</span>
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
}

function handleSubmit(event) {
  event.preventDefault();

  if (!validateForm()) return;

  const contentId = contentIdInput.value;

  const payload = {
    id: contentId || crypto.randomUUID(),
    title: titleInput.value.trim(),
    pillar: pillarInput.value,
    type: typeInput.value,
    platform: platformInput.value,
    date: dateInput.value,
    status: statusInput.value,
    pic: picInput.value.trim(),
    caption: captionInput.value.trim()
  };

  if (contentId) {
    contentData = contentData.map((content) => {
      if (content.id === contentId) {
        return payload;
      }

      return content;
    });

    alert("Konten berhasil diperbarui.");
  } else {
    contentData.push(payload);
    alert("Konten berhasil ditambahkan.");
  }

  saveToLocalStorage();
  closeModal();
  renderAll();
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

function deleteContent(id) {
  const isConfirmed = confirm("Yakin ingin menghapus konten ini?");

  if (!isConfirmed) return;

  contentData = contentData.filter((content) => content.id !== id);
  saveToLocalStorage();
  renderAll();
}

function resetAllData() {
  const isConfirmed = confirm("Yakin ingin reset semua data konten?");

  if (!isConfirmed) return;

  localStorage.removeItem(STORAGE_KEY);
  contentData = [];
  resetForm();
  renderAll();
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

function convertToCsv(data) {
  const headers = [
    "Judul Konten",
    "Pilar Konten",
    "Jenis Konten",
    "Platform",
    "Tanggal Posting",
    "Status",
    "PIC",
    "Caption"
  ];

  const rows = data.map((content) => {
    const formattedDate = formatDateTime(content.date);

    return [
      content.title,
      content.pillar,
      content.type,
      content.platform,
      `${formattedDate.dateText} ${formattedDate.timeText} WIB`,
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
    version: "1.0",
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

  reader.onload = function (readerEvent) {
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

      const isValidData = importedData.every((item) => {
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
        alert("Data JSON tidak valid. Pastikan file berasal dari backup aplikasi ini.");
        return;
      }

      const isConfirmed = confirm(
        "Import JSON akan mengganti semua data yang ada sekarang. Lanjutkan?"
      );

      if (!isConfirmed) return;

      contentData = importedData;
      saveToLocalStorage();
      renderAll();

      alert("Data berhasil diimport.");
    } catch (error) {
      alert("Gagal membaca file JSON. Pastikan file tidak rusak.");
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

window.editContent = editContent;
window.deleteContent = deleteContent;
window.openDetailModal = openDetailModal;

saveToLocalStorage();
renderAll();
updateTopbarByPage("dashboard");