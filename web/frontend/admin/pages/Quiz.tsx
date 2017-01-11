'use strict';

import * as React from 'react';
import { EditorLayout, EditorLayoutProps } from './common/Editor'
import { FetchableComponent } from '../../common/lib/fetch'

export interface LayoutProps extends EditorLayoutProps {

}

class PageLayout extends EditorLayout<LayoutProps, {}> {
	constructor(props) {
		super(props)
		this.formName = 'quiz-form'
	}

	main() {
		const { ID, title, slug, courseSlug, quizIDs, accessLevel } = this.props.content
		return (
			<div className="wrap">
				<form className="wide-form" name={this.formName} action="POST" onSubmit={this.submit}>
					{this.title(this.update, 'Quiz', title)}
					<input type="hidden" name="ID" value={ID} />
					<div className="form-group">
						<label>Title</label>
						<input type="text" className="form-field" name="title" defaultValue={title} placeholder="title" />
					</div>
					<div className="form-group">
						<label>Slug</label>
						<input type="text" className="form-field" name="slug" defaultValue={slug} placeholder="slug" />
					</div>
					<div className="form-group">
						<label>Course Slug</label>
						<input type="text" className="form-field" name="courseSlug" defaultValue={courseSlug} placeholder="course slug" />
					</div>
					<div className="form-group">
						<label>Quiz IDs</label>
						<input type="text" className="form-field" name="quizIDs" defaultValue={quizIDs} placeholder="quiz IDs" />
					</div>
					<div className="form-group">
						<label>AccessLevel</label>
						<input type="text" className="form-field" name="accessLevel" defaultValue={accessLevel} placeholder="access level" />
					</div>
					{this.props.waiting && (<div>Now saving quiz...</div>)}
					{this.props.succeeded && (<div>Quiz saved</div>)}
					{this.props.failed && (<div>Save failed. Maybe slug problem.</div>)}
					<div className="button-wrap">
						<button type="submit" className="submit-button">Save</button>
					</div>
				</form>
			</div>
		);
	}
}

export const QuizPage = FetchableComponent({
	admin: true,
	id: "quiz",
	resource: "/quiz",
})(PageLayout)