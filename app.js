const STORAGE_KEY = "thebox-ticket-alert-demo-v3";

const ADMIN_PIN = "thebox2026";

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
    holdsUsed: 0,
    sentAlerts: {},
    holdRequests: [],
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
    holdsUsed: 1,
    sentAlerts: {},
    holdRequests: [],
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
    holdsUsed: 2,
    sentAlerts: { half: true },
    holdRequests: [],
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
  adminDialog: document.querySelector("#adminDialog"),
  adminForm: document.querySelector("#adminForm"),
  adminError: document.querySelector("#adminError"),
  adminOnly: document.querySelectorAll(".admin-only"),
  adminLockButton: document.querySelector("#adminLockButton"),
  addStudentButton: document.querySelector("#addStudentButton"),
  resetDemo: document.querySelector("#resetDemo"),
};

elements.navTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.dataset.view === "admin" && !adminUnlocked) {
      elements.adminError.textContent = "";
      elements.adminForm.reset();
      elements.adminDialog.showModal();
      return;
    }

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
elements.adminDialog.querySelectorAll("[value='cancel']").forEach((button) => {
  button.addEventListener("click", () => elements.adminDialog.close());
});

elements.adminForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.adminForm);
  const pin = String(data.get("adminPin") || "").trim();

  if (pin !== ADMIN_PIN) {
    elements.adminError.textContent = "관리자 PIN이 맞지 않습니다.";
    return;
  }

  adminUnlocked = true;
  elements.adminError.textContent = "";
  elements.adminDialog.close();
  elements.adminForm.reset();
  syncAdminState();
  showView("admin");
});

elements.adminLockButton.addEventListener("click", () => {
  adminUnlocked = false;
  syncAdminState();
  showView("student");
});

elements.resetDemo.addEventListener("click", () => {
  students = structuredClone(defaultStudents);
  loggedInStudentId = null;
  saveStudents();
  render();
});

elements.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(elements.loginForm);
  const phoneLast4 = onlyDigits(data.get("phoneLast4"));
  const pin = onlyDigits(data.get("pin"));
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
    id: crypto.randomUUID(),
    name: data.get("name").trim(),
    phone: data.get("phone").trim(),
    pin: onlyDigits(data.get("pin")),
    course: data.get("course"),
    plan,
    remaining,
    months: Number(data.get("months")),
    holdsUsed: 0,
    sentAlerts: {},
    holdRequests: [],
    attendanceLog: createAttendanceFromUsage(plan - remaining),
  });

  elements.form.reset();
  elements.dialog.close();
  saveStudents();
  render();
});

function loadStudents() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const loaded = saved ? JSON.parse(saved) : structuredClone(defaultStudents);
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
    holdsUsed: student.holdsUsed || 0,
    sentAlerts: student.sentAlerts || {},
    holdRequests: student.holdRequests || [],
    attendanceLog: student.attendanceLog || createAttendanceFromUsage((student.plan || 0) - (student.remaining || 0)),
  };
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function getPhoneLast4(phone) {
  return onlyDigits(phone).slice(-4);
}

function getFutureDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function getPastDate(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
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

function getHoldSummary(student) {
  const limit = student.months * 2;
  const left = Math.max(0, limit - student.holdsUsed);
  return { limit, left };
}

function createAttendanceFromUsage(used) {
  return Array.from({ length: Math.max(0, used) }, (_, index) => ({
    id: `seed-${crypto.randomUUID()}`,
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
  const averageAttendance = students.length
    ? Math.round(students.reduce((sum, student) => sum + getAttendanceStats(student).rate, 0) / students.length)
    : 0;

  elements.totalStudents.textContent = students.length;
  elements.pendingAlerts.textContent = pending.length;
  elements.averageAttendance.textContent = `${averageAttendance}%`;
  elements.renewalAlerts.textContent = renewals.length;
  elements.pendingHolds.textContent = pendingHolds;
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
    student.remaining = Math.max(0, student.remaining - 1);
    student.attendanceLog.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      status: "present",
      note: "관리자 출석 처리",
    });
  }

  if (action === "absent") {
    student.remaining = Math.max(0, student.remaining - 1);
    student.attendanceLog.push({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      status: "absent",
      note: "관리자 결석 처리",
    });
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
        id: crypto.randomUUID(),
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
  const canRequestHold = holdSummary.left > 0;

  elements.studentLogin.classList.add("hidden");
  elements.studentPreview.classList.remove("hidden");
  elements.studentPreview.innerHTML = `
    <div class="preview-hero">
      <div>
        <p class="eyebrow">THE BOX STUDENT PASS</p>
        <h4>${student.name}님</h4>
        <p>${student.course} · 월 ${student.plan}회 수강권</p>
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
      id: crypto.randomUUID(),
      classDate: data.get("classDate"),
      reason: data.get("reason"),
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

render();
