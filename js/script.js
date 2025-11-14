document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // --- 1. LLAMADAS DE RENDERIZADO (AL CARGAR) ---
    // =========================================================================
    
    // Revisa si las funciones de movies.js están listas
    const hasRenderFunction = typeof renderMovies === 'function';
    const hasMetaRenderFunction = typeof renderMovieMetadata === 'function';

    // CASO A: Estamos en el Index
    const mainList = document.getElementById('movie-list');
    if (mainList && hasRenderFunction) {
        renderMovies('movie-list', false); // false = modo normal (todas)
    }

    // CASO B: Estamos en una página de Detalle (Sugerencias)
    const suggestions = document.querySelector('.suggestions-carousel');
    if (suggestions && hasRenderFunction) {
        if (!suggestions.id) suggestions.id = 'suggestions-container-gen';
        renderMovies(suggestions.id, true); // true = modo sugerencias
    }

    // CASO C: Estamos en página de Detalle (Info de Autor/Fecha)
    const metaContainer = document.getElementById('movie-meta-container');
    if (metaContainer && hasMetaRenderFunction) {
        const movieId = metaContainer.dataset.id;
        renderMovieMetadata('movie-meta-container', movieId);
    }

    // =========================================================================
    // --- 2. SELECCIÓN DE ELEMENTOS (POST-RENDERIZADO) ---
    // =========================================================================
    
    // Espera a que el evento 'moviesRendered' se dispare para activar clics
    document.addEventListener('moviesRendered', () => {
        // Activar bloqueo de click en tarjetas 'locked'
        document.querySelectorAll('.movie-card-link.is-locked').forEach(link => {
            link.addEventListener('click', (e) => e.preventDefault());
        });
    });


    // =========================================================================
    // --- 3. LÓGICA DE DETALLE.HTML (ESTRELLAS, CARRUSEL, SHARE) ---
    // =========================================================================
    
    const carousels = document.querySelectorAll('.carousel');
    const starRatingContainer = document.querySelector('.star-rating');
    
    function setupShareButtons() {
        const shareFb = document.getElementById('share-fb');
        const shareX = document.getElementById('share-x');
        const shareInsta = document.getElementById('share-insta'); 
        
        if (!shareFb) return; 
        
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        
        shareFb.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        shareX.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        shareInsta.href = 'https://www.instagram.com/cine.post.tis/'; // Enlace a tu perfil
    }

    // Escucha el evento que disparamos en movies.js
    document.addEventListener('metadataRendered', setupShareButtons);

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

            function moveCarousel() {
                if (totalItems > 1) { 
                    inner.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
            }
            function autoAdvance() {
                currentIndex = (currentIndex + 1) % totalItems;
                moveCarousel();
            }
            function resetInterval() {
                clearInterval(autoSlideInterval); 
                if (totalItems > 1) {
                    autoSlideInterval = setInterval(autoAdvance, intervalTime);
                }
            }

            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % totalItems;
                moveCarousel();
                resetInterval(); 
            });
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + totalItems) % totalItems;
                moveCarousel();
                resetInterval(); 
            });
            resetInterval(); 
        });
    }

    if (starRatingContainer) {
        // ... (Tu lógica de estrellas va aquí, no necesita cambios) ...
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
            if (count > 0) avgRating = score / count;
            
            if(avgDisplay) avgDisplay.textContent = `${avgRating.toFixed(1)} estrellas (${count} votos)`;
            fillStars(Math.round(avgRating));

            if (hasVoted) {
                starRatingContainer.classList.add('voted');
                if(savedMsg) {
                    savedMsg.textContent = '¡Gracias por tu voto!';
                    savedMsg.style.opacity = '1';
                }
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
                localStorage.setItem(scoreKey, score + rating);
                localStorage.setItem(countKey, count + 1);
                localStorage.setItem(votedKey, 'true');
                loadSavedRating();
            });
        });
        loadSavedRating(); 
    }


    // =========================================================================
    // --- 4. LÓGICA DE FILTRO A-Z ---
    // =========================================================================
    
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


    // =========================================================================
    // --- 5. LÓGICA PRINCIPAL DE INDEX (FILTROS Y RULETA) ---
    // =========================================================================
    
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
        
        window.selectedLetter = 'all'; 
        let calendarInstance = null; 

        function resetAllFilters(exceptThisElement) {
            if (exceptThisElement !== searchBar) searchBar.value = '';
            if (exceptThisElement !== genreFilter) genreFilter.value = 'all';
            if (exceptThisElement !== authorFilter) authorFilter.value = 'all';
            if (exceptThisElement !== dateFilterInput && calendarInstance) {
                calendarInstance.clear(false); 
            }
            
            const isAzLink = azNav && Array.from(azNav.querySelectorAll('a')).includes(exceptThisElement);
            if (!isAzLink && azNav) {
                if (azNav.querySelector('a.active')) azNav.querySelector('a.active').classList.remove('active');
                const allLink = azNav.querySelector('[data-letter="all"]');
                if(allLink) allLink.classList.add('active');
                window.selectedLetter = 'all';
            }
        }

        window.filterAndSearchMovies = function() {
            const searchTerm = searchBar.value.toLowerCase();
            const selectedGenre = decodeURIComponent(genreFilter.value);
            const selectedAuthor = decodeURIComponent(authorFilter.value);
            const selectedDate = dateFilterInput.value; 
            
            // Re-selecciona las tarjetas por si acaso
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
        
        function setupRoulette() {
            if(!openRouletteBtn) return;
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
                    movie => !movie.classList.contains('is-locked')
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

        function checkURLForParams() {
            const urlParams = new URLSearchParams(window.location.search);
            const dateFromURL = urlParams.get('date');
            const authorFromURL = decodeURIComponent(urlParams.get('author') || '');
            const letterFromURL = urlParams.get('letter');
            const genreFromURL = decodeURIComponent(urlParams.get('genre') || ''); 
            
            if (letterFromURL) {
                resetAllFilters(azNav.querySelector(`[data-letter="${letterFromURL.toUpperCase()}"]`));
                window.selectedLetter = letterFromURL.toLowerCase();
                if (azNav.querySelector('a.active')) azNav.querySelector('a.active').classList.remove('active');
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
                if(calendarInstance) calendarInstance.setDate(dateFromURL, false); 
            }
            
            window.filterAndSearchMovies();
        }
        
        // Inicializar componentes del Index
        setupRoulette();
        
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
        
        // Espera a que las películas se dibujen antes de checar la URL
        document.addEventListener('moviesRendered', checkURLForParams);
    }
    
    // =========================================================================
    // --- 6. LÓGICA PARA REDIRECCIÓN DESDE SUBPÁGINAS ---
    // =========================================================================
    
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

    // =========================================================================
    // --- 7. LÓGICA DE CONTACTO.HTML ---
    // =========================================================================
    
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