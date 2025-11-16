// --- 1. DATOS DE PELÍCULAS REALES ---
// (Aquí es el único lugar donde agregas/editas películas)
const realMovies = [

        {
        id: "mad-max",
        title: "Mad Max",
        url: "/pages/mad-max.html",
        image: "https://m.media-amazon.com/images/I/81JnqdgWM4L._AC_UF894,1000_QL80_.jpg",
        genre: "ficcion",
        genreLabel: "Ciencia Ficción",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-16",
        dateDisplay: "16 nov 2025",
        locked: false
    },
    {
        id: "red-social",
        title: "La Red Social",
        url: "/pages/red-social.html",
        image: "https://m.media-amazon.com/images/M/MV5BY2FjYzQxNmQtOWZiNy00MTZjLWFjNDktMDA0Y2E5YWM0N2UwXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
        genre: "tech",
        genreLabel: "Tecnología",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-15",
        dateDisplay: "15 nov 2025",
        locked: false
    },
    {
        id: "naranja-mecanica",
        title: "La naranja mecánica",
        url: "/pages/naranja-mecanica.html",
        image: "https://www.originalfilmart.com/cdn/shop/files/a_clockwork_orange_1972_linen_x_rated_original_film_art_f_1600x.webp?v=1746466043",
        genre: "ficcion",
        genreLabel: "Ciencia Ficción",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-14",
        dateDisplay: "14 nov 2025",
        locked: false
    },
    {
        id: "furia-titanes",
        title: "Furia de Titanes",
        url: "/pages/furia-titanes.html",
        image: "https://i.pinimg.com/736x/b8/61/59/b861593b15e6143c6763ae673a6513e0.jpg",
        genre: "fantasia",
        genreLabel: "Fantasía",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-13",
        dateDisplay: "13 nov 2025",
        locked: false
    },
    {
        id: "inception",
        title: "Inception (El Origen)",
        url: "/pages/inception.html",
        image: "https://moviepostermexico.com/cdn/shop/products/inception_ver4_xlg_1024x1024@2x.jpg?v=1574871227",
        genre: "ficcion",
        genreLabel: "Ciencia Ficción",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-12",
        dateDisplay: "12 nov 2025",
        locked: false
    },
    {
        id: "laberinto-fauno",
        title: "El laberinto del fauno",
        url: "/pages/laberinto-fauno.html",
        image: "https://image.tmdb.org/t/p/original/taa9P4xmywUufE41RYD88kE9g9X.jpg",
        genre: "fantasia",
        genreLabel: "Fantasía",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-11",
        dateDisplay: "11 nov 2025",
        locked: false
    },
    {
        id: "et",
        title: "E.T., el extraterrestre",
        url: "/pages/et.html",
        image: "https://m.media-amazon.com/images/I/515EK8C6HEL._AC_UF894,1000_QL80_.jpg",
        genre: "ficcion",
        genreLabel: "Ciencia Ficción",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-10",
        dateDisplay: "10 nov 2025",
        locked: false
    },
    {
        id: "gremlins",
        title: "Gremlins",
        url: "/pages/gremlins.html",
        image: "https://m.media-amazon.com/images/I/61yE11TL06L.jpg",
        genre: "fantasia",
        genreLabel: "Fantasía",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-09",
        dateDisplay: "09 nov 2025",
        locked: false
    },
    {
        id: "star-wars",
        title: "Star Wars: Episodio IV - Una Nueva Esperanza",
        url: "/pages/star-wars.html",
        image: "https://m.media-amazon.com/images/I/91uddP3RA5L._AC_UF894,1000_QL80_.jpg",
        genre: "ficcion",
        genreLabel: "Ciencia Ficción",
        author: "amc",
        authorName: "Alberto Martínez",
        dateISO: "2025-11-08",
        dateDisplay: "08 nov 2025",
        locked: false
    }
];

