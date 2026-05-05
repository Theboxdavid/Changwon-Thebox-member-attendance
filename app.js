const STORAGE_KEY = "thebox-ticket-alert-demo-v3";

const TOPIC_STORAGE_KEY = "thebox-weekly-topic-v1";

const ADMIN_LOGIN = {
  phoneLast4: "9475",
  pin: "0000",
};

const CLASS_DAY_LABELS = {
  0: "일",
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
};

const defaultWeeklyTopic = {
  sessions: [
    {
      title: "Coachella 2026 Music Festival Experience",
      desc: "음악 페스티벌 경험, 공연 문화, 여행 계획을 영어로 이야기합니다.",
      pdf: "assets/topics/coachella-2026.pdf",
      words: [
        ["festival", "축제, 페스티벌"],
        ["lineup", "공연 출연진"],
        ["venue", "행사 장소"],
        ["crowd", "관중, 사람들"],
        ["memorable", "기억에 남는"],
      ],
      phrases: [
        ["I would love to go to a music festival.", "음악 페스티벌에 꼭 가보고 싶어요."],
        ["The lineup looks amazing this year.", "올해 출연진이 정말 좋아 보여요."],
        ["It would be a memorable experience.", "기억에 남는 경험이 될 것 같아요."],
      ],
    },
    {
      title: "Many People Will Be Overweight in 2050",
      desc: "건강, 생활 습관, 미래 사회 문제에 대해 의견을 말합니다.",
      pdf: "assets/topics/overweight-2050.pdf",
      words: [
        ["overweight", "과체중의"],
        ["obesity", "비만"],
        ["lifestyle", "생활 방식"],
        ["diet", "식단"],
        ["prevent", "예방하다"],
      ],
      phrases: [
        ["Many people may become overweight by 2050.", "2050년까지 많은 사람이 과체중이 될 수 있어요."],
        ["Our lifestyle has a big impact on health.", "생활 방식은 건강에 큰 영향을 줍니다."],
        ["We should build healthier habits.", "우리는 더 건강한 습관을 만들어야 해요."],
      ],
    },
  ],
  event: {
    title: "더박스 English Party",
    status: "Coming Soon",
    desc: "이번 주 수업 주제처럼 음악, 여행, 건강 습관을 가볍게 영어로 이야기하는 네트워킹 파티를 준비 중입니다.",
    note: "자세한 날짜와 장소는 학원 공지로 안내됩니다.",
  },
};

const defaultStudents = [
  {
    id: "s-1",
    name: "김민지",
    phone: "010-1234-8890",
    pin: "4821",
    course: "더박스 스터디",
    plan: 16,
    remaining: 15,
    months: 1,
    startDate: getPastDate(20),
    expiryDate: getFutureDate(40),
    memo: "월/수 기본반",
    classDays: [1, 3],
    lastAutoDeductedDate: getTodayISO(),
    holdsUsed: 0,
    sentAlerts: {},
    holdRequests: [],
    certificateRequests: [],
    attendanceLog: [
      { id: "a-1-1", date: getPastDate(14), status: "present", note: "출석" },
    ],
  },
  {
    id: "s-2",
    name: "박준호",
    phone: "010-4421-7620",
    pin: "7194",
    course: "더박스 아카데미",
    plan: 16,
    remaining: 8,
    months: 1,
    startDate: getPastDate(18),
    expiryDate: getFutureDate(42),
    memo: "화/목반, 재등록 상담 예정",
    classDays: [2, 4],
    lastAutoDeductedDate: getTodayISO(),
    holdsUsed: 1,
    sentAlerts: {},
    holdRequests: [
      {
        id: "h-1",
        classDate: getFutureDate(2),
        reason: "회사 일정",
        status: "pending",
        requestedAt: new Date().toISOString(),
      },
    ],
    certificateRequests: [],
    attendanceLog: [
      { id: "a-2-1", date: getPastDate(21), status: "present", note: "출석" },
      { id: "a-2-2", date: getPastDate(14), status: "absent", note: "결석" },
      { id: "a-2-3", date: getPastDate(7), status: "present", note: "출석" },
    ],
  },
  {
    id: "s-3",
    name: "이서윤",
    phone: "010-9300-1184",
    pin: "2358",
    course: "더박스 스터디",
    plan: 16,
    remaining: 3,
    months: 1,
    startDate: getPastDate(26),
    expiryDate: getFutureDate(34),
    memo: "토요일만 수강",
    classDays: [6],
    lastAutoDeductedDate: getTodayISO(),
    holdsUsed: 1,
    sentAlerts: {},
    holdRequests: [],
    certificateRequests: [],
    attendanceLog: [
      { id: "a-3-1", date: getPastDate(24), status: "present", note: "출석" },
      { id: "a-3-2", date: getPastDate(17), status: "absent", note: "결석" },
      { id: "a-3-3", date: getPastDate(10), status: "absent", note: "결석" },
      { id: "a-3-4", date: getPastDate(3), status: "present", note: "출석" },
    ],
  },
  {
    id: "s-4",
    name: "최도현",
    phone: "010-5519-2700",
    pin: "9042",
    course: "더박스 아카데미",
    plan: 24,
    remaining: 12,
    months: 2,
    startDate: getPastDate(30),
    expiryDate: getFutureDate(50),
    memo: "목/토 가능",
    classDays: [4, 6],
    lastAutoDeductedDate: getTodayISO(),
    holdsUsed: 2,
    sentAlerts: { half: true },
    holdRequests: [],
    certificateRequests: [],
    attendanceLog: [
      { id: "a-4-1", date: getPastDate(28), status: "present", note: "출석" },
      { id: "a-4-2", date: getPastDate(21), status: "present", note: "출석" },
      { id: "a-4-3", date: getPastDate(14), status: "hold", note: "홀딩" },
      { id: "a-4-4", date: getPastDate(7), status: "present", note: "출석" },
    ],
  },
];

let students = loadStudents();
let weeklyTopic = loadWeeklyTopic();
let loggedInStudentId = null;
let adminUnlocked = false;
let activeAttendanceDay = "today";
applyAutoDeductions();

const alertRules = {
  8: [
    { key: "first", threshold: 7, label: "1차 안내", tone: "checkin" },
    { key: "half", threshold: 4, label: "2차 안내", tone: "schedule" },
    { key: "renewal", threshold: 2, label: "재등록 할인", tone: "renewal" },
  ],
  16: [
    { key: "first", threshold: 15, label: "1차 안내", tone: "checkin" },
    { key: "half", threshold: 8, label: "2차 안내", tone: "schedule" },
    { key: "renewal", threshold: 3, label: "재등록 할인", tone: "renewal" },
  ],
  24: [
    { key: "first", threshold: 23, label: "1차 안내", tone: "checkin" },
    { key: "half", threshold: 12, label: "2차 안내", tone: "schedule" },
    { key: "renewal", threshold: 5, label: "재등록 할인", tone: "renewal" },
  ],
};

