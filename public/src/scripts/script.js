// navbar du dashboard

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const container = document.getElementById('monitoring-container');

    async function loadPage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Erreur de chargement");

            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            console.error(error);
            container.innerHTML = "<p style='color:white;'>Erreur : Impossible de charger la vue.</p>";
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            navLinks.forEach(l => l.removeAttribute('id'));
            link.setAttribute('id', 'dashboard-active-page');
            navLinks.forEach(l => l.removeAttribute('id'));
            link.setAttribute('id', 'dashboard-active-page');

            const pageToLoad = link.getAttribute('data-page');
            loadPage(pageToLoad);
        });
    });
    loadPage('views/monitoring.html');
});

// navbar re-sizing to scroll

const nav = document.querySelector('#navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 1) {
        nav.style.scale = '1.03';
    } else {
        nav.style.scale = '1.0';
    }
})

// menu hamburger

const change = document.querySelector('#hamburgerBtn');
const menu = document.querySelector('#mobile');
change.addEventListener('click', (e) => {
    menu.classList.toggle('active');
})
