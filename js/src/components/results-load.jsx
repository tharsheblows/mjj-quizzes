var React = require('react');
var ResultsBox = require( './results-box.jsx' );

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

module.exports = ResultsLoad;