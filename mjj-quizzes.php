<?php
/**
 * Plugin Name: MJJ Quizzes
 * Version: 0.1-alpha
 * Description: A simple plugin using the WP-API and React to make quizzes
 * Author: JJ Jay
 * Text Domain: mjj-quizzes
 * Domain Path: /languages
 * @package mjj-quizzes
 */

require_once( plugin_dir_path( __FILE__ ) . 'class-mjj-quizzes-cpt.php' );
require_once( plugin_dir_path( __FILE__ ) . 'class-mjj-quizzes-metaboxes.php' );
require_once( plugin_dir_path( __FILE__ ) . 'class-mjj-quizzes-api.php' );

MJJ_Quizzes::get_instance();
MJJ_Quizzes_CPT::get_instance();
MJJ_Quizzes_Metaboxes::get_instance();
MJJ_Quizzes_API::get_instance();

class MJJ_Quizzes{

	protected static $instance = null;

	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		} // end if

		return self::$instance;

	} // end get_instance

	private function __construct(){
		add_action( 'wp_enqueue_scripts', array( 'MJJ_Quizzes', 'add_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( 'MJJ_Quizzes', 'add_styles' ) );

		register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
		register_activation_hook( __FILE__, array( 'MJJ_Quizzes', 'mjj_quizzes_flush_rewrites' ) );
	}

	public static function add_styles() {
		
		if( is_singular( 'mjj_quiz' ) ){
			wp_register_style( 'mjj-quiz-styles', plugins_url( 'css/mjj-quizzes.css', __FILE__ ) );
			wp_enqueue_style( 'mjj-quiz-styles' );
		}

	}

	public static function add_scripts() {

		if( is_singular( 'mjj_quiz' ) ){

			$suffix = ( defined('SCRIPT_DEBUG') && SCRIPT_DEBUG ) ? '' : '.min'; //.min

			wp_register_script( 'mjj-quiz-script', plugin_dir_url( __FILE__ ) . 'js/mjj-quizzes' . $suffix . '.js', array(), '0.3.0', true );
			wp_localize_script( 'mjj-quiz-script', 'quiz_object', array( 'ID' => get_the_ID(), 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
			wp_enqueue_script( 'mjj-quiz-script' );

		}

	} // end add_scripts

	public static function mjj_quizzes_flush_rewrites(){
		MJJ_Quizzes_CPT::get_instance();
		flush_rewrite_rules();
	}

}

