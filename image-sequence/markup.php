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
	'shape-1'  => 'Shape_01_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-2'  => 'Shape_02_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-3'  => 'Shape_03_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-4'  => 'Shape_04_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-5'  => 'Shape_05_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-6'  => 'Shape_06_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-7'  => 'Shape_07_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-8'  => 'Shape_08_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-9'  => 'Shape_09_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-10' => 'Shape_10_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-11' => 'Shape_11_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-12' => 'Shape_12_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-13' => 'Shape_13_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-14' => 'Shape_14_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-15' => 'Shape_15_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-16' => 'Shape_16_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-17' => 'Shape_17_Glass_sprite_f-151_c-12_r-13.webp',
	'shape-18' => 'Shape_18_Glass_sprite_f-151_c-12_r-13.webp',
];

$url = FUELED_BLOCK_THEME_DIST_URL . 'images/sprites/' . $sprite_map[ $attributes['illustration'] ];

$classes = [];

$classes[] = ! empty( $attributes['aspectRatio'] ) ? 'has-aspect-ratio' : '';
$classes[] = ! empty( $attributes['aspectRatio'] ) ? 'has-aspect-ratio--' . str_replace( ' / ', '-', $attributes['aspectRatio'] ) : '';
$classes[] = ! empty( $attributes['blendMode'] ) ? 'has-blend-mode' : '';

$var_blend_mode   = ! empty( $attributes['blendMode'] ) ? $attributes['blendMode'] : 'normal';
$var_aspect_ratio = ! empty( $attributes['aspectRatio'] ) ? $attributes['aspectRatio'] : '16 / 9';

$additional_attributes = [
	'class' => implode( ' ', $classes ),
	'style' => implode(
		';',
		array_filter(
			[
				'--wp-block-fueled-image-sequence--blend-mode:' . $var_blend_mode,
				'--wp-block-fueled-image-sequence--aspect-ratio:' . $var_aspect_ratio,
			]
		)
	),
];

?>

<div <?php echo get_block_wrapper_attributes( $additional_attributes ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="wp-block-fueled-image-sequence__container wp-block-fueled-image-sequence__container--image">
		<div class="wp-block-fueled-image-sequence__inner image-sequence">
			<img
				src="<?php echo esc_url( $url ); ?>"
				alt=""
				loading="lazy"
				class="wp-block-fueled-image-sequence__image image-sequence__image"
			/>
		</div>
	</div>
</div>
