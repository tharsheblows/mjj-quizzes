var React = require('react');
var ResultsInfo = require( './results-info.jsx' );

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

module.exports = ResultsBox;