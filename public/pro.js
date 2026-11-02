/* ==========================================================================
   Crêpes & Galettes Pro — page professionnels
   Estimation avec remise pro (−10 % dès 2 jours), envoi par e-mail/WhatsApp.
   ⚠️ Coordonnées à personnaliser ci-dessous (un seul endroit à modifier).
   ========================================================================== */

const CONTACT = {
  email: "contact@crepesetgalettes.fr",
  phoneDisplay: "06 81 02 70 02",
  phoneRaw: "+33681027002",
  whatsapp: "33681027002",
  adresse: "4 clos de la Mignardière, 37510 Ballan-Miré",
};

const REMISE_PRO = 0.1;

const APPARELS = {
  crepiere: { label: "Crêpière Ø 40 cm", jour: 35, weekend: 50, max: 3 },
  double:   { label: "Crêpière double 2×35 cm", jour: 40, weekend: 60, max: 1 },
  gaufrier: { label: "Gaufrier Bruxelles", jour: 45, weekend: 70, max: 1 },
  panini:   { label: "Grill panini", jour: 35, weekend: 50, max: 1 },
  parc:     { label: "Parc complet (6 appareils)", jour: null, weekend: null, max: 1 },
};

/* ---------------------------------- header -------------------------------- */
const header = document.querySelector(".site-header");
if (header) {
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

const nav = document.getElementById("nav");
const navToggle = document.querySelector(".nav-toggle");
if (nav && navToggle) {
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

/* -------------------------------- estimation ------------------------------ */
const form = document.getElementById("pro-form");

if (form) {
  const appareilSelect = document.getElementById("appareil-pro");
  const qteInput = document.getElementById("qte-pro");
  const formuleSelect = document.getElementById("formule-pro");
  const joursInput = document.getElementById("jours-pro");
  const duInput = document.getElementById("du-pro");
  const auInput = document.getElementById("au-pro");
  const structureInput = document.getElementById("structure");
  const metierSelect = document.getElementById("metier");
  const besoinSelect = document.getElementById("besoin");
  const telInput = document.getElementById("tel-pro");
  const emailInput = document.getElementById("email-pro");
  const messageInput = document.getElementById("message-pro");
  const estimateTotal = document.getElementById("estimate-total-pro");
  const estimateDetail = document.getElementById("estimate-detail-pro");
  const waLink = document.getElementById("wa-link-pro");
  const formNote = document.getElementById("form-note-pro");

  const DUREES = {
    jour: "1 jour",
    weekend: "week-end (2 jours)",
    jours: "2 jours et plus",
  };

  function todayISO() {
    const d = new Date();
    const offset = d.getTimezoneOffset();
    return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10);
  }

  const today = todayISO();
  duInput.min = today;
  auInput.min = today;

  function addDays(iso, n) {
    const d = new Date(iso + "T12:00:00");
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  }

  function eur(value) {
    const s = (Math.round(value * 100) / 100).toFixed(2).replace(/\.00$/, "").replace(".", ",");
    return `${s} €`;
  }

  function currentApparel() {
    return APPARELS[appareilSelect.value] || APPARELS.crepiere;
  }

  function estimate() {
    const appareil = currentApparel();
    const qty = Math.max(1, Math.min(Number(qteInput.value) || 1, appareil.max));
    const formule = formuleSelect.value;
    const jours = Math.max(2, Math.min(30, Number(joursInput.value) || 2));

    if (appareil.jour === null) {
      return { appareil, qty, formule, jours, total: null, remise: false };
    }
    if (formule === "jour") {
      return { appareil, qty, formule, jours, total: appareil.jour * qty, remise: false };
    }
    if (formule === "weekend") {
      return {
        appareil, qty, formule, jours,
        total: appareil.weekend * qty * (1 - REMISE_PRO),
        remise: true,
      };
    }
    return {
      appareil, qty, formule, jours,
      total: appareil.jour * qty * jours * (1 - REMISE_PRO),
      remise: true,
    };
  }

  function update() {
    const appareil = currentApparel();

    qteInput.max = String(appareil.max);
    if (Number(qteInput.value) > appareil.max) qteInput.value = String(appareil.max);
    if (Number(qteInput.value) < 1) qteInput.value = "1";
    qteInput.disabled = appareil.max === 1;

    joursInput.disabled = formuleSelect.value !== "jours";
    if (formuleSelect.value === "jours" && Number(joursInput.value) < 2) joursInput.value = "2";

    const { qty, formule, jours, total, remise } = estimate();
    const duree = formule === "jours" ? `${jours} jours` : DUREES[formule];

    estimateTotal.textContent = total === null ? "Sur devis" : eur(total);
    estimateDetail.textContent =
      `${qty} × ${appareil.label} · ${duree}${remise ? " · remise pro −10 %" : ""}`;

    waLink.href = waUrl();
  }

  function recap() {
    const { appareil, qty, formule, jours, total } = estimate();
    const duree = formule === "jours" ? `${jours} jours` : DUREES[formule];
    return [
      "Demande professionnelle — Crêpes & Galettes Pro",
      "",
      `Structure : ${structureInput.value || "—"}`,
      `Métier : ${metierSelect.value}`,
      `Besoin : ${besoinSelect.value}`,
      `Appareil : ${qty} × ${appareil.label}`,
      `Durée : ${duree}`,
      `Retrait : ${duInput.value || "à préciser"}`,
      `Retour : ${auInput.value || "à préciser"}`,
      `Estimation : ${total === null ? "sur devis" : eur(total)}`,
      "",
      `Téléphone : ${telInput.value || "—"}`,
      `E-mail : ${emailInput.value || "—"}`,
      `Précisions : ${messageInput.value || "—"}`,
      "",
      "Demande envoyée depuis la page professionnels du site Crêpes & Galettes Pro.",
    ].join("\n");
  }

  function waUrl() {
    return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(recap())}`;
  }

  duInput.addEventListener("change", () => {
    auInput.min = duInput.value || today;
    if (!auInput.value || auInput.value < duInput.value) {
      auInput.value = addDays(duInput.value, 1);
    }
    update();
  });

  [appareilSelect, formuleSelect, qteInput, joursInput, auInput, structureInput, telInput, emailInput, messageInput].forEach(
    (el) => {
      el.addEventListener("input", update);
      el.addEventListener("change", update);
    }
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!duInput.value || !auInput.value) {
      formNote.textContent = "Merci d'indiquer la date de début et de fin.";
      formNote.style.color = "#B4552F";
      duInput.focus();
      return;
    }
    if (auInput.value < duInput.value) {
      formNote.textContent = "La date de fin doit être après la date de début.";
      formNote.style.color = "#B4552F";
      auInput.focus();
      return;
    }
    if (!structureInput.value.trim() || !telInput.value.trim() || !emailInput.value.trim()) {
      formNote.textContent = "Il nous manque vos coordonnées pour vous répondre.";
      formNote.style.color = "#B4552F";
      form.reportValidity();
      return;
    }

    const { qty, appareil } = estimate();
    const subject = `[Pro] ${structureInput.value.trim()} — ${qty} × ${appareil.label} — ${duInput.value}`;
    const mailto = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(recap())}`;

    formNote.textContent = "Votre messagerie s'ouvre avec la demande pré-remplie. Il ne reste qu'à envoyer.";
    formNote.style.color = "";
    formNote.classList.add("is-ok");
    window.location.href = mailto;
  });

  update();
}

/* ---------------------------------- divers -------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

document.querySelectorAll("[data-phone]").forEach((el) => {
  el.textContent = CONTACT.phoneDisplay;
  el.setAttribute("href", `tel:${CONTACT.phoneRaw}`);
});
