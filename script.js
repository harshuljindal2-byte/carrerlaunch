const opportunities = [
  {id:1,type:"Hackathon",title:"Global AI Buildathon",org:"FutureLabs",mark:"F",desc:"Create practical AI solutions that make everyday work smarter and more accessible.",mode:"Online",deadline:"2026-11-15",level:"All student levels"},
  {id:2,type:"Hackathon",title:"Code for Climate",org:"GreenTech Collective",mark:"G",desc:"Build technology that supports a cleaner, more sustainable future.",mode:"Hybrid",deadline:"2026-11-22",level:"Beginner friendly"},
  {id:3,type:"Internship",title:"Frontend Developer Intern",org:"PixelWorks",mark:"P",desc:"Work with a product team and build accessible, responsive web experiences.",mode:"Remote",deadline:"2026-11-18",level:"Students"},
  {id:4,type:"Competition",title:"Campus Innovation Challenge",org:"NextGen Network",mark:"N",desc:"Turn a campus or community problem into a prototype with measurable impact.",mode:"Online",deadline:"2026-11-28",level:"Teams of 2–4"},
  {id:5,type:"Scholarship",title:"Future Leaders Scholarship",org:"BrightPath Foundation",mark:"B",desc:"A sample scholarship listing for students with a strong learning mindset.",mode:"Online",deadline:"2026-12-05",level:"Undergraduate"},
  {id:6,type:"Hackathon",title:"FinTech Sprint 2026",org:"BuildFinance",mark:"B",desc:"Prototype useful tools for payments, financial inclusion and money management.",mode:"Online",deadline:"2026-12-02",level:"All skill levels"},
  {id:7,type:"Fellowship",title:"Young Innovators Fellowship",org:"Impact Circle",mark:"I",desc:"Learn from mentors while developing a project around a real-world challenge.",mode:"Hybrid",deadline:"2026-12-10",level:"Undergraduate"},
  {id:8,type:"Workshop",title:"Product Design Bootcamp",org:"DesignUp",mark:"D",desc:"Practice user research, wireframing and prototyping with guided sessions.",mode:"Online",deadline:"2026-11-25",level:"Beginner friendly"}
];

let activeFilter = "All";
let searchTerm = "";
let saved = new Set();
const grid = document.getElementById("opportunityGrid");
const count = document.getElementById("resultCount");
const empty = document.getElementById("emptyState");
const toast = document.getElementById("toast");

function prettyDate(dateString) {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-IN", {day:"numeric", month:"short", year:"numeric"});
}
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}
function renderOpportunities() {
  let list = opportunities.filter(item => {
    const matchesCategory = activeFilter === "All" || item.type === activeFilter;
    const text = `${item.title} ${item.org} ${item.type} ${item.desc} ${item.level}`.toLowerCase();
    return matchesCategory && text.includes(searchTerm);
  });
  const sort = document.getElementById("sortSelect").value;
  if (sort === "az") list.sort((a,b) => a.title.localeCompare(b.title));
  if (sort === "deadline") list.sort((a,b) => a.deadline.localeCompare(b.deadline));
  count.textContent = list.length;
  empty.classList.toggle("hidden", list.length !== 0);
  grid.classList.toggle("hidden", list.length === 0);
  grid.innerHTML = list.map(item => `
    <article class="op-card">
      <div class="op-card-top"><div class="org-mark">${item.mark}</div>
        <button class="save-btn ${saved.has(item.id) ? "saved" : ""}" data-save="${item.id}" aria-label="Save ${item.title}">${saved.has(item.id) ? "♥" : "♡"}</button>
      </div>
      <span class="op-type">${item.type}</span>
      <h3>${item.title}</h3>
      <div class="op-org">by ${item.org}</div>
      <p class="op-desc">${item.desc}</p>
      <div class="op-meta"><span>◷ <b>${prettyDate(item.deadline)}</b><br>Deadline</span>
        <span>◎ <b>${item.mode}</b><br>${item.level}</span>
        <button class="op-apply" data-view="${item.id}">View details ↗</button>
      </div>
    </article>`).join("");
}
function setFilter(filter) {
  activeFilter = filter;
  document.querySelectorAll(".filter-tab").forEach(btn => btn.classList.toggle("selected", btn.dataset.filter === filter));
  renderOpportunities();
}
document.getElementById("filterTabs").addEventListener("click", e => {
  const button = e.target.closest("[data-filter]");
  if (button) setFilter(button.dataset.filter);
});
document.querySelectorAll(".category-tile").forEach(tile => tile.addEventListener("click", () => {
  setFilter(tile.dataset.category);
  document.getElementById("opportunities").scrollIntoView({behavior:"smooth"});
}));
document.getElementById("searchForm").addEventListener("submit", e => {
  e.preventDefault();
  searchTerm = document.getElementById("searchInput").value.trim().toLowerCase();
  setFilter("All");
  document.getElementById("opportunities").scrollIntoView({behavior:"smooth"});
});
document.querySelectorAll(".quick-search").forEach(button => button.addEventListener("click", () => {
  document.getElementById("searchInput").value = button.dataset.search;
  searchTerm = button.dataset.search.toLowerCase();
  setFilter("All");
  document.getElementById("opportunities").scrollIntoView({behavior:"smooth"});
}));
document.getElementById("sortSelect").addEventListener("change", renderOpportunities);
grid.addEventListener("click", e => {
  const saveButton = e.target.closest("[data-save]");
  const viewButton = e.target.closest("[data-view]");
  if (saveButton) {
    const id = Number(saveButton.dataset.save);
    saved.has(id) ? saved.delete(id) : saved.add(id);
    renderOpportunities();
    showToast(saved.has(id) ? "Opportunity saved to your list." : "Removed from your saved list.");
  }
  if (viewButton) {
    const item = opportunities.find(op => op.id === Number(viewButton.dataset.view));
    showToast(`${item.title} — demo listing. Add a verified application link before publishing.`);
  }
});
document.getElementById("clearFilters").addEventListener("click", () => {
  searchTerm = "";
  document.getElementById("searchInput").value = "";
  setFilter("All");
});
document.getElementById("loadMore").addEventListener("click", () => showToast("You're viewing all sample opportunities in this prototype."));
document.getElementById("newsletterForm").addEventListener("submit", e => {
  e.preventDefault();
  document.getElementById("newsletterMessage").textContent = "Thanks! Newsletter signup is a demo and is not connected to a mailing service.";
  e.target.reset();
});
const dialog = document.getElementById("authDialog");
function openAuth(mode) {
  document.getElementById("dialogTitle").textContent = mode === "signup" ? "Create your account" : "Welcome back";
  document.getElementById("dialogText").textContent = mode === "signup" ? "Join CareerLaunch and keep your opportunities in one place." : "Log in to continue your CareerLaunch journey.";
  document.getElementById("authSubmit").innerHTML = (mode === "signup" ? "Create account" : "Log in") + " <span>→</span>";
  dialog.showModal();
}
document.getElementById("loginBtn").addEventListener("click", () => openAuth("login"));
document.getElementById("signupBtn").addEventListener("click", () => openAuth("signup"));
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("authForm").addEventListener("submit", e => {
  e.preventDefault();
  dialog.close();
  showToast("Demo only: connect a backend to enable real accounts.");
  e.target.reset();
});
document.getElementById("mobileMenu").addEventListener("click", () => document.getElementById("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => document.getElementById("mainNav").classList.remove("open")));

renderOpportunities();
