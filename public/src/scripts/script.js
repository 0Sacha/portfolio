// navbar re-sizing to scroll

const nav = document.querySelector('#navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
        nav.style.scale = '1.03';
    } else {
        nav.style.scale = '1.0';
    }
})

//

const change = document.querySelector('#hamburgerBtn');
const menu = document.querySelector('#mobile');
change.addEventListener('click', (e) => {
    menu.classList.toggle('active');
})