// --- 2. IMÁGENES PARA PLACEHOLDERS ---
// (Estas son las imágenes que se usarán para rellenar)
const placeholderImages = [
    "https://www.originalfilmart.com/cdn/shop/products/avatar_2009_advance_styleC_original_film_art_5000x.webp?v=1671134076",
    "https://www.originalfilmart.com/cdn/shop/products/alien_1979_german_a1_original_film_art_5000x.jpg?v=1613719562",
    "https://m.media-amazon.com/images/I/71PfZFFz9yL.jpg",
    "https://m.media-amazon.com/images/I/41jOy+rrcHL._AC_UF894,1000_QL80_.jpg",
    "https://moviepostermexico.com/cdn/shop/products/shrek_ver3_xxlg_1024x1024@2x.jpg?v=1581215574",
    "https://m.media-amazon.com/images/I/6143TqGItiL._AC_UF894,1000_QL80_.jpg",
    "https://www.originalfilmart.com/cdn/shop/products/gravity_2013_advance_original_film_art_30d74323-6a3b-4901-a3a4-bd946e9c0c45_5000x.jpg?v=1589238161",
    "https://m.media-amazon.com/images/I/A1sc22tugbL._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/71O4PY10pTL._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/91mjR0cmayL.jpg",
    "https://m.media-amazon.com/images/I/71pwYomGC1L._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/61qCgQZyhOL._AC_UF894,1000_QL80_.jpg",
    "https://es.web.img3.acsta.net/r_1280_720/pictures/14/05/07/12/13/408663.jpg",
    "https://m.media-amazon.com/images/I/71zji3aER6L._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/81JnqdgWM4L._AC_UF894,1000_QL80_.jpg",
    "https://m.media-amazon.com/images/I/91XMXQCZwKL.jpg",
    "https://m.media-amazon.com/images/I/61ASebTsLpL._AC_UF894,1000_QL80_.jpg"
];

// --- 3. DATOS DE AUTORES ---
const authorsData = {
    "amc": {
        name: "Alberto Martínez Cruz",
        photo: "https://scontent.fpbc2-4.fna.fbcdn.net/v/t39.30808-6/503295232_3979233205740140_5703252013657337713_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=104&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=FcQMcvfcYxoQ7kNvwGoE_Rq&_nc_oc=Adk0ehJ_BJT56_IbHWOcVJRvsFZ7nlepQCpBQ-EJ6AfImZ4FXqIqt0EAPxtBcPqK_URS7xrQAytvkCGcFY8flgS7&_nc_zt=23&_nc_ht=scontent.fpbc2-4.fna&_nc_gid=k6Uf56IQMdm-6Wi5WXVS9g&oh=00_AfgT13Uk5cuxRogtwS9A3xDBo7OGl7lCfTpGvkKDR8bxrw&oe=691868B0",
        profileUrl: "/index.html?author=amc"
    },
    "one": {
        name: "4lb One",
        photo: "/img/autores/one-placeholder.jpg", // Asegúrate de tener esta imagen
        profileUrl: "/index.html?author=one"
    },
    "1": { // Autor para 'locked'
        name: "🔒",
        photo: "",
        profileUrl: "#"
    }
};

// --- 4. GENERACIÓN DE DATOS GLOBALES (¡AUTOMÁTICO!) ---
// ¡ESTA ES LA CORRECCIÓN!
// Define el número total de tarjetas que quieres en la página de inicio
const TOTAL_CARDS_DESIRED = 25;

// 1. Empezamos con las películas que ya tienes
const moviesData = [...realMovies];

// 2. El script calcula cuántos placeholders faltan para llegar a 25
// (Si ya tienes 25 o más películas reales, esto será 0 o negativo)
const numberOfPlaceholders = TOTAL_CARDS_DESIRED - realMovies.length;

// 3. Genera automáticamente solo los placeholders necesarios
if (numberOfPlaceholders > 0) {
    for (let i = 0; i < numberOfPlaceholders; i++) {

        // Usamos módulo para rotar las imágenes si hay más placeholders que imágenes
        const imgUrl = placeholderImages[i % placeholderImages.length];

        moviesData.push({
            id: `locked-${i}`,
            title: "Próximamente",
            url: "#",
            image: imgUrl,
            genre: "1",
            genreLabel: "🔒",
            author: "1",
            authorName: "🔒",
            dateISO: "2025-10-01", // Fecha vieja para que queden al final
            dateDisplay: "**",
            locked: true
        });
    }
}

