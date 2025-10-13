document.addEventListener('DOMContentLoaded', () => {
    // --- PENGATURAN DATA LOKASI ---
    let DESTINATIONS = [];

    // KITA AKAN MENGGUNAKAN VARIABEL 'GEOJSON_PATH_PREFIX' DARI HTML
    const geojsonFiles = [
        'LokasiWisataAlamBandung.json',
        'LokasiWisataBudayaBandung.json',
        'LokasiWisataKulinerBandung.json',
        'LokasiWisataRekreasiBandung.json'
    ];

    const searchInput = document.getElementById('search');
    const searchResults = document.getElementById('searchResults');
    const mapIframe = document.getElementById('mapIframe');

    // --- FUNGSI UTAMA UNTUK MEMUAT DATA & MENJALANKAN PENCARIAN ---
    async function initializeSearch() {
        // Cek apakah variabel path sudah didefinisikan oleh HTML
        if (typeof GEOJSON_PATH_PREFIX === 'undefined') {
            console.error("Variabel GEOJSON_PATH_PREFIX belum diatur di file HTML!");
            return;
        }

        try {
            const promises = geojsonFiles.map(file => 
                fetch(GEOJSON_PATH_PREFIX + file).then(response => {
                    if (!response.ok) throw new Error(`Gagal memuat file: ${file}`);
                    return response.json();
                })
            );
            const allGeojsonData = await Promise.all(promises);

            let allDestinations = [];
            allGeojsonData.forEach(geojson => {
                const features = geojson.features.map(feature => ({
                    name: feature.properties.Nama,
                    lat: feature.geometry.coordinates[1],
                    lon: feature.geometry.coordinates[0],
                    category: feature.properties.Kategori || 'Lainnya',
                    district: feature.properties.Kecamatan || 'Tidak diketahui'
                }));
                allDestinations = allDestinations.concat(features);
            });

            DESTINATIONS = allDestinations;
            console.log(`${DESTINATIONS.length} destinasi Bandung berhasil dimuat!`);

            attachSearchListeners();

        } catch (error) {
            console.error("Gagal memuat atau memproses data destinasi:", error);
        }
    }

    // --- FUNGSI UNTUK MENGATUR EVENT LISTENER ---
    function attachSearchListeners() {
        if (!searchInput || !searchResults || !mapIframe) {
            console.warn("Salah satu elemen penting (searchInput, searchResults, mapIframe) tidak ditemukan.");
            return;
        }

        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            if (query.length === 0) {
                searchResults.classList.add('hidden');
                return;
            }
            const filtered = DESTINATIONS.filter(dest =>
                dest.name.toLowerCase().includes(query) ||
                dest.district.toLowerCase().includes(query)
            );
            if (filtered.length > 0) {
                searchResults.innerHTML = filtered.map(dest => `
                    <div class="search-item" 
                         data-name="${dest.name}" 
                         data-lat="${dest.lat}" 
                         data-lon="${dest.lon}">
                        <div class="font-semibold">${dest.name}</div>
                        <div class="text-xs opacity-70">${dest.district} - <span class="category">${dest.category}</span></div>
                    </div>
                `).join('');
                searchResults.classList.remove('hidden');
            } else {
                searchResults.innerHTML = `<div class="search-item" style="text-align: center; cursor: default;">Tidak ada hasil ditemukan.</div>`;
                searchResults.classList.remove('hidden');
            }
        });

        searchResults.addEventListener('click', (e) => {
            const item = e.target.closest('.search-item');
            if (!item || !item.dataset.name) return;

            const name = item.dataset.name;
            const lat = item.dataset.lat;
            const lon = item.dataset.lon;
            
            // Tentukan path ke routingAll.html berdasarkan lokasi file saat ini
            const isSubfolder = window.location.pathname.includes('/HTML/');
            const routingPagePath = isSubfolder ? './routingAll.html' : './HTML/routingAll.html';

            const url = `${routingPagePath}?dest_lat=${lat}&dest_lon=${lon}&dest_name=${encodeURIComponent(name)}`;
            window.location.href = url;
        });
    }

    document.addEventListener('click', (e) => {
        if (searchInput && searchResults && !searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    initializeSearch();
});