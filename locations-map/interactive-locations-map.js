import * as d3 from 'd3';
import { __ } from '@wordpress/i18n';
import us from '../../../json/us-states.geo.json';

const maps = document.querySelectorAll('.interactive-locations-map');
const mq = window.matchMedia('( min-width: 48em )');

/**
 * Sends a location event to the data layer.
 *
 * @param {string} location - The location to be included in the event. Defaults to false if not provided.
 */
const sendLocationEvent = (location) => {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push({
		event: 'find_location',
		page_location: document.referrer,
		location: location || false,
	});
};

/**
 * Get locations grouped by state.
 *
 * @param {Array} locations Array of location objects.
 * @returns {object} Object with states as keys and locations as values.
 */
const getGroupedLocationsByState = (locations) => {
	const states = {};

	// Group locations by state
	locations.forEach((location) => {
		if (!states[location.state_full]) {
			states[location.state_full] = [];
		}

		const { latitude, longitude } = location;

		if (!latitude.length || !longitude.length) {
			return;
		}

		states[location.state_full].push(location);
	});

	// Sort cities within each state in reverse alphabetical order
	const sortedStates = Object.keys(states)
		.sort()
		.reduce((sortedObj, key) => {
			sortedObj[key] = states[key].sort((a, b) => a.city.localeCompare(b.city));
			return sortedObj;
		}, {});

	return sortedStates;
};

/**
 * Creates the SVG map using the D3 library.
 *
 * @param {Node} el The document node to append the SVG to.
 * @param {Array} locations Array of location objects.
 */
export const createSVG = (el, locations) => {
	const width = 960;
	const height = 600;

	// Create a projection for the map
	const projection = d3.geoAlbersUsa().fitSize([width, height], us);

	// Create a path generator
	const path = d3.geoPath().projection(projection);

	// Append the map to the SVG element
	const svg = d3
		.select(el)
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.attr('viewBox', `0 0 ${width} ${height}`)
		.attr('aria-label', __('Interactive map of the United States', 'armstrong-theme'));

	// Create states
	const groupedStates = getGroupedLocationsByState(locations);

	// Create states group
	const statesGroup = svg.append('g').attr('class', 'states');

	// Create states with locations
	// We need to use links here to make the map accessible and make states clickable. Buttons won't work inside the SVG.
	statesGroup
		.selectAll('a')
		.data(
			us.features.filter((feature) => {
				const hasState = Object.keys(groupedStates).includes(feature.properties.name);
				const hasLocations = hasState && groupedStates[feature.properties.name].length;

				return hasLocations && hasState;
			}),
		)
		.enter()
		.append('a')
		.attr('class', 'state')
		.attr('data-state', (feature) => feature.properties.name.toLowerCase().replace(' ', '-'))
		.attr('href', (feature) => `#${feature.properties.name.toLowerCase().replace(' ', '-')}`)
		.attr('aria-label', (feature) => feature.properties.name)
		.append('path')
		.attr('d', path)
		.append('title')
		.text((feature) => feature.properties.name);

	// Create states without locations
	statesGroup
		.selectAll('g')
		.data(
			us.features.filter((feature) => {
				const hasState = Object.keys(groupedStates).includes(feature.properties.name);
				const hasLocations = hasState && groupedStates[feature.properties.name].length;

				return !hasLocations || !hasState;
			}),
		)
		.enter()
		.append('g')
		.attr('class', 'state')
		.attr('data-state', (feature) => feature.properties.name.toLowerCase().replace(' ', '-'))
		.append('path')
		.attr('d', path)
		.append('title')
		.text((feature) => feature.properties.name);

	// Create marker definition
	const markerWidth = 12;
	const markerHeight = 16;
	const marker = svg
		.append('defs')
		.append('symbol')
		.attr('id', 'marker')
		.attr('viewBox', `0 0 ${markerWidth} ${markerHeight}`)
		.attr('width', markerWidth)
		.attr('height', markerHeight);

	marker
		.append('path')
		.attr(
			'd',
			'M.4 5.6C.4 2.504 2.902 0 6 0c3.095 0 5.6 2.504 5.6 5.6C11.6 9.8 6 16 6 16S.4 9.8.4 5.6Z',
		);

	marker.append('path').attr('d', 'M6 7.6a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z').attr('fill', '#fff');

	// Create markers
	svg.append('g')
		.attr('class', 'markers')
		.selectAll('use')
		.data(locations)
		.enter()
		.append('use')
		.attr('xlink:href', '#marker')
		.attr('x', (d) => {
			const coords = projection([d.longitude, d.latitude]);

			// If the coordinates are not found, return 0.
			if (!coords) return 0;

			return coords[0];
		})
		.attr('y', (d) => {
			const coords = projection([d.longitude, d.latitude]);

			// If the coordinates are not found, return 0.
			if (!coords) return 0;

			return coords[1];
		})
		.attr('width', 12)
		.attr('height', 16)
		.attr('transform', `translate(${-markerWidth / 2}, ${-markerHeight})`)
		.attr('class', 'marker');
};

