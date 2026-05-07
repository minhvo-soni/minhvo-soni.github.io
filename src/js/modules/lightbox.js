// ─── Photo Zoom — Full-screen single image viewer ─────────────────
// Handles: #photo-zoom overlay (click .cuisine-img-wrap in any lightbox)
// Features: prev/next navigation, keyboard nav, background isolation,
//           ScrollTrigger.refresh() on close, scroll bug fix.
//
// Live file: index.html (last <script> before </body>) — mirror changes here.

(function () {
  var zoomImages = []; // [{ src, alt }, ...]
  var zoomIndex = 0;
  var BG_SELECTORS = "#hero, #social, #work, #about, #skills, #contact, footer";

  function openPhotoZoom(imagesArr, idx) {
    var zoom = document.getElementById("photo-zoom");
    var img = document.getElementById("photo-zoom-img");
    if (!zoom || !img) return;

    zoomImages = imagesArr;
    zoomIndex = Math.max(0, Math.min(idx, imagesArr.length - 1));
    img.src = zoomImages[zoomIndex].src;
    img.alt = zoomImages[zoomIndex].alt || "";
    zoom.classList.add("is-open");
    document.body.style.overflow = "hidden";

    // Cô lập background: không click/cuộn được vào nền
    document.querySelectorAll(BG_SELECTORS).forEach(function (el) {
      el.setAttribute("aria-hidden", "true");
      el.style.pointerEvents = "none";
    });

    updateZoomNav();
  }

  function closePhotoZoom() {
    var zoom = document.getElementById("photo-zoom");
    if (!zoom || !zoom.classList.contains("is-open")) return;
    zoom.classList.remove("is-open");
    document.body.style.overflow = "";

    // Khôi phục background
    document.querySelectorAll(BG_SELECTORS).forEach(function (el) {
      el.removeAttribute("aria-hidden");
      el.style.pointerEvents = "";
    });

    // GSAP ScrollTrigger tính lại vị trí sau khi đóng
    if (window.ScrollTrigger) {
      setTimeout(function () {
        window.ScrollTrigger.refresh();
      }, 50);
    }

    setTimeout(function () {
      var img = document.getElementById("photo-zoom-img");
      if (
        img &&
        !document.getElementById("photo-zoom").classList.contains("is-open")
      ) {
        img.src = "";
      }
    }, 250);
  }

  function goPhotoZoom(dir) {
    if (zoomImages.length < 2) return;
    zoomIndex = (zoomIndex + dir + zoomImages.length) % zoomImages.length;
    var img = document.getElementById("photo-zoom-img");
    if (img) {
      img.style.opacity = "0";
      setTimeout(function () {
        img.src = zoomImages[zoomIndex].src;
        img.alt = zoomImages[zoomIndex].alt || "";
        img.style.opacity = "1";
      }, 120);
    }
    updateZoomNav();
  }

  function updateZoomNav() {
    var counter = document.getElementById("photo-zoom-counter");
    var prev = document.getElementById("photo-zoom-prev");
    var next = document.getElementById("photo-zoom-next");
    var show = zoomImages.length > 1;
    if (prev) prev.style.display = show ? "flex" : "none";
    if (next) next.style.display = show ? "flex" : "none";
    if (counter) {
      counter.style.display = show ? "block" : "none";
      counter.textContent = zoomIndex + 1 + " / " + zoomImages.length;
    }
  }

  window.openPhotoZoom = openPhotoZoom;
  window.closePhotoZoom = closePhotoZoom;
  window.goPhotoZoom = goPhotoZoom;

  // Keyboard: Escape đóng, ← → chuyển ảnh
  document.addEventListener("keydown", function (e) {
    var zoom = document.getElementById("photo-zoom");
    if (!zoom || !zoom.classList.contains("is-open")) return;
    if (e.key === "Escape") closePhotoZoom();
    if (e.key === "ArrowLeft") goPhotoZoom(-1);
    if (e.key === "ArrowRight") goPhotoZoom(1);
  });

  // Delegate: click .cuisine-img-wrap → lấy tập ảnh cùng lightbox
  document.addEventListener("click", function (e) {
    var wrap = e.target.closest(".cuisine-img-wrap");
    if (!wrap) return;

    // Tìm container lightbox cha gần nhất
    var container =
      wrap.closest('[id$="-lb-scroll"]') ||
      wrap.closest('[id$="-lb"]') ||
      document;

    var allImgs = Array.from(
      container.querySelectorAll(".cuisine-img-wrap img"),
    );
    var imagesArr = allImgs.map(function (img) {
      return { src: img.src, alt: img.alt };
    });

    var clickedImg = wrap.querySelector("img");
    var idx = allImgs.indexOf(clickedImg);
    if (idx < 0) idx = 0;

    openPhotoZoom(imagesArr, idx);
  });
})();
