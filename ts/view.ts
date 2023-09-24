import type { Game, Player, Stats } from './types'

export class View {
	$: Record<string, Element> = {}
	$$: Record<string, NodeListOf<Element>> = {}

	constructor() {
		// Single elements
		this.$.turnIndicator = this.#qs('[data-id="turn-indicator"]')
		this.$.menu = this.#qs('[data-id="menu"]')
		this.$.menuBtn = this.#qs('[data-id="menu-btn"]')
		this.$.menuItems = this.#qs('[data-id="menu-items"]')
		this.$.resetBtn = this.#qs('[data-id="reset-btn"]')
		this.$.newRoundBtn = this.#qs('[data-id="new-round-btn"]')
		this.$.modal = this.#qs('[data-id="modal"]')
		this.$.modalText = this.#qs('[data-id="modal-text"]')
		this.$.modalBtn = this.#qs('[data-id="modal-btn"]')
		this.$.p1Wins = this.#qs('[data-id="p1-wins"]')
		this.$.p2Wins = this.#qs('[data-id="p2-wins"]')
		this.$.ties = this.#qs('[data-id="ties"]')
		this.$.grid = this.#qs('[data-id="grid"]')
		// Element lists
		this.$$.squares = this.#qsAll('[data-id="square"]')
		// ui only event listeners
		this.$.menuBtn.addEventListener('click', () => {
			this.#toggleMenu()
		})
	}

	render(game: Game, stats: Stats) {
		const {
			players,
			currentPlayer,
			status: { isComplete, winnerId },
		} = game
		const { playerOneWins, playerTwoWins, tieGames } = stats

		this.#closeAll()
		this.#clearMoves()
		this.#updateScoreboard(playerOneWins, playerTwoWins, tieGames)
		this.#initializeMoves(players)

		if (isComplete) {
			this.#openModal(winnerId ? `Player ${winnerId} wins!` : 'Tie game!')

			return
		}

		this.#setTurnIndicator(currentPlayer)
	}

	// register event listeners
	bindGameResetEvent(handler: EventListener) {
		this.$.resetBtn.addEventListener('click', handler)
		this.$.modalBtn.addEventListener('click', handler)
	}
	bindNewRoundEvent(handler: EventListener) {
		this.$.newRoundBtn.addEventListener('click', handler)
	}
	bindPlayerMoveEvent(handler: (el: Element) => void) {
		this.#delegate(this.$.grid, '[data-id="square"]', 'click', handler)
	}
	// utility methods

	#updateScoreboard(
		playerOneWins: number,
		playerTwoWins: number,
		tieGames: number
	) {
		this.$.p1Wins.textContent = `${playerOneWins} wins`
		this.$.p2Wins.textContent = `${playerTwoWins} wins`
		this.$.ties.textContent = `${tieGames} ties`
	}

	#openModal(message: string) {
		this.$.modal.classList.remove('hidden')
		this.$.modalText.textContent = message
	}

	#clearMoves() {
		this.$$.squares.forEach(square => square.replaceChildren())
	}

	#initializeMoves(players: Player[]) {
		this.$$.squares.forEach(square => {
			players.forEach(player => {
				if (player.moves.includes(square.id)) {
					this.#handlePlayerMove(square, player)
				}
			})
		})
	}

	#closeAll() {
		this.#closeModal()
		this.#closeMenu()
	}

	#setTurnIndicator(player: Player) {
		const icon = document.createElement('i')
		const label = document.createElement('p')

		icon.classList.add('fa-solid', player.color, player.icon)
		label.classList.add(player.color)
		label.innerText = `Player ${player.id} you are up!`

		this.$.turnIndicator.replaceChildren(icon, label)
	}

	#handlePlayerMove(squareEl: Element, player: Player) {
		const icon = document.createElement('i')

		icon.classList.add('fa-solid', player.icon, player.color)
		squareEl.replaceChildren(icon)
	}

	#closeModal() {
		this.$.modal.classList.add('hidden')
	}

	#closeMenu() {
		const icon = this.#qs('i', this.$.menuBtn)

		this.$.menuItems.classList.add('hidden')
		this.$.menuBtn.classList.remove('border')

		icon.classList.add('fa-chevron-down')
		icon.classList.remove('fa-chevron-up')
	}

	#toggleMenu() {
		const icon = this.#qs('i', this.$.menuBtn)

		this.$.menuItems.classList.toggle('hidden')
		this.$.menuBtn.classList.toggle('border')

		icon.classList.toggle('fa-chevron-down')
		icon.classList.toggle('fa-chevron-up')
	}

	#qs(selector: string, parent?: Element) {
		const el = parent
			? parent.querySelector(selector)
			: document.querySelector(selector)

		if (!el) {
			throw new Error(`Could not find element by selector ${selector}`)
		}

		return el
	}

	#qsAll(selector: string) {
		const elList = document.querySelectorAll(selector)

		if (!elList) {
			throw new Error(`Could not find elements by selector ${selector}`)
		}

		return elList
	}

	#delegate(
		el: Element,
		selector: string,
		eventKey: string,
		handler: (el: Element) => void
	) {
		el.addEventListener(eventKey, event => {
			if (!(event.target instanceof Element)) {
				throw new Error('Event target not found')
			}

			if (event.target.matches(selector)) {
				handler(event.target)
			}
		})
	}
}