// --- 5. FUNCIÓN PARA GENERAR HTML DE 1 TARJETA ---
// CAMBIO AQUÍ: Se añadió 'isNew = false' como parámetro
function generateMovieHTML(movie, isNew = false) {
    if (movie.locked) {
        return `
        <a class="movie-card-link is-locked" data-title="z" data-genre="${movie.genre}" data-author="${movie.author}" data-date="${movie.dateISO}">
            <article class="movie-card">
                <span class="card-badge">🔒</span>
                <img src="${movie.image}" alt="Poster Próximamente" class="movie-poster">
                <div class="movie-card-content">
                    <h3><span>Próximamente</span></h3>
                    <div class="movie-card-meta">
                        <span class="author">🔒</span> | <span class="date">**</span>
                    </div>
                </div>
                <div class="card-lock-overlay">
                    <div class="lock-message">
                        <i class="fas fa-lock"></i>
                        <span>Próximamente</span>
                    </div>
                </div>
            </article>
        </a>`;
    }

    return `
    <a href="${movie.url}" class="movie-card-link" 
       data-title="${movie.title}" 
       data-genre="${movie.genre}" 
       data-author="${movie.author}" 
       data-date="${movie.dateISO}">
        <article class="movie-card">
            
            ${isNew ? '<span class="card-badge-new">NUEVO</span>' : ''} 

            <span class="card-badge">${movie.genreLabel}</span>
            <img src="${movie.image}" alt="Poster ${movie.title}" class="movie-poster">
            <div class="movie-card-content">
                <h3><span>${movie.title}</span></h3>
                <div class="movie-card-meta">
                    <span class="author">${movie.authorName}</span> | <span class="date">${movie.dateDisplay}</span>
                </div>
            </div>
        </article>
    </a>`;
}

// --- 6. FUNCIÓN PARA DIBUJAR TODAS LAS TARJETAS (INDEX O SUGERENCIAS) ---
function renderMovies(containerId, isSuggestionMode = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    const currentPath = window.location.pathname;

    // Ordenamiento: Reales primero (por fecha más reciente), Bloqueadas al final
    const sortedMovies = [...moviesData].sort((a, b) => {
        if (!a.locked && b.locked) return -1;
        if (a.locked && !b.locked) return 1;
        if (!a.locked && !b.locked) {
            return b.dateISO.localeCompare(a.dateISO); // b vs a = Más reciente primero
        }
        return 0;
    });

    // CAMBIO AQUÍ: Se añadió 'index' al forEach
    sortedMovies.forEach((movie, index) => {
        if (isSuggestionMode) {
            if (movie.url.includes(currentPath)) return; // No sugerir la peli actual
            if (movie.locked) return; // No sugerir "Próximamente"
        }
        
        // CAMBIO AQUÍ: Estas 2 líneas son nuevas
        // Define si es la tarjeta "nueva" (la primera, no bloqueada, no sugerencia)
        const isNew = (index === 0 && !movie.locked && !isSuggestionMode);

        // CAMBIO AQUÍ: Se pasa 'isNew' a la función
        container.innerHTML += generateMovieHTML(movie, isNew);
    });

    // Avisa a script.js que las películas ya se dibujaron
    document.dispatchEvent(new Event('moviesRendered'));
}

// --- 7. FUNCIÓN PARA DIBUJAR INFO DE AUTOR/FECHA (PÁGINAS DE DETALLE) ---
function renderMovieMetadata(containerId, movieId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const movie = moviesData.find(m => m.id === movieId);
    if (!movie) return;

    const author = authorsData[movie.author] || authorsData["amc"]; // Fallback

    // Asegúrate de que la URL base es la correcta
    const pageUrlEncoded = encodeURIComponent("https://mi-cine-post.vercel.app" + movie.url);

    container.innerHTML = `
        Subido por
        <a href="${author.profileUrl}" class="author-tooltip-trigger"
            title="Ver todos los posts de ${author.name}">
            <strong>${author.name}</strong>
            <div class="author-tooltip-card">
                <img src="${author.photo}" alt="Foto de ${author.name}">
            </div>
        </a>
        el
        <a href="/index.html?date=${movie.dateISO}" class="date-link" title="Ver todos de esta fecha">
            ${movie.dateDisplay}
        </a>

        <div class="visit-counter-page">
            <img src="https://api.visitorbadge.io/api/visitors?path=${pageUrlEncoded}&countColor=%236a11cb" alt="Contador de visitas" />
        </div>

        <div class="share-buttons">
            <a href="#" id="share-fb" target="_blank" title="Compartir en Facebook"><i class="fab fa-facebook-f"></i></a>
            <a href="#" id="share-x" target="_blank" title="Compartir en X (Twitter)"><i class="fa-brands fa-x-twitter"></i></a>
            <a href="#" id="share-insta" target="_blank" title="Compartir en Instagram"><i class="fab fa-instagram"></i></a>
        </div>
    `;

    // Avisa a script.js que la metadata ya se dibujó
    document.dispatchEvent(new Event('metadataRendered'));
}