const elements = {
  navTabs: document.querySelectorAll(".nav-tab"),
  views: document.querySelectorAll(".view"),
  studentList: document.querySelector("#studentList"),
  todayAttendanceList: document.querySelector("#todayAttendanceList"),
  dayFilters: document.querySelectorAll(".day-filter button"),
  topicForm: document.querySelector("#topicForm"),
  resetTopicsButton: document.querySelector("#resetTopicsButton"),
  totalStudents: document.querySelector("#totalStudents"),
  pendingAlerts: document.querySelector("#pendingAlerts"),
  averageAttendance: document.querySelector("#averageAttendance"),
  renewalAlerts: document.querySelector("#renewalAlerts"),
  pendingHolds: document.querySelector("#pendingHolds"),
  sidebarAlertCount: document.querySelector("#sidebarAlertCount"),
  search: document.querySelector("#studentSearch"),
  courseFilter: document.querySelector("#courseFilter"),
  alertFilter: document.querySelector("#alertFilter"),
  attendanceFilter: document.querySelector("#attendanceFilter"),
  studentLogin: document.querySelector("#studentLogin"),
  loginForm: document.querySelector("#loginForm"),
  loginError: document.querySelector("#loginError"),
  studentPreview: document.querySelector("#studentPreview"),
  dialog: document.querySelector("#studentDialog"),
  form: document.querySelector("#studentForm"),
  adminOnly: document.querySelectorAll(".admin-only"),
  adminLockButton: document.querySelector("#adminLockButton"),
  addStudentButton: document.querySelector("#addStudentButton"),
  exportDataButton: document.querySelector("#exportDataButton"),
  importDataButton: document.querySelector("#importDataButton"),
  importDataInput: document.querySelector("#importDataInput"),
  resetDemo: document.querySelector("#resetDemo"),
};

elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    showView(tab.dataset.view);
  });
});

elements.search.addEventListener("input", render);
elements.courseFilter.addEventListener("change", render);
elements.alertFilter.addEventListener("change", render);
elements.attendanceFilter.addEventListener("change", render);
elements.addStudentButton.addEventListener("click", () => openStudentDialog());
elements.dialog.querySelectorAll("[value='cancel']").forEach((button) => {
  button.addEventListener("click", () => elements.dialog.close());
});

elements.dayFilters.forEach((button) => {
  button.addEventListener("click", () => {
    activeAttendanceDay = button.dataset.day;
    elements.dayFilters.forEach((item) => item.classList.toggle("active", item === button));
    renderTodayAttendance();
  });
});

elements.exportDataButton.addEventListener("click", exportBackup);
elements.importDataButton.addEventListener("click", () => elements.importDataInput.click());
elements.importDataInput.addEventListener("change", importBackup);
elements.topicForm.addEventListener("submit", handleTopicSubmit);
elements.resetTopicsButton.addEventListener("click", () => {
  weeklyTopic = cloneData(defaultWeeklyTopic);
  saveWeeklyTopic();
  fillTopicForm();
  renderTopicContent();
});

elements.dialog.querySelectorAll("[data-days]").forEach((button) => {
  button.addEventListener("click", () => {
    const days = button.dataset.days.split(",");
    elements.form.elements.classPreset.value = button.dataset.days;
    elements.form.querySelectorAll("input[name='classDays']").forEach((checkbox) => {
      checkbox.checked = days.includes(checkbox.value);
    });
    elements.dialog.querySelectorAll("[data-days]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

elements.form.elements.classPreset.addEventListener("change", (event) => {
  if (event.target.value === "custom") return;
  const days = event.target.value.split(",");
  elements.form.querySelectorAll("input[name='classDays']").forEach((checkbox) => {
    checkbox.checked = days.includes(checkbox.value);
  });
  elements.dialog.querySelectorAll("[data-days]").forEach((item) => {
    item.classList.toggle("active", item.dataset.days === event.target.value);
  });
});

elements.adminLockButton.addEventListener("click", () => {
  adminUnlocked = false;
  syncAdminState();
  showView("dashboard");
});

elements.resetDemo.addEventListener("click", () => {
  students = cloneData(defaultStudents);
  loggedInStudentId = null;
  saveStudents();
  render();
});

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.loginForm);
  const phoneLast4 = onlyDigits(data.get("phoneLast4"));
  const pin = onlyDigits(data.get("pin"));

  if (phoneLast4 === ADMIN_LOGIN.phoneLast4 && pin === ADMIN_LOGIN.pin) {
    adminUnlocked = true;
    loggedInStudentId = null;
    elements.loginError.textContent = "";
    elements.loginForm.reset();
    syncAdminState();
    showView("admin");
    render();
    return;
  }

  const matchedStudent = students.find((student) => {
    return getPhoneLast4(student.phone) === phoneLast4 && student.pin === pin;
  });

  if (!matchedStudent) {
    elements.loginError.textContent = "정보가 맞지 않습니다. 전화번호 뒤 4자리와 고유번호를 다시 확인해주세요.";
    return;
  }

  loggedInStudentId = matchedStudent.id;
  elements.loginError.textContent = "";
  elements.loginForm.reset();
  renderStudentPreview();
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.form);
  const studentId = data.get("studentId");
  const plan = Number(data.get("plan"));
  const remaining = Math.min(Number(data.get("remaining")), plan);
  const studentData = {
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    pin: onlyDigits(data.get("pin")),
    course: data.get("course"),
    plan,
    remaining,
    months: Number(data.get("months")),
    classDays: getSelectedClassDays(data),
    startDate: data.get("startDate") || getTodayISO(),
    expiryDate: data.get("expiryDate") || "",
    memo: String(data.get("memo") || "").trim(),
  };

  if (studentId) {
    const student = students.find((item) => item.id === studentId);
    if (student) {
      Object.assign(student, studentData);
      student.lastAutoDeductedDate = getTodayISO();
    }
  } else {
    students.unshift({
      id: createId(),
      ...studentData,
      lastAutoDeductedDate: getTodayISO(),
      holdsUsed: 0,
      sentAlerts: {},
      holdRequests: [],
      certificateRequests: [],
      attendanceLog: createAttendanceFromUsage(plan - remaining),
    });
  }

  elements.form.reset();
  elements.dialog.close();
  saveStudents();
  render();
});

function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const loaded = saved ? JSON.parse(saved) : cloneData(defaultStudents);
  return loaded.map(normalizeStudent);
}

