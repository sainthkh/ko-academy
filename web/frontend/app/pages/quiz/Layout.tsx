'use strict';

import * as React from 'react';
import { Link } from 'react-router'
import * as CSSModules from 'react-css-modules'

import { PageLayout, PageLayoutProps, FetchablePageComponent } from '../common/Page'
import { AuthPage, AccessLevel } from '../common/AuthPage'
import { fetch } from '../../../common/lib/fetch'
import { getToken } from '../../../common/lib/token'

import MainBar from '../common/menu/MainBar'

import { default as Choice, ChoiceStatus }  from './Choice'
import styles from './style.css'

export enum QuestionStatus {
	NORMAL,
	CORRECT,
	WRONG,
}

interface QuizLayoutState {
	chosenAnswer: number
	questionStatus: QuestionStatus
	currentQuestionIndex: number
}

class Layout extends AuthPage<PageLayoutProps, QuizLayoutState> {
	componentWillMount() {
		const { courseSlug, slug } = this.props.params
		this.props.load({ courseSlug, slug })
	}

	protected approved(userLevel:AccessLevel, contentLevel:AccessLevel): JSX.Element {
		if(!this.questions) {
			this.parseQuestions(this.props.content.questions)
		}
		if(this.state.currentQuestionIndex < this.questions.length) {
			return this.renderQuestion()
		} else {
			return this.renderResult(userLevel)
		}
	}

	private renderQuestion() {
		let question = this.currentQuestion()
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="quiz">
						<div styleName="question" dangerouslySetInnerHTML={{__html:question.question}} />
						<div styleName="choices">
							{ question.choices.map((c, index) => {
								return <Choice number={index+1} content={c.content} correctMessage={c.correct} 
									answer={c.answer} status={this.choiceStatus(c)} 
									showMessage={this.state.questionStatus == QuestionStatus.CORRECT} 
									onClick={this.onClickChoice(c.ID)} />
							})}
						</div>
						{this.state.questionStatus == QuestionStatus.WRONG && (
							<div styleName="wrong-message">
								<h2>Hint:</h2>
								<p>{question.choices[this.wrongAnswers[this.wrongAnswers.length - 1]-1].wrong}</p>
							</div>
						)}
						<div styleName="button-wrap">
							{this.state.questionStatus != QuestionStatus.CORRECT && (
								<button styleName="check" onClick={this.onClickCheck}>check answer</button>
							) || (
								<button styleName="next" onClick={this.onClickNext}>go to next</button>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	private renderResult(userLevel) {
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="result">
						<h1>{this.sentence(this.correctCount, this.questions.length)}</h1>
						<h2>Result: {this.correctCount}/{this.questions.length}</h2>
					</div>
					{userLevel <= AccessLevel.FREE && (
						<div styleName="cta">
							<div styleName="message">
								<h1>Join our Gold Plan</h1>
								You can learn Korean faster by solving quizzes. <br/> How about joining our gold membership and getting access to unlimited quizzes?
							</div>
							<div styleName="signup-button-wrap">
								<Link to="/pricing">JOIN NOW</Link>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	private sentence(correct, total) {
		if (correct == total) {
			let s = [
				"Great!",
				"Wonderful!",
				"Terrific!",
			]
			return s[this.randomInt(0, s.length)]
		} else if (correct == total-1 || correct/total > 0.9) {
			let s = [
				"What a pity! It was so close!",
				"You did a good job! You will get the full mark next time",
			]
			return s[this.randomInt(0, s.length)]
		} else if (correct/total > 0.5) {
			let s = [
				"Not bad. You can get better with a few reviews.",
				"Don't be discouraged. You can get better."
			]
			return s[this.randomInt(0, s.length)]
		} else {
			return "How about reviewing now? You can do better than this."
		}
	}

	private randomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min)) + min;
	}

	private onClickChoice(ID) {
		return e => {
			e.preventDefault()

			if(this.wrongAnswers.indexOf(ID) == -1) {
				this.setState({
					chosenAnswer: ID,
				} as QuizLayoutState)
			}
		}
	}

	private onClickCheck(e) {
		e.preventDefault()

		let question = this.currentQuestion()
		const chosenAnswer = this.state.chosenAnswer
		if(chosenAnswer == question.answerID) {
			if(this.state.questionStatus == QuestionStatus.NORMAL) {
				this.correctCount++
			}
			this.setState({
				chosenAnswer: -1,
				questionStatus: QuestionStatus.CORRECT,
			} as QuizLayoutState)
		} else {
			this.setState({
				chosenAnswer,
				questionStatus: QuestionStatus.WRONG,
			}  as QuizLayoutState)
			this.wrongAnswers.push(chosenAnswer)
		}
	}

	private onClickNext(e) {
		e.preventDefault() 

		let question = this.currentQuestion()
		fetch({
			admin: false,
			resource: '/log/quiz',
			token: getToken(),
			method: 'POST',
			args: {
				questionID: question.ID, 
				answers: this.wrongAnswers.length == 0 ? 
					[question.answerID] : this.wrongAnswers,
			}
		})
		this.wrongAnswers = []

		this.setState({
			currentQuestionIndex: ++this.state.currentQuestionIndex,
			questionStatus: QuestionStatus.NORMAL,
		} as QuizLayoutState)
	}

	private choiceStatus(choice) {
		let status = ChoiceStatus.NORMAL
		if (this.state.chosenAnswer == choice.ID) {
			status = ChoiceStatus.SELECTED
		}
		if (this.wrongAnswers.indexOf(choice.ID) > -1) {
			status = ChoiceStatus.WRONG
		}
		if (choice.answer && this.state.questionStatus == QuestionStatus.CORRECT) {
			status = ChoiceStatus.CORRECT
		}

		return status
	}

	private parseQuestions(questions) {
		this.questions = questions.map(question => {
			let answerChoices = question.answerChoices.split('\n')
			let correctMessages = question.correctMessages.split('\n')
			let wrongMessages = question.wrongMessages.split('\n')
			let choices = []
			let answerID = -1
			for(let i = 0; i < answerChoices.length; i++) {
				choices.push({
					ID: i + 1,
					content: answerChoices[i].replace(/^(\*|!)\s*/, ''),
					correct: correctMessages[i].replace(/^\*\s*/, ''),
					wrong: wrongMessages[i].replace(/^\*\s*/, ''),
					answer: answerChoices[i][0] == '!',
				})
				if (answerChoices[i][0] == '!') {
					answerID = i + 1
				}
			}
			return {
				ID: question.ID,
				question: question.question,
				choices: this.shuffle(choices),
				answerID,
			}
		})
	}

	private shuffle(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}

	private currentQuestion() {
		return this.questions[this.state.currentQuestionIndex]
	}

	constructor(props) {
		super(props)

		this.state = {
			chosenAnswer: -1,
			questionStatus: QuestionStatus.NORMAL,
			currentQuestionIndex: 0,
		}

		this.correctCount = 0
		this.chosenAnswers = new Set()
		this.wrongAnswers = []

		this.onClickChoice = this.onClickChoice.bind(this)
		this.onClickNext = this.onClickNext.bind(this)
		this.onClickCheck = this.onClickCheck.bind(this)
	}

	private questions: any
	private correctCount: number
	private chosenAnswers: any
	private wrongAnswers: any
}

export const QuizPage = FetchablePageComponent({
	id: "quiz",
	resource: "/quiz",
})(CSSModules(Layout, styles))