var React = require('react');
var ReactDOM = require( 'react-dom' );
var page = require( 'page' );
var request = require( 'superagent' );

var QuizInfo = require( './questions-list.jsx' );


var Router = React.createClass({

	// I'm taking this from https://github.com/Automattic/Picard/blob/master/components/router/router.jsx even though I fully appreciate I've been warned
	componentDidMount: function(){

		var self = this;

		var pathArray = window.location.pathname.split('/');

		var quizIndex = pathArray.indexOf( 'quizzes' );

		if( quizIndex === -1 ){
			return;
		}

		var currentSlug = pathArray[ quizIndex + 1 ];

		if( currentSlug === -1 ){
			return;
		}

		// history.redirect( '/', '/quizzes/' );
		// page.base( '/quizzes' );

		page( '/quizzes/:slug', function ( ctx ){

			var data,
				slug = ctx.params.slug,
				url = "/wp-json/wp/v2/mjj-quizzes-api/";

			if( slug !== currentSlug ){
				// I can't imagine this is the best way to do this but we need to be able to get to the other quizzes
				window.location.href = '/quizzes/' + slug;
			}


			request
				.get( url + quiz_object.ID )
				.end( function( error, response ){
					var data = JSON.parse( response.text );
					self.setState({ component: <QuizInfo data={ data } bodyClass="single-quiz" /> });
			});

		});

		page.start();

	}, 

	getInitialState: function(){
		return ({ component: <div /> });
	},

	render: function() {
		return( this.state.component );
	}

});


module.exports = Router;
