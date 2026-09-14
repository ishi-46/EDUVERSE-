// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile menu toggle
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");

if (toggle) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
}

// Login / Register buttons — placeholders until Supabase Auth is wired up (Phase 2)
document.querySelectorAll("[data-auth]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    alert(
      el.dataset.auth === "login"
        ? "Login is coming in Phase 2, once Supabase Auth is connected."
        : "Registration is coming in Phase 2, once Supabase Auth is connected."
    );
  });
});
