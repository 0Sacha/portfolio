// affichage des messages reçus dans le dashboard

function chargerMessages() {
    const messagesZone = document.querySelector('.messages');
    const globalContainer = document.getElementById('messages-container');

    if (!messagesZone || !globalContainer) return;
    fetch('/api/messages')
        .then(response => response.json())
        .then(data => {

            if (data.length > 0) {
                messagesZone.classList.replace('messages', 'has-messages');
                messagesZone.innerHTML = '';

                data.forEach(msg => {
                    messagesZone.innerHTML += `
                    <div class="messages-card">
                        <div class="messages-titre">
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.8332 17.5V15.8333C15.8332 14.9493 15.482 14.1014 14.8569 13.4763C14.2317 12.8512 13.3839 12.5 12.4998 12.5H7.49984C6.61578 12.5 5.76794 12.8512 5.14281 13.4763C4.51769 14.1014 4.1665 14.9493 4.1665 15.8333V17.5"
                                 stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z"
                                 stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <p class="messages-nom">${msg.nom}</p>
                            <span class="messages-new">New</span>
                        </div>
                        <div class="messages-content">
                            <p class="messages-sujet">${msg.sujet}</p>
                            <p class="messages-contenu">${msg.contenu.substring(0, 40)}</p>
                            <p class="messages-temps">le ${new Date(msg.data_envoi).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                });
            }
        });
    console.log('Zone Message:', messagesZone);
    console.log('Global Container:', globalContainer);
}

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
            if (url.includes('messages.html')) {
                setTimeout(() => {
                    chargerMessages();
                }, 10);
            }
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
