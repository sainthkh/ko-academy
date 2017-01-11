'use strict';

import * as React from 'react';
import { EditorLayout, EditorLayoutProps } from './common/Editor'
import { FetchableComponent } from '../../common/lib/fetch'

export interface LayoutProps extends EditorLayoutProps {

}

class PageLayout extends EditorLayout<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = 'question-form'
	}

	main() {
		const { ID, question, answerChoices, correctMessages, wrongMessages } = this.props.content
		return (
			<div className="wrap">
				<form className="wide-form" name={this.formName} action="POST" onSubmit={this.submit}>
					{this.title(this.update, 'Question', `ID-${ID}`)}
					<input type="hidden" name="ID" value={ID} />
					<div className="form-group">
						<label>Question</label>
						<textarea name="question" className="form-field" rows={5}>{question}</textarea>
					</div>
					<div className="form-group">
						<label>Answer Choices</label>
						<textarea name="answerChoices" className="form-field" rows={5}>{answerChoices}</textarea>
					</div>
					<div className="form-group">
						<label>Correct Messages</label>
						<textarea name="correctMessages" className="form-field" rows={5}>{correctMessages}</textarea>
					</div>
					<div className="form-group">
						<label>Wrong Messages</label>
						<textarea name="wrongMessages" className="form-field" rows={5}>{wrongMessages}</textarea>
					</div>
					{this.props.waiting && (<div>Now saving question...</div>)}
					{this.props.succeeded && (<div>Question saved</div>)}
					{this.props.failed && (<div>Save failed. Maybe slug problem.</div>)}
					<div className="button-wrap">
						<button type="submit" className="submit-button">Save</button>
					</div>
				</form>
			</div>
		);
	}
}

export const QuestionPage = FetchableComponent({
	admin: true,
	id: "question",
	resource: "/question",
})(PageLayout)