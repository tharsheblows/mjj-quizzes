var React = require('react');
var QuestionsList = require( './questions-list.jsx' );

var QuizInfo = React.createClass({

	render: function(){

		var metaInfo = this.props.data._mjj_quiz_meta_info;

		return(
			<div>
				<p className="meta-info">
					Time required: {metaInfo}<br />
				</p>
				<QuestionsList {...this.props} bodyClass="single-quiz" /> 
			</div>
		);
	}
});

module.exports = QuizInfo;