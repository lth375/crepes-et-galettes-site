/* ==========================================================================
   Crêpes & Galettes Pro — interactions
   ⚠️ Coordonnées à personnaliser ci-dessous (un seul endroit à modifier).
   ========================================================================== */

const CONTACT = {
  email: "contact@crepesetgalettes.fr",
  phoneDisplay: "06 81 02 70 02",
  phoneRaw: "+33681027002",
  whatsapp: "33681027002",
  adresse: "4 clos de la Mignardière, 37510 Ballan-Miré",
};

const APPARELS = {
  crepiere: { label: "Crêpière Ø 40 cm", jour: 35, weekend: 50, max: 3 },
  double:   { label: "Crêpière double 2×35 cm", jour: 40, weekend: 60, max: 1 },
  gaufrier: { label: "Gaufrier Bruxelles", jour: 45, weekend: 70, max: 1 },
  panini:   { label: "Grill panini", jour: 35, weekend: 50, max: 1 },
  "pack-gaufrier": { label: "Offre crêpière + gaufrier", jour: null, weekend: 110, max: 1 },
  "pack-panini":   { label: "Offre crêpière + panini", jour: null, weekend: 85, max: 1 },
  "pack-trio":     { label: "Offre crêpière + gaufrier + panini", jour: null, weekend: 145, max: 1 },
  parc:     { label: "Parc complet (6 appareils)", jour: null, weekend: null, max: 1 },
};

const FORMULES = {
  jour: "À la journée (24 h)",
  weekend: "Week-end (samedi + dimanche)",
  semaine: "Semaine (7 jours)",
  devis: "Sur mesure",
};

/* ---------------------------------- header -------------------------------- */
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* menu mobile */
const nav = document.getElementById("nav");
const navToggle = document.querySelector(".nav-toggle");
if (navToggle) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

/* ---------------------------------- reveal -------------------------------- */
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ------------------------------ pré-sélection ----------------------------- */
const appareilSelect = document.getElementById("appareil");
const bookingSection = document.getElementById("reserver");

document.querySelectorAll("[data-choose]").forEach((btn) => {
  btn.addEventListener("click", () => {
    appareilSelect.value = btn.dataset.choose;
    appareilSelect.dispatchEvent(new Event("change", { bubbles: true }));
    bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => document.getElementById("du").focus({ preventScroll: true }), 650);
  });
});

/* -------------------------------- estimation ------------------------------ */
const qteInput = document.getElementById("qte");
const formuleSelect = document.getElementById("formule");
const duInput = document.getElementById("du");
const auInput = document.getElementById("au");
const nomInput = document.getElementById("nom");
const telInput = document.getElementById("tel");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const estimateTotal = document.getElementById("estimate-total");
const estimateDetail = document.getElementById("estimate-detail");
const waLink = document.getElementById("wa-link");
const formNote = document.getElementById("form-note");
const form = document.getElementById("booking-form");

function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
}

const today = todayISO();
duInput.min = today;
auInput.min = today;

function dueDate() {
  if (!duInput.value) return "";
  const d = new Date(duInput.value + "T12:00:00");
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

duInput.addEventListener("change", () => {
  auInput.min = duInput.value || today;
  if (!auInput.value || auInput.value < duInput.value) {
    auInput.value = dueDate();
  }
  update();
});

function currentApparel() {
  return APPARELS[appareilSelect.value] || APPARELS.crepiere;
}

function currentFormule() {
  return formuleSelect.value;
}

function estimate() {
  const appareil = currentApparel();
  const formule = currentFormule();
  const qty = Math.max(1, Math.min(Number(qteInput.value) || 1, appareil.max));
  const unit = formule === "devis" ? null : appareil[formule];
  return { appareil, formule, qty, unit, total: unit ? unit * qty : null };
}

function update() {
  const appareil = currentApparel();

  qteInput.max = String(appareil.max);
  if (Number(qteInput.value) > appareil.max) qteInput.value = String(appareil.max);
  if (Number(qteInput.value) < 1) qteInput.value = "1";
  qteInput.disabled = appareil.max === 1;

  const { qty, formule, total } = estimate();
  const plural = qty > 1 ? "s" : "";

  if (total === null) {
    estimateTotal.textContent = "Sur devis";
    estimateDetail.textContent = `${qty} × ${appareil.label} · ${FORMULES[formule]}`;
  } else {
    estimateTotal.textContent = `${total} €`;
    estimateDetail.textContent =
      `${qty} × ${appareil.label}${plural} · ${FORMULES[formule]}`;
  }

  waLink.href = waUrl();
}

function recap() {
  const { appareil, qty, total } = estimate();
  return [
    "Demande de location — Crêpes & Galettes Pro",
    "",
    `Appareil : ${qty} × ${appareil.label}`,
    `Durée : ${FORMULES[currentFormule()]}`,
    `Retrait : ${duInput.value || "à préciser"}`,
    `Retour : ${auInput.value || "à préciser"}`,
    `Estimation : ${total === null ? "sur devis" : total + " €"}`,
    "",
    `Nom / structure : ${nomInput.value || "—"}`,
    `Téléphone : ${telInput.value || "—"}`,
    `E-mail : ${emailInput.value || "—"}`,
    `Projet : ${messageInput.value || "—"}`,
    "",
    "Demande envoyée depuis le site Crêpes & Galettes Pro.",
  ].join("\n");
}

function waUrl() {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(recap())}`;
}

[appareilSelect, formuleSelect, qteInput, auInput, nomInput, telInput, emailInput, messageInput].forEach(
  (el) => {
    el.addEventListener("input", update);
    el.addEventListener("change", update);
  }
);

/* -------------------------------- envoi ---------------------------------- */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!duInput.value || !auInput.value) {
    formNote.textContent = "Merci d'indiquer la date de retrait et de retour.";
    formNote.style.color = "#B4552F";
    duInput.focus();
    return;
  }
  if (auInput.value < duInput.value) {
    formNote.textContent = "La date de retour doit être après la date de retrait.";
    formNote.style.color = "#B4552F";
    auInput.focus();
    return;
  }
  if (!nomInput.value.trim() || !telInput.value.trim() || !emailInput.value.trim()) {
    formNote.textContent = "Il nous manque vos coordonnées pour vous répondre.";
    formNote.style.color = "#B4552F";
    form.reportValidity();
    return;
  }

  const subject = `Location ${estimate().qty} × ${estimate().appareil.label} — ${duInput.value}`;
  const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(recap())}`;

  formNote.textContent = "Votre messagerie s'ouvre avec la demande pré-remplie. Il ne reste qu'à envoyer.";
  formNote.style.color = "";
  formNote.classList.add("is-ok");
  window.location.href = mailto;
});

/* ------------------------- photos produit (repli) ------------------------- */
document.querySelectorAll(".equip-photo img").forEach((img) => {
  const mark = () => img.closest(".equip-photo").classList.add("is-fallback");
  if (img.complete && img.naturalWidth === 0) mark();
  img.addEventListener("error", mark);
});

/* ---------------------------------- divers -------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = CONTACT.phoneDisplay;
  el.setAttribute("href", `tel:${CONTACT.phoneRaw}`);
});

update();