/**
 * Creates locations for the map using the location dialog template.
 *
 * @param {Node} map The map element to use.
 * @param {Array} locations Array of location objects.
 */
const createLocations = (map, locations) => {
	const groupedStates = getGroupedLocationsByState(locations);
	const locationsEl = map.querySelector('.interactive-locations-map__locations');
	const template = document.getElementById('location-template');

	// Since dialogs show all locations in a state, we need to get the locations grouped by state.
	Object.keys(groupedStates).forEach((state) => {
		const clone = template.content.cloneNode(true);
		const locationRoot = clone.querySelector('.location-dialog');
		const locationName = clone.querySelector('[data-key="state"]');
		const locationsList = clone.querySelector('[data-key="cities"]');
		const locationsHeading = clone.querySelector('[data-key="heading"]');
		const locationsNumber = clone.querySelector('[data-key="number"]');

		locationRoot.id = state.toLowerCase().replace(' ', '-');
		locationRoot.setAttribute('data-state', state.toLowerCase().replace(' ', '-'));
		locationRoot.setAttribute('aria-label', `Locations in ${state}`);
		locationName.textContent = state;
		locationsNumber.textContent = groupedStates[state].length;
		locationsHeading.setAttribute(
			'aria-label',
			`${groupedStates[state].length} locations in ${state}`,
		);

		groupedStates[state].forEach((location) => {
			const locationElement = document.createElement('li');
			const locationLink = document.createElement('a');

			locationLink.href = location.href;
			locationLink.textContent = `${location.city}, ${location.state}`;
			locationLink.classList.add('location-link');
			locationLink.setAttribute('data-location', locationLink.textContent.toLowerCase());
			locationElement.appendChild(locationLink);
			locationsList.appendChild(locationElement);
		});

		locationsEl.appendChild(clone);

		const stateLinkElement = map.querySelector(`[data-state="${locationRoot.id}"]`);

		if (groupedStates[state].length) {
			stateLinkElement.classList.add('has-locations');
		}

		if (mq.matches) {
			stateLinkElement.removeAttribute('tabindex');
		}
	});
};

/**
 * Shows the location dialog specified.
 *
 * @param {Node} location The dialog location element to show.
 */
const showLocation = (location) => {
	const { id } = location;
	const map = location.closest('.interactive-locations-map');
	const state = map.querySelector(`[data-state="${id}"]`);

	// Send event to Google Tag Manager.
	sendLocationEvent(id);

	location.addEventListener(
		'transitionend',
		() => {
			location.querySelector('a, button').focus();
		},
		{ once: true },
	);

	location.show();
	location.classList.add('is-active');
	state.classList.add('is-active');
};

/**
 * Close the location dialog specified.
 *
 * @param {Node} location The dialog location element to close.
 * @param {boolean} immediately Whether to close the location immediately.
 * @returns {void}
 */
