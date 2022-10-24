'use strict';

///////////////////////////////////////
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
///////////////////////////////////////
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

// EXPERIMENTAL DOM TRAVERSING
// GOING DOWNWARDS; SELECTING DIRECT CHILD ELEMENTS
// const h1 = document.querySelector('h1');

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes); //returns all of the direct nodes under
// console.log(h1.children); // returns an html collection of the active children elements under
// h1.firstElementChild.style.color = 'pink';
// h1.lastElementChild.style.color = 'purple';

// GOING UPWARDS; SELECTING PARENT  ELEMENTS
// console.log(h1.parentNode);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// GOING SIDWAYS; SELECTING SIBLING ELEMENTS
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.parentElement.children); //to view all of the siblings(children) nodes
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) {
//     el.style.transform = 'scale(0.7)';
//   }
// }); //selecting elements sibling elements and adding features by accessing all the siblings
// EXPERIMENTAL; NAVBAR FEATURE
// const randomColor = () =>
//   `rgb(${randomInt(0, 225)},${randomInt(0, 225)},${randomInt(0, 225)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('NAVBAR', e.target, e.currentTarget);
// });

// LECTURES
// DOCUMENT METHODS
// console.log(document.documentElement); //selecting the whole elements of the page
// console.log(document.head);
// console.log(document.body);

// console.log(document.querySelectorAll('.section')); //returns an array like node list; cannot be change d in real time

// const allButtons = document.getElementsByTagName('button');
// console.log(allButtons); //this method returns an html collection; which is a live collection that changes in real time as the dom changes

// const allBtnsClass = document.getElementsByClassName('btn');
// console.log(allBtnsClass); //returns and html collection

// CREATING AND INSERTING ELEMENTS
// insertAdjacentHTML

// const message = document.createElement('div'); //creating a dive manually
// message.classList.add('cookie-message');
// message.innerHTML =
//   'we use cookies to stress you tf out  <button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// header.before(message);
// header.append(message.cloneNode(true)); //to display an element multiple tiems, CLONING

// DELETE ELEMENTS
// STYLES
// message.style.backgroundColor = '#37383d';
// console.log(message.style.backgroundColor); //only styles that are set inline can be gotten by calling it externally

// console.log(message.style.color); //returns nothing
// console.log(getComputedStyle(message).color); //returns the predefined computed style
// console.log(getComputedStyle(message).height);

// message.style.height =
//   Number.parseFloat(getComputedStyle(message).height, 2) + 90 + 'px';

// // changing css default parameters; from root because 'root is equivalent to documentElement
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// ATTRIBUTES; src, alt, class, id
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src); //delivers the absolute url
// console.log(logo.getAttribute('src')); //delivers the relative url
// console.log(logo.className);

// logo.alt = 'beautiful minimalist design'; //alter the standardattributes

// NON STANDARD
// console.log(logo.designer); //non standard attributes cannot be gotten in the same way as standard ones
// console.log(logo.getAttribute('designer'));

// // DATA ATTRIBUTES; attrib
// console.log(logo.dataset.versionNumber);

// CLASSES
// logo.classList.add('x', 'y');
// logo.classList.remove('x', 'y');
// logo.classList.toggle('x', 'y');
// logo.classList.constains('x', 'y');
