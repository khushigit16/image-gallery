// Image Gallery Script
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const images = galleryItems.map(item => item.querySelector('img'));
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const closeBtn = document.querySelector('.lightbox .close');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const categoryBtns = document.querySelectorAll('.category-btn');
let currentIndex = 0;
let filteredItems = galleryItems;

function showImage(index) {
    const item = filteredItems[index];
    if (!item) return;
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.alt;
    lightbox.classList.add('active');
    currentIndex = index;
}

galleryItems.forEach((item, idx) => {
    item.addEventListener('click', () => {
        filteredItems = getVisibleItems();
        showImage(filteredItems.indexOf(item));
    });
});

function closeLightbox() {
    lightbox.classList.remove('active');
}

closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

function navigateLightbox(direction) {
    filteredItems = getVisibleItems();
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredItems.length - 1;
    if (newIndex >= filteredItems.length) newIndex = 0;
    showImage(newIndex);
}

lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

// Gallery navigation (outside lightbox)
function getVisibleItems() {
    return galleryItems.filter(item => item.style.display !== 'none');
}

function navigateGallery(direction) {
    filteredItems = getVisibleItems();
    if (filteredItems.length === 0) return;
    let visibleIndexes = filteredItems.map(item => galleryItems.indexOf(item));
    let firstVisible = visibleIndexes[0];
    let lastVisible = visibleIndexes[visibleIndexes.length - 1];
    let newIndex = direction > 0 ? lastVisible + 1 : firstVisible - 1;
    if (newIndex < 0) newIndex = galleryItems.length - 1;
    if (newIndex >= galleryItems.length) newIndex = 0;
    galleryItems.forEach(item => item.scrollIntoView({behavior: 'smooth', block: 'nearest'}));
    galleryItems[newIndex].scrollIntoView({behavior: 'smooth', block: 'center'});
    galleryItems[newIndex].classList.add('highlight');
    setTimeout(() => galleryItems[newIndex].classList.remove('highlight'), 600);
}

prevBtn.addEventListener('click', () => navigateGallery(-1));
nextBtn.addEventListener('click', () => navigateGallery(1));

// Category filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.getAttribute('data-category');
        galleryItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Optional: highlight effect for navigation
const style = document.createElement('style');
style.innerHTML = `.gallery-item.highlight { box-shadow: 0 0 0 4px #222, 0 2px 12px rgba(0,0,0,0.08); }`;
document.head.appendChild(style); 