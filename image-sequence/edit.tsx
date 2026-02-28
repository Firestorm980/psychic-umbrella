import React from 'react';
import { clsx } from 'clsx';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';

const IMAGE_MAP = {
	'shape-1': 'Shape_01_Glass_frames',
	'shape-2': 'Shape_02_Glass_frames',
	'shape-3': 'Shape_03_Glass_frames',
	'shape-4': 'Shape_04_Glass_frames',
	'shape-5': 'Shape_05_Glass_frames',
	'shape-6': 'Shape_06_Glass_frames',
	'shape-7': 'Shape_07_Glass_frames',
	'shape-8': 'Shape_08_Glass_frames',
	'shape-9': 'Shape_09_Glass_frames',
	'shape-10': 'Shape_10_Glass_frames',
	'shape-11': 'Shape_11_Glass_frames',
	'shape-12': 'Shape_12_Glass_frames',
	'shape-13': 'Shape_13_Glass_frames',
	'shape-14': 'Shape_14_Glass_frames',
	'shape-15': 'Shape_15_Glass_frames',
	'shape-16': 'Shape_16_Glass_frames',
	'shape-17': 'Shape_17_Glass_frames',
	'shape-18': 'Shape_18_Glass_frames',
};

export const BlockEdit = (props) => {
	const { attributes, setAttributes } = props;
	const { illustration, aspectRatio, blendMode } = attributes;
	const blockProps = useBlockProps({
		className: clsx('wp-block-fueled-image-sequence', {
			[`has-aspect-ratio has-aspect-ratio--${aspectRatio}`]: aspectRatio !== '16 / 9',
			[`has-blend-mode`]: blendMode !== 'normal',
		}),
		style: {
			'--wp-block-fueled-image-sequence--aspect-ratio': aspectRatio,
			'--wp-block-fueled-image-sequence--blend-mode': blendMode,
		},
	});
	const { template_uri } = select('core').getCurrentTheme();
	const url = `${template_uri}/dist/images/sprites/${IMAGE_MAP[illustration]}/frame_0001.webp`;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Settings', 'fueled')}>
					<SelectControl
						label={__('Illustration', 'fueled')}
						value={illustration}
						onChange={(illustration) => setAttributes({ illustration })}
						options={Object.keys(IMAGE_MAP).map((key) => ({
							label: (key.charAt(0).toUpperCase() + key.slice(1)).replace(/-/g, ' '),
							value: key,
						}))}
						help={__('Select the illustration to display.', 'fueled')}
					/>
					<SelectControl
						label={__('Aspect Ratio', 'fueled')}
						value={aspectRatio}
						onChange={(aspectRatio) => setAttributes({ aspectRatio })}
						options={[
							{ label: '16:9', value: '16 / 9' },
							{ label: '4:3', value: '4 / 3' },
							{ label: '1:1', value: '1' },
						]}
						help={__(
							'Select the aspect ratio for the image. Can be useful in certain situations with cards. Will crop the image accordingly.',
							'fueled',
						)}
					/>
					<SelectControl
						label={__('Blend Mode', 'fueled')}
						value={blendMode}
						onChange={(blendMode) => setAttributes({ blendMode })}
						options={[
							{ label: 'Normal', value: 'normal' },
							{ label: 'Multiply', value: 'multiply' },
							{ label: 'Screen', value: 'screen' },
							{ label: 'Overlay', value: 'overlay' },
							{ label: 'Darken', value: 'darken' },
							{ label: 'Lighten', value: 'lighten' },
							{ label: 'Luminosity', value: 'luminosity' },
						]}
						help={__(
							'Select the blend mode for the image. Useful if overlaying with backgrounds.',
							'fueled',
						)}
					/>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				<div className="wp-block-fueled-image-sequence__container wp-block-fueled-image-sequence__container--image">
					<div className="wp-block-fueled-image-sequence__inner image-sequence">
						<img
							loading="lazy"
							src={url}
							alt=""
							className="wp-block-fueled-image-sequence__image image-sequence__image"
						/>
					</div>
				</div>
			</div>
		</>
	);
};