function loadWeeklyTopic() {
  const saved = localStorage.getItem(TOPIC_STORAGE_KEY);
  if (!saved) return cloneData(defaultWeeklyTopic);
  try {
    return normalizeWeeklyTopic(JSON.parse(saved));
  } catch {
    return cloneData(defaultWeeklyTopic);
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function saveWeeklyTopic() {
  localStorage.setItem(TOPIC_STORAGE_KEY, JSON.stringify(weeklyTopic));
}

function showView(viewName) {
  elements.navTabs.forEach((item) => {
    item.classList.toggle("active", item.dataset.view === viewName);
  });
  elements.views.forEach((view) => {
    view.classList.toggle("active-view", view.id === `${viewName}View`);
  });
}

function syncAdminState() {
  elements.adminOnly.forEach((item) => {
    item.classList.toggle("hidden", !adminUnlocked);
  });
}

function normalizeStudent(student) {
  return {
    ...student,
    pin: student.pin || "0000",
    classDays: normalizeClassDays(student.classDays),
    lastAutoDeductedDate: student.lastAutoDeductedDate || getTodayISO(),
    startDate: student.startDate || "",
    expiryDate: student.expiryDate || "",
    memo: student.memo || "",
    holdsUsed: student.holdsUsed || 0,
    sentAlerts: student.sentAlerts || {},
    holdRequests: student.holdRequests || [],
    certificateRequests: student.certificateRequests || [],
    attendanceLog: student.attendanceLog || createAttendanceFromUsage((student.plan || 0) - (student.remaining || 0)),
  };
}

function normalizeWeeklyTopic(topic) {
  const base = cloneData(defaultWeeklyTopic);
  return {
    sessions: [0, 1].map((index) => ({
      ...base.sessions[index],
      ...(topic.sessions?.[index] || {}),
      words: normalizePairs(topic.sessions?.[index]?.words, base.sessions[index].words),
      phrases: normalizePairs(topic.sessions?.[index]?.phrases, base.sessions[index].phrases),
    })),
    event: {
      ...base.event,
      ...(topic.event || {}),
    },
  };
}

function normalizePairs(value, fallback) {
  if (!Array.isArray(value)) return fallback;
  const pairs = value
    .map((item) => Array.isArray(item) ? [String(item[0] || ""), String(item[1] || "")] : null)
    .filter((item) => item && item[0]);
  return pairs.length ? pairs : fallback;
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function getPhoneLast4(phone) {
  return onlyDigits(phone).slice(-4);
}

function getTodayISO() {
  return toISODate(new Date());
}

function createId() {
  if (window.crypto?.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cloneData(data) {
  if (window.structuredClone) {
    return structuredClone(data);
  }
  return JSON.parse(JSON.stringify(data));
}

function getSelectedClassDays(data) {
  const preset = String(data.get("classPreset") || "");
  if (preset && preset !== "custom") {
    return preset.split(",").map(Number).filter((day) => Number.isInteger(day));
  }
  const selected = data.getAll("classDays").map(Number).filter((day) => Number.isInteger(day));
  return selected.length ? selected : [1, 3];
}

function normalizeClassDays(days) {
  if (!Array.isArray(days)) return [1, 3];
  const order = [1, 2, 3, 4, 5, 6, 0];
  const normalized = [...new Set(days.map(Number))]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((a, b) => order.indexOf(a) - order.indexOf(b));
  return normalized.length ? normalized : [1, 3];
}

function formatClassDays(days) {
  return normalizeClassDays(days).map((day) => CLASS_DAY_LABELS[day]).join(" · ");
}

function getClassPreset(days) {
  const normalized = normalizeClassDays(days).join(",");
  const match = elements.form.querySelector(`option[value="${normalized}"]`);
  return match ? normalized : "custom";
}

function setClassDayInputs(days) {
  const normalized = normalizeClassDays(days).map(String);
  elements.form.elements.classPreset.value = getClassPreset(days);
  elements.form.querySelectorAll("input[name='classDays']").forEach((checkbox) => {
    checkbox.checked = normalized.includes(checkbox.value);
  });
  elements.dialog.querySelectorAll("[data-days]").forEach((item) => {
    item.classList.toggle("active", item.dataset.days === normalized.join(","));
  });
}

function openStudentDialog(student = null) {
  elements.form.reset();
  elements.form.elements.studentId.value = student?.id || "";
  elements.dialog.querySelector(".dialog-header h3").textContent = student ? "학생 수정" : "학생 추가";

  if (student) {
    elements.form.elements.name.value = student.name;
    elements.form.elements.phone.value = student.phone;
    elements.form.elements.pin.value = student.pin;
    elements.form.elements.course.value = student.course;
    elements.form.elements.plan.value = String(student.plan);
    elements.form.elements.remaining.value = String(student.remaining);
    elements.form.elements.months.value = String(student.months);
    elements.form.elements.startDate.value = student.startDate || "";
    elements.form.elements.expiryDate.value = student.expiryDate || "";
    elements.form.elements.memo.value = student.memo || "";
    setClassDayInputs(student.classDays);
  } else {
    elements.form.elements.startDate.value = getTodayISO();
    setClassDayInputs([1, 3]);
  }

  elements.dialog.showModal();
}

function getDayNumberForAttendance() {
  if (activeAttendanceDay === "today") return new Date().getDay();
  return Number(activeAttendanceDay);
}

function getStudentsForDay(day) {
  return students.filter((student) => normalizeClassDays(student.classDays).includes(day));
}

function getRecordForDate(student, date) {
  return (student.attendanceLog || []).find((record) => record.date === date);
}

function makeRenewalMessage(student) {
  return `${student.name}님, 안녕하세요. 더박스 어학원입니다 :)

현재 ${student.course} 수강권이 ${student.remaining}회 남아있습니다.
수업 흐름이 끊기지 않도록 재등록 상담을 미리 도와드릴게요.
편한 시간에 말씀주시면 안내드리겠습니다.`;
}

function makeAttendanceRiskMessage(student) {
  const stats = getAttendanceStats(student);
  return `${student.name}님, 안녕하세요. 더박스 어학원입니다 :)

최근 출석률이 ${stats.rate}%로 확인되어 안내드립니다.
수업 루틴이 끊기지 않도록 이번 주 가능한 수업 일정을 함께 조정해보면 좋겠습니다.
홀딩이 필요하시면 수업 전날까지 신청해주세요.`;
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hasAttendanceOnDate(student, date) {
  return (student.attendanceLog || []).some((record) => record.date === date);
}

function applyAutoDeductions() {
  const today = getTodayISO();
  let changed = false;

  students.forEach((student) => {
    const classDays = normalizeClassDays(student.classDays);
    const lastDate = student.lastAutoDeductedDate || today;
    let cursor = addDays(`${lastDate}T00:00:00`, 1);
    const todayDate = new Date(`${today}T00:00:00`);
    let deducted = 0;

    while (cursor <= todayDate) {
      const date = toISODate(cursor);
      const day = cursor.getDay();

      if (classDays.includes(day) && student.remaining > 0 && !hasAttendanceOnDate(student, date)) {
        student.remaining = Math.max(0, student.remaining - 1);
        student.attendanceLog.push({
          id: createId(),
          date,
          status: "present",
          note: "정기 수업 자동 차감",
          autoDeducted: true,
        });
        deducted += 1;
      }

      cursor = addDays(cursor, 1);
    }

    if (student.lastAutoDeductedDate !== today) {
      student.lastAutoDeductedDate = today;
      changed = true;
    }

    if (deducted > 0) {
      changed = true;
    }
  });

  if (changed) {
    saveStudents();
  }
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

function getPastDate(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return toISODate(date);
}

function getTomorrowDate() {
  return getFutureDate(1);
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${year}.${month}.${day}`;
}

function getPendingHolds(student) {
  return student.holdRequests.filter((request) => request.status === "pending");
}

function getPendingCertificates(student) {
  return student.certificateRequests.filter((request) => request.status === "pending");
}

function getLatestCertificate(student) {
  return student.certificateRequests.slice().reverse()[0] || null;
}

function getHoldSummary(student) {
  const limit = student.months * 2;
  const left = Math.max(0, limit - student.holdsUsed);
  return { limit, left };
}

function createAttendanceFromUsage(used) {
  return Array.from({ length: Math.max(0, used) }, (_, index) => ({
    id: `seed-${createId()}`,
    date: getPastDate((index + 1) * 3),
    status: "present",
    note: "출석",
  }));
}

function getAttendanceStats(student) {
  const records = student.attendanceLog || [];
  const present = records.filter((record) => record.status === "present").length;
  const absent = records.filter((record) => record.status === "absent").length;
  const hold = records.filter((record) => record.status === "hold").length;
  const counted = present + absent;
  const rate = counted ? Math.round((present / counted) * 100) : 100;
  const status = rate >= 80 ? "good" : rate >= 60 ? "watch" : "risk";
  return { present, absent, hold, counted, rate, status };
}

function getAttendanceLabel(status) {
  const labels = {
    present: "출석",
    absent: "결석",
    hold: "홀딩",
    scheduled: "수업 예정",
    off: "수업 없음",
  };
  return labels[status] || status;
}

function getAttendanceBadge(stats) {
  if (stats.status === "risk") {
    return `<span class="tag risk">출석 위험 ${stats.rate}%</span>`;
  }
  if (stats.status === "watch") {
    return `<span class="tag warning">관심 ${stats.rate}%</span>`;
  }
  return `<span class="tag good">출석 안정 ${stats.rate}%</span>`;
}

function getAlert(student) {
  const rules = alertRules[student.plan] || [];
  return rules.find((rule) => student.remaining === rule.threshold && !student.sentAlerts[rule.key]) || null;
}

function getAlertBadge(student) {
  const alert = getAlert(student);
  if (!alert) return `<span class="tag">알림 없음</span>`;
  const className = alert.key === "renewal" ? "danger" : "warning";
  return `<span class="tag ${className}">${alert.label} 필요</span>`;
}

function getExpiryBadge(student) {
  if (!student.expiryDate) return "";
  const today = new Date(`${getTodayISO()}T00:00:00`);
  const expiry = new Date(`${student.expiryDate}T00:00:00`);
  const daysLeft = Math.ceil((expiry - today) / 86400000);
  if (daysLeft < 0) return `<span class="tag danger">만료 ${Math.abs(daysLeft)}일 지남</span>`;
  if (daysLeft <= 7) return `<span class="tag warning">만료 ${daysLeft}일 전</span>`;
  return `<span class="tag">만료 ${formatDate(student.expiryDate)}</span>`;
}

function makeMessage(student, alert) {
  const nameLine = `${student.name}님, 안녕하세요. 더박스 어학원입니다 :)`;

  if (alert.tone === "renewal") {
    return `${nameLine}

현재 ${student.course} 수강권이 ${student.remaining}회 남아있어 안내드립니다.

수강 흐름이 끊기지 않도록 미리 재등록하시면 좋습니다.
남은 횟수가 있을 때 재결제하시면 재등록 할인 혜택을 적용해드리고 있어요.

원하시면 다음 수강권 안내 도와드릴게요.`;
  }

  if (alert.tone === "schedule") {
    return `${nameLine}

현재 ${student.course} 수강권이 ${student.remaining}회 남아있습니다.

남은 수업도 효율적으로 사용하실 수 있도록 출석과 홀딩 일정을 한 번 확인해주세요.
홀딩은 수업 전날까지 신청 가능하며, ${student.months}개월 등록 기준 총 ${student.months * 2}회까지 사용할 수 있습니다.`;
  }

  return `${nameLine}

현재 ${student.course} 수강권이 ${student.remaining}회 남아있습니다.

이번 달도 꾸준히 회화 루틴 이어가실 수 있도록 출석 현황을 안내드려요.
궁금한 점이 있으면 편하게 말씀해주세요.`;
}

function getFilteredStudents() {
  const query = elements.search.value.trim().toLowerCase();
  const course = elements.courseFilter.value;
  const alertMode = elements.alertFilter.value;
  const attendanceMode = elements.attendanceFilter.value;

  return students.filter((student) => {
    const alert = getAlert(student);
    const attendanceStats = getAttendanceStats(student);
    const matchesQuery = `${student.name} ${student.course}`.toLowerCase().includes(query);
    const matchesCourse = course === "all" || student.course === course;
    const matchesAlert =
      alertMode === "all" ||
      (alertMode === "pending" && alert) ||
      (alertMode === "renewal" && alert?.key === "renewal") ||
      (alertMode === "attendanceRisk" && attendanceStats.status === "risk");
    const matchesAttendance =
      attendanceMode === "all" ||
      (attendanceMode === "good" && attendanceStats.status === "good") ||
      (attendanceMode === "watch" && attendanceStats.status === "watch") ||
      (attendanceMode === "risk" && attendanceStats.status === "risk");

    return matchesQuery && matchesCourse && matchesAlert && matchesAttendance;
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pairsToText(pairs) {
  return pairs.map(([english, korean]) => `${english}=${korean}`).join("\n");
}

function textToPairs(text) {
  return String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [english, ...rest] = line.split("=");
      return [english.trim(), rest.join("=").trim()];
    })
    .filter(([english]) => english);
}

function renderTopicContent() {
  const todayStack = document.querySelector(".dashboard-today .session-stack");
  const sessionList = document.querySelector(".session-list");
  const eventCard = document.querySelector(".event-card");

  todayStack.innerHTML = weeklyTopic.sessions
    .map((session, index) => `
      <div>
        <b>Session ${index + 1}</b>
        <strong>${escapeHtml(session.title)}</strong>
        <p>${escapeHtml(session.desc)}</p>
        ${session.pdf ? `<a class="pdf-link" href="${escapeHtml(session.pdf)}" target="_blank" rel="noopener">PDF 보기</a>` : ""}
      </div>
    `)
    .join("");

  sessionList.innerHTML = weeklyTopic.sessions
    .map((session, index) => `
      <div class="session-card">
        <div class="session-head">
          <b>Session ${index + 1}</b>
          <strong>${escapeHtml(session.title)}</strong>
        </div>
        <div class="prep-columns">
          <div>
            <h4>필요 단어</h4>
            <ul class="study-list">
              ${session.words.map(([english, korean]) => `<li><strong>${escapeHtml(english)}</strong><span>${escapeHtml(korean)}</span></li>`).join("")}
            </ul>
          </div>
          <div>
            <h4>필수 문장</h4>
            <ul class="study-list phrase-list">
              ${session.phrases.map(([english, korean]) => `<li><strong>${escapeHtml(english)}</strong><span>${escapeHtml(korean)}</span></li>`).join("")}
            </ul>
          </div>
        </div>
      </div>
    `)
    .join("");

  eventCard.innerHTML = `
    <b>${escapeHtml(weeklyTopic.event.title)}</b>
    <strong>${escapeHtml(weeklyTopic.event.status)}</strong>
    <p>${escapeHtml(weeklyTopic.event.desc)}</p>
    <span>${escapeHtml(weeklyTopic.event.note)}</span>
  `;
}

function fillTopicForm() {
  const [session1, session2] = weeklyTopic.sessions;
  elements.topicForm.elements.session1Title.value = session1.title;
  elements.topicForm.elements.session1Pdf.value = session1.pdf;
  elements.topicForm.elements.session1Desc.value = session1.desc;
  elements.topicForm.elements.session1Words.value = pairsToText(session1.words);
  elements.topicForm.elements.session1Phrases.value = pairsToText(session1.phrases);
  elements.topicForm.elements.session2Title.value = session2.title;
  elements.topicForm.elements.session2Pdf.value = session2.pdf;
  elements.topicForm.elements.session2Desc.value = session2.desc;
  elements.topicForm.elements.session2Words.value = pairsToText(session2.words);
  elements.topicForm.elements.session2Phrases.value = pairsToText(session2.phrases);
  elements.topicForm.elements.eventTitle.value = weeklyTopic.event.title;
  elements.topicForm.elements.eventStatus.value = weeklyTopic.event.status;
  elements.topicForm.elements.eventDesc.value = weeklyTopic.event.desc;
  elements.topicForm.elements.eventNote.value = weeklyTopic.event.note;
}

function handleTopicSubmit(event) {
  event.preventDefault();
  const data = new FormData(elements.topicForm);
  weeklyTopic = normalizeWeeklyTopic({
    sessions: [
      {
        title: data.get("session1Title"),
        pdf: data.get("session1Pdf"),
        desc: data.get("session1Desc"),
        words: textToPairs(data.get("session1Words")),
        phrases: textToPairs(data.get("session1Phrases")),
      },
      {
        title: data.get("session2Title"),
        pdf: data.get("session2Pdf"),
        desc: data.get("session2Desc"),
        words: textToPairs(data.get("session2Words")),
        phrases: textToPairs(data.get("session2Phrases")),
      },
    ],
    event: {
      title: data.get("eventTitle"),
      status: data.get("eventStatus"),
      desc: data.get("eventDesc"),
      note: data.get("eventNote"),
    },
  });
  saveWeeklyTopic();
  renderTopicContent();
}

function exportBackup() {
  const payload = {
    exportedAt: new Date().toISOString(),
    students,
    weeklyTopic,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `thebox-backup-${getTodayISO()}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function importBackup(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const data = JSON.parse(String(reader.result || "{}"));
      const nextStudents = Array.isArray(data.students) ? data.students.map(normalizeStudent) : null;
      if (!nextStudents) throw new Error("invalid students");
      students = nextStudents;
      weeklyTopic = normalizeWeeklyTopic(data.weeklyTopic || defaultWeeklyTopic);
      saveStudents();
      saveWeeklyTopic();
      fillTopicForm();
      render();
      elements.importDataInput.value = "";
    } catch {
      alert("백업 파일을 불러오지 못했습니다. JSON 파일을 다시 확인해주세요.");
    }
  });
  reader.readAsText(file);
}

function render() {
  const pending = students.filter(getAlert);
  const renewals = students.filter((student) => getAlert(student)?.key === "renewal");
  const pendingHolds = students.reduce((sum, student) => sum + getPendingHolds(student).length, 0);
  const pendingCertificates = students.reduce((sum, student) => sum + getPendingCertificates(student).length, 0);
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum, student) => sum + getAttendanceStats(student).rate, 0) / students.length)
    : 0;

  elements.totalStudents.textContent = students.length;
  elements.pendingAlerts.textContent = pending.length;
  elements.averageAttendance.textContent = `${averageAttendance}%`;
  elements.renewalAlerts.textContent = renewals.length;
  elements.pendingHolds.textContent = pendingHolds + pendingCertificates;
  elements.sidebarAlertCount.textContent = `${pending.length}명`;

  renderStudentList();
  renderTodayAttendance();
  renderStudentPreview();
  renderTopicContent();
}

function renderStudentList() {
  const filtered = getFilteredStudents();

  if (!filtered.length) {
    elements.studentList.innerHTML = `<div class="empty-state">조건에 맞는 학생이 없습니다.</div>`;
    return;
  }

  elements.studentList.innerHTML = filtered
    .map((student) => {
      const alert = getAlert(student);
      const used = student.plan - student.remaining;
      const progress = Math.round((used / student.plan) * 100);
      const message = alert ? makeMessage(student, alert) : "";
      const holdSummary = getHoldSummary(student);
      const pendingHoldList = getPendingHolds(student);
      const pendingCertificateList = getPendingCertificates(student);
      const attendanceStats = getAttendanceStats(student);
      const recentAttendance = (student.attendanceLog || []).slice().reverse().slice(0, 3);

      return `
        <article class="student-card" data-id="${student.id}">
          <div class="student-main">
            <h4>${student.name}</h4>
            <p>${student.phone}</p>
            <div class="tag-row">
              <span class="tag">${student.course}</span>
              <span class="tag">월 ${student.plan}회</span>
              <span class="tag">수업 ${formatClassDays(student.classDays)}</span>
              <span class="tag">고유번호 ${student.pin}</span>
              ${getAttendanceBadge(attendanceStats)}
              ${getAlertBadge(student)}
              ${getExpiryBadge(student)}
            </div>
            <div class="student-meta">
              <span>결제 ${formatDate(student.startDate) || "-"} · 만료 ${formatDate(student.expiryDate) || "-"}</span>
              <span>${student.memo ? `메모: ${escapeHtml(student.memo)}` : "내부 메모 없음"}</span>
            </div>
            <button class="ghost-button slim-button" type="button" data-action="edit">학생 수정</button>
          </div>

          <div class="progress-wrap">
            <div class="state-row">
              <span>사용 ${used}회</span>
              <strong>남은 ${student.remaining}회</strong>
            </div>
            <div class="progress-track" aria-hidden="true">
              <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="state-row">
              <span>홀딩 ${student.holdsUsed}/${holdSummary.limit}회 사용</span>
              <div class="count-controls" aria-label="${student.name} 잔여 횟수 조정">
                <button type="button" data-action="decrease" title="출석 처리">−</button>
                <button type="button" data-action="increase" title="횟수 복구">+</button>
              </div>
            </div>
            <p class="auto-deduct-note">정기 수업일 ${formatClassDays(student.classDays)} · 마지막 자동 확인 ${formatDate(student.lastAutoDeductedDate)}</p>
            <div class="hold-admin">
              <strong>홀딩 신청</strong>
              ${
                pendingHoldList.length
                  ? pendingHoldList
                      .map(
                        (request) => `
                          <div class="hold-request" data-hold-id="${request.id}">
                            <div>
                              <b>${formatDate(request.classDate)}</b>
                              <span>${request.reason || "사유 없음"}</span>
                            </div>
                            <div class="hold-actions">
                              <button type="button" data-action="approveHold" data-hold-id="${request.id}">승인</button>
                              <button type="button" data-action="rejectHold" data-hold-id="${request.id}">반려</button>
                            </div>
                          </div>
                        `
                      )
                      .join("")
                  : `<p>대기 중인 신청 없음</p>`
              }
            </div>
            <div class="certificate-admin">
              <strong>수강증 신청</strong>
              ${
                pendingCertificateList.length
                  ? pendingCertificateList
                      .map(
                        (request) => `
                          <div class="certificate-request" data-certificate-id="${request.id}">
                            <div>
                              <b>${formatDate(request.requestedAt.slice(0, 10))}</b>
                              <span>${request.memo || "수강증 출력 요청"}</span>
                            </div>
                            <div class="hold-actions">
                              <button type="button" data-action="completeCertificate" data-certificate-id="${request.id}">출력 완료</button>
                            </div>
                          </div>
                        `
                      )
                      .join("")
                  : `<p>대기 중인 신청 없음</p>`
              }
            </div>
          </div>

          <div class="attendance-panel">
            <h5>출석율</h5>
            <div class="attendance-score">
              <strong>${attendanceStats.rate}%</strong>
              <span>출석 ${attendanceStats.present} · 결석 ${attendanceStats.absent} · 홀딩 ${attendanceStats.hold}</span>
            </div>
            <div class="progress-track" aria-hidden="true">
              <div class="progress-fill" style="width: ${attendanceStats.rate}%"></div>
            </div>
            <div class="attendance-actions" aria-label="${student.name} 출결 기록">
              <button type="button" data-action="present">출석</button>
              <button type="button" data-action="absent">결석</button>
              <button type="button" data-action="undoAttendance">되돌림</button>
            </div>
            <div class="attendance-mini">
              ${
                recentAttendance.length
                  ? recentAttendance
                      .map((record) => `${formatDate(record.date)} ${getAttendanceLabel(record.status)}`)
                      .join(" · ")
                  : "아직 출결 기록 없음"
              }
            </div>
          </div>

          <div class="message-box">
            ${
              alert
                ? `<strong>${alert.label} 문구</strong>
                   <textarea readonly>${message}</textarea>
                   <div class="message-actions">
                     <button class="ghost-button" type="button" data-action="copy">복사</button>
                     <button class="primary-button" type="button" data-action="sent" data-alert="${alert.key}">발송 완료</button>
                   </div>`
                : `<strong>빠른 카톡 문구</strong>
                   <textarea readonly>${getAttendanceStats(student).status === "risk" ? makeAttendanceRiskMessage(student) : makeRenewalMessage(student)}</textarea>
                   <div class="message-actions">
                     <button class="ghost-button" type="button" data-action="copy">복사</button>
                   </div>`
            }
          </div>
        </article>
      `;
    })
    .join("");

  elements.studentList.querySelectorAll(".student-card").forEach((card) => {
    card.addEventListener("click", handleStudentCardClick);
  });
}

function renderTodayAttendance() {
  if (!elements.todayAttendanceList) return;

  const day = getDayNumberForAttendance();
  const date = getTodayISO();
  const list = getStudentsForDay(day);

  if (!list.length) {
    elements.todayAttendanceList.innerHTML = `<div class="empty-state">${CLASS_DAY_LABELS[day]}요일 수업 학생이 없습니다.</div>`;
    return;
  }

  elements.todayAttendanceList.innerHTML = list
    .map((student) => {
      const record = getRecordForDate(student, date);
      const stats = getAttendanceStats(student);
      return `
        <article class="today-card" data-id="${student.id}">
          <div>
            <h4>${escapeHtml(student.name)}</h4>
            <p>${escapeHtml(student.course)} · 수업 ${formatClassDays(student.classDays)} · 남은 ${student.remaining}회</p>
            <p>${student.memo ? `메모: ${escapeHtml(student.memo)}` : "내부 메모 없음"}</p>
          </div>
          <div class="today-status">
            <span class="tag ${record?.status || ""}">${record ? getAttendanceLabel(record.status) : "미처리"}</span>
            <span>출석률 ${stats.rate}%</span>
          </div>
          <div class="today-actions">
            <button type="button" data-action="present">출석</button>
            <button type="button" data-action="absent">결석</button>
            <button type="button" data-action="undoAttendance">되돌림</button>
            <button type="button" data-action="edit">수정</button>
          </div>
        </article>
      `;
    })
    .join("");

  elements.todayAttendanceList.querySelectorAll(".today-card").forEach((card) => {
    card.addEventListener("click", handleStudentCardClick);
  });
}

function getDayLabelFromDate(value) {
  return CLASS_DAY_LABELS[new Date(`${value}T00:00:00`).getDay()];
}

function formatStudentDate(value) {
  if (!value) return "";
  const [, month, day] = value.split("-");
  return `${Number(month)}월 ${Number(day)}일 ${getDayLabelFromDate(value)}요일`;
}

function getNextClassDate(student) {
  const classDays = normalizeClassDays(student.classDays);
  const base = new Date(`${getTodayISO()}T00:00:00`);

  for (let index = 0; index <= 14; index += 1) {
    const candidate = addDays(base, index);
    if (classDays.includes(candidate.getDay())) {
      return toISODate(candidate);
    }
  }

  return "";
}

function getHoldDeadlineInfo(student) {
  const nextClassDate = getNextClassDate(student);
  if (!nextClassDate) {
    return { nextClassDate: "", canHoldNextClass: false, text: "정기 수업일이 아직 설정되지 않았습니다." };
  }

  const today = new Date(`${getTodayISO()}T00:00:00`);
  const classDate = new Date(`${nextClassDate}T00:00:00`);
  const deadline = addDays(classDate, -1);
  const canHoldNextClass = today <= deadline;

  return {
    nextClassDate,
    canHoldNextClass,
    text: canHoldNextClass
      ? `다음 수업 홀딩은 ${formatStudentDate(toISODate(deadline))}까지 신청할 수 있습니다.`
      : "다음 수업은 홀딩 신청 마감 시간이 지났습니다.",
  };
}

function getRemainingGuide(student) {
  const perWeek = Math.max(1, normalizeClassDays(student.classDays).length);
  const weeks = Math.ceil(student.remaining / perWeek);
  if (student.remaining <= 0) return "남은 횟수가 없습니다. 상담실에서 재등록 상담을 받아주세요.";
  return `현재 패턴 기준 약 ${weeks}주 정도 수업을 이어갈 수 있습니다.`;
}

function renderStudentTopicCards() {
  return `
    <div class="student-topic-panel">
      <div class="student-panel-head">
        <span>THIS WEEK</span>
        <h5>이번 주 수업 주제</h5>
      </div>
      <div class="student-topic-grid">
        ${weeklyTopic.sessions
          .map(
            (session, index) => `
              <article class="student-topic-card">
                <b>Session ${index + 1}</b>
                <strong>${escapeHtml(session.title)}</strong>
                <p>${escapeHtml(session.desc)}</p>
                <div class="mini-study-list">
                  ${session.words
                    .slice(0, 3)
                    .map(([english, korean]) => `<span><em>${escapeHtml(english)}</em>${escapeHtml(korean)}</span>`)
                    .join("")}
                </div>
                <div class="mini-phrase-list">
                  ${session.phrases
                    .slice(0, 2)
                    .map(([english, korean]) => `<span><em>${escapeHtml(english)}</em>${escapeHtml(korean)}</span>`)
                    .join("")}
                </div>
                ${session.pdf ? `<a class="pdf-link" href="${escapeHtml(session.pdf)}" target="_blank" rel="noopener">PDF 보기</a>` : ""}
              </article>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderAttendanceCalendar(student) {
  const today = new Date(`${getTodayISO()}T00:00:00`);
  const classDays = normalizeClassDays(student.classDays);
  const days = Array.from({ length: 28 }, (_, index) => {
    const date = addDays(today, index - 20);
    const iso = toISODate(date);
    const record = getRecordForDate(student, iso);
    const isClassDay = classDays.includes(date.getDay());
    const status = record?.status || (isClassDay ? "scheduled" : "off");
    return { iso, date, status };
  });

  return `
    <div class="attendance-calendar">
      <div class="student-panel-head">
        <span>CALENDAR</span>
        <h5>출석 캘린더</h5>
      </div>
      <div class="calendar-grid" aria-label="최근 출석 캘린더">
        ${days
          .map(
            (day) => `
              <div class="calendar-day ${day.status}" title="${formatStudentDate(day.iso)} ${getAttendanceLabel(day.status)}">
                <span>${CLASS_DAY_LABELS[day.date.getDay()]}</span>
                <strong>${day.date.getDate()}</strong>
              </div>
            `
          )
          .join("")}
      </div>
      <div class="calendar-legend">
        <span><i class="present"></i>출석</span>
        <span><i class="absent"></i>결석</span>
        <span><i class="hold"></i>홀딩</span>
        <span><i class="scheduled"></i>수업 예정</span>
      </div>
    </div>
  `;
}

function renderStudentFaq() {
  return `
    <div class="student-faq">
      <div class="student-panel-head">
        <span>FAQ</span>
        <h5>자주 묻는 질문</h5>
      </div>
      <details open>
        <summary>홀딩은 언제까지 신청할 수 있나요?</summary>
        <p>수업 전날까지 신청할 수 있고, 승인되면 해당 수업은 차감되지 않습니다.</p>
      </details>
      <details>
        <summary>당일 취소나 노쇼는 어떻게 되나요?</summary>
        <p>당일 취소 또는 노쇼는 수강권에서 1회 차감될 수 있습니다.</p>
      </details>
      <details>
        <summary>PDF 자료는 어디서 확인하나요?</summary>
        <p>학생 화면의 이번 주 수업 주제 카드에서 바로 열 수 있습니다.</p>
      </details>
      <details>
        <summary>수강증은 어디서 받나요?</summary>
        <p>앱에서 신청 후 준비 완료가 뜨면 더박스 상담실로 오시면 출력해드립니다.</p>
      </details>
    </div>
  `;
}

async function handleStudentCardClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const card = event.currentTarget;
  const student = students.find((item) => item.id === card.dataset.id);
  const action = button.dataset.action;

  if (action === "edit") {
    openStudentDialog(student);
    return;
  }

  if (action === "decrease") {
    student.remaining = Math.max(0, student.remaining - 1);
  }

  if (action === "increase") {
    student.remaining = Math.min(student.plan, student.remaining + 1);
  }

  if (action === "present") {
    const today = getTodayISO();
    const existing = student.attendanceLog.find((record) => record.date === today);
    if (existing) {
      existing.status = "present";
      existing.note = "관리자 출석 처리";
      existing.autoDeducted = false;
    } else {
      student.remaining = Math.max(0, student.remaining - 1);
      student.attendanceLog.push({
        id: createId(),
        date: today,
        status: "present",
        note: "관리자 출석 처리",
      });
    }
  }

  if (action === "absent") {
    const today = getTodayISO();
    const existing = student.attendanceLog.find((record) => record.date === today);
    if (existing) {
      existing.status = "absent";
      existing.note = "관리자 결석 처리";
      existing.autoDeducted = false;
    } else {
      student.remaining = Math.max(0, student.remaining - 1);
      student.attendanceLog.push({
        id: createId(),
        date: today,
        status: "absent",
        note: "관리자 결석 처리",
      });
    }
  }

  if (action === "undoAttendance") {
    const lastRecord = student.attendanceLog.pop();
    if (lastRecord && (lastRecord.status === "present" || lastRecord.status === "absent")) {
      student.remaining = Math.min(student.plan, student.remaining + 1);
    }
  }

  if (action === "sent") {
    student.sentAlerts[button.dataset.alert] = true;
  }

  if (action === "approveHold") {
    const request = student.holdRequests.find((item) => item.id === button.dataset.holdId);
    if (request && request.status === "pending") {
      request.status = "approved";
      request.deducted = false;
      student.holdsUsed = Math.min(student.months * 2, student.holdsUsed + 1);
      student.attendanceLog.push({
        id: createId(),
        date: request.classDate,
        status: "hold",
        note: request.reason || "홀딩 승인",
      });
    }
  }

  if (action === "rejectHold") {
    const request = student.holdRequests.find((item) => item.id === button.dataset.holdId);
    if (request) {
      request.status = "rejected";
    }
  }

  if (action === "completeCertificate") {
    const request = student.certificateRequests.find((item) => item.id === button.dataset.certificateId);
    if (request) {
      request.status = "completed";
      request.completedAt = new Date().toISOString();
    }
  }

  if (action === "copy") {
    const textarea = card.querySelector("textarea");
    try {
      await navigator.clipboard.writeText(textarea.value);
    } catch {
      textarea.removeAttribute("readonly");
      textarea.select();
      document.execCommand("copy");
      textarea.setAttribute("readonly", "");
    }
    button.textContent = "복사됨";
    setTimeout(() => {
      button.textContent = "복사";
    }, 1200);
  }

  if (action !== "copy") {
    saveStudents();
    render();
  }
}

function renderStudentPreview() {
  const student = students.find((item) => item.id === loggedInStudentId);

  if (!student) {
    elements.studentLogin.classList.remove("hidden");
    elements.studentPreview.classList.add("hidden");
    elements.studentPreview.innerHTML = "";
    return;
  }

  const used = student.plan - student.remaining;
  const holdSummary = getHoldSummary(student);
  const alert = getAlert(student);
  const recentHolds = student.holdRequests.slice().reverse().slice(0, 3);
  const attendanceStats = getAttendanceStats(student);
  const recentAttendance = (student.attendanceLog || []).slice().reverse().slice(0, 5);
  const latestCertificate = getLatestCertificate(student);
  const hasPendingCertificate = latestCertificate?.status === "pending";
  const canRequestHold = holdSummary.left > 0;
  const holdDeadline = getHoldDeadlineInfo(student);

  elements.studentLogin.classList.add("hidden");
  elements.studentPreview.classList.remove("hidden");
  elements.studentPreview.innerHTML = `
    <div class="preview-hero">
      <div>
        <p class="eyebrow">THE BOX STUDENT PASS</p>
        <h4>${student.name}님</h4>
        <p>${student.course} · 월 ${student.plan}회 수강권 · 정기 수업 ${formatClassDays(student.classDays)}</p>
      </div>
      <div class="preview-actions">
        <span class="tag ${alert?.key === "renewal" ? "danger" : alert ? "warning" : ""}">
          ${alert ? alert.label : "정상 수강중"}
        </span>
        <button class="ghost-button" type="button" data-action="logout">로그아웃</button>
      </div>
    </div>

    <div class="preview-grid">
      <div class="preview-item">
        <span>출석율</span>
        <strong>${attendanceStats.rate}%</strong>
      </div>
      <div class="preview-item">
        <span>남은 횟수</span>
        <strong>${student.remaining}회</strong>
      </div>
      <div class="preview-item">
        <span>사용 횟수</span>
        <strong>${used}회</strong>
      </div>
      <div class="preview-item">
        <span>홀딩 가능</span>
        <strong>${holdSummary.left}회</strong>
      </div>
    </div>

    <div class="student-action-grid">
      <div class="next-class-card">
        <span>NEXT CLASS</span>
        <strong>${formatStudentDate(holdDeadline.nextClassDate)}</strong>
        <p>${getRemainingGuide(student)}</p>
      </div>
      <div class="next-class-card ${holdDeadline.canHoldNextClass ? "available" : "closed"}">
        <span>HOLDING</span>
        <strong>${holdDeadline.canHoldNextClass ? "홀딩 신청 가능" : "홀딩 마감"}</strong>
        <p>${holdDeadline.text}</p>
      </div>
      <div class="todo-card">
        <span>오늘 확인</span>
        <label><input type="checkbox" /> 이번 주 주제 보기</label>
        <label><input type="checkbox" /> 필수 문장 1개 말해보기</label>
        <label><input type="checkbox" /> 홀딩 필요 여부 확인</label>
      </div>
    </div>

    <div class="notice-band">
      현재 출석 ${attendanceStats.present}회, 결석 ${attendanceStats.absent}회, 홀딩 ${attendanceStats.hold}회입니다.
      정기 수업일이 지나면 앱 확인 시 남은 횟수가 자동 차감됩니다.
      ${holdDeadline.text}
      당일 취소 또는 노쇼는 수강권에서 1회 차감될 수 있습니다.
    </div>

    ${renderStudentTopicCards()}

    <form id="holdForm" class="hold-form">
      <div>
        <h5>홀딩 신청</h5>
        <p>수업 전날까지 신청할 수 있고, 승인되면 수강권 횟수는 차감되지 않습니다.</p>
      </div>
      <label>
        홀딩할 수업일
        <input name="classDate" type="date" min="${getTomorrowDate()}" required ${canRequestHold ? "" : "disabled"} />
      </label>
      <label>
        사유
        <select name="reason" ${canRequestHold ? "" : "disabled"}>
          <option>회사 일정</option>
          <option>개인 일정</option>
          <option>건강 문제</option>
          <option>기타</option>
        </select>
      </label>
      <button class="primary-button" type="submit" ${canRequestHold ? "" : "disabled"}>홀딩 신청하기</button>
      <p class="form-note">${canRequestHold ? `${holdDeadline.text} 이번 수강권에서 ${holdSummary.left}회 더 신청할 수 있습니다.` : "사용 가능한 홀딩 횟수를 모두 사용했습니다."}</p>
    </form>

    <form id="certificateForm" class="certificate-form">
      <div>
        <h5>수강증 신청</h5>
        <p>수강증이 필요하면 신청해주세요. 더박스 상담실로 오시면 확인 후 출력해드립니다.</p>
      </div>
      <div class="certificate-status ${latestCertificate?.status || "none"}">
        <span>현재 상태</span>
        <strong>${getCertificateStatusLabel(latestCertificate?.status)}</strong>
        <p>${
          latestCertificate?.status === "completed"
            ? "수강증 준비가 완료되었습니다. 더박스 상담실로 오시면 출력해드립니다."
            : latestCertificate?.status === "pending"
              ? "신청이 접수되었습니다. 상담실에서 확인 후 준비되면 상태가 바뀝니다."
              : "아직 신청 내역이 없습니다."
        }</p>
      </div>
      <label>
        요청 메모
        <input name="memo" placeholder="예: 회사 제출용, 영문 이름 필요 등" ${hasPendingCertificate ? "disabled" : ""} />
      </label>
      <button class="primary-button" type="submit" ${hasPendingCertificate ? "disabled" : ""}>수강증 신청하기</button>
      <p class="form-note">${hasPendingCertificate ? "이미 신청한 수강증이 준비 대기 중입니다." : "신청 후 준비가 완료되면 이 화면에서 바로 확인할 수 있습니다."}</p>
    </form>

    ${renderAttendanceCalendar(student)}

    <div class="attendance-history">
      <h5>최근 출결 내역</h5>
      ${
        recentAttendance.length
          ? recentAttendance
              .map(
                (record) => `
                  <div class="attendance-row">
                    <span>${formatDate(record.date)} · ${record.note || getAttendanceLabel(record.status)}</span>
                    <strong class="${record.status}">${getAttendanceLabel(record.status)}</strong>
                  </div>
                `
              )
              .join("")
          : `<p>아직 출결 내역이 없습니다.</p>`
      }
    </div>

    <div class="hold-history">
      <h5>최근 홀딩 내역</h5>
      ${
        recentHolds.length
          ? recentHolds
              .map(
                (request) => `
                  <div class="history-row">
                    <span>${formatDate(request.classDate)} · ${request.reason}</span>
                    <strong class="${request.status}">${getHoldStatusLabel(request.status)}</strong>
                  </div>
                `
              )
              .join("")
          : `<p>아직 신청 내역이 없습니다.</p>`
      }
    </div>

    ${renderStudentFaq()}
  `;

  elements.studentPreview.querySelector("[data-action='logout']").addEventListener("click", () => {
    loggedInStudentId = null;
    renderStudentPreview();
  });

  elements.studentPreview.querySelector("#holdForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    student.holdRequests.push({
      id: createId(),
      classDate: data.get("classDate"),
      reason: data.get("reason"),
      status: "pending",
      requestedAt: new Date().toISOString(),
    });
    saveStudents();
    render();
  });

  elements.studentPreview.querySelector("#certificateForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    student.certificateRequests.push({
      id: createId(),
      memo: String(data.get("memo") || "").trim(),
      status: "pending",
      requestedAt: new Date().toISOString(),
    });
    saveStudents();
    render();
  });
}

function getHoldStatusLabel(status) {
  const labels = {
    pending: "승인 대기",
    approved: "승인 완료",
    rejected: "반려",
  };
  return labels[status] || status;
}

function getCertificateStatusLabel(status) {
  const labels = {
    pending: "준비 대기",
    completed: "준비 완료",
    none: "신청 전",
  };
  return labels[status || "none"] || status;
}

fillTopicForm();
render();
