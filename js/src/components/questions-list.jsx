var React = require('react');
var QuestionBox = require( './question-box.jsx' );
var ResultsLoad = require( './results-box.jsx' );


var QuestionsList = React.createClass({

	// this is only checked in development mode
	// https://facebook.github.io/react/docs/reusable-components.html
	propTypes: {
	},

	getInitialState: function(){
		return{
			numQuestions: 1,
			changeResults: 1
		}
	},

	// this is what handles watching for the changes in the child elements. numQuestions and changeResults will bubble up and we use them here
	handleChange: function( numQuestions, changeResults ){
		this.setState({
			numQuestions: numQuestions,
			changeResults: changeResults
		});
	},

	render: function(){
		// for help see https://jsfiddle.net/reactjs/yun1vgqb/light/
		
		var questions = []; // this will be the list of individual questions
		var results = [];

		var data = this.props.data;
		var the_quiz = data._mjj_quiz_meta;
		var the_quiz_length;
		var the_results = data._mjj_quiz_results_meta;

		if( the_quiz ){
			the_quiz_length = the_quiz.length;
		}

		// this is the data we will pass through all of our components to correctly update QuestionsList
		var updata = {
			changeResults: this.state.changeResults,
			numQuestions: this.state.numQuestions
		}

		// I only want to animate the first results load. I'll keep track of it here as this is the parent for all the elements which affect it
		var animateResults = ( this.state.changeResults === the_quiz_length + 1 ) ? 'animate' : 'dont-animate';

		// how many questions should be showing? We're doing them one at a time
		var questionsToShow = ( this.state.numQuestions < the_quiz_length ) ? this.state.numQuestions : the_quiz_length;
		
		for( var ii = 0; ii < questionsToShow; ii++ ){
			questions.push(
				<QuestionBox index={ii} key={ii} theQuiz={the_quiz[ii]} quizLength={the_quiz_length} updata={updata} handleChange={this.handleChange} />
			);
		}

		// we want to show the results after all of the questions have been answered
		if( this.state.numQuestions > the_quiz_length && this.state.changeResults > the_quiz_length ){
			results.push(
				// the key is this.state.changeResults which, when changed, causes it to re-render key={this.state.changeResults}
				<ResultsLoad key={this.state.changeResults} resultsMeta={the_results} animateResults={ animateResults } id="results"/>
			);
		}

		return(
			<div className="questions-list" id="mjj-quiz-questions">
					{questions}
					{results}
			</div>
		);
	}

});

module.exports = QuestionsList;