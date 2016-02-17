var React = require('react');

var Remarkable = require( 'remarkable' );
var md = new Remarkable({linkify: true});

var ResultsLoad = React.createClass({


	componentDidMount: function(){

		var allPointsNodesList = document.querySelectorAll( '#mjj-quiz-questions button.selected' );
		var pointsSum = 0;

		for (var i = 0; i < allPointsNodesList.length; ++i) {
			var item = allPointsNodesList[i];
			pointsSum = parseInt( item.getAttribute('data-points'), 10 ) + parseInt( pointsSum, 10 );
		}

		this.setState(
			{ points: pointsSum },
			function (){
				this.setState({
					component: 
						<ResultsBox key="ResultsBox" points={ this.state.points } resultsMeta={ this.props.resultsMeta } animateResults={ this.props.animateResults } />
				});
			}
		);
		
	}, 

	getInitialState: function(){
		var initial_class = 'results-box-box';
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

	componentDidMount: function(){
		jQuery( '#mjj-quiz .results-box.animate' ).velocity( 'fadeIn', {duration: 250} );
	},

	render: function(){
		var points = this.props.points;
		var resultsMetas = this.props.resultsMeta;
		var resultMetaToUse = [];
		var animate = 'dont-animate ';

		if( this.props.animateResults === 'animate' ){
			animate = 'animate ';
		}


		resultsMetas.forEach( function( item, index, array ){
			if( points >= parseInt( item.results_lower_bound, 10 ) && points <= parseInt( item.results_upper_bound, 10 ) ){
				resultMetaToUse = item;
			}
		});

		var resultsClass = 'results-box ' + animate + resultMetaToUse.results_class;

		return(
			<div className={resultsClass}>
				<ResultsInfo points={points} resultMetaToUse={resultMetaToUse} />
			</div>
		);
	}
});

var ResultsInfo = React.createClass({

	resultsInfoMarkup: function( resultsInfo ){

		resultsInfo = ( typeof( resultsInfo ) === 'undefined' || resultsInfo === '' ) ? 'Something has gone wrong. You are outside the answer range but it isn&rsquo;t your fault, whoever set up the quiz did it. Sorry!' : resultsInfo;
		return {
			__html: md.render( resultsInfo )
		}
	},

	render: function(){

		var points = this.props.points;
		var resultMetaToUse = this.props.resultMetaToUse;

		return(
		<div>
				<h3 className="results-points">Result: {points} points</h3>
				<h3 className="results-range">{resultMetaToUse.results_lower_bound} - {resultMetaToUse.results_upper_bound} {resultMetaToUse.results_title}</h3>
				<div dangerouslySetInnerHTML={ this.resultsInfoMarkup( resultMetaToUse.results_info )} />
		</div>
		);
	}

});

module.exports = ResultsLoad;