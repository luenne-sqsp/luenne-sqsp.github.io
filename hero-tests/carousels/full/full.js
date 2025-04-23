const fullCarousel = document.getElementById('full-carousel');
const fullIndicators = document.querySelectorAll('#full-indicators button');

let originalSlides = Array.from(document.querySelectorAll('.full-slide'));
let currentIndex = 1; // Start on the real first slide
let autoPlayTimeout;
let lastManualClick = 0;

// Clone first and last slides
const firstClone = originalSlides[0].cloneNode(true);
const lastClone = originalSlides[originalSlides.length - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');

fullCarousel.appendChild(firstClone);
fullCarousel.insertBefore(lastClone, originalSlides[0]);

let allSlides = document.querySelectorAll('.full-slide');

// init position
fullCarousel.style.transform = `translateX(-${currentIndex * allSlides[0].offsetWidth}px)`;

// get real index ignoring clones
function getRealIndex(indexWithClones) {
  return (indexWithClones - 1 + originalSlides.length) % originalSlides.length;
}

// update slides + classes
function updateSlides(animate = true) {
  const slideWidth = allSlides[0].offsetWidth;
  fullCarousel.style.transition = animate ? 'transform 0.6s ease' : 'none';
  fullCarousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

  allSlides.forEach(slide => {
    slide.classList.remove('prev', 'next', 'active');
  });

  const total = allSlides.length;
  const prevIndex = (currentIndex - 1 + total) % total;
  const nextIndex = (currentIndex + 1) % total;

  allSlides[prevIndex]?.classList.add('prev');
  allSlides[currentIndex]?.classList.add('active');
  allSlides[nextIndex]?.classList.add('next');

  // Update indicators
  fullIndicators.forEach(btn => btn.classList.remove('active'));
  if (currentIndex >= 1 && currentIndex <= originalSlides.length) {
    fullIndicators[getRealIndex(currentIndex)]?.classList.add('active');
  }

  fullCarousel.addEventListener('transitionend', handleLoopEdges);
}

function handleLoopEdges() {
  fullCarousel.removeEventListener('transitionend', handleLoopEdges);

  if (allSlides[currentIndex].classList.contains('clone')) {
    const slideWidth = allSlides[0].offsetWidth;

    fullCarousel.style.transition = 'none';

    if (currentIndex === allSlides.length - 1) {
      currentIndex = 1;
    } else if (currentIndex === 0) {
      currentIndex = originalSlides.length;
    }

    fullCarousel.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Wait 1 frame before reapplying classes (prevent flicker)
    requestAnimationFrame(() => {
      allSlides.forEach(slide => {
        slide.classList.remove('prev', 'next', 'active');
        slide.classList.add('no-animation');
      });

      const prevIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
      const nextIndex = (currentIndex + 1) % allSlides.length;

      allSlides[prevIndex]?.classList.add('prev');
      allSlides[currentIndex]?.classList.add('active');
      allSlides[nextIndex]?.classList.add('next');

      fullIndicators.forEach(btn => btn.classList.remove('active'));
      if (currentIndex >= 1 && currentIndex <= originalSlides.length) {
        fullIndicators[getRealIndex(currentIndex)]?.classList.add('active');
      }

      setTimeout(() => {
        allSlides.forEach(slide => slide.classList.remove('no-animation'));
      }, 30);
    });
  }
}

function nextSlide() {
  if (currentIndex < allSlides.length - 1) {
    currentIndex++;
    updateSlides(true);
  }
}

// 🧠 New: Smart directional click logic
fullIndicators.forEach((button, btnIndex) => {
  button.addEventListener('click', () => {
    const targetRealIndex = btnIndex;
    const currentRealIndex = getRealIndex(currentIndex);

    let direction;
    // Map: 0 - Auto Bookings, 1 - Secure Payments, 2 - Custom Design
    if (currentRealIndex === 0 && targetRealIndex === 2) {
      direction = -1; // Go backward
    } else if (currentRealIndex === 2 && targetRealIndex === 0) {
      direction = 1; // Go forward (new cycle)
    } else {
      direction = targetRealIndex > currentRealIndex ? 1 : -1;
    }

    // Find nearest matching slide in the desired direction
    let newIndex = currentIndex;
    const maxLoops = allSlides.length;
    for (let i = 0; i < maxLoops; i++) {
      newIndex += direction;
      const real = getRealIndex(newIndex);
      if (real === targetRealIndex) break;
    }

    currentIndex = newIndex;
    updateSlides(true);
    startAutoPlay(10000); // 10s pause after click
  });
});

function startAutoPlay(customDelay) {
  clearTimeout(autoPlayTimeout);
  const delay = customDelay ?? 5000;

  autoPlayTimeout = setTimeout(() => {
    nextSlide();
    startAutoPlay(); // default 3s after
  }, delay);
}


// Arrow navigation & pause on hover
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    nextSlide();
    startAutoPlay(10000);
  } else if (e.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
    updateSlides(true);
    startAutoPlay(10000);
  }
});

fullCarousel.addEventListener('mouseenter', () => clearTimeout(autoPlayTimeout));
fullCarousel.addEventListener('mouseleave', () => startAutoPlay());



updateSlides();
startAutoPlay();

