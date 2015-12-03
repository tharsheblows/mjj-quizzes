var React = require('react');

var marked = require( 'marked' );

var VelocityTransitionGroup = require('velocity-react/velocity-transition-group');
var velocityHelpers = require( 'velocity-react/velocity-helpers');

require('velocity-animate');
require('velocity-animate/velocity.ui');

var ResultsLoad = React.createClass({


	componentDidMount: function(){

		var allPointsNodesList = document.querySelectorAll( '#mjj-quiz-questions button.selected' );
		var pointsSum = 0;

		var runOnMount = true;

		for (var i = 0; i < allPointsNodesList.length; ++i) {
			var item = allPointsNodesList[i];
			pointsSum = parseInt( item.getAttribute('data-points'), 10 ) + parseInt( pointsSum, 10 );
		}

		console.log( pointsSum );

		if( this.props.animateResults === 'animate' ){
			this.setState(
				{ points: pointsSum },
				function (){
					this.setState({
						component: 
							<VelocityTransitionGroup enter={{animation: "fadeIn", duration: 500}} leave={{animation: "fadeOut"}} runOnMount={runOnMount}>
								<div><ResultsBox key="ResultsBox" points={ this.state.points } resultsMeta={ this.props.resultsMeta } /></div>
							</VelocityTransitionGroup>,
					});
				});
		}
		else{
			this.setState(
				{ points: pointsSum },
				function (){
					this.setState({
						component: 
							<ResultsBox key="ResultsBox" points={ this.state.points } resultsMeta={ this.props.resultsMeta } />
					});
				}
			);
		}
		
	}, 

	getInitialState: function(){
		return ({ 
			component: <div />,
			points: 0,
		});
	},

	render: function(){
		return(
			this.state.component
		);
	}

});

var ResultsBox = React.createClass({

	render: function(){
		var points = this.props.points;
		var resultsMetas = this.props.resultsMeta;
		var resultMetaToUse = [];

		var runOnMount = true;

		resultsMetas.forEach( function( item, index, array ){
			if( points >= parseInt( item.results_lower_bound, 10 ) && points <= parseInt( item.results_upper_bound, 10 ) ){
				resultMetaToUse = item;
			}
		});
		return(
			<div className="results-box">
				<ResultsInfo points={points} resultMetaToUse={resultMetaToUse} />
			</div>
		);
	}
});

var ResultsInfo = React.createClass({

	resultsInfoMarkup: function( resultsInfo ){

		resultsInfo = ( typeof( resultsInfo ) === 'undefined' || resultsInfo === '' ) ? 'Something has gone wrong. You are outside the answer range but it isn&rsquo;t your fault, whoever set up the quiz did it. Sorry!' : resultsInfo;
		return {
			__html: marked( resultsInfo, {sanitize: true} )
		}
	},

	render: function(){

		var points = this.props.points;
		var resultMetaToUse = this.props.resultMetaToUse;
		var runOnMount = true;

		var Animations = {
			pulse: velocityHelpers.registerEffect({
				defaultDuration: 2000,
    			calls: [
        			[ { backgroundColorAlpha: 0 }, 1]
    			]
			})
		}

		return(
		<div>
			<VelocityTransitionGroup enter={{animation: Animations.pulse}} runOnMount={runOnMount}>
				<h4>Result: {points} points</h4>
			</VelocityTransitionGroup>
				<h3>{resultMetaToUse.results_lower_bound} - {resultMetaToUse.results_upper_bound} {resultMetaToUse.results_title}</h3>
				<div dangerouslySetInnerHTML={ this.resultsInfoMarkup( resultMetaToUse.results_info )} />
		</div>
		);
	}

});

module.exports = ResultsLoad;