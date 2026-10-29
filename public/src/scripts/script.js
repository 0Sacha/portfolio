// navbar du dashboard

document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const container = document.getElementById('monitoring-container');

    async function loadPage(url) {
        if (!container) return;
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

            const pageToLoad = link.getAttribute('data-page');
            const pageName = pageToLoad.split('/')[1].replace('.html', '');
            window.location.hash = pageName;
            loadPage(pageToLoad);

        });
    });
    const hash = window.location.hash.replace('#', '');

    if (hash) {
        loadPage(`views/${hash}.html`);

        const activeLink = document.querySelector(`[data-page="views/${hash}.html"]`);
        if (activeLink) {
            navLinks.forEach(l => l.removeAttribute('id'));
            activeLink.setAttribute('id', 'dashboard-active-page');
        }
    } else {
        loadPage('views/monitoring.html');

        const monitoringLink = document.querySelector('[data-page="views/monitoring.html"]');
        if (monitoringLink) {
            monitoringLink.setAttribute('id', 'dashboard-active-page');
        }
    }
});


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

                const messagesDetails = document.querySelector('.messages-details');
                if (messagesDetails) {
                    messagesDetails.style.display = 'flex';
                }

                data.forEach(msg => {
                    messagesSection.innerHTML += `
                    <div class="messages-card" data-id="${msg.id}">
                        <div class="messages-titre">
                            <i class="fa-solid fa-user-astronaut" style="color : white"></i>
                            <p class="messages-nom">${msg.nom}</p>
                            ${msg.is_new === 1 ? '<span class="messages-new">New</span>' : ''}
                        </div>
                        <div class="messages-content">
                            <p class="messages-sujet">${msg.sujet}</p>
                            <p class="messages-contenu">${msg.contenu.substring(0, 40)}</p>
                            <p class="messages-temps">le ${new Date(msg.data_envoi).toLocaleDateString()}</p>
                        </div>
                    </div>
                `;
                });

                messagesSection.addEventListener('click', (e) => {
                    const card = e.target.closest('.messages-card');

                    if (card) {
                        const messageId = card.dataset.id;
                        const newBadge = card.querySelector('.messages-new');

                        if (newBadge && newBadge.style.display !== 'none') {

                            newBadge.style.display = 'none';
                            console.log("ID du message cliqué :", messageId);

                            fetch(`/api/messages/${messageId}`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ is_new: 0 })
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        newBadge.style.display = 'block';
                                        console.error("Erreur lors de la mise à jour");
                                    } else {
                                        console.log(`Message ${messageId} marqué comme lu en BDD !`);
                                    }
                                })
                                .catch(err => {
                                    newBadge.style.display = 'block';
                                    console.error("Erreur réseau :", err);
                                });
                        }
                        readMessage(messageId)
                    }
                });
            }
        });
    console.log('Zone Message:', messagesZone);
}

