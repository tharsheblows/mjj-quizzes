var React = require('react');
var ReactDOM = require( 'react-dom' );
var VelocityTransitionGroup = require('velocity-react/velocity-transition-group');

var QuestionBox = require( './question-box.jsx' );
var ResultsLoad = require( './results.jsx' );

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
		var the_quiz_length = the_quiz.length;
		var the_results = data._mjj_quiz_results_meta;

		var animateResults = ( this.state.changeResults === the_quiz_length + 1 ) ? 'animate' : 'dont-animate';

		// I need this because I can't pass a boolean true through jsx so it has to be in a variable
		var runOnMount = true;

		// this is the data we will pass through all of our components to correctly update QuestionsList
		var updata = {
			changeResults: this.state.changeResults,
			numQuestions: this.state.numQuestions
		}

		// how many questions should be showing? We're doing them one at a time
		var questionsToShow = ( this.state.numQuestions < the_quiz_length ) ? this.state.numQuestions : the_quiz_length;
		
		for( var ii = 0; ii < questionsToShow; ii++ ){
			questions.push(
				<QuestionBox index={ii} key={ii} theQuiz={the_quiz[ii]} updata={updata} handleChange={this.handleChange} />
			);
		}

		// we want to show the results after all of the questions have been answered
		if( this.state.numQuestions > the_quiz_length && this.state.changeResults > the_quiz_length ){
			results.push(
				// the key is this.state.changeResults which, when changed, causes it to re-render key={this.state.changeResults}
				<ResultsLoad key={this.state.changeResults} resultsMeta={the_results} id="results" animateResults={animateResults} />
			);
		}

		return(
			<div className="questions-list" id="mjj-quiz-questions">
				<VelocityTransitionGroup enter={{animation: "fadeIn", duration: 250}} leave={{animation: "fadeOut"}} runOnMount={runOnMount}>
					{questions}
				</VelocityTransitionGroup>
					{results}
			</div>
		);
	}

});

module.exports = QuestionsList;