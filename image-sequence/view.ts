import { store, getElement } from '@wordpress/interactivity';
import { loadImage } from '../utils';

const { motion } = window;
const { animate } = motion;

// Define the options type for the animateSequence function
interface AnimateSequenceOptions {
	target: HTMLImageElement; // The target image element to animate
}

// Define the return type for the animateSequence function
interface AnimateSequenceResult {
	animation: ReturnType<typeof animate> | false; // The Motion animation instance
}

/**
 * Animates an image sequence by rendering frames on a canvas element.
 *
 * @async
 * @function animateSequence
 * @param {AnimateSequenceOptions} options - The configuration options for the animation.
 * @returns {AnimateSequenceResult | false} A promise that resolves to an object containing the Motion animation object or `false` if an error occurs.
 * @throws Will log errors to the console if required parameters are missing or if the image fails to load.
 */
export function animateSequence({ target }: AnimateSequenceOptions): AnimateSequenceResult | false {
	if (!target) {
		return false;
	}

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return false;
	}

	if (target.nextElementSibling?.matches('canvas')) {
		return false;
	}

	const block = target.closest<HTMLElement>('.wp-block-fueled-image-sequence');

	if (!block) {
		return false;
	}

	const framesDirectory = block.dataset.frames;

	const framesObject = {
		index: 0,
		frameWidth: 640,
		frameHeight: 360,
		totalFrames: 151,
		urls: [] as string[],
	};

	for (let i = 0; i < framesObject.totalFrames; i++) {
		framesObject.urls.push(
			`${framesDirectory}/frame_${(i + 1).toString().padStart(4, '0')}.webp`,
		);
	}

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) {
		return false;
	}

	// Set canvas size to the size of the image
	canvas.width = framesObject.frameWidth;
	canvas.height = framesObject.frameHeight;
	canvas.classList.add('image-sequence__canvas');

	const preloadImages = async () => {
		const images = await Promise.all(framesObject.urls.map(loadImage));
		return images;
	};

	let animation: ReturnType<typeof animate> | false = false;

	const animationObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (!animation) {
				return;
			}

			if (entry.isIntersecting) {
				animation.play();
			} else {
				animation.pause();
			}
		});
	});

	const preloadObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach(async (entry) => {
				if (entry.isIntersecting) {
					// Preload all images for the canvas just before it comes into view
					const images = await preloadImages();

					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(
						images[0],
						0,
						0,
						framesObject.frameWidth,
						framesObject.frameHeight,
					);

					// Replace our static image with the canvas
					target.replaceWith(canvas);

					// Using Motion's animate function instead of GSAP
					animation = animate(
						framesObject,
						{ index: [0, framesObject.totalFrames - 1] },
						{
							duration: 5,
							ease: 'linear',
							repeat: Infinity,
							onUpdate: () => {
								const image = images[Math.round(framesObject.index)];
								context.clearRect(0, 0, canvas.width, canvas.height);
								context.drawImage(
									image,
									0,
									0,
									framesObject.frameWidth,
									framesObject.frameHeight,
								);
							},
						},
					);

					// Start observing the element for play / pause
					animationObserver.observe(block);

					// Stop observing the element for preloading
					preloadObserver.disconnect();
				}
			});
		},
		{
			rootMargin: '100% 0px 100% 0px',
		},
	);

	// Start observing the element
	preloadObserver.observe(block);

	return {
		animation,
	};
}

/**
 * Sets up an instance of the block
 *
 * @param {HTMLElement} block - DOM Node of the block
 * @returns {Promise<void>}
 */
async function setupImageSequenceBlock(block: HTMLElement): Promise<void> {
	const target = block.querySelector<HTMLImageElement>('.wp-block-fueled-image-sequence__image');

	if (!target) {
		return;
	}

	await animateSequence({
		target,
	});
}

store('fueled/image-sequence', {
	actions: {
		init() {
			const { ref } = getElement();
			if (!ref) {
				return;
			}
			setupImageSequenceBlock(ref);
		},
	},
});
