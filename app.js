const STORAGE_KEY = "thebox-ticket-alert-demo-v3";

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
let loggedInStudentId = null;
let adminUnlocked = false;
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
elements.addStudentButton.addEventListener("click", () => elements.dialog.showModal());
elements.dialog.querySelectorAll("[value='cancel']").forEach((button) => {
  button.addEventListener("click", () => elements.dialog.close());
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
  const plan = Number(data.get("plan"));
  const remaining = Math.min(Number(data.get("remaining")), plan);

  students.unshift({
    id: createId(),
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    pin: onlyDigits(data.get("pin")),
    course: data.get("course"),
    plan,
    remaining,
    months: Number(data.get("months")),
    classDays: getSelectedClassDays(data),
    lastAutoDeductedDate: getTodayISO(),
    holdsUsed: 0,
    sentAlerts: {},
    holdRequests: [],
    certificateRequests: [],
    attendanceLog: createAttendanceFromUsage(plan - remaining),
  });

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

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
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
    holdsUsed: student.holdsUsed || 0,
    sentAlerts: student.sentAlerts || {},
    holdRequests: student.holdRequests || [],
    certificateRequests: student.certificateRequests || [],
    attendanceLog: student.attendanceLog || createAttendanceFromUsage((student.plan || 0) - (student.remaining || 0)),
  };
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
  const normalized = [...new Set(days.map(Number))]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((a, b) => a - b);
  return normalized.length ? normalized : [1, 3];
}

function formatClassDays(days) {
  return normalizeClassDays(days).map((day) => CLASS_DAY_LABELS[day]).join(" · ");
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
  renderStudentPreview();
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
            </div>
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
                : `<strong>현재 자동 알림 없음</strong>
                   <p>기준 잔여 횟수에 도달하면 카톡 문구가 여기에 표시됩니다.</p>`
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

async function handleStudentCardClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const card = event.currentTarget;
  const student = students.find((item) => item.id === card.dataset.id);
  const action = button.dataset.action;

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

    <div class="notice-band">
      현재 출석 ${attendanceStats.present}회, 결석 ${attendanceStats.absent}회, 홀딩 ${attendanceStats.hold}회입니다.
      정기 수업일이 지나면 앱 확인 시 남은 횟수가 자동 차감됩니다.
      홀딩은 수업 전날까지 신청하면 횟수가 차감되지 않습니다.
      당일 취소 또는 노쇼는 수강권에서 1회 차감될 수 있습니다.
    </div>

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
      <p class="form-note">${canRequestHold ? `이번 수강권에서 ${holdSummary.left}회 더 신청할 수 있습니다.` : "사용 가능한 홀딩 횟수를 모두 사용했습니다."}</p>
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

render();
