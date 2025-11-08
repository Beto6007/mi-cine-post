document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // --- 1. LÓGICA DE DETALLE.HTML (ESTRELLAS, CARRUSEL, SHARE) ---
    // =========================================================================
    
    const carousels = document.querySelectorAll('.carousel');
    const starRatingContainer = document.querySelector('.star-rating');
    
    // ¡NUEVO! Función para activar los botones de compartir
    function setupShareButtons() {
        const shareFb = document.getElementById('share-fb');
        const shareX = document.getElementById('share-x');
        const shareInsta = document.getElementById('share-insta'); // Nota: Instagram no tiene API de compartir post
        
        if (!shareFb) return; // Si no hay botones de compartir, no hace nada
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        shareX.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        
        // Instagram no permite compartir posts por URL,
        // lo mejor es enlazar a tu perfil.
        // ¡CAMBIA ESTO! por tu URL de Instagram
        shareInsta.href = 'https://www.instagram.com/TU_USUARIO/';
    }


    if (carousels.length > 0) {
        // --- 1a. Lógica del Carrusel ---
        carousels.forEach(carousel => {
            const inner = carousel.querySelector('.carousel-inner');
            const items = carousel.querySelectorAll('.carousel-item');
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            
            let currentIndex = 0;
            const totalItems = items.length;

            function moveCarousel() {
                inner.style.transform = `translateX(-${currentIndex * 100}%)`;
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                moveCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                moveCarousel();
            });
        });
    }

    if (starRatingContainer) {
        // --- 1b. Lógica de Ranking de Estrellas ---
        const stars = starRatingContainer.querySelectorAll('.stars i');
        const movieId = starRatingContainer.dataset.movieId;
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
            if (count > 0) {
                avgRating = score / count;
            }
            avgDisplay.textContent = `${avgRating.toFixed(1)} estrellas (${count} votos)`;
            fillStars(Math.round(avgRating));

            if (hasVoted) {
                starRatingContainer.classList.add('voted');
                savedMsg.textContent = '¡Gracias por tu voto!';
                savedMsg.style.opacity = '1';
            }
        }

        function fillStars(ratingValue) {
            stars.forEach(star => {
                if (star.dataset.value <= ratingValue) {
                    star.classList.remove('fa-regular');
                    star.classList.add('fa-solid');
                } else {
                    star.classList.remove('fa-solid');
                    star.classList.add('fa-regular');
                }
            });
        }

        stars.forEach(star => {
            star.addEventListener('mouseover', () => {
                if (starRatingContainer.classList.contains('voted')) return;
                fillStars(star.dataset.value);
            });
            star.addEventListener('mouseout', () => {
                if (starRatingContainer.classList.contains('voted')) return;
                loadSavedRating(); 
            });
            star.addEventListener('click', () => {
                if (starRatingContainer.classList.contains('voted')) return;
                const rating = parseInt(star.dataset.value);
                let score = parseInt(localStorage.getItem(scoreKey) || 0);
                let count = parseInt(localStorage.getItem(countKey) || 0);
                score += rating;
                count += 1;
                localStorage.setItem(scoreKey, score);
                localStorage.setItem(countKey, count);
                localStorage.setItem(votedKey, 'true');
                loadSavedRating();
            });
        });

        loadSavedRating(); // Carga la calificación al iniciar
        
        // ¡NUEVO! Activa los botones de compartir
        setupShareButtons();
    }


    // =========================================================================
    // --- 2. LÓGICA DE FILTRO A-Z (PARA AMBAS PÁGINAS) ---
    // =========================================================================
    
    const azNav = document.getElementById('az-filter-nav');
    
    // Generador de Filtro A-Z
    function setupAZFilter() {
        if (!azNav) return; 

        for (let i = 65; i <= 90; i++) { // 65=A, 90=Z
            const letter = String.fromCharCode(i);
            const link = document.createElement('a');
            link.href = `/index.html?letter=${letter.toLowerCase()}`; 
            link.dataset.letter = letter;
            link.textContent = letter;
            azNav.appendChild(link);
        }
        
        // Añadir listeners (solo para index.html)
        azNav.querySelectorAll('a').forEach(link => {
            if (document.getElementById('movie-list')) { // Solo si estamos en index.html
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Evita recargar la página
                    resetAllFilters(link); 
                    
                    if (azNav.querySelector('a.active')) {
                        azNav.querySelector('a.active').classList.remove('active');
                    }
                    link.classList.add('active');
                    
                    window.selectedLetter = link.dataset.letter.toLowerCase();
                    window.filterAndSearchMovies(); // Llama a la función de filtrado
                });
            }
        });
    }

    setupAZFilter(); 


    // =========================================================================
    // --- 3. LÓGICA DE INDEX.HTML (FILTROS, RULETA, ETC.) ---
    // =========================================================================
    
    const movieListContainer = document.getElementById('movie-list');
    
    // Comprueba si estamos en index.html
    if (movieListContainer) {
        
        // --- 3a. Seleccionar TODOS los elementos del DOM ---
        const searchBar = document.getElementById('search-bar');
        const genreFilter = document.getElementById('genre-filter');
        const authorFilter = document.getElementById('author-filter');
        const dateFilterInput = document.getElementById('date-filter');
        const azNavLinks = azNav.querySelectorAll('a'); // Links A-Z
        
        // Selectores de Ruleta
        const rouletteModal = document.getElementById('roulette-widget');
        const openRouletteBtn = document.getElementById('open-roulette-btn');
        const closeRouletteBtn = document.getElementById('close-roulette-btn');
        const spinBtn = document.getElementById('spin-roulette-btn');
        const rouletteWheel = document.getElementById('roulette-wheel');
        const rouletteResult = document.getElementById('roulette-result');
        
        let allMovieLinks = document.querySelectorAll('.movie-card-link'); 
        
        window.selectedLetter = 'all'; // Variable global para el filtro A-Z
        let calendarInstance = null; // Se definirá después

        
        // --- (NUEVA) FUNCIÓN DE RESETEO DE FILTROS ---
        function resetAllFilters(exceptThisElement) {
            if (exceptThisElement !== searchBar) searchBar.value = '';
            if (exceptThisElement !== genreFilter) genreFilter.value = 'all';
            if (exceptThisElement !== authorFilter) authorFilter.value = 'all';
            if (exceptThisElement !== dateFilterInput && calendarInstance) {
                calendarInstance.clear(false); 
            }
            let isAzLink = Array.from(azNavLinks).includes(exceptThisElement);
            
            if (!isAzLink) {
                if (azNav.querySelector('a.active')) {
                    azNav.querySelector('a.active').classList.remove('active');
                }
                azNav.querySelector('[data-letter="all"]').classList.add('active');
                window.selectedLetter = 'all';
            }
        }


        // --- 3b. Función de Filtrado PRINCIPAL (Global) ---
        window.filterAndSearchMovies = function() {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedGenre = decodeURIComponent(genreFilter.value);
            const selectedAuthor = decodeURIComponent(authorFilter.value);
            const selectedDate = dateFilterInput.value; 

            allMovieLinks.forEach(link => {
                const title = link.dataset.title.toLowerCase();
                const genre = link.dataset.genre;
                const author = link.dataset.author;
                const postDate = link.dataset.date; 

                // Lógica de "un solo filtro a la vez"
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

                if (show) {
                    link.style.display = 'block';
                } else {
                    link.style.display = 'none';
                }
            });
        }
        
        // --- 3c. Lógica de la Ruleta (Modal) ---
        function setupRoulette() {
            openRouletteBtn.addEventListener('click', () => {
                rouletteModal.classList.add('visible');
            });
            closeRouletteBtn.addEventListener('click', () => {
                rouletteModal.classList.remove('visible');
            });
            rouletteModal.addEventListener('click', (e) => {
                if(e.target === rouletteModal) { 
                    rouletteModal.classList.remove('visible');
                }
            });

            spinBtn.addEventListener('click', () => {
                spinBtn.disabled = true;
                rouletteWheel.classList.add('spinning');
                rouletteResult.textContent = 'Buscando...';
                
                const oldHighlight = document.querySelector('.movie-card-link.highlight');
                if (oldHighlight) {
                    oldHighlight.classList.remove('highlight');
                }

                resetAllFilters(null);
                window.filterAndSearchMovies();
                
                const visibleMovies = Array.from(allMovieLinks).filter(
                    movie => !movie.classList.contains('is-locked')
                );

                setTimeout(() => {
                    rouletteWheel.classList.remove('spinning');
                    spinBtn.disabled = false;

                    if (visibleMovies.length > 0) {
                        const randomIndex = Math.floor(Math.random() * visibleMovies.length);
                        const chosenMovie = visibleMovies[randomIndex];
                        const movieTitle = chosenMovie.dataset.title;
                        rouletteResult.textContent = `¡Te recomendamos: ${movieTitle}!`;
                        
                        setTimeout(() => {
                            rouletteModal.classList.remove('visible');
                            chosenMovie.classList.add('highlight');
                            chosenMovie.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 1000); 

                    } else {
                        rouletteResult.textContent = 'No hay películas para recomendar.';
                    }
                }, 1500); 
            });
        }

        // --- 3d. Lógica de Carga de Parámetros URL (ACTUALIZADA) ---
        function checkURLForParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const dateFromURL = urlParams.get('date');
            const authorFromURL = decodeURIComponent(urlParams.get('author') || '');
            const letterFromURL = urlParams.get('letter');
            const genreFromURL = decodeURIComponent(urlParams.get('genre') || ''); 
            
            if (letterFromURL) {
                resetAllFilters(azNav.querySelector(`[data-letter="${letterFromURL.toUpperCase()}"]`));
                window.selectedLetter = letterFromURL.toLowerCase();
                if (azNav.querySelector('a.active')) {
                     azNav.querySelector('a.active').classList.remove('active');
                }
                const newActiveLetter = azNav.querySelector(`[data-letter="${letterFromURL.toUpperCase()}"]`);
                if (newActiveLetter) newActiveLetter.classList.add('active');
                
            } else if (authorFromURL) {
                resetAllFilters(authorFilter);
                authorFilter.value = authorFromURL;
                
            } else if (genreFromURL) { 
                resetAllFilters(genreFilter);
                genreFilter.value = genreFromURL;

            } else if (dateFromURL) {
                resetAllFilters(dateFilterInput);
                calendarInstance.setDate(dateFromURL, false); 
            }
            
            window.filterAndSearchMovies();
        }
        
        // --- 3e. Inicialización de todo en Index.html ---
        
        // ¡CAMBIO! Ordenado por fecha (el data-date)
        const sortedLinks = Array.from(allMovieLinks).sort((a, b) => {
            // Orden descendente (más nuevo primero)
            return b.dataset.date.localeCompare(a.dataset.date);
        });
        movieListContainer.innerHTML = ''; 
        sortedLinks.forEach(link => movieListContainer.appendChild(link));
        allMovieLinks = document.querySelectorAll('.movie-card-link'); 
        
        // 2. Activar tarjeta bloqueada
        document.querySelectorAll('.movie-card-link.is-locked').forEach(link => {
            link.addEventListener('click', (e) => e.preventDefault());
        });
        
        // 3. Activar Ruleta
        setupRoulette();
        
        // 4. Activar Filtros Normales (ahora con reset)
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

        // 5. Activar Calendario (Flatpickr)
        calendarInstance = flatpickr(dateFilterInput, {
            dateFormat: "Y-m-d",
            onChange: function(selectedDates, dateStr, instance) {
                resetAllFilters(dateFilterInput); 
                window.filterAndSearchMovies(); 
            },
            onClose: function(selectedDates, dateStr, instance) {
                if (dateStr === '') { 
                    resetAllFilters(null); 
                    window.filterAndSearchMovies();
                }
            }
        });
        
        // 6. Revisar URL para filtros
        checkURLForParams();
    }
    
    
    // --- 4. LÓGICA DE FILTRO PARA PÁGINAS (DETALLE, CONTACTO, ETC.) ---
    
    if (!movieListContainer) { // Si NO estamos en index.html
        const headerFilters = document.querySelector('.header-filters');
        if (headerFilters) {
            
            function redirectToIndex(paramName, paramValue) {
                if(paramValue === 'all' || paramValue === '') { 
                   window.location.href = `/index.html`; // Ruta raíz
                   return;
                }
                const encodedValue = encodeURIComponent(paramValue);
                window.location.href = `/index.html?${paramName}=${encodedValue}`; // Ruta raíz
            }
            
            headerFilters.querySelector('#search-bar').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.value.trim() !== '') {
                   redirectToIndex('search', e.target.value);
                }
            });
            headerFilters.querySelector('#genre-filter').addEventListener('change', (e) => {
                redirectToIndex('genre', e.target.value);
            });
            headerFilters.querySelector('#author-filter').addEventListener('change', (e) => {
                redirectToIndex('author', e.target.value);
            });
            flatpickr(headerFilters.querySelector('#date-filter'), {
                dateFormat: "Y-m-d",
                onChange: function(selectedDates, dateStr, instance) {
                    redirectToIndex('date', dateStr);
                }
            });
        }
    }

    
    // =========================================================================
    // --- 5. LÓGICA DE CONTACTO.HTML (Formulario WhatsApp) ---
    // =========================================================================
    
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // --- ¡IMPORTANTE! ---
            // Reemplaza '522222784581' con tu número de WhatsApp completo
            const tuNumeroDeWhatsApp = '5211234567890'; 
            
            const nombre = document.getElementById('nombre').value;
            const motivo = document.getElementById('motivo').value;
            const mensaje = document.getElementById('mensaje').value;
            
            let texto = `¡Hola! Soy ${nombre}.\n\n`;
            texto += `*Motivo:* ${motivo}\n`;
            texto += `*Mensaje:*\n${mensaje}`;
            
            const textoCodificado = encodeURIComponent(texto);
            
            const urlWhatsApp = `https://wa.me/${tuNumeroDeWhatsApp}?text=${textoCodificado}`;
            
            window.open(urlWhatsApp, '_blank');
        });
    }

});