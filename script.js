// Navbar scroll effect
const navbar = document.getElementById("mainNav");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Active nav link on scroll
const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// Menu filter
const filterButtons = document.querySelectorAll(".btn-filter");
const menuItems = document.querySelectorAll(".menu-item");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    menuItems.forEach((item) => {
      const category = item.dataset.category;
      if (filter === "all" || category === filter) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  });
});

// Contact form
const contactForm = document.getElementById("contact-form");
const formAlert = document.getElementById("form-alert");
const submitBtn = contactForm.querySelector("button[type=submit]");

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const entry = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    message: document.getElementById("message").value.trim(),
  };

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

  saveMessage(entry);

  try {
    const result = await sendToEmail(entry);
    if (!result.ok && !result.skipped) {
      throw new Error("Email delivery failed");
    }

    formAlert.className = "alert alert-success mt-3";
    formAlert.innerHTML = '<i class="bi bi-check-circle me-2"></i>Thanks! We\'ll get back to you soon.';
    formAlert.classList.remove("d-none");
    contactForm.reset();
  } catch {
    formAlert.className = "alert alert-warning mt-3";
    formAlert.innerHTML =
      '<i class="bi bi-exclamation-circle me-2"></i>Message saved. Email delivery failed — check your Web3Forms key in config.js.';
    formAlert.classList.remove("d-none");
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '<i class="bi bi-send me-2"></i>Send Message';

  setTimeout(() => formAlert.classList.add("d-none"), 5000);
});
