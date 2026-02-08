const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");
const closeMenuBtn = document.getElementById("closeMenuBtn");

const backdrop = document.createElement("div");
backdrop.id = "menuBackdrop";
backdrop.className = "menu-backdrop";
document.body.appendChild(backdrop);

function openMenu() {
  menu.classList.add("open");
  backdrop.classList.add("open");
}

function closeMenu() {
  menu.classList.remove("open");
  backdrop.classList.remove("open");
}

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    if (menu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", closeMenu);
}

backdrop.addEventListener("click", closeMenu);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

window.openMenu = openMenu;
window.closeMenu = closeMenu;