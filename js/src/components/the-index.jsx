var React = require('react');

var TheIndex = React.createClass({

	render: function(){

		var theIndex = this.props.theIndex + 1;
		var questionXofY = theIndex + ' of ' + this.props.quizLength + ': ';
		
		return(
			<div className="the-index">{questionXofY}</div>
		);
	}

});

module.exports = TheIndex;