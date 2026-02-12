// affichage des messages reçus dans le dashboard

function chargerMessages() {
    const messagesZone = document.querySelector('.messages');
    const messagesSection = document.querySelector('.messages-card-section');

    if (!messagesZone) return;
    fetch('/api/messages')
        .then(response => response.json())
        .then(data => {

            if (data.length > 0) {
                messagesZone.classList.replace('messages', 'has-messages');
                messagesSection.innerHTML = '';

                data.forEach(msg => {
                    messagesSection.innerHTML += `
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
}

function readMessage() {
    const messagesZone = document.querySelector('.messages');
    const messagesDetails = document.querySelector('.messages-details');
    const messagesDetailsRemplis = document.querySelector('.messages-details-remplis');
    if (!messagesZone) return;

    if (!messagesZone) return;
    fetch('/api/messages')
        .then(response => response.json())
        .then(data => {

            if (data.length > 0) {

                messagesDetails.classList.replace('messages-details', 'messages-details-remplis');
                messagesDetails.style.display = 'flex';
                messagesDetailsRemplis.innerHTML = '';

                messagesDetails.innerHTML += `
                <div class="messages-content">
                <p class="messages-sujet">${msg.sujet}</p>
                <div class="messages-nom-content">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8332 17.5V15.8333C15.8332 14.9493 15.482 14.1014 14.8569 13.4763C14.2317 12.8512 13.3839 12.5 12.4998 12.5H7.49984C6.61578 12.5 5.76794 12.8512 5.14281 13.4763C4.51769 14.1014 4.1665 14.9493 4.1665 15.8333V17.5"
                              stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M9.99984 9.16667C11.8408 9.16667 13.3332 7.67428 13.3332 5.83333C13.3332 3.99238 11.8408 2.5 9.99984 2.5C8.15889 2.5 6.6665 3.99238 6.6665 5.83333C6.6665 7.67428 8.15889 9.16667 9.99984 9.16667Z"
                              stroke="white" stroke-opacity="1" stroke-width="1.66667" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                    <p class="messages-nom-p">${msg.nom}</p>
                </div>
                <div class="messages-email-content">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3337 5.83301L10.8412 10.6055C10.5869 10.7532 10.2981 10.831 10.0041 10.831C9.71004 10.831 9.42125 10.7532 9.16699 10.6055L1.66699 5.83301"
                              stroke="#FFFFFF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.667 3.33301H3.33366C2.41318 3.33301 1.66699 4.0792 1.66699 4.99967V14.9997C1.66699 15.9201 2.41318 16.6663 3.33366 16.6663H16.667C17.5875 16.6663 18.3337 15.9201 18.3337 14.9997V4.99967C18.3337 4.0792 17.5875 3.33301 16.667 3.33301Z"
                              stroke="#FFFFFF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p class="messages-email">${msg.email}</p>
                </div>
                <div class="messages-time-content">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 6V12L16 14" stroke="#00D3F2" stroke-width="2" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                              stroke="#00D3F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p class="messages-temps">le ${new Date(msg.data_envoi).toLocaleDateString()}</p>
                </div>
                <div class="messages-contenu"><p class="messages-contenu-p">${msg.contenu.substring(0, 40)}</p></div>
            </div>
            <div class="messages-actions">
                <div class="messages-reponse">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.3337 5.83301L10.8412 10.6055C10.5869 10.7532 10.2981 10.831 10.0041 10.831C9.71004 10.831 9.42125 10.7532 9.16699 10.6055L1.66699 5.83301"
                              stroke="#FFFFFF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M16.667 3.33301H3.33366C2.41318 3.33301 1.66699 4.0792 1.66699 4.99967V14.9997C1.66699 15.9201 2.41318 16.6663 3.33366 16.6663H16.667C17.5875 16.6663 18.3337 15.9201 18.3337 14.9997V4.99967C18.3337 4.0792 17.5875 3.33301 16.667 3.33301Z"
                              stroke="#FFFFFF" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <p class="messages-reponse-p">Répondre</p>
                </div>
                <div class="messages-supprimer">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 4H14" stroke="white" stroke-width="1.33333" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M12.6668 4V13.3333C12.6668 14 12.0002 14.6667 11.3335 14.6667H4.66683C4.00016 14.6667 3.3335 14 3.3335 13.3333V4"
                              stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M5.3335 4.00004V2.66671C5.3335 2.00004 6.00016 1.33337 6.66683 1.33337H9.3335C10.0002 1.33337 10.6668 2.00004 10.6668 2.66671V4.00004"
                              stroke="white" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M6.6665 7.33337V11.3334" stroke="white" stroke-width="1.33333" stroke-linecap="round"
                              stroke-linejoin="round"/>
                        <path d="M9.3335 7.33337V11.3334" stroke="white" stroke-width="1.33333" stroke-linecap="round"
                              stroke-linejoin="round"/>
                    </svg>
                </div>
            </div>
                `;
            }
        })
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
                    // readMessage()
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
