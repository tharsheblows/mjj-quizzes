<?php 

class MJJ_Quizzes_CPT{

	protected static $instance = null;

	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		} // end if

		return self::$instance;

	} // end get_instance

	private function __construct(){
		add_action( 'init', array( 'MJJ_Quizzes_CPT', 'create_post_types' ) );
		add_filter( 'the_content', array( 'MJJ_Quizzes_CPT', 'add_div' ) );
	}

	public static function create_post_types(){
		register_post_type( 'mjj_quiz',
			array(
				'labels' => array(
					'name' => __( 'MJJ_Quizzes' ),
					'singular_name' => __( 'Quiz' ),
					'add_new' => 'Add New',
					'add_new_item' => 'Add New Quiz',
					'edit_item' => 'Edit Quiz',
					'new_item' => 'New Quiz',
				    'all_items' => 'All Quizzes',
					'view_item' => 'View Quizzes',
					'search_items' => 'Search Quiz',
					'not_found' =>  'No Quizzes found',
					'not_found_in_trash' => 'No Quizzes found in Trash',
					'parent_item_colon' => '',
					'menu_name' => 'Quizzes'
				),
				'supports' => array('title', 'editor', 'thumbnail' ),
				'public' => true,
				'hierarchical' => false,
				'has_archive' => true,
				'rewrite' => array('slug' => 'quizzes'),
				'menu_position' => 5,
				'show_in_rest'       => true,
        		'rest_base'          => 'mjj-quizzes-api',
        		'rest_controller_class' => 'WP_REST_Posts_Controller',
			)
		);
	}

	public static function add_div( $content ){
		
		if( is_singular( 'mjj_quiz' )  ){
			$content .= '<div id="mjj-quiz"></div>';
		}

		return $content;
	}
}