async function readMessage(messageId) {
    const detailsContainer = document.querySelector('.messages-details') || document.querySelector('.messages-details-remplis');

    if (!detailsContainer) return;

    try {
        const response = await fetch(`/api/messages/${messageId}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du message");

        const msg = await response.json();

        detailsContainer.innerHTML = `
                <div class="messages-content">
                <p class="messages-sujet">${msg.sujet}</p>
                <div class="messages-nom-content">
                    <i class="fa-regular fa-user"></i>
                    <p class="messages-nom-p">${msg.nom}</p>
                </div>
                <div class="messages-email-content">
                    <i class="fa-regular fa-envelope"></i>
                    <p class="messages-email">${msg.email}</p>
                </div>
                <div class="messages-time-content">
                    <i class="fa-regular fa-clock"></i>
                    <p class="messages-temps">le ${new Date(msg.data_envoi).toLocaleDateString()}</p>
                </div>
                <div class="messages-contenu"><p class="messages-contenu-p">${msg.contenu.substring(0, 10000)}</p></div>
            </div>
            <div class="messages-actions">
                <div class="messages-reponse">
                    <i class="fa-regular fa-clock" style="color:white;"></i>
                    <p class="messages-reponse-p">Répondre</p>
                </div>
                <div class="messages-supprimer">
                    <i class="fa-regular fa-trash-can" style="color:white;"></i>
                </div>
            </div>
                `;

        if (detailsContainer.classList.contains('messages-details')) {
            detailsContainer.classList.replace('messages-details', 'messages-details-remplis');
        }

        detailsContainer.style.display = 'flex';

    } catch (error) {
        console.error("Erreur:", error);
    }

    deleteMessage(messageId)
}

async function deleteMessage(messageId) {
    const deleteMessage = document.querySelector('.messages-supprimer');
    const messagesZone = document.querySelector('.messages');
    const messagesSection = document.querySelector('.messages-card-section');
    const detailsContainer = document.querySelector('.messages-details') || document.querySelector('.messages-details-remplis');

    if (!deleteMessage) return;

    deleteMessage.addEventListener('click', async () => {
        try {
            const response = await fetch(`/api/messages/${messageId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error("Erreur suppression");

            window.location.reload();

            if (detailsContainer.classList.contains('messages-details-remplis')) {
                detailsContainer.classList.replace('messages-details-remplis', 'messages-details');
            }

            detailsContainer.innerHTML = `
            <i class="fa-regular fa-message"></i>
            <p class="messages-notfound">Sélectionnez un message pour voir les détails</p>
            `;

        } catch (error) {
            console.error("Erreur:", error);
        }
    });
}

// navbar re-sizing to scroll

const nav = document.querySelector('#navbar');
const navMobile = document.querySelector('#navbar-mobile');

if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 1) {
            nav.style.scale = '1.03';
        } else {
            nav.style.scale = '1.0';

        }
    })
}



// menu hamburger

const change = document.querySelector('#hamburgerBtn');
const menu = document.querySelector('#mobile');

if (change) {
    change.addEventListener('click', (e) => {
        menu.classList.toggle('active');
    })
}

// glissement de la pilule sous les text de la navbar

const navLi = document.querySelectorAll('#navbar li')
const aActive = document.querySelector('#active');

