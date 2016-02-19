var React = require('react');
var ReactDOM = require( 'react-dom' );

var QuizInfo = require( './quiz-info.jsx' );


var Router = React.createClass({

	// I'm taking this from https://facebook.github.io/react/tips/initial-ajax.html
	componentDidMount: function(){

		var quizUrl = '/wp-json/wp/v2/mjj-quizzes-api/' + quiz_object.ID;

		var self = this;

		self.serverRequest = jQuery.get( quizUrl, function( data ){

			if( data._mjj_quiz_meta != null && data._mjj_quiz_meta.length > 0 ){
				self.setState({ component: <QuizInfo data={ data } bodyClass="single-quiz" /> });
			}
		});
	}, 

	getInitialState: function(){
		return ({ component: <div /> });
	},

	render: function() {
		return( this.state.component );
	}

});


module.exports = Router;
