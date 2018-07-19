var React = require('react');
var TheIndex = require( './the-index.jsx' );
var TheQuestion = require( './the-question.jsx' );
var AllAnswers = require( './all-answers.jsx' );

var QuestionBox = React.createClass({

	componentDidMount: function(){
		jQuery( '#mjj-quiz .question-box.new' ).velocity( 'fadeIn', {duration: 250} ).removeClass( 'new' );
	},

	handleChange: function( numQuestions, changeResults ){

		this.props.handleChange( 
			numQuestions,
			changeResults
		);
	},

	render: function(){

		var theQuiz = this.props.theQuiz;
		var theIndex = this.props.index;

		var oddness = ( this.props.index % 2 === 0 ) ? 'even question-box new' : 'odd question-box new';

		return( 
			<div className={oddness}>
				<TheIndex theIndex={theIndex} quizLength={this.props.quizLength} />
				<TheQuestion theQuestion={theQuiz.the_question} className="mjj_question" />
				<AllAnswers allAnswers={theQuiz.answers} className="all_answers" handleChange={this.handleChange} updata={this.props.updata} />
			</div>
		);
	}

});

module.exports = QuestionBox;