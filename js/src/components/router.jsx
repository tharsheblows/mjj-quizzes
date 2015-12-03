var React = require('react');
var ReactDOM = require( 'react-dom' );
var page = require( 'page' );
var request = require( 'superagent' );

var QuestionsList = require( './questions-list.jsx' );


var Router = React.createClass({

	// I'm taking this from https://github.com/Automattic/Picard/blob/master/components/router/router.jsx even though I fully appreciate I've been warned
	componentDidMount: function(){

		var self = this;

		page( '/quizzes/:slug', function ( ctx ){

			var data,
				slug = ctx.params.slug,
				url = "/wp-json/wp/v2/mjj-quizzes-api/";

			request
				.get( url + quiz_object.ID )
				.end( function( error, response ){
					var data = JSON.parse( response.text );
					self.setState({ component: <QuestionsList data={ data } bodyClass="single-quiz" /> });
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
