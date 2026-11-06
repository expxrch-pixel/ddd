document.addEventListener("DOMContentLoaded", () => {
  const ownerList = document.getElementById("ownerList");
  const coreList = document.getElementById("coreList");
  const supportList = document.getElementById("supportList");
  const memberList = document.getElementById("memberList");

  const totalCount = document.getElementById("totalCount");
  const ownerCount = document.getElementById("ownerCount");
  const coreCount = document.getElementById("coreCount");
  const supportCount = document.getElementById("supportCount");
  const memberCount = document.getElementById("memberCount");

  const searchInput = document.getElementById("memberSearch");
  const filterButtons = document.querySelectorAll(".filter");
  const emptyState = document.getElementById("emptyState");

  // Render Member Cards
  function renderMembers(data) {
    ownerList.innerHTML = "";
    coreList.innerHTML = "";
    supportList.innerHTML = "";
    memberList.innerHTML = "";

    let counts = { owner: 0, core: 0, bigsupport: 0, member: 0 };

    data.forEach(m => {
      counts[m.role] = (counts[m.role] || 0) + 1;

      const card = document.createElement("div");
      card.className = "member-card";
      card.onclick = () => openProfileModal(m);

      // สร้าง HTML การ์ดสมาชิกพร้อมเข็มปักสถานะ Online/Offline
      const isOnline = m.status === "online";
      card.innerHTML = `
        <div class="card-avatar-wrap">
          <img src="${m.avatar}" alt="${m.name}">
          <span class="card-status-dot ${isOnline ? 'online' : 'offline'}"></span>
        </div>
        <div class="member-card-info">
          <h3 class="single-line-name" title="${m.name}">${m.name}</h3>
          <p class="single-line-title">${m.customTitle}</p>
        </div>
      `;

      if (m.role === "owner") ownerList.appendChild(card);
      else if (m.role === "core") coreList.appendChild(card);
      else if (m.role === "bigsupport") supportList.appendChild(card);
      else memberList.appendChild(card);
    });

    totalCount.textContent = data.length.toString().padStart(2, "0");
    ownerCount.textContent = counts.owner.toString().padStart(2, "0");
    coreCount.textContent = counts.core.toString().padStart(2, "0");
    supportCount.textContent = counts.bigsupport.toString().padStart(2, "0");
    memberCount.textContent = counts.member.toString().padStart(2, "0");

    emptyState.hidden = data.length > 0;
  }

  // Filter & Search Logic
  function filterData() {
    const query = searchInput.value.toLowerCase().trim();
    const activeFilter = document.querySelector(".filter.active").dataset.filter;

    const filtered = membersData.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(query) || 
                            m.nickname.toLowerCase().includes(query) ||
                            m.customTitle.toLowerCase().includes(query);
      const matchesFilter = activeFilter === "all" || m.role === activeFilter;
      return matchesSearch && matchesFilter;
    });

    renderMembers(filtered);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      filterData();
    });
  });

  searchInput.addEventListener("input", filterData);

  renderMembers(membersData);
});

// Modal Control System
function openProfileModal(m) {
  document.getElementById("modalAvatar").src = m.avatar;
  document.getElementById("modalCover").src = m.cover;
  document.getElementById("modalName").textContent = m.name;
  document.getElementById("modalCustomTitle").textContent = m.customTitle;
  document.getElementById("modalRoleBadge").textContent = m.role.toUpperCase();

  const statusBadge = document.getElementById("modalStatusBadge");
  const statusText = document.getElementById("modalStatusText");
  if (statusBadge && statusText) {
    statusBadge.setAttribute("data-status", m.status || "online");
    statusText.textContent = (m.status || "online").toUpperCase();
  }

  // สร้างปุ่ม Facebook ลิงก์
  const socialLinksWrap = document.getElementById("modalSocialLinks");
  socialLinksWrap.innerHTML = "";

  if (m.social && m.social.facebook) {
    const fbBtn = document.createElement("a");
    fbBtn.className = "facebook-link-btn";
    fbBtn.href = m.social.facebook;
    fbBtn.target = "_blank";
    fbBtn.rel = "noopener noreferrer";
    fbBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>FACEBOOK PROFILE</span>
    `;
    socialLinksWrap.appendChild(fbBtn);
  }

  const overlay = document.getElementById("profileOverlay");
  const modal = document.getElementById("profileModal");

  overlay.classList.add("active");
  modal.classList.add("active");
}

document.getElementById("profileClose").onclick = closeModal;
document.getElementById("profileOverlay").onclick = closeModal;

function closeModal() {
  document.getElementById("profileOverlay").classList.remove("active");
  document.getElementById("profileModal").classList.remove("active");
}