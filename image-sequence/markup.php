<?php
/**
 * fueled markup
 *
 * @package fueled\Blocks\fueled
 *
 * @var array    $attributes         Block attributes.
 * @var string   $content            Block content.
 * @var WP_Block $block              Block instance.
 */

$sprite_map = [
	'shape-1'  => 'Shape_01_Glass_frames',
	'shape-2'  => 'Shape_02_Glass_frames',
	'shape-3'  => 'Shape_03_Glass_frames',
	'shape-4'  => 'Shape_04_Glass_frames',
	'shape-5'  => 'Shape_05_Glass_frames',
	'shape-6'  => 'Shape_06_Glass_frames',
	'shape-7'  => 'Shape_07_Glass_frames',
	'shape-8'  => 'Shape_08_Glass_frames',
	'shape-9'  => 'Shape_09_Glass_frames',
	'shape-10' => 'Shape_10_Glass_frames',
	'shape-11' => 'Shape_11_Glass_frames',
	'shape-12' => 'Shape_12_Glass_frames',
	'shape-13' => 'Shape_13_Glass_frames',
	'shape-14' => 'Shape_14_Glass_frames',
	'shape-15' => 'Shape_15_Glass_frames',
	'shape-16' => 'Shape_16_Glass_frames',
	'shape-17' => 'Shape_17_Glass_frames',
	'shape-18' => 'Shape_18_Glass_frames',
];

$frames      = FUELED_BLOCK_THEME_DIST_URL . 'images/sprites/' . $sprite_map[ $attributes['illustration'] ];
$first_frame = FUELED_BLOCK_THEME_DIST_URL . 'images/sprites/' . $sprite_map[ $attributes['illustration'] ] . '/frame_0001.webp';

$classes = [];

$classes[] = ! empty( $attributes['aspectRatio'] ) ? 'has-aspect-ratio' : '';
$classes[] = ! empty( $attributes['aspectRatio'] ) ? 'has-aspect-ratio--' . str_replace( ' / ', '-', $attributes['aspectRatio'] ) : '';
$classes[] = ! empty( $attributes['blendMode'] ) ? 'has-blend-mode' : '';

$var_blend_mode   = ! empty( $attributes['blendMode'] ) ? $attributes['blendMode'] : 'normal';
$var_aspect_ratio = ! empty( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '16 / 9';

$additional_attributes = [
	'data-wp-interactive' => 'fueled/image-sequence',
	'data-wp-init'        => 'actions.init',
	'class'               => implode( ' ', $classes ),
	'style'               => implode(
		';',
		array_filter(
			[
				'--wp-block-fueled-image-sequence--blend-mode:' . $var_blend_mode,
				'--wp-block-fueled-image-sequence--aspect-ratio:' . $var_aspect_ratio,
			]
		)
	),
	'data-frames' => $frames,
];

?>

<div <?php echo get_block_wrapper_attributes( $additional_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-block-fueled-image-sequence__container wp-block-fueled-image-sequence__container--image">
		<div class="wp-block-fueled-image-sequence__inner image-sequence">
			<img
				src="<?php echo esc_url( $first_frame ); ?>"
				alt=""
				loading="lazy"
				class="wp-block-fueled-image-sequence__image image-sequence__image"
			/>
		</div>
	</div>
</div>