const closeLocation = (location, immediately) => {
	const { id } = location;
	const map = location.closest('.interactive-locations-map');
	const state = map.querySelector(`[data-state="${id}"]`);

	location.classList.remove('is-active');
	state.classList.remove('is-active');

	if (immediately) {
		location.close();
		return;
	}

	const locationInner = location.querySelector('.location-dialog__inner');

	locationInner.addEventListener(
		'transitionend',
		() => {
			location.close();
		},
		{ once: true },
	);
};

/**
 * Handle the click event on the map states.
 * This will show the location dialog for the state clicked.
 *
 * @param {object} event The event object.
 * @returns {void}
 */
const handleStatesClick = (event) => {
	const state = event.target.closest('.state');

	if (!state) {
		return;
	}

	// Prevent the default link behavior.
	// It actually would link to the location dialog without JS enabled, if it existed.
	event.preventDefault();

	const map = state.closest('.interactive-locations-map');
	const id = state.getAttribute('data-state');
	const locations = map.querySelectorAll('.location-dialog');
	const acitveLocation = map.querySelector(`[id="${id}"]`);

	locations.forEach((location) => {
		if (location !== acitveLocation) {
			closeLocation(location, true);
		} else {
			showLocation(location);
		}
	});
};

/**
 * Handle the keydown event on the location dialog.
 * This will close the dialog if the escape key is pressed.
 * This will also handle tabbing through the dialog.
 *
 * @param {object} event The event object.
 * @returns {void}
 */
const handleLocationKeydown = (event) => {
	const { key, currentTarget, shiftKey } = event;
	const location = currentTarget.closest('.location-dialog');

	// Close the location dialog if the escape key is pressed.
	if (key === 'Escape') {
		closeLocation(location);
	}

	if (key !== 'Tab') {
		return;
	}

	// Create a focus trap for the location dialog.
	const focusable = location.querySelectorAll('a[href], button');
	const { 0: first, [focusable.length - 1]: last } = focusable;
	const { activeElement } = document;

	if (shiftKey && activeElement === first) {
		event.preventDefault();
		last.focus();
	} else if (!shiftKey && activeElement === last) {
		event.preventDefault();
		first.focus();
	}
};

/**
 * Handle the close event on the location dialog.
 * This is the native browser event when the dialog is closed from the form.
 *
 * @param {object} event The event object.
 */
const handleLocationClose = (event) => {
	const { target: location } = event;

	closeLocation(location, true);
};

/**
 * Handle the media query change event.
 */
const handleMediaQueryChange = () => {
	const states = document.querySelectorAll('.state');

	states.forEach((state) => {
		const hasLocations = state.classList.contains('has-locations');

		// We're doing this so that on small screens, keyboard users have parity with pointer users.
		if (mq.matches && hasLocations) {
			state.removeAttribute('tabindex');
		} else {
			state.setAttribute('tabindex', '-1');
		}
	});
};

/**
 * Bind the events for the interactive locations maps.
 */
const bind = () => {
	maps.forEach((map) => {
		const states = map.querySelector('.states');

		states.addEventListener('click', handleStatesClick);
	});

	document.querySelectorAll('.location-dialog').forEach((location) => {
		location.addEventListener('keydown', handleLocationKeydown);
		location.addEventListener('close', handleLocationClose);
	});

	mq.addEventListener('change', handleMediaQueryChange);
};

/**
 * Setup the interactive locations maps.
 */
const setup = () => {
	maps.forEach((map) => {
		const el = map.querySelector('.interactive-locations-map__map');
		const endpoint = `${window._armstrong.rest_api}armstrong-theme/v1/locations`;

		// Fetch the locations data.
		// Doing this for parity with the editor.
		fetch(endpoint)
			.then((res) => res.json())
			.then((data) => {
				const { locations } = data;

				// Create our elements first.
				createSVG(el, locations);
				createLocations(map, locations);

				// Now that they're created, bind the events.
				bind();
			});
	});
};

/**
 * Init.
 *
 * @returns {void}
 */
const init = () => {
	if (!maps.length) {
		return;
	}

	setup();
};

export default init;
