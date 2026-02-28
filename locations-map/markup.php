<?php
/**
 * Example block markup
 *
 * @package ArmstrongTheme\Blocks\Example
 *
 * @var array    $attributes         Block attributes.
 * @var string   $content            Block content.
 * @var WP_Block $block              Block instance.
 * @var array    $context            Block context.
 */

$unique_id = wp_unique_id( 'interactive-locations-map-' );
$locations = \ArmstrongTheme\get_dropdown_locations();

// Add link attributes for tracking.
foreach ( $locations as &$location ) {
	foreach ( $location['items'] as &$item ) {
		$item['link-class'] = 'location-link';

		$item['attrs'] = array(
			'data-location' => strtolower( $item['label'] ),
		);
	}
}

$dropdown_args = array(
	'label' => esc_html__( 'Select from list', 'armstrong-theme' ),
	'items' => $locations,
);

$heading = $attributes['heading'] ?? '';
$content = $attributes['content'] ?? '';

?>
<div <?php echo get_block_wrapper_attributes(); // phpcs:ignore ?>>

	<div class="interactive-locations-map" id="<?php echo esc_attr( $unique_id ); ?>">
		<a href="#<?php echo esc_attr( $unique_id ); ?>-content" class="skip-to-content-link">
			<?php esc_html_e( 'Skip to map content', 'armstrong-theme' ); ?>
		</a>
		<div class="interactive-locations-map__map-wrap">
			<div class="interactive-locations-map__map"></div>
			<div class="interactive-locations-map__locations"></div>
		</div>
		<div class="interactive-locations-map__content-wrap">
			<div class="interactive-locations-map__content" id="<?php echo esc_attr( $unique_id ); ?>-content" tabindex="-1">
				<div class="interactive-locations-map__content-inner">
					<h2 class="has-lg-font-size"><?php echo wp_kses_post( $heading ); ?></h2>
					<p><?php echo wp_kses_post( $content ); ?></p>
				</div>
				<div class="interactive-locations-map__content-dropdown">
					<?php get_template_part( 'partials/dropdown', null, $dropdown_args ); ?>
				</div>
			</div>
		</div>
	</div>

</div>
