<?php

class MJJ_Quizzes_Metaboxes{

	/**
	 *  This is a class which makes metaboxes for a quiz which can have an arbitrary number of questions, each with an arbitrary number of answers. 
	 *  Each answer gets a point value (it's for quizzes of the type "Are you addicted to the colour blue?" ).
	 *  Each quiz is stored in a multidimensional array with the meta_key _mjj_quiz_meta like this:
	 *  (
	 *   [0] => Array
	 *       (
	 *           [the_question] => This is a question?
	 *           [answers] => Array
	 *               (
	 *                   [0] => Array
	 *                       (
	 *                           [answer] => this is an answer
	 *                           [points] => 1001
	 *                       )
	 *               )
	 *       )
	 *   [1] => Array
	 *       (
	 *           [the_question] => And this is a question?
	 *           [answers] => Array
	 *               (
	 *                   [0] => Array
	 *                       (
	 *                           [answer] => this is another answer
	 *                           [points] => 2001
	 *                       )
	 *               )
	 *       )
	 *   [2] => Array
	 *       (
	 *           [the_question] => It is possible this is not a question? Oh it is.
	 *           [answers] => Array
	 *               (
	 *                   [0] => Array
	 *                       (
	 *                           [answer] => third answer
	 *                           [points] => 3001
	 *                       )
	 *                   [1] => Array
	 *                       (
	 *                           [answer] => dogs
	 *                           [points] => 4001
	 *                       )
	 *               )
	 *       )
	 *
	 */

