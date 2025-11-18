document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // --- 1. VARIABLES GLOBALES Y DEFINICIONES ---
    // =========================================================================
    
    const mainList = document.getElementById('movie-list'); // Solo existe en index
    const metaContainer = document.getElementById('movie-meta-container'); // Solo en detalle
    const suggestions = document.querySelector('.suggestions-carousel'); // Solo en detalle

    const hasRenderFunction = typeof renderMovies === 'function';
    const hasMetaRenderFunction = typeof renderMovieMetadata === 'function';

    // Definimos funciones vacías globalmente para evitar errores si no estamos en el index
    window.filterAndSearchMovies = () => {};
    window.checkURLForParams = () => {};
    let resetAllFilters = () => {}; 


    // =========================================================================
    // --- 2. LÓGICA PRINCIPAL DEL INDEX (FILTROS Y URL) ---
    // =========================================================================
    // IMPORTANTE: Configuramos esto ANTES de renderizar nada
    
    if (mainList) {
        const searchBar = document.getElementById('search-bar');
        const genreFilter = document.getElementById('genre-filter');
        const authorFilter = document.getElementById('author-filter');
        const dateFilterInput = document.getElementById('date-filter');
        
        const rouletteModal = document.getElementById('roulette-widget');
        const openRouletteBtn = document.getElementById('open-roulette-btn');
        const closeRouletteBtn = document.getElementById('close-roulette-btn');
        const spinBtn = document.getElementById('spin-roulette-btn');
        const rouletteWheel = document.getElementById('roulette-wheel');
        const rouletteResult = document.getElementById('roulette-result');
        const azNav = document.getElementById('az-filter-nav');
        
        window.selectedLetter = 'all'; 
        let calendarInstance = null;

        // --- A. Función para resetear filtros ---
        resetAllFilters = function(exceptThisElement) {
            if (exceptThisElement !== searchBar) searchBar.value = '';
            if (exceptThisElement !== genreFilter) genreFilter.value = 'all';
            if (exceptThisElement !== authorFilter) authorFilter.value = 'all';
            if (exceptThisElement !== dateFilterInput && calendarInstance) {
                calendarInstance.clear(false); 
            }
            
            // Resetear filtro A-Z
            if(azNav) {
                const isAzLink = Array.from(azNav.querySelectorAll('a')).includes(exceptThisElement);
                if (!isAzLink) {
                    if (azNav.querySelector('a.active')) azNav.querySelector('a.active').classList.remove('active');
                    const allLink = azNav.querySelector('[data-letter="all"]');
                    if(allLink) allLink.classList.add('active');
                    window.selectedLetter = 'all';
                }
            }
        }

        // --- B. Función Principal de Filtrado ---
        window.filterAndSearchMovies = function() {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedGenre = decodeURIComponent(genreFilter.value);
            const selectedAuthor = decodeURIComponent(authorFilter.value);
            const selectedDate = dateFilterInput.value; 
            
            const allMovieLinks = document.querySelectorAll('#movie-list .movie-card-link');

            allMovieLinks.forEach(link => {
                const title = link.dataset.title.toLowerCase();
                const genre = link.dataset.genre;
                const author = link.dataset.author;
                const postDate = link.dataset.date; 

                let show = true; 
                
                if (searchTerm !== '') {
                    show = title.includes(searchTerm);
                } else if (selectedGenre !== 'all') {
                    show = (genre === selectedGenre);
                } else if (selectedAuthor !== 'all') {
                    show = (author === selectedAuthor);
                } else if (selectedDate !== "") {
                    show = (postDate === selectedDate);
                } else if (window.selectedLetter !== 'all') {
                    show = title.startsWith(window.selectedLetter);
                }

                link.style.display = show ? 'block' : 'none';
            });
        }
        
        // --- C. Función que lee la URL (LA CLAVE DEL PROBLEMA) ---
        window.checkURLForParams = function() {
            const urlParams = new URLSearchParams(window.location.search);
            
            const searchFromURL = decodeURIComponent(urlParams.get('search') || '');
            const dateFromURL = urlParams.get('date');
            const authorFromURL = decodeURIComponent(urlParams.get('author') || '');
            const letterFromURL = urlParams.get('letter');
            const genreFromURL = decodeURIComponent(urlParams.get('genre') || ''); 
            
            let needsFiltering = false;

            if (searchFromURL) {
                resetAllFilters(searchBar);
                searchBar.value = searchFromURL;
                needsFiltering = true;
            } else if (letterFromURL) {
                resetAllFilters(null); // Reset simple
                window.selectedLetter = letterFromURL.toLowerCase();
                // Actualizar visualmente el NAV A-Z
                if(azNav) {
                    if (azNav.querySelector('a.active')) azNav.querySelector('a.active').classList.remove('active');
                    const newActiveLetter = azNav.querySelector(`[data-letter="${letterFromURL.toUpperCase()}"]`);
                    if (newActiveLetter) newActiveLetter.classList.add('active');
                }
                needsFiltering = true;
            } else if (authorFromURL && authorFromURL !== 'all') { 
                resetAllFilters(authorFilter);
                authorFilter.value = authorFromURL;
                needsFiltering = true;
            } else if (genreFromURL && genreFromURL !== 'all') { 
                resetAllFilters(genreFilter);
                genreFilter.value = genreFromURL;
                needsFiltering = true;
            } else if (dateFromURL) {
                resetAllFilters(dateFilterInput);
                if(calendarInstance) calendarInstance.setDate(dateFromURL, false); 
                dateFilterInput.value = dateFromURL; 
                needsFiltering = true;
            }
            
            if (needsFiltering) {
                window.filterAndSearchMovies();
            }
        }
        
        // --- D. Inicialización de Eventos del Index ---
        calendarInstance = flatpickr(dateFilterInput, {
            dateFormat: "Y-m-d",
            onChange: (selectedDates, dateStr) => {
                resetAllFilters(dateFilterInput); 
                window.filterAndSearchMovies(); 
            },
            onClose: (selectedDates, dateStr) => {
                if (dateStr === '') { 
                    resetAllFilters(null); 
                    window.filterAndSearchMovies();
                }
            }
        });

        // Setup Ruleta
        if(openRouletteBtn) {
            openRouletteBtn.addEventListener('click', () => rouletteModal.classList.add('visible'));
            closeRouletteBtn.addEventListener('click', () => rouletteModal.classList.remove('visible'));
            rouletteModal.addEventListener('click', (e) => {
                if(e.target === rouletteModal) rouletteModal.classList.remove('visible');
            });
            spinBtn.addEventListener('click', () => {
                spinBtn.disabled = true;
                rouletteWheel.classList.add('spinning');
                rouletteResult.textContent = 'Buscando...';
                const oldHighlight = document.querySelector('.movie-card-link.highlight');
                if (oldHighlight) oldHighlight.classList.remove('highlight');
                resetAllFilters(null);
                window.filterAndSearchMovies(); 
                
                const visibleMovies = Array.from(document.querySelectorAll('#movie-list .movie-card-link')).filter(
                    movie => !movie.classList.contains('is-locked') && movie.style.display !== 'none'
                );
                setTimeout(() => {
                    rouletteWheel.classList.remove('spinning');
                    spinBtn.disabled = false;
                    if (visibleMovies.length > 0) {
                        const randomIndex = Math.floor(Math.random() * visibleMovies.length);
                        const chosenMovie = visibleMovies[randomIndex];
                        rouletteResult.textContent = `¡Te recomendamos: ${chosenMovie.dataset.title}!`;
                        setTimeout(() => {
                            rouletteModal.classList.remove('visible');
                            chosenMovie.classList.add('highlight');
                            chosenMovie.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 1000); 
                    } else {
                        rouletteResult.textContent = 'No hay películas disponibles.';
                    }
                }, 1500); 
            });
        }

        // Listeners Filtros Manuales
        searchBar.addEventListener('input', () => {
            resetAllFilters(searchBar);
            window.filterAndSearchMovies();
        });
        genreFilter.addEventListener('change', () => {
            resetAllFilters(genreFilter);
            window.filterAndSearchMovies();
        });
        authorFilter.addEventListener('change', () => {
            resetAllFilters(authorFilter);
            window.filterAndSearchMovies();
        });
    }

    // =========================================================================
    // --- 3. CONFIGURACIÓN DE EVENTOS GLOBALES ---
    // =========================================================================
    
    document.addEventListener('metadataRendered', setupShareButtons);

    document.addEventListener('moviesRendered', () => {
        // 1. Bloquear clicks en 'locked'
        document.querySelectorAll('.movie-card-link.is-locked').forEach(link => {
            link.addEventListener('click', (e) => e.preventDefault());
        });
        
        // 2. IMPORTANTE: Revisar URL params ahora que las pelis existen
        if(mainList) {
             window.checkURLForParams();
        }
    });

    // =========================================================================
    // --- 4. RENDERIZADO (¡AHORA VA AL FINAL!) ---
    // =========================================================================
    
    // CASO A: Index
    if (mainList && hasRenderFunction) {
        renderMovies('movie-list', false); // Esto dispara 'moviesRendered'
    }

    // CASO B: Sugerencias en Detalle
    if (suggestions && hasRenderFunction) {
        if (!suggestions.id) suggestions.id = 'suggestions-container-gen';
        renderMovies(suggestions.id, true); 
    }

    // CASO C: Metadata en Detalle
    if (metaContainer && hasMetaRenderFunction) {
        const movieId = metaContainer.dataset.id;
        if (movieId) { 
            renderMovieMetadata('movie-meta-container', movieId);
        }
    }

    // =========================================================================
    // --- 5. LÓGICA ESPECÍFICA DE PÁGINAS DE DETALLE Y OTROS ---
    // =========================================================================

    // --- 5.1 Redirects desde Subpáginas (Header filters) ---
    if (!mainList) { 
        const headerFilters = document.querySelector('.header-filters');
        if (headerFilters) {
            function redirectToIndex(paramName, paramValue) {
                if(paramValue === 'all' || paramValue === '') { 
                   window.location.href = `/index.html`; 
                   return;
                }
                window.location.href = `/index.html?${paramName}=${encodeURIComponent(paramValue)}`; 
            }
            
            const sBar = headerFilters.querySelector('#search-bar');
            if(sBar) sBar.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '') redirectToIndex('search', e.target.value);
            });
            
            const gFilter = headerFilters.querySelector('#genre-filter');
            if(gFilter) gFilter.addEventListener('change', (e) => redirectToIndex('genre', e.target.value));

            const aFilter = headerFilters.querySelector('#author-filter');
            if(aFilter) aFilter.addEventListener('change', (e) => redirectToIndex('author', e.target.value));

            const dFilter = headerFilters.querySelector('#date-filter');
            if(dFilter) flatpickr(dFilter, {
                dateFormat: "Y-m-d",
                onChange: (selectedDates, dateStr) => redirectToIndex('date', dateStr)
            });
        }
    }

    // --- 5.2 Botones Share ---
    function setupShareButtons() {
        const shareFb = document.getElementById('share-fb');
        const shareX = document.getElementById('share-x');
        const shareInsta = document.getElementById('share-insta'); 
        
        if (!shareFb) return; 
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        shareFb.addEventListener('click', (e) => {
            e.preventDefault();
            const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            window.open(fbUrl, 'fbShareWindow', 'height=450, width=550, top=' + (window.innerHeight / 2 - 275) + ', left=' + (window.innerWidth / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        });

        shareX.addEventListener('click', (e) => {
            e.preventDefault();
            const xUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            window.open(xUrl, 'twitterShareWindow', 'height=450, width=550, top=' + (window.innerHeight / 2 - 275) + ', left=' + (window.innerWidth / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
        });

        if(shareInsta) {
            shareInsta.href = 'https://www.instagram.com/cine.post.tis/'; 
        }
    }

    // --- 5.3 Filtro A-Z (Setup Inicial) ---
    const azNav = document.getElementById('az-filter-nav');
    function setupAZFilter() {
        if (!azNav) return; 
        for (let i = 65; i <= 90; i++) { 
            const letter = String.fromCharCode(i);
            const link = document.createElement('a');
            link.href = `/index.html?letter=${letter.toLowerCase()}`; 
            link.dataset.letter = letter;
            link.textContent = letter;
            azNav.appendChild(link);
        }
        // Listeners solo si estamos en index (para filtrar en vivo)
        if (mainList) { 
            azNav.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); 
                    resetAllFilters(link); 
                    if (azNav.querySelector('a.active')) azNav.querySelector('a.active').classList.remove('active');
                    link.classList.add('active');
                    window.selectedLetter = link.dataset.letter.toLowerCase();
                    window.filterAndSearchMovies(); 
                });
            });
        }
    }
    setupAZFilter(); 

    // --- 5.4 Carrusel y Rating (Detalles) ---
    const carousels = document.querySelectorAll('.carousel');
    if (carousels.length > 0) {
        carousels.forEach(carousel => {
            const inner = carousel.querySelector('.carousel-inner');
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            if (!inner || !prevBtn || !nextBtn || items.length === 0) return;
            let currentIndex = 0;
            const totalItems = items.length;
            let autoSlideInterval; 
            const intervalTime = 3000; 
            function moveCarousel() { if (totalItems > 1) inner.style.transform = `translateX(-${currentIndex * 100}%)`; }
            function autoAdvance() { currentIndex = (currentIndex + 1) % totalItems; moveCarousel(); }
            function resetInterval() { clearInterval(autoSlideInterval); if (totalItems > 1) autoSlideInterval = setInterval(autoAdvance, intervalTime); }
            nextBtn.addEventListener('click', () => { currentIndex = (currentIndex + 1) % totalItems; moveCarousel(); resetInterval(); });
            prevBtn.addEventListener('click', () => { currentIndex = (currentIndex - 1 + totalItems) % totalItems; moveCarousel(); resetInterval(); });
            resetInterval(); 
        });
    }

    const starRatingContainer = document.querySelector('.star-rating');
    if (starRatingContainer) {
        setTimeout(() => {
            const stars = starRatingContainer.querySelectorAll('.stars i');
            const movieId = starRatingContainer.dataset.movieId;
            if (!movieId) return; 
            const avgDisplay = document.getElementById('star-avg-display');
            const savedMsg = document.getElementById('rating-saved-msg');
            const scoreKey = `movie_score_${movieId}`;
            const countKey = `movie_count_${movieId}`;
            const votedKey = `movie_voted_${movieId}`;
            function loadSavedRating() {
                const score = parseInt(localStorage.getItem(scoreKey) || 0);
                const count = parseInt(localStorage.getItem(countKey) || 0);
                const hasVoted = localStorage.getItem(votedKey) === 'true';
                let avgRating = 0;
                if (count > 0) avgRating = score / count;
                if(avgDisplay) avgDisplay.textContent = `${avgRating.toFixed(1)} estrellas (${count} votos)`;
                fillStars(Math.round(avgRating));
                if (hasVoted) { starRatingContainer.classList.add('voted'); if(savedMsg) { savedMsg.textContent = '¡Gracias por tu voto!'; savedMsg.style.opacity = '1'; } }
            }
            function fillStars(ratingValue) {
                stars.forEach(star => {
                    if (star.dataset.value <= ratingValue) { star.classList.remove('fa-regular'); star.classList.add('fa-solid'); } 
                    else { star.classList.remove('fa-solid'); star.classList.add('fa-regular'); }
                });
            }
            stars.forEach(star => {
                star.addEventListener('mouseover', () => { if (starRatingContainer.classList.contains('voted')) return; fillStars(star.dataset.value); });
                star.addEventListener('mouseout', () => { if (starRatingContainer.classList.contains('voted')) return; loadSavedRating(); });
                star.addEventListener('click', () => {
                    if (starRatingContainer.classList.contains('voted')) return;
                    const rating = parseInt(star.dataset.value);
                    let score = parseInt(localStorage.getItem(scoreKey) || 0);
                    let count = parseInt(localStorage.getItem(countKey) || 0);
                    localStorage.setItem(scoreKey, score + rating);
                    localStorage.setItem(countKey, count + 1);
                    localStorage.setItem(votedKey, 'true');
                    loadSavedRating();
                });
            });
            loadSavedRating(); 
        }, 500); 
    }

    // --- 5.5 Formulario Contacto ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tuNumeroDeWhatsApp = '522222784581'; 
            const nombre = document.getElementById('nombre').value;
            const motivo = document.getElementById('motivo').value;
            const mensaje = document.getElementById('mensaje').value;
            let texto = `¡Hola! Soy ${nombre}.\n\n*Motivo:* ${motivo}\n*Mensaje:*\n${mensaje}`;
            window.open(`https://wa.me/${tuNumeroDeWhatsApp}?text=${encodeURIComponent(texto)}`, '_blank');
        });
    }
});

// --- 5.6 Scroll Header (Lógica Unificada por Posición) ---
    const header = document.querySelector('.main-header');
    const body = document.body;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 1. LÓGICA MÓVIL (Adaptativa)
        if (window.innerWidth <= 768) {
            header.classList.remove('desktop-scroll-active'); // Limpieza

            // CAMBIO: Ya no importa si subes o bajas. 
            // Solo si estás abajo (+50px) se ocultan los filtros.
            // Tienes que subir hasta el tope (<50px) para verlos de nuevo.
            if (scrollTop > 0) { 
                header.classList.add('compact'); 
                body.classList.add('scroll-down-state'); 
            } else { 
                // Solo aquí, al principio de la página, se muestran
                header.classList.remove('compact'); 
                body.classList.remove('scroll-down-state'); 
            }
        } 
        // 2. LÓGICA ESCRITORIO
        else {
            header.classList.remove('compact'); 
            body.classList.remove('scroll-down-state'); 

            // Misma lógica: solo se oculta si bajamos
            if (scrollTop > 100) {
                header.classList.add('desktop-scroll-active');
            } else {
                header.classList.remove('desktop-scroll-active');
            }
        }
        // Ya no necesitamos lastScrollTop para esta lógica
    });