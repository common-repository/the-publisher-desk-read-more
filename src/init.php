<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package tpd
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'init', 'tpd_read_more_block_tpd_block_assets' );
function tpd_read_more_block_tpd_block_assets() { // phpcs:ignore

	// Register block styles for both frontend + backend.
	wp_register_style(
		'tpd_read_more_block-tpd-style-css',
		plugins_url( 'dist/blocks.style.build.css', dirname( __FILE__ ) ),
		array(),
		'1.1'
	);

	// Register block editor script for backend.
	wp_register_script(
		'tpd_read_more_block-tpd-block-js',
		plugins_url( '/dist/blocks.build.js', dirname( __FILE__ ) ),
		array( 'wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor' ),
		'1.1',
		true
	);

	// Register block editor styles for backend.
	wp_register_style(
		'tpd_read_more_block-tpd-block-editor-css',
		plugins_url( 'dist/blocks.editor.build.css', dirname( __FILE__ ) ),
		array( 'wp-edit-blocks' ),
		'1.1'
	);

	// WP Localized globals
	wp_localize_script(
		'tpd_read_more_block-tpd-block-js',
		'tpdGlobal',
		[
			'pluginDirPath' => plugin_dir_path( __DIR__ ),
			'pluginDirUrl'  => plugin_dir_url( __DIR__ ),
		]
	);

	/**
	 * Register Gutenberg block on server-side.
	 */
	register_block_type(
		'tpd/block-tpd-read-more-block', array(
			// 'style'         => 'tpd_read_more_block-tpd-style-css', // Enqueue blocks.style.build.css on both frontend & backend.
			'editor_script' => 'tpd_read_more_block-tpd-block-js', // Enqueue blocks.build.js in the editor only.
			'editor_style'  => 'tpd_read_more_block-tpd-block-editor-css', // Enqueue blocks.editor.build.css in the editor only.
			'render_callback' => 'render_read_more_block',
		)
	);
}


function render_read_more_block( $attributes ) {

	$theme = wp_get_theme();
	if ( 'TPD Theme' != $theme->name && 'TPD Theme' != $theme->parent_theme ) {
		$opt = get_option('tpd_read_more_discourage_from_feeds');
		$show_read_more = ( $opt == 1 ) ? 'off' : 'on' ;
	} else {
		$show_read_more = get_theme_mod('tpd_single_read_more_on_feeds', 'off' );
	}

	if ( is_feed() && $show_read_more == "off" ) {
		return;
	}

	$id            = ( isset($attributes['id']) && !empty($attributes['id']) ) ? $attributes['id'] : '' ;
	$title         = ( isset($attributes['title']) && !empty($attributes['title']) ) ? $attributes['title'] : '' ;
	$readMoreText  = ( isset($attributes['readMoreText']) && !empty($attributes['readMoreText']) ) ? $attributes['readMoreText'] : 'Also Read:' ;
	$titleChanged  = ( isset($attributes['titleChanged']) && !empty($attributes['titleChanged']) ) ? $attributes['titleChanged'] : false ;
	$image         = ( isset($attributes['image']) && !empty($attributes['image']) ) ? $attributes['image'] : '' ;
	$link          = ( isset($attributes['link']) && !empty($attributes['link']) ) ? $attributes['link'] : '' ;
	$showThumbnail = ( isset($attributes['showThumbnail']) && empty($attributes['showThumbnail']) ) ? false : true ;
	$img_url       = ( isset($attributes['id']) && !empty($attributes['id']) ) ? get_the_post_thumbnail_url($id, 'thumbnail') : false ;
	$img_alt 	   = ( $titleChanged ) ? $title : get_the_title($id); 
	// Start cached output
	$output = "";
	ob_start();
	?>

	<div class="tpd-read-more-container" style="border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0; padding-top:15px;padding-bottom:15px; display:flex;margin-bottom:1.5em;margin-top:1.5em;">
		<?php if( $showThumbnail && $img_url && $link && !is_feed() ): ?>
			<?php echo "<a class='tpd-read-more-image' aria-label='".esc_attr($img_alt)."' style='display: block;position: relative;padding-bottom: 78.75px;height: 0;min-width:140px;overflow: hidden;' href='" . $link . "'>"; ?>
				<img src="<?php echo $img_url; ?>" alt="<?php echo esc_attr($img_alt); ?>" style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;-o-object-fit: cover;object-fit: cover;" />
			<?php echo "</a>"; ?>
		<?php endif; ?>
		<div class="tpd-read-more-headline" style="padding-left:20px;padding-right:20px;font-size:0.9em;">
			<strong style="color:#fe0000;font-size:1.2em;"><?php echo $readMoreText; ?></strong><br>
			<?php if ( $titleChanged ): ?>
				<?php echo "<a href='" . $link . "' aria-label='".esc_attr($title)."'>" . $title . "</a>"; ?>
				<?php else: ?>
					<?php echo "<a href='" . $link . "' aria-label='".esc_attr(get_the_title($id))."'>" . get_the_title($id) . "</a>"; ?>
			<?php endif; ?>
		</div>
	</div>

	<?php
	// End cached output
	$output = ob_get_contents();
	ob_end_clean();

	return $output;

}