if (aActive) {

    let liActif = navLi[0]

    function moveIndicator(element) {
        aActive.style.left = element.offsetLeft + 'px'
        aActive.style.width = element.offsetWidth + 'px'

        if (window.innerWidth <= 768) {
            aActive.style.top = element.offsetTop + 'px'
            aActive.style.height = element.offsetHeight + 'px'
        } else {
            aActive.style.top = ''
            aActive.style.height = ''
        }
    }

    moveIndicator(navLi[0])

    // au clic : la pilule va directement sur le lien cliqué
    // et on bloque le scroll le temps que la page finisse de défiler
    let clicEnCours = false
    let minuteur

    function finDuClic() {
        clicEnCours = false
        clearTimeout(minuteur)
    }

    navLi.forEach(lien => {
        lien.addEventListener('click', (e) => {
            moveIndicator(e.currentTarget)
            clicEnCours = true
            clearTimeout(minuteur)
            minuteur = setTimeout(finDuClic, 1500) // sécurité si 'scrollend' n'arrive jamais
        })
    })

    window.addEventListener('scrollend', finDuClic)

    window.addEventListener('resize', () => {
        window.dispatchEvent(new Event('scroll'))
    })

    window.addEventListener('load', () => {
        window.dispatchEvent(new Event('scroll'))
    })

    document.fonts.ready.then(() => {
        window.dispatchEvent(new Event('scroll'))
    })

    const navBloc = document.querySelector('#nav')
    const navSide = document.querySelector('#nav-side')

    function placerNav(gauche) {
        navBloc.classList.toggle('gauche', gauche)
        navSide.querySelector('i').className = gauche ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-left'
        navSide.setAttribute('aria-label', gauche ? 'Placer la navigation à droite' : 'Placer la navigation à gauche')
    }

    if (navSide) {
        try {
            const navbar = document.querySelector('#navbar')
            navbar.style.transition = 'none'
            placerNav(localStorage.getItem('navCote') === 'gauche')
            if (localStorage.getItem('navCote')) {
                navSide.classList.add('discret')
            }
            requestAnimationFrame(() => {
                navbar.style.transition = ''
            })
        } catch (e) {}

        let minuteurDiscret

        navSide.addEventListener('click', () => {
            const gauche = !navBloc.classList.contains('gauche')
            const etaitDiscret = navSide.classList.contains('discret')
            clearTimeout(minuteurDiscret)
            navSide.classList.remove('discret')

            setTimeout(() => {
                navSide.classList.add('cache')

                setTimeout(() => {
                    navSide.style.transition = 'none'
                    placerNav(gauche)

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            navSide.style.transition = ''
                            navSide.classList.remove('cache')

                            minuteurDiscret = setTimeout(() => {
                                navSide.classList.add('discret')
                            }, 1500)
                        })
                    })
                }, 200)
            }, etaitDiscret ? 150 : 0)

            try {
                localStorage.setItem('navCote', gauche ? 'gauche' : 'droite')
            } catch (e) {}
        })
    }

    const sectionHeros = document.querySelector('#nav')
    const sectionProjet = document.querySelector('#section-projet')
    const experienceTitle = document.querySelector('#experienceTitle')
    const contactTitle = document.querySelector('#contactTitle')


    window.addEventListener('scroll', () => {
        if (clicEnCours) return

        if (window.scrollY >= sectionHeros.offsetTop) {
            moveIndicator(navLi[0])
        }
        if (window.scrollY + window.innerHeight / 2 >= sectionProjet.offsetTop - 200) {
            moveIndicator(navLi[1])
        }
        if (window.scrollY + window.innerHeight / 2 >= experienceTitle.offsetTop - 200 || window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5 ) {
            moveIndicator(navLi[2])
        }
        if (window.scrollY <= 5) {
            moveIndicator(navLi[0])
        }
    })

}

// API GITHUB


async function fetchGitHubContributions() {
    const url = "https://api.github.com/graphql";
    try {
        const query = `
        {
            user(login: "0Sacha") {
            contributionsCollection {
            contributionCalendar {
            weeks {
            contributionDays {
                                date
                                contributionCount
                            }
                        }
                    }
                }
            }
        }`
        const reponse = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + GITHUB_TOKEN,
            },
            body: JSON.stringify({ query: query })
        });
        if (!reponse.ok) {
            throw new Error(`Statut de réponse : ${reponse.status}`);
        }
        const resultat = await reponse.json();
        console.log(resultat);
        const weeks = resultat.data.user.contributionsCollection.contributionCalendar.weeks;
        const graphContainer = document.querySelector('.graph-container')
        console.log(graphContainer)
        if (!graphContainer) return;
        graphContainer.innerHTML = ""
        weeks.forEach(week => {

            const weekEl = document.createElement("div");

            weekEl.classList.add("week");
            week.contributionDays.forEach(day => {
                const dayEl = document.createElement("div");

                dayEl.classList.add("day");

                weekEl.appendChild(dayEl);

                dayEl.dataset.level = getLevel(day.contributionCount)
            })
            graphContainer.appendChild(weekEl);

        })
        console.log(weeks);
    } catch (erreur) {
        console.error(erreur.message);
    }
}

function getLevel(count) {
    if (count === 0) {
        return 0;
    } else if (count >= 1 && count <= 3) {
        return 1;
    } else if (count >= 4 && count <= 9) {
        return 2;
    } else if (count >= 10 && count <= 19) {
        return 3;
    } else if (count >= 20) {
        return 4;
    }
}

// fetchGitHubContributions();