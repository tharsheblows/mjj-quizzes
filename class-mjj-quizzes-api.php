<?php

class MJJ_Quizzes_API{

	protected static $instance = null;

	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		} // end if

		return self::$instance;

	} // end get_instance

	private function __construct(){
		add_action( 'rest_api_init', array( 'MJJ_Quizzes_API', 'register_quiz_meta' ) );
	}

	public static function register_quiz_meta(){

		register_api_field( 
			'mjj_quiz',
        	'_mjj_quiz_meta',
       		array(
        	    'get_callback'    => array( 'MJJ_Quizzes_API', 'get_quiz_meta'),
        	    'update_callback' => null,
        	    'schema'          => null,
        	)
        );

        register_api_field(
        	'mjj_quiz',
        	'_mjj_quiz_results_meta',
        	array(
        	    'get_callback'    => array( 'MJJ_Quizzes_API', 'get_quiz_results_meta'),
        	    'update_callback' => null,
        	    'schema'          => null,
        	)
        );
	}

	public static function get_quiz_meta( $object, $field_name, $request ){

		$quiz_meta_array = get_post_meta( $object[ 'id' ], $field_name );

		foreach( $quiz_meta_array[0] as $quiz_meta ){

			foreach( $quiz_meta as $key => $value ){
	
				if( $key === 'the_question' ){
					$esc_quiz_meta[ 'the_question' ] =implode( "\n", array_map( 'sanitize_text_field', explode( "\n", $value ) ) );
				}
	
				if( $key === 'answers' ){
					$i = 0;
					$esc_quiz_meta[ 'answers' ] = array();

					foreach( $value as $answer ){
						$esc_quiz_meta[ 'answers' ][$i][ 'answer' ] = implode( "\n", array_map( 'sanitize_text_field', explode( "\n", $answer['answer' ] ) ) );
						$esc_quiz_meta[ 'answers' ][$i][ 'points' ] = (float)$answer['points'];
						$esc_quiz_meta[ 'answers' ][$i][ 'class' ] = esc_attr( $answer['class'] );

						$i++;
					}
				}

			}

			$esc_quiz_meta_array[] = $esc_quiz_meta;
		}


		return $esc_quiz_meta_array;
	}

	public static function get_quiz_results_meta( $object, $field_name, $request ){

		$quiz_results_meta_array = get_post_meta( $object[ 'id' ], '_mjj_quiz_results_meta' );

		foreach( $quiz_results_meta_array[0] as $quiz_results_meta ){

			foreach( $quiz_results_meta as $key => $value ){
				if( $key === 'results_lower_bound' || $key === 'results_upper_bound' ){
					$esc_quiz_meta[ $key ] = (float)$value;
				}
				else{
					$esc_quiz_meta[ $key ] = implode( "\n", array_map( 'sanitize_text_field', explode( "\n", $value ) ) );
				}
			}
			// because cmb2 seems to not save 0
			if( ! isset( $quiz_results_meta['results_lower_bound'] ) ){
				$esc_quiz_meta['results_lower_bound'] = 0;
			}

			$esc_quiz_meta_array[] = $esc_quiz_meta;
		}


		return $esc_quiz_meta_array;
	}
}