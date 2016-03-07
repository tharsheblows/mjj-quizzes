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

		register_rest_field(
			'mjj_quiz',
			'_mjj_quiz_meta_info',
			array(
        	    'get_callback'    => array( 'MJJ_Quizzes_API', 'get_quiz_meta_info'),
			)
		);

		register_rest_field( 
			'mjj_quiz', // the cpt or object type
        	'_mjj_quiz_meta', // $field_name in callback function
       		array(
        	    'get_callback'    => array( 'MJJ_Quizzes_API', 'get_quiz_meta'),
        	)
        );

        register_rest_field(
        	'mjj_quiz',
        	'_mjj_quiz_results_meta',
        	array(
        	    'get_callback'    => array( 'MJJ_Quizzes_API', 'get_quiz_results_meta'),
        	)
        );
	}

	public static function get_quiz_meta_info( $object, $field_name, $request ){

		$quiz_meta_info = get_post_meta( $object['id'], $field_name, true );

		return sanitize_text_field( $quiz_meta_info );

	}

	public static function get_quiz_meta( $object, $field_name, $request ){

		$quiz_meta_array = get_post_meta( $object[ 'id' ], $field_name );
		$parsedown = new Parsedown();
		$esc_quiz_meta_array = array();

		if( empty( $quiz_meta_array ) || !is_array( $quiz_meta_array[0] ) ){
			return $esc_quiz_meta_array; // this is a quiz page without a quiz
		}

		foreach( $quiz_meta_array[0] as $quiz_meta ){

			foreach( $quiz_meta as $key => $value ){
	
				if( $key === 'the_question' ){
					$esc_quiz_meta[ 'the_question' ] =  ( !empty( $value ) ) ? wpautop( wp_kses( $parsedown->text( $value ), MJJ_Quizzes::$allowed_html ) ) : '';
				}
	
				if( $key === 'answers' ){
					$i = 0;
					$esc_quiz_meta[ 'answers' ] = array();

					foreach( $value as $answer ){
						$esc_quiz_meta[ 'answers' ][$i][ 'answer' ] =  ( !empty( $answer['answer'] ) ) ? wpautop( wp_kses( $parsedown->text( $answer['answer' ] ), MJJ_Quizzes::$allowed_html ) ) : '';
						$esc_quiz_meta[ 'answers' ][$i][ 'points' ] = ( !empty( $answer['points'] ) ) ? (float)$answer['points'] : 0;
						$esc_quiz_meta[ 'answers' ][$i][ 'class' ] = ( !empty( $answer['class'] ) ) ? esc_attr( $answer['class'] ) : '';

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
		$esc_quiz_meta_array = array();
		$parsedown = new Parsedown();

		if( empty( $quiz_results_meta_array ) || !is_array( $quiz_results_meta_array[0] ) ){
			return $esc_quiz_meta_array; // this is a quiz page without a quiz
		}

		foreach( $quiz_results_meta_array[0] as $quiz_results_meta ){

			foreach( $quiz_results_meta as $key => $value ){
				if( $key === 'results_lower_bound' || $key === 'results_upper_bound' ){
					$esc_quiz_meta[ $key ] = (float)$value;
				}
				elseif( $key === 'results_info' ){
					$esc_quiz_meta[ $key ] = wpautop( wp_kses( $parsedown->text( $value ),  MJJ_Quizzes::$allowed_html ) );
				}
				elseif( $key === 'results_title' ){
					$esc_quiz_meta[ $key ] = sanitize_text_field( $value );
				}
				else{
					$esc_quiz_meta[ $key ] = esc_attr( $value );
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