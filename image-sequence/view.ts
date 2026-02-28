import { gsap } from 'gsap';

// Define the options type for the animateSequence function
interface AnimateSequenceOptions {
	target: HTMLImageElement; // The target image element to animate
	frameWidth: number; // The width of each frame in the sequence
	frameHeight: number; // The height of each frame in the sequence
	totalFrames: number; // The total number of frames in the sequence
	cols: number; // The number of columns in the sprite sheet
	rows: number; // The number of rows in the sprite sheet
	duration?: number; // The duration of the animation in seconds (default: 10)
	timelineOptions?: gsap.TimelineVars; // Additional options for the GSAP timeline
}

// Define the return type for the animateSequence function
interface AnimateSequenceResult {
	tl: gsap.core.Timeline; // The GSAP timeline instance
}

/**
 * Asynchronously loads an image from the given source URL.
 *
 * @param {string} src - The source URL of the image to load.
 * @returns {Promise<HTMLImageElement>} A promise that resolves with the loaded image element,
 * or rejects with an error if the image fails to load.
 */
async function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();

		img.onload = () => {
			resolve(img);
		};

		img.onerror = (err) => {
			reject(new Error(`Failed to load image: ${src}. Error: ${err}`));
		};

		img.src = src;
	});
}

/**
 * Animates an image sequence by rendering frames on a canvas element.
 *
 * @async
 * @function animateSequence
 * @param {AnimateSequenceOptions} options - The configuration options for the animation.
 * @returns {Promise<AnimateSequenceResult | false>} A promise that resolves to an object containing the GSAP timeline (`tl`) or `false` if an error occurs. *
 * @throws Will log errors to the console if required parameters are missing or if the image fails to load.
 *
 * @example
 * const animation = await animateSequence({
 *   target: document.querySelector('img'),
 *   frameWidth: 100,
 *   frameHeight: 100,
 *   totalFrames: 30,
 *   cols: 5,
 *   rows: 6,
 *   duration: 5,
 * });
 *
 * if (animation) {
 *   console.log('Animation started:', animation.tl);
 * }
 */
export async function animateSequence({
	target,
	frameWidth,
	frameHeight,
	totalFrames,
	cols,
	rows,
	duration = 10,
	timelineOptions = {
		repeat: -1,
	},
}: AnimateSequenceOptions): Promise<AnimateSequenceResult | false> {
	if (!target) {
		console.error('Target element not found');
		return false;
	}
	if (!frameWidth || !frameHeight) {
		console.error('Frame width and height must be provided');
		return false;
	}
	if (!totalFrames) {
		console.error('Total frames must be provided');
		return false;
	}
	if (!cols || !rows) {
		console.error('Columns and rows must be provided');
		return false;
	}

	target.style.width = `${100 * cols}%`;
	target.style.height = `${100 * rows}%`;

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return false;
	}

	if (target.nextElementSibling?.matches('canvas')) {
		return false;
	}

	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d');

	if (!context) {
		return false;
	}

	// Set canvas size to the size of the image
	canvas.width = frameWidth;
	canvas.height = frameHeight;
	canvas.classList.add('image-sequence__canvas');

	// Load the image
	const image = await loadImage(target.src);

	if (!image) {
		console.error('Failed to load image');
		return false;
	}

	// Set the canvas as the source of the target element
	target.replaceWith(canvas);

	const tl = gsap.timeline({
		onUpdate: () => {
			const frameIndex = Math.floor((tl.time() / duration) * totalFrames) % totalFrames;
			const x = (frameIndex % cols) * frameWidth;
			const y = Math.floor(frameIndex / cols) * frameHeight;

			// Clear the canvas
			context.clearRect(0, 0, canvas.width, canvas.height);

			// Draw the current frame on the canvas
			context.drawImage(image, x, y, frameWidth, frameHeight, 0, 0, frameWidth, frameHeight);
		},
		...timelineOptions,
	});

	const _obj = {
		x: 0,
		y: 0,
	};

	// Sets up frames for the timeline
	for (let i = 0; i < totalFrames; i++) {
		const x = `${(((i % cols) * -frameWidth) / (cols * frameWidth)) * 100}%`;
		const y = `${((Math.floor(i / cols) * -frameHeight) / (rows * frameHeight)) * 100}%`;
		const position = (i / (totalFrames - 1)) * duration;

		tl.set(
			_obj,
			{
				x,
				y,
			},
			position,
		);
	}

	// Create an IntersectionObserver
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				tl.play();
			} else {
				tl.pause();
			}
		});
	});

	// Start observing the element
	if (canvas) {
		observer.observe(canvas);
	}

	return {
		tl,
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

	const sequence = await animateSequence({
		target,
		frameWidth: 640,
		frameHeight: 360,
		totalFrames: 151,
		cols: 12,
		rows: 13,
		duration: 5,
	});

	if (!sequence) {
		return;
	}

	const { tl } = sequence;
	tl.pause();
}

const allImageSequenceBlocks = document.querySelectorAll<HTMLElement>(
	'.wp-block-fueled-image-sequence',
);
allImageSequenceBlocks.forEach(setupImageSequenceBlock);
