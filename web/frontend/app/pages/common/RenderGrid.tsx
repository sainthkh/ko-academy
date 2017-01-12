export class RenderGrid {
	constructor(userLevel, contentLevel, funcs) {
		this.userLevel = this.accessLevelCode(userLevel)
		this.contentLevel = this.accessLevelCode(contentLevel)
		this.funcs = funcs
	}

	render() {
		let f = this.funcs[this.userLevel]
		let approved = f[0]
		let denied = f[1]
		return (this.contentLevel <= this.userLevel)? 
			approved(this.contentLevel, this.userLevel) : 
			denied(this.contentLevel, this.userLevel)
	}

	protected accessLevelCode(level) {
		switch(level) {
			case "guest":	return 0
			case "free":	return 1
			case "gold":	return 2
			default:		return 0
		}
	}

	private userLevel: number
	private contentLevel: number
	private funcs: any
}