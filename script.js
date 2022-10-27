'use strict';

const nav = document.querySelector('.nav');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');

const header = document.querySelector('header');
const section1 = document.querySelector('#section--1');
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

// FUNCTIONS
// Modal Window
const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // // scroll to coordinates
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// with delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////
//TABBED COMPONENTS
tabsContainer.addEventListener('click', function (el) {
  const clicked = el.target.closest('.operations__tab');

  if (!clicked) return;
  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');
  // Activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////

// MENU FADE ANIMATION
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(e => {
      if (e !== link) e.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
//
// passing an argument into an handler function
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

///////////////////////////////////////

// NAVBAR STICKY ANIMATION
// using the scroll event
// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// INTERSECTION OBSERVER API
// const obsCallback = (entries, observer) => {
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root: null,
//   // rootMargin: '600px',
//   threshold: 0.3,
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;
const hCallback = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(hCallback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// REVEAL SECTIONS
const sCallback = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden1');
  entry.target.classList.remove('section--hidden2');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(sCallback, {
  root: null,
  threshold: 0.15,
});

allSections.forEach((section, i) => {
  sectionObserver.observe(section);
  if (i % 2 == 0) section.classList.add('section--hidden1');
  else section.classList.add('section--hidden2');
});

// const sCallback = function (entries, observer) {
//   const [entry] = entries;

//   if (!entry.isIntersecting) return;

//   entry.target.classList.remove('section--hidden');
//   observer.unobserve(entry.target);
// };

// const sectionObserver = new IntersectionObserver(sCallback, {
//   root: null,
//   threshold: 0.15,
// });

// allSections.forEach(function (section) {
//   sectionObserver.observe(section);
//   section.classList.add('section--hidden');
// });
// const allSections = document.querySelectorAll('.section');

// const revealSection = function (entries, observer) {
//   const [entry] = entries;

//   if (!entry.isIntersecting) return;

//   entry.target.classList.remove('section--hidden');
//   observer.unobserve(entry.target);
// };

// const sectionObserver = new IntersectionObserver(revealSection, {
//   root: null,
//   threshold: 0.15,
// });

// allSections.forEach(function (section) {
//   sectionObserver.observe(section);
//   section.classList.add('section--hidden');
// });

// LAZY LOADING IMAGES

const iCallback = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // console.log(entry);
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(iCallback, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// SLIDER ANIMATIONS
const slides = document.querySelectorAll('.slide');
// const slider = document.querySelector('.slider');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let currSlide = 0;
let maxSlide = slides.length - 1;
// EXPLAIN AGAIN; ADVANCED DOM AND EVENTS 4:30, SLIDER PART 1

// FUNCTIONS
const goToSlide = function (slide) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};

const createDots = function () {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeEnd',
      `<button class="dots__dot dots__dot--active" data-slide="${i}"></button>`
    );
  });
};

const activateDot = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
};
const init = () => {
  createDots();
  goToSlide(0);
  activateDot(0);
};
init();

const nextSlide = () => {
  if (currSlide === maxSlide) currSlide = 0;
  else currSlide++;
  console.log(currSlide);
  goToSlide(currSlide);
  activateDot(currSlide);
};

const prevSlide = () => {
  if (currSlide === 0) currSlide = maxSlide;
  else currSlide--;
  console.log(currSlide);
  goToSlide(currSlide);
  activateDot(currSlide);
};

// EVENT LISTENERS
btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});

dotContainer.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) console.log(e.target);
  const slide = e.target.dataset.slide;
  goToSlide(slide);
  activateDot(slide);
});
// SMOOTH SCROLLING

// PAGE NAVIGATION
// without delegation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// FORCE SCROLL TO TOP ON RELOAD
history.scrollRestoration = 'manual';
window.addEventListener('beforeunload', function () {
  window.scrollTo(0);
});
