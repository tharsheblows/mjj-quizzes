var React = require('react');

var TheQuestion = React.createClass({

	render: function(){

		var theQuestion = {
			__html: this.props.theQuestion
		}

		return( 
			<div className="the-question" dangerouslySetInnerHTML={ theQuestion } />
		);
	}

});

module.exports = TheQuestion;