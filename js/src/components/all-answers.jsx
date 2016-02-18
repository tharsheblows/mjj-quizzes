var React = require('react');
var AnAnswer = require( './an-answer.jsx' );

var AllAnswers = React.createClass({

	getInitialState: function(){
		return{
			chosen: false,
			clicks: 0
		}
	},

	handleChange: function( numQuestions, changeResults, chosenId ){

		this.setState( {
			clicks: this.state.clicks + 1
		} );

		numQuestions = ( this.state.clicks === 0 ) ? this.props.updata.numQuestions + 1 : this.props.updata.numQuestions;
		changeResults = this.props.updata.changeResults + 1;

		this.props.handleChange( 
			numQuestions,
			changeResults
		);

		this.setState({
			chosen: chosenId
		});

	},

	render: function(){

		var allAnswers = this.props.allAnswers;
		var answers = [];

		var handleChange = this.handleChange;
		var changeChosen = this.changeChosen;
		var chosen = this.state.chosen;
		var clicks = this.state.clicks;

		allAnswers.forEach( function( item, index, array ){

			var isSelected = ( index === chosen ) ? 'yes' : 'no';

			answers.push(
				<AnAnswer key={index} index={index} isSelected={isSelected} clicks={clicks} handleChange={handleChange} answerInfo={item} />
			);
		});

		return( 
				<div className="answer-list">{answers}</div>
		);
	}

});

module.exports = AllAnswers;