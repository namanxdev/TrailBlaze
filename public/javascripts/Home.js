// Show Menu
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close');

// MENU SHOW
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

// MENU HIDDEN
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// REMOVE MENU MOBILE WHEN CLICKING A LINK
const navLinks = document.querySelectorAll('.nav__link');

const linkAction = () => {
    navMenu.classList.remove('show-menu');
};
navLinks.forEach(n => n.addEventListener('click', linkAction));

// ENSURE MENU IS HIDDEN ON PAGE LOAD
window.addEventListener('DOMContentLoaded', () => {
    navMenu.classList.remove('show-menu');
});

// Change background header
// scroll is greater than 50 viewport height
const bg_Header = ()=>{
    const header = document.getElementById('header')
    this.scrollY>=50? header.classList.add('bg-header')
                    : header.classList.remove('bg-header')

}
window.addEventListener('scroll',bg_Header)
