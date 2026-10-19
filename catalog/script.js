const photos = [
	{ brand: 'Chanel', name: 'Blush & Eyeshadow Collection', src: 'IMG/chanel(1).jpg', alt: 'Chanel makeup compacts with pink blushes and eyeshadows', description: 'Glossy black Chanel compacts open to reveal a collection of soft pink blushes and shimmering eyeshadows. The embossed double-C details and reflective lids turn this rosy makeup edit into a little vanity display.' },
	{ brand: 'Chanel', name: 'Les Beiges Healthy Glow Foundation', src: 'IMG/chanel(2).jpg', alt: 'Chanel Les Beiges Healthy Glow Foundation bottle' },
	{ brand: 'Chanel', name: 'Rouge Allure Lipstick Collection', src: 'IMG/chanel(3).jpg', alt: 'Chanel Rouge Allure lipsticks in several shades' },
	{ brand: 'Dior', name: 'Capture Dreamskin Fresh & Perfect Cushion', src: 'IMG/dior(1).jpg', alt: 'Dior Capture Dreamskin Fresh & Perfect Cushion compact on soft fabric', description: 'Dior Capture Dreamskin Fresh & Perfect Cushion rests on softly gathered satin beside its open compact. The pale pink case, polished gold-tone trim, and clean white applicator make this quiet still life feel especially delicate.' },
	{ brand: 'Dior', name: 'Addict Lipstick Collection', src: 'IMG/dior(2).jpg', alt: 'Dior Addict lipsticks in assorted cases' },
	{ brand: 'Dior', name: 'Backstage Glow Face Palette', src: 'IMG/dior(3).jpg', alt: 'Dior Backstage Glow Face Palette with four shades' },
	{ brand: 'YSL', name: 'Pink Quilted Cushion Compact', src: 'IMG/YSL(1).jpg', alt: 'Two pink quilted Yves Saint Laurent cushion compacts', description: 'Two glossy, quilted pink YSL cushion compacts are held together in a hand, their gold-tone monograms catching the light. Soft blush tones, a ribbon-trimmed sleeve, and playful details give the close-up a sweet, dressed-up feel.' },
	{ brand: 'YSL', name: 'Couture Mini Clutch Eyeshadow Palette', src: 'IMG/YSL(2).jpg', alt: 'Yves Saint Laurent four-shade eyeshadow palette' },
	{ brand: 'YSL', name: 'Makeup Collection', src: 'IMG/YSL(3).jpg', alt: 'Yves Saint Laurent makeup collection including a cushion compact and lipstick' },
];

const grid = document.querySelector('#photo-grid');
const count = document.querySelector('#image-count');
const filterButtons = [...document.querySelectorAll('.filter-button')];
const lightbox = document.querySelector('#lightbox');
const lightboxImage = document.querySelector('#lightbox-image');
const lightboxBrand = document.querySelector('#lightbox-brand');
const lightboxDescription = document.querySelector('#lightbox-description');
const lightboxPosition = document.querySelector('#lightbox-position');
let visiblePhotos = photos;
let currentIndex = 0;
let lastFocusedElement = null;

photos.forEach((photo, index) => {
	const card = document.createElement('article');
	card.className = 'photo-card';
	card.dataset.brand = photo.brand;
	card.innerHTML = `
		<button class="photo-button" type="button" aria-label="View ${photo.brand} ${photo.name}">
			<img src="${photo.src}" alt="${photo.alt}" loading="lazy">
		</button>
		<div class="photo-meta">
			<div class="photo-meta-top">
				<span class="photo-brand">${photo.brand}</span>
				<span class="photo-number">NO. ${String(index + 1).padStart(2, '0')}</span>
			</div>
			<span class="photo-name">${photo.name}</span>
		</div>`;
	card.querySelector('.photo-button').addEventListener('click', () => openLightbox(index));
	grid.append(card);
});

function setFilter(brand) {
	visiblePhotos = brand === 'all' ? photos : photos.filter((photo) => photo.brand === brand);
	document.querySelectorAll('.photo-card').forEach((card) => {
		card.hidden = brand !== 'all' && card.dataset.brand !== brand;
	});
	filterButtons.forEach((button) => {
		const active = button.dataset.filter === brand;
		button.classList.toggle('is-active', active);
		button.setAttribute('aria-pressed', String(active));
	});
	count.innerHTML = `${String(visiblePhotos.length).padStart(2, '0')} <span>PHOTOGRAPHS</span>`;
}

function showPhoto(index) {
	currentIndex = (index + visiblePhotos.length) % visiblePhotos.length;
	const photo = visiblePhotos[currentIndex];
	lightboxImage.src = photo.src;
	lightboxImage.alt = photo.alt;
	lightboxBrand.textContent = `${photo.brand.toUpperCase()} · ${photo.name}`;
	lightboxDescription.textContent = photo.description || '';
	lightboxDescription.hidden = !photo.description;
	lightboxPosition.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(visiblePhotos.length).padStart(2, '0')}`;
}

function openLightbox(photoIndex) {
	lastFocusedElement = document.activeElement;
	const photo = photos[photoIndex];
	visiblePhotos = filterButtons.find((button) => button.classList.contains('is-active')).dataset.filter === 'all'
		? photos
		: photos.filter((item) => item.brand === photo.brand);
	showPhoto(visiblePhotos.indexOf(photo));
	lightbox.hidden = false;
	lightbox.setAttribute('aria-hidden', 'false');
	document.body.style.overflow = 'hidden';
	lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
	lightbox.hidden = true;
	lightbox.setAttribute('aria-hidden', 'true');
	document.body.style.overflow = '';
	lastFocusedElement?.focus();
}

filterButtons.forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.querySelectorAll('.instagram-profile-button').forEach((button) => {
	button.addEventListener('click', () => {
		const description = document.getElementById(button.getAttribute('aria-controls'));
		const expanded = button.getAttribute('aria-expanded') === 'true';
		button.setAttribute('aria-expanded', String(!expanded));
		description.hidden = expanded;
	});
});
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-previous').addEventListener('click', () => showPhoto(currentIndex - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(currentIndex + 1));
lightbox.addEventListener('click', (event) => {
	if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
	if (lightbox.hidden) return;
	if (event.key === 'Escape') closeLightbox();
	if (event.key === 'ArrowLeft') showPhoto(currentIndex - 1);
	if (event.key === 'ArrowRight') showPhoto(currentIndex + 1);
});
