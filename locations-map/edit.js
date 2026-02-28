/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { RichText, useBlockProps } from '@wordpress/block-editor';
import { useRef, useEffect } from '@wordpress/element';
import { createSVG } from '../../../assets/js/frontend/components/interactive-locations-map';

/**
 * Edit component.
 * See https://wordpress.org/gutenberg/handbook/designers-developers/developers/block-api/block-edit-save/#edit
 *
 * @param {object}   props                  The block props.
 * @param {object}   props.attributes       Block attributes.
 * @param {string}   props.attributes.title Custom title to be displayed.
 * @param {string}   props.className        Class name for the block.
 * @param {Function} props.setAttributes    Sets the value for block attributes.
 * @returns {Function} Render the edit screen
 */
const InteractiveLocationsMapEdit = (props) => {
	const { attributes, setAttributes } = props;
	const { heading, content } = attributes;
	const blockProps = useBlockProps({
		// 'js' is here because the dropdown styles depend on it.
		className: 'js',
	});
	const mapRef = useRef(null);

	useEffect(() => {
		if (!mapRef.current) {
			return;
		}

		const svg = mapRef.current.querySelector('svg');

		if (svg) {
			return;
		}

		apiFetch({ path: `/armstrong-theme/v1/locations` }).then((data) => {
			const { locations } = data;

			createSVG(mapRef.current, locations);
		});
	});

	return (
		<div {...blockProps}>
			<div className="interactive-locations-map">
				<div className="interactive-locations-map__map" ref={mapRef} />
				<div className="interactive-locations-map__locations" />
				<div className="interactive-locations-map__content-wrap">
					<div className="interactive-locations-map__content">
						<div className="interactive-locations-map__content-inner">
							<RichText
								className="has-lg-font-size"
								tagName="h2"
								placeholder={__('Custom heading...')}
								value={heading}
								onChange={(heading) => setAttributes({ heading })}
							/>
							<RichText
								tagName="p"
								placeholder={__('Custom content...')}
								value={content}
								onChange={(content) => setAttributes({ content })}
							/>
						</div>
						<div className="interactive-locations-map__content-dropdown">
							<div className="dropdown">
								<span className="dropdown__button">
									<span className="dropdown__button-text">
										{__('Select from list', 'armstrong-theme')}
									</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default InteractiveLocationsMapEdit;
