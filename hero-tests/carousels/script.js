window.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");
  const originalSlides = Array.from(carousel.children);
  const slideCount = originalSlides.length;
  const gap = 40;
  let currentIndex = slideCount; // Start at the beginning of the middle copy

  // === 1. CLONE SLIDES ===
  const beforeClones = originalSlides.map(slide => slide.cloneNode(true));
  const afterClones = originalSlides.map(slide => slide.cloneNode(true));
  beforeClones.forEach(clone => carousel.insertBefore(clone, carousel.firstChild));
  afterClones.forEach(clone => carousel.appendChild(clone));

  const allSlides = Array.from(carousel.children);

  function getSlideWidth() {
    return allSlides[0].offsetWidth + gap;
  }

  function scrollToIndex(index, behavior = "smooth") {
    const slideWidth = getSlideWidth();
    carousel.scrollTo({
      left: slideWidth * index,
      behavior
    });
  }

  // === 2. INITIAL SCROLL ===
  window.addEventListener("load", () => {
    scrollToIndex(currentIndex, "auto");
  });

  // === 3. LOOP LOGIC ===
  function goNext() {
    currentIndex++;
    scrollToIndex(currentIndex);

    // Seamless reset to middle copy when hitting end
    if (currentIndex >= slideCount * 2) {
      setTimeout(() => {
        currentIndex = slideCount;
        scrollToIndex(currentIndex, "auto");
      }, 350);
    }
  }

  function goPrev() {
    currentIndex--;
    scrollToIndex(currentIndex);

    // Seamless reset to middle copy when hitting start
    if (currentIndex < slideCount) {
      setTimeout(() => {
        currentIndex = slideCount * 2 - 1;
        scrollToIndex(currentIndex, "auto");
      }, 350);
    }
  }

  // === 4. BUTTON EVENTS ===
  document.querySelector(".carousel-button.next").addEventListener("click", goNext);
  document.querySelector(".carousel-button.prev").addEventListener("click", goPrev);

  // === 5. AUTOPLAY ===
  const AUTOPLAY_INTERVAL = 4000;
  let autoplayTimer;

  function startAutoplay() {
    autoplayTimer = setInterval(goNext, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  startAutoplay();
  carousel.addEventListener("mouseenter", stopAutoplay);
  carousel.addEventListener("mouseleave", startAutoplay);
});
