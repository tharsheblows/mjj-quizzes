var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var marked = require( 'marked' );

var ResultsLoad = React.createClass({


	componentDidMount: function(){

		var allPointsNodesList = document.querySelectorAll( '#mjj-quiz-questions button.selected' );
		var points = 0;

		for (var i = 0; i < allPointsNodesList.length; ++i) {
			var item = allPointsNodesList[i];
			points = parseInt( item.getAttribute('data-points'), 10 ) + parseInt( points, 10 );
			console.log( points );
		}

		this.setState({ component: <ResultsBox changeResults={ this.props.changeResults } points={ points } resultsMeta={ this.props.resultsMeta } /> });
	}, 

	getInitialState: function(){
		return ({ component: <div /> });
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

		resultsMetas.forEach( function( item, index, array ){
			if( points > item.results_lower_bound && points <= item.results_upper_bound ){
				resultMetaToUse = item;
			}

		});

		return(
			<div className="results-box" key={points} changeResults={ this.props.changeResults } >
					<ResultsInfo point={points} key={points } resultMetaToUse={resultMetaToUse}  />
			</div>
		);
	}
});

var ResultsInfo = React.createClass({

	resultsInfoMarkup: function( resultsInfo ){
		return {
			__html: marked( resultsInfo, {sanitize: true} )
		}
	},

	render: function(){

		var points = this.props.points;
		var resultMetaToUse = this.props.resultMetaToUse;

		return(
			<div>
				<h4>Result: {points} points</h4>
				<h3>{resultMetaToUse.results_lower_bound} - {resultMetaToUse.results_upper_bound} {resultMetaToUse.results_title}</h3>
				<div dangerouslySetInnerHTML={ this.resultsInfoMarkup( resultMetaToUse.results_info )} />
			</div>
		);
	}

});

module.exports = ResultsLoad;