	protected static $instance = null;

	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
		} // end if

		return self::$instance;

	} // end get_instance

	private function __construct(){
		add_action( 'init', array( 'MJJ_Quizzes_Metaboxes', 'add_cmb2_actions' ) );
	}

	public static function add_cmb2_actions(){
		
		if( !class_exists( 'CMB2' ) ){
			
			if ( file_exists( plugins_url() . '/cmb2/init.php' ) ) {
				
				require_once plugins_url() . '/cmb2/init.php';
			
			} elseif ( file_exists( plugins_url() . '/CMB2/init.php' ) ) {
				
				require_once plugins_url() . '/CMB2/init.php';
			}

		}

		add_filter( 'cmb2_render_quiz_answer', array( 'MJJ_Quizzes_Metaboxes', 'cmb2_render_answer_field_callback' ), 10, 5  );
		add_action( 'cmb2_init', array( 'MJJ_Quizzes_Metaboxes', 'register_metaboxes' ) );

		//override the save bit for our quiz meta
		//actually try sanitising it this way then see if it saves: https://github.com/WebDevStudios/CMB2-Snippet-Library/blob/master/custom-field-types/address-field-type.php
		add_filter( 'cmb2_override__mjj_quiz_meta_meta_save', array( 'MJJ_Quizzes_Metaboxes', 'cmb2_save_it_correctly' ), 10, 4 );
	}

	// register the metaboxes the normal way
	public static function register_metaboxes(){

    	$prefix = '_mjj_quiz';

    	// if I have an issue with losing things, look here: https://github.com/WebDevStudios/CMB2/issues/348
    	// it should be go... 

		$quiz_group = new_cmb2_box( array(
		    'id'           => $prefix . 'box',
		    'title'        => __( 'The quiz', 'mjj_quizzes' ),
		    'object_types' => array( 'mjj_quiz', ),
		) );

		// the main repeatable field is Question. 
		$quiz_field_id = $quiz_group->add_field( array(
		    'id'          => $prefix . '_meta',
		    'type'        => 'group',
		    'options'     => array(
		        'group_title'   => __( 'Question {#}', 'mjj_quizzes' ), // {#} gets replaced by row number
		        'add_button'    => __( 'Add another', 'mjj_quizzes' ),
		        'remove_button' => __( 'Remove', 'mjj_quizzes' ),
		        'sortable'      => true, // beta
		    ),
		) );
		
		// Each question has a question field so you can add the text for the question
		$quiz_group->add_group_field( $quiz_field_id, array(
		    'name'       => __( 'Question', 'mjj_quizzes' ),
		    'id'         => 'the_question',
		    'type'       => 'textarea',
		) );

		// Each question can have multiple answers, each with a 
		$quiz_group->add_group_field( $quiz_field_id, array(
		   'name'       => __( 'Answer', 'mjj_quizzes' ),
		    'id'         => 'answers',
		    'type'       => 'quiz_answer',
		    'repeatable' => true
		) );

		// now for the results box
		 
		$results_group = new_cmb2_box( array(
		    'id'           => $prefix . 'results',
		    'title'        => __( 'The results', 'mjj_quizzes' ),
		    'object_types' => array( 'mjj_quiz', ),
		) );

		// these will make the results categories
		$results_field_id = $results_group->add_field( array(
		    'id'          => $prefix . '_results_meta',
		    'type'        => 'group',
		    'options'     => array(
		        'group_title'   => __( 'Results range {#}', 'mjj_quizzes' ), // {#} gets replaced by row number
		        'add_button'    => __( 'Add another result', 'mjj_quizzes' ),
		        'remove_button' => __( 'Remove this result', 'mjj_quizzes' ),
		        'sortable'      => true, // beta
		    ),
		) );

		$results_group->add_group_field( $results_field_id, array(
		    'name'       => __( 'Title', 'mjj_quizzes' ),
		    'id'         => 'results_title',
		    'type'       => 'text'		
		    ) );

		$results_group->add_group_field( $results_field_id, array(
		    'name'       => __( 'Lower bound of results range', 'mjj_quizzes' ),
		    'id'         => 'results_lower_bound',
		    'type'       => 'text_small',
		    'description' => 'This must be a number. It&rsquo;s the lowest value for this results range.'
		) );

		$results_group->add_group_field( $results_field_id, array(
		    'name'       => __( 'Upper bound of results range', 'mjj_quizzes' ),
		    'id'         => 'results_upper_bound',
		    'type'       => 'text_small',
		    'description' => 'This must be a number. It&rsquo;s the highest value for this results range.'
		) );

		$results_group->add_group_field( $results_field_id, array(
		    'name'       => __( 'More information', 'mjj_quizzes' ),
		    'id'         => 'results_info',
		    'type'       => 'textarea'		
		) );
		
		
	}

	public static function cmb2_render_answer_field_callback( $field, $value, $object_id, $object_type, $field_type ) {

		$current_quiz = get_post_meta( $object_id, '_mjj_quiz_meta');

		
		$values = $field_type->field->value;

		$the_answer = ( !empty( $values[ $field_type->iterator ]['answer'] ) ) ? esc_textarea( $values[ $field_type->iterator ]['answer'] ) : '';
		$the_points = ( isset( $values[ $field_type->iterator ]['points'] ) ) ? (float)$values[ $field_type->iterator ]['points']  : '';
		$the_class = ( !empty( $values[ $field_type->iterator ]['class'] ) ) ? esc_attr( $values[ $field_type->iterator ]['class'] )  : '';

		// print_r( $field_type->iterator ); this is the iterator in the 
		//print_r( $values );

    	// make sure we specify each part of the value we need.
    	$value = array(
    	    'answer' => $the_answer,
    	    'points' => $the_points,
    	    'class'  => $the_class 
    	);
	
    	?>
    	<table class="form-table">
    		<tr>
    			<th>
    				<label for="<?php echo $field_type->_id( '_answer' ); ?>">Answer</label>
    			</th>
    			<td>
    			    <?php echo $field_type->input( array(
    			        'name'  => $field_type->_name( '[answer]' ),
    			        'id'    => $field_type->_id( '_answer' ),
    			        'value' => $value['answer'],
    			        'desc'  => '',
    			    ) ); ?>
    			</td>
    		</tr>
    		<tr>
    			<th>
    				<label for="<?php echo $field_type->_id( '_points' ); ?>'">Number of points for this answer</label>
    			</th>
    			<td>
    	    		<?php echo $field_type->input( array(
    	   			    'name'  => $field_type->_name( '[points]' ),
    	   			    'id'    => $field_type->_id( '_points' ),
    	   			    'value' => $value['points'],
    	   			) ); ?>
    	   		</td>
    		</tr>
    		<tr>
    			<th>
    				<label for="<?php echo $field_type->_id( '_class' ); ?>'">Custom class</label>
    			</th>
    			<td>
    	    		<?php echo $field_type->input( array(
    	   			    'name'  => $field_type->_name( '[class]' ),
    	   			    'id'    => $field_type->_id( '_class' ),
    	   			    'value' => $value['class'],
    	   			) ); ?>
    	   		</td>
    		</tr>
    	</table>
	
    	<?php
    	echo $field_type->_desc( true );

	}

	public static function cmb2_save_it_correctly( $override, $a, $args, $the_object ){
		
		if( isset( $_POST['_mjj_quiz_meta' ] ) && !empty( $_POST['_mjj_quiz_meta' ] ) ){

			$save_quiz = array();
			$i = 0;

			$quiz_meta = $_POST['_mjj_quiz_meta' ];

			foreach( $quiz_meta as $meta ){
				
				if( isset( $meta['the_question' ] ) && !empty( $meta['the_question' ] ) ){
					$save_quiz[ $i ]['the_question'] = implode( "\n", array_map( 'sanitize_text_field', explode( "\n", $meta['the_question' ] ) ) );
				}

				if( isset( $meta['answers' ] ) && !empty( $meta['answers' ] ) ){

					$j = 0;

					foreach( (array)$meta['answers' ] as $answer ){

						if( !empty( $answer['answer'] ) ){

							$save_quiz[ $i ]['answers'][ $j ][ 'answer' ] = implode( "\n", array_map( 'sanitize_text_field', explode( "\n", $answer['answer' ] ) ) );
							$save_quiz[ $i ]['answers'][ $j ][ 'points' ] = (int)$answer['points'];
							$save_quiz[ $i ]['answers'][ $j ][ 'class' ] = esc_attr( $answer['class'] );
	
							$j++;
						}
					}
				}

				$i++;
			}

			if( !empty( $save_quiz ) ){
				update_post_meta( $the_object->object_id, '_mjj_quiz_meta', $save_quiz );
			}


			return 'do not save';
		}
		// if _mjj_quiz_meta is not set or is empty, return null to continue normal saving
		return null;
	}
}