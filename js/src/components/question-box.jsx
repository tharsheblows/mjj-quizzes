var React = require('react');
var marked = require('marked');


var QuestionBox = React.createClass({


	handleChange: function( numQuestions, changeResults ){

		this.props.handleChange( 
			numQuestions,
			changeResults
		);
	},

	render: function(){

		var theQuiz = this.props.theQuiz;
		var theIndex = this.props.index;

		var oddness = ( this.props.index % 2 === 0 ) ? 'even' : 'odd';

		return( 
			<div className={oddness}>
				<TheQuestion theIndex={theIndex} theQuestion={theQuiz.the_question} className="mjj_question" />
				<AllAnswers allAnswers={theQuiz.answers} className="all_answers" handleChange={this.handleChange} updata={this.props.updata} />
			</div>
		);
	}

});

var TheQuestion = React.createClass({

	render: function(){

		var theIndex = this.props.theIndex + 1;
		var theQuestion = this.props.theQuestion;

		var theQuestionMarkedIndexed = {
			__html: theIndex + '. ' + marked( theQuestion, {sanitize: true} )
		};

		return( 
			<div className="the-question" dangerouslySetInnerHTML={theQuestionMarkedIndexed} />
		);
	}

});

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
		var answer = answerInfo.answer;
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
			<button className={answerClass} key={selected} data-points={points} onClick={ this.handleChange }>{answer}</button>
		);
	}

});


module.exports = QuestionBox;