/**
 * Add Featured Image to Rest API
 * https://medium.com/@dalenguyen/how-to-get-featured-image-from-wordpress-rest-api-5e023b9896c6
 */
add_action('rest_api_init', 'tpd_read_more_posts_register_rest_images' );
function tpd_read_more_posts_register_rest_images() {
	register_rest_field( array('post'),
			'thumbnail',
			array(
					'get_callback'    => 'tpd_read_more_get_rest_featured_image_thumb',
					'update_callback' => null,
					'schema'          => null,
			)
	);
}
function tpd_read_more_get_rest_featured_image_thumb( $object, $field_name, $request ) {
	if( $object['featured_media'] ){
			$img = wp_get_attachment_image_src( $object['featured_media'], 'thumbnail' );
			return $img[0];
	}
	return false;
}


/**
 * Add TPD Setting option to show/hide on feeds
 */
add_filter('tpd_admin_settings', 'tpd_add_readmore_settings');
function tpd_add_readmore_settings( $settings )
{
	$settings['templates']['settings']['tpd_single_read_more_on_feeds'] = array(
		'default' => 'off',
		'transport' => 'refresh',
		'control' => array(
			'control_class' => 'WP_Customize_Control',
			'type' => 'checkbox',
			'section' => 'tpd_template_single_targeting_group',
			'label' => __( 'Show Read More on feeds' ),
			'description' => __( '' ),
			'settings' => 'tpd_single_read_more_on_feeds'
		),
	);
	return $settings;
}


/**
 * If no TPD Theme then add option tp show/hide on feeds
 */
add_action( 'admin_menu', 'tpd_reading_admin_page_add_field' ); // CallBack Function
function tpd_reading_admin_page_add_field() {
	$theme = wp_get_theme();
	if ( 'TPD Theme' != $theme->name && 'TPD Theme' != $theme->parent_theme ) {
		register_setting( 'reading', 'tpd_read_more_discourage_from_feeds' );	
		add_settings_field( 
				'field_id-to-add', 
				'Read More Block visibility', 
				'tpd_read_more_checkbox_cb', //Function to Call
				'reading', 
				'default', 
				array( 
						'id' => 'field_id-to-add', 
						'option_name' => 'tpd_read_more_discourage_from_feeds'
				)
		);
	}	
}

function tpd_read_more_checkbox_cb( $val ) {
	$id = $val['id'];
	$option_name = $val['option_name'];
	?>
	<input 
			type="checkbox"
			name="<?php echo esc_attr( $option_name ) ?>"
			id="<?php echo esc_attr( $id ) ?>"
			value="1"
			<?php checked(1, get_option( $option_name ), true); ?> 
	/> <label for="<?php echo esc_attr( $id ) ?>">Discourage feeds from showing the block "Read More"</label>
	<?php
}