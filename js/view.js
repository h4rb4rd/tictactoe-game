export class View {
	$ = {}

	constructor() {
		// dom elements
		this.$.turnIndicator = this.#qs('[data-id="turn-indicator"]')
		this.$.menu = this.#qs('[data-id="menu"]')
		this.$.menuBtn = this.#qs('[data-id="menu-btn"]')
		this.$.menuItems = this.#qs('[data-id="menu-items"]')
		this.$.resetBtn = this.#qs('[data-id="reset-btn"]')
		this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]')
		this.$.squares = this.#qsAll('[data-id="square"]')
		this.$.modal = this.#qs('[data-id="modal"]')
		this.$.modalText = this.#qs('[data-id="modal-text"]')
		this.$.modalBtn = this.#qs('[data-id="modal-btn"]')
		this.$.p1Wins = this.#qs('[data-id="p1-wins"]')
		this.$.p2Wins = this.#qs('[data-id="p2-wins"]')
		this.$.ties = this.#qs('[data-id="ties"]')
		// ui only event listeners
		this.$.menuBtn.addEventListener('click', () => {
			this.#toggleMenu()
		})
	}

	// register event listeners
	bindGameResetEvent(handler) {
		this.$.resetBtn.addEventListener('click', handler)
		this.$.modalBtn.addEventListener('click', handler)
	}
	bindNewRoundEvent(handler) {
		this.$.newRoundBtn.addEventListener('click', handler)
	}
	bindPlayerMoveEvent(handler) {
		this.$.squares.forEach(square => {
			square.addEventListener('click', handler)
		})
	}
	// utility methods
	updateScoreboard(playerOneWins, playerTwoWins, tieGames) {
		this.$.p1Wins.innerText = `${playerOneWins} wins`
		this.$.p2Wins.innerText = `${playerTwoWins} wins`
		this.$.ties.innerText = `${tieGames} ties`
	}

	openModal(message) {
		this.$.modal.classList.remove('hidden')
		this.$.modalText.innerText = message
	}

	clearMoves() {
		this.$.squares.forEach(square => square.replaceChildren())
	}

	closeAll() {
		this.#closeModal()
		this.#closeMenu()
	}

	setTurnIndicator(player) {
		const icon = document.createElement('i')
		const label = document.createElement('p')

		icon.classList.add('fa-solid', player.color, player.icon)
		label.classList.add(player.color)
		label.innerText = `Player ${player.id} you are up!`

		this.$.turnIndicator.replaceChildren(icon, label)
	}

	handlePlayerMove(squareEl, player) {
		const icon = document.createElement('i')

		icon.classList.add('fa-solid', player.icon, player.color)
		squareEl.replaceChildren(icon)
	}

	#closeModal() {
		this.$.modal.classList.add('hidden')
	}

	#closeMenu() {
		const icon = this.$.menuBtn.querySelector('i')

		this.$.menuItems.classList.add('hidden')
		this.$.menuBtn.classList.remove('border')

		icon.classList.add('fa-chevron-down')
		icon.classList.remove('fa-chevron-up')
	}

	#toggleMenu() {
		const icon = this.$.menuBtn.querySelector('i')

		this.$.menuItems.classList.toggle('hidden')
		this.$.menuBtn.classList.toggle('border')

		icon.classList.toggle('fa-chevron-down')
		icon.classList.toggle('fa-chevron-up')
	}

	#qs(selector, parent) {
		const el = parent
			? parent.querySelector(selector)
			: document.querySelector(selector)

		if (!el) {
			throw new Error(`Could not find element by selector ${selector}`)
		}

		return el
	}

	#qsAll(selector) {
		const elList = document.querySelectorAll(selector)

		if (!elList) {
			throw new Error(`Could not find elements by selector ${selector}`)
		}

		return elList
	}
}
