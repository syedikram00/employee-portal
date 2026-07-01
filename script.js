/* ==========================================================================
   Next Gen Employee Portal — Client-side logic
   Renders hardcoded data and implements sortable employee table
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Sample data                                                         */
  /* ------------------------------------------------------------------ */

  const employees = [
    { id: 1024, name: "Sarah Mitchell",   department: "Engineering", email: "sarah.mitchell@nextgen.com",   status: "Active" },
    { id: 1031, name: "James Okafor",     department: "Sales",       email: "james.okafor@nextgen.com",     status: "Active" },
    { id: 1042, name: "Priya Raman",      department: "HR",          email: "priya.raman@nextgen.com",      status: "On Leave" },
    { id: 1055, name: "David Chen",       department: "Engineering", email: "david.chen@nextgen.com",       status: "Active" },
    { id: 1063, name: "Laura Bennett",    department: "Marketing",   email: "laura.bennett@nextgen.com",    status: "Active" },
    { id: 1077, name: "Michael Torres",   department: "Finance",     email: "michael.torres@nextgen.com",   status: "Active" },
    { id: 1088, name: "Emily Novak",      department: "Sales",       email: "emily.novak@nextgen.com",      status: "On Leave" },
    { id: 1094, name: "Ahmed Farouk",     department: "IT Support",  email: "ahmed.farouk@nextgen.com",     status: "Active" },
    { id: 1109, name: "Rachel Kim",       department: "HR",          email: "rachel.kim@nextgen.com",       status: "Active" },
    { id: 1116, name: "Thomas Whitfield", department: "Finance",     email: "thomas.whitfield@nextgen.com", status: "Active" }
  ];

  const announcements = [
    {
      title: "Q3 All-Hands Meeting Scheduled",
      date: "2026-07-14",
      body: "Join us for the quarterly company update covering financial results, product roadmap, and team recognitions.",
      color: "#4f46e5"
    },
    {
      title: "New Health Benefits Enrollment Open",
      date: "2026-07-08",
      body: "Open enrollment for the updated health and wellness plan runs through the end of the month. Details are in the HR portal.",
      color: "#db2777"
    },
    {
      title: "Office Closed for Summer Holiday",
      date: "2026-07-03",
      body: "The Next Gen office will be closed on July 4th. Normal operations resume the following business day.",
      color: "#f59e0b"
    },
    {
      title: "Engineering Team Wins Innovation Award",
      date: "2026-06-27",
      body: "Congratulations to the Engineering team for being recognized at this year's Industry Innovation Awards.",
      color: "#0d9488"
    },
    {
      title: "Updated Remote Work Policy Now in Effect",
      date: "2026-06-20",
      body: "The revised hybrid work policy is now live. Please review the guidelines shared by your department lead.",
      color: "#7c3aed"
    }
  ];

  /* Department -> visual styling map (tag class + avatar color) */
  const departmentStyles = {
    "Engineering": { tag: "dept-engineering", avatar: "#2563eb" },
    "Sales":       { tag: "dept-sales",       avatar: "#ea580c" },
    "HR":          { tag: "dept-hr",          avatar: "#db2777" },
    "Marketing":   { tag: "dept-marketing",   avatar: "#9333ea" },
    "Finance":     { tag: "dept-finance",     avatar: "#059669" },
    "IT Support":  { tag: "dept-itsupport",   avatar: "#0d9488" }
  };

  /* ------------------------------------------------------------------ */
  /* Rendering                                                            */
  /* ------------------------------------------------------------------ */

  function statusClass(status) {
    return status === "On Leave" ? "status-onleave" : "status-active";
  }

  function formatDate(isoDate) {
    const d = new Date(isoDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  }

  function initials(name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function deptStyle(department) {
    return departmentStyles[department] || { tag: "dept-engineering", avatar: "#6366f1" };
  }

  function renderAnnouncements() {
    const list = document.getElementById("announcement-list");
    const html = announcements
      .map(
        (a) => `
      <li class="announcement-item" style="--accent-color: ${a.color}">
        <span class="announcement-date">${formatDate(a.date)}</span>
        <h3 class="announcement-title">${a.title}</h3>
        <p class="announcement-body">${a.body}</p>
      </li>`
      )
      .join("");
    list.innerHTML = html;
  }

  function renderEmployees(data) {
    const body = document.getElementById("employee-table-body");
    const html = data
      .map((e) => {
        const style = deptStyle(e.department);
        return `
      <tr>
        <td class="emp-id">${e.id}</td>
        <td>
          <div class="emp-name-cell">
            <span class="emp-avatar" style="background:${style.avatar}">${initials(e.name)}</span>
            <span>${e.name}</span>
          </div>
        </td>
        <td><span class="dept-tag ${style.tag}">${e.department}</span></td>
        <td class="emp-email">${e.email}</td>
        <td><span class="status-pill ${statusClass(e.status)}">${e.status}</span></td>
      </tr>`;
      })
      .join("");
    body.innerHTML = html;
  }

  /* ------------------------------------------------------------------ */
  /* Sorting                                                              */
  /* ------------------------------------------------------------------ */

  let sortState = { key: null, direction: "ascending" };

  function sortEmployees(key, type) {
    if (sortState.key === key) {
      sortState.direction = sortState.direction === "ascending" ? "descending" : "ascending";
    } else {
      sortState.key = key;
      sortState.direction = "ascending";
    }

    const dir = sortState.direction === "ascending" ? 1 : -1;

    const sorted = [...employees].sort((a, b) => {
      let valA = a[key];
      let valB = b[key];

      if (type === "number") {
        return (valA - valB) * dir;
      }

      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return -1 * dir;
      if (valA > valB) return 1 * dir;
      return 0;
    });

    renderEmployees(sorted);
    updateSortIndicators();
  }

  function updateSortIndicators() {
    const headers = document.querySelectorAll("#employee-table thead th");
    headers.forEach((th) => {
      const key = th.getAttribute("data-sort");
      const icon = th.querySelector(".sort-icon");

      if (key === sortState.key) {
        th.setAttribute("aria-sort", sortState.direction);
        icon.textContent = sortState.direction === "ascending" ? "▲" : "▼";
      } else {
        th.removeAttribute("aria-sort");
        icon.textContent = "";
      }
    });
  }

  function attachSortHandlers() {
    const headers = document.querySelectorAll("#employee-table thead th");
    headers.forEach((th) => {
      const key = th.getAttribute("data-sort");
      const type = th.getAttribute("data-type");
      const btn = th.querySelector(".sort-btn");

      btn.addEventListener("click", () => sortEmployees(key, type));
    });
  }

  /* ------------------------------------------------------------------ */
  /* Header / footer meta                                                */
  /* ------------------------------------------------------------------ */

  function renderMeta() {
    const dateEl = document.getElementById("today-date");
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }

    const yearEl = document.getElementById("footer-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Init                                                                 */
  /* ------------------------------------------------------------------ */

  function init() {
    renderAnnouncements();
    renderEmployees(employees);
    attachSortHandlers();
    renderMeta();
  }

  document.addEventListener("DOMContentLoaded", init);
})();