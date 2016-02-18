var React = require('react');

var AnAnswer = React.createClass({

	handleChange: function(){

		this.props.handleChange( 
			1, // we'll let theAnswers decide what to do, let's just let it know there's been a click here
			1, // we'll let theAnswers decide what to do, let's just let it know there's been a click here
			this.props.index // this sets the selected state
		);
	},

	render: function(){

		var answerInfo = this.props.answerInfo;
		var answer = {
			__html: answerInfo.answer
		}
		var points = answerInfo.points;
		var theClass = (answerInfo.class !== '' ) ? ' ' + answerInfo.class : '' ;

		var selected;

		if( this.props.clicks !== 0 ){
			selected = ( this.props.isSelected === 'yes' ) ? 'selected' : 'not-selected';
		}
		else{
			selected = '';
		}

		var answerClass = selected + theClass;

		return( 
			<button className={answerClass} key={selected} data-points={points} onClick={ this.handleChange } dangerouslySetInnerHTML={answer}></button>
		);
	}

});

module.exports = AnAnswer;