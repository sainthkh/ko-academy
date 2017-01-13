'use strict';

import * as React from 'react';
import * as CSSModules from 'react-css-modules'

import MainBar from '../common/menu/MainBar'

import { default as Choice, ChoiceStatus }  from './Choice'
import styles from './style.css'

class Layout extends React.Component<{}, {}> {
	render() {
		return (
			<div>
				<MainBar />
				<div className="wrap">
					<div styleName="quiz">
						<div styleName="question">
							What is the most similar sound of the character below?
							<div className="center big">가</div>
						</div>
						<div styleName="choices">
							<Choice number="1" content="ka" correctMessage="ㄱ is like weak /k/ sound and ㅏ is like /a/ sound in ah, car." status={ChoiceStatus.CORRECT} answer={true}/>
							<Choice number="2" content="ko" correctMessage="/o/ sound is for ㅗ. You'll learn about it later." status={ChoiceStatus.NORMAL} answer={false} />
							<Choice number="3" content="na" correctMessage="/n/ sound is for ㄴ. You'll learn about it soon." status={ChoiceStatus.CORRECT} answer={false} />
							<Choice number="4" content="no" correctMessage="/n/ sound is for ㄴ. And /o/ is for ㅗ. You'll learn about them soon." status={ChoiceStatus.WRONG} answer={false} />
						</div>
						<div styleName="wrong-message">
							<h2>Hint:</h2>
							<p>Remember the sounds we've learned. There were only two of them and there was no /n/ and /o/ sounds!</p>
						</div>
						<div styleName="button-wrap">
							<button styleName="check">check answer</button>
							<button styleName="next">go to next</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default CSSModules(Layout, styles)