function handleHeaderHeight() {
  const header = document.querySelector(".page-header");
  const content = document.querySelector("#content");

  function setHeaderHeight() {
    const headerHeight = header.offsetHeight;
    content.style.setProperty("--header-height", `${headerHeight}px`);
  }

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);
}

function handleNavMenu() {
  const navigation = document.querySelector("#primary-navigation");
  const menuToggle = document.querySelector("#menu-toggle");
  const footer = document.querySelector("footer");
  const main = document.querySelector("main");
  const mediaQuery = window.matchMedia("(min-width: 600px)");
  const once = { once: true };

  function closeNavigation() {
    navigation.setAttribute("data-state", "closed");
    menuToggle.setAttribute("aria-expanded", "false");
    main.removeEventListener("click", closingNavigation);
    footer.removeEventListener("click", closingNavigation);
  }

  function closingNavigation() {
    navigation.setAttribute("data-state", "closing");
    navigation.addEventListener("animationend", closeNavigation, once);
  }

  function openNavigation() {
    navigation.setAttribute("data-state", "opened");
    menuToggle.setAttribute("aria-expanded", "true");
    main.addEventListener("click", closingNavigation, once);
    footer.addEventListener("click", closingNavigation, once);
  }

  function toggleNavigation() {
    const state = navigation.getAttribute("data-state");
    state === "closed" ? openNavigation() : closingNavigation();
  }

  function handleNavChange(e) {
    if (e.matches) closeNavigation();
  }

  mediaQuery.addEventListener("change", handleNavChange);
  menuToggle.addEventListener("click", toggleNavigation);
}

function setCopyright() {
  const currentYear = document.querySelector("#currentYear");
  currentYear.innerHTML = new Date().getFullYear();
}

function debug() {
  const root = document.querySelector(":root");
  root.style.setProperty("--outline-color", "green");
}

handleHeaderHeight();
handleNavMenu();
setCopyright();
// debug();

function handleBarcode() {
  const barcodeDownload = document.querySelector("#barcode-download");
  const barcodeLink = document.querySelector("#barcode-link");
  const barcodeData = document.querySelector("#barcode-data");
  const barcodeType = document.querySelector("#barcode-type");
  const barcodeForm = document.querySelector("#barcode-form");

  const barcodeImage = document.querySelector("#tabpanel-barcode-image");
  const barcodeAPI = barcodeImage.src;

  // Generate Barcode Image
  barcodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const barcode = `${barcodeAPI}?data=${barcodeData.value}&type=${barcodeType.value}`;
    barcodeImage.src = barcode;
  });

  // Download Barcode Image
  barcodeDownload.addEventListener("click", () => {
    downloadSVG(barcodeLink, barcodeImage);
  });
}

function handleQRcode() {
  const qrcodeDownload = document.querySelector("#qrcode-download");
  const qrcodeLink = document.querySelector("#qrcode-link");
  const qrcodeData = document.querySelector("#qrcode-data");
  const qrcodeForm = document.querySelector("#qrcode-form");

  const qrcodeImage = document.querySelector("#tabpanel-qrcode-image");
  const qrcodeAPI = qrcodeImage.src;

  // Generate QR Code Image
  qrcodeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const qrcode = `${qrcodeAPI}?data=${qrcodeData.value}`;
    qrcodeImage.src = qrcode;
  });

  // Download QR Code Image
  qrcodeDownload.addEventListener("click", () => {
    downloadSVG(qrcodeLink, qrcodeImage);
  });
}

async function downloadSVG(link, image) {
  const src = await fetch(image.src);
  const imageBlob = await src.blob();
  link.href = URL.createObjectURL(imageBlob);
  link.download = `${image.alt}.svg`;
  link.click();
}

function handleTabs() {
  const tabList = document.querySelector('[role="tablist"]');
  const tabs = document.querySelectorAll('[role="tab"]');

  let tabFocus = 0;

  function handleArrowNav(e) {
    tabs[tabFocus].setAttribute("tabindex", -1);
    switch (e.key) {
      case "ArrowRight":
        tabFocus++;
        if (tabFocus >= tabs.length) tabFocus = 0;
        break;
      case "ArrowLeft":
        tabFocus--;
        if (tabFocus < 0) tabFocus = tabs.length - 1;
        break;
      default:
        return;
    }

    tabs[tabFocus].setAttribute("tabindex", 0);
    tabs[tabFocus].focus();
  }

  function changeTabs(e) {
    const target = e.target;
    const parent = target.parentNode;
    const grandparent = parent.parentNode;
    const container = grandparent.parentNode;
    const targetID = target.getAttribute("aria-controls");

    const activeTabs = parent.querySelectorAll('[aria-selected="true"]');
    const panels = grandparent.querySelectorAll('[role="tabpanel"]');
    const images = container.querySelectorAll(".tab-images");

    const targetPanel = grandparent.querySelector(`#${targetID}`);
    const targetImage = container.querySelector(`#${targetID}-image`);

    for (const activeTab of activeTabs)
      activeTab.setAttribute("aria-selected", false);
    for (const panel of panels) panel.setAttribute("hidden", true);
    for (const image of images) image.setAttribute("aria-selected", false);

    targetImage.setAttribute("aria-selected", true);
    target.setAttribute("aria-selected", true);
    targetPanel.removeAttribute("hidden");
  }

  tabList.addEventListener("keydown", (e) => handleArrowNav(e));
  for (const tab of tabs) tab.addEventListener("click", changeTabs);
}

handleBarcode();
handleQRcode();
handleTabs();
