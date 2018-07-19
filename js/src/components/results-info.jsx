var React = require('react');

var ResultsInfo = React.createClass({

	resultsInfoMarkup: function( resultsInfo ){

		resultsInfo = ( typeof( resultsInfo ) === 'undefined' || resultsInfo === '' ) ? 'Something has gone wrong. You are outside the answer range but it isn&rsquo;t your fault, whoever set up the quiz did it. Sorry!' : resultsInfo;
		return {
			__html: resultsInfo
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

module.exports = ResultsInfo;