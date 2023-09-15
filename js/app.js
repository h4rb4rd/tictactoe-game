// const app = {
// 	$: {
// 		menu: document.querySelector('[data-id="menu"]'),
// 		menuBtn: document.querySelector('[data-id="menu-btn"]'),
// 		menuItems: document.querySelector('[data-id="menu-items"]'),
// 		resetButton: document.querySelector('[data-id="reset-btn"]'),
// 		newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
// 		squares: document.querySelectorAll('[data-id="square"]'),
// 	},

// 	state: {
// 		moves: [],
// 	},

// 	registerEventListeners() {
// 		app.$.menu.addEventListener('click', e => {
// 			app.$.menuItems.classList.toggle('hidden')
// 		})

// 		app.$.resetButton.addEventListener('click', e => {
// 			console.log('reset the game')
// 		})

// 		app.$.newRoundBtn.addEventListener('click', e => {
// 			console.log('start a new round')
// 		})

// 		app.$.squares.forEach(square => {
// 			square.addEventListener('click', e => {
// 				const checkHasMove = squareId => {
// 					const isMoveExist = app.state.moves.find(
// 						move => move.squareId === squareId
// 					)

// 					return !isMoveExist
// 				}

// 				if (!checkHasMove(square.id)) {
// 					return
// 				}

// 				const lastMove = app.state.moves.at(-1)

// 				const getOppositePlayer = playerId => (playerId === 1 ? 2 : 1)

// 				const currentPlayerId =
// 					app.state.moves.length === 0
// 						? 1
// 						: getOppositePlayer(lastMove.playerId)

// 				const icon = document.createElement('i')

// 				if (currentPlayerId === 1) {
// 					icon.classList.add('fa-solid', 'fa-x', 'turquoise')
// 				} else {
// 					icon.classList.add('fa-solid', 'fa-o', 'yellow')
// 				}

// 				app.state.moves.push({
// 					squareId: square.id,
// 					playerId: currentPlayerId,
// 				})

// 				square.replaceChildren(icon)

// 				const { winnerId, status } = app.getGameStatus(app.state.moves)

// 				if (status === 'complete' && winnerId) {
// 					console.log(`Player ${winnerId} wins`)
// 				}

// 				if (status === 'complete' && !winnerId) {
// 					console.log('Tie!')
// 				}
// 			})
// 		})
// 	},

// 	getGameStatus(moves) {
// 		const p1Moves = moves
// 			.filter(move => move.playerId === 1)
// 			.map(move => +move.squareId)
// 		const p2Moves = moves
// 			.filter(move => move.playerId === 2)
// 			.map(move => +move.squareId)
// 		const maxMoves = 9

// 		const winningPatterns = [
// 			[1, 2, 3],
// 			[1, 5, 9],
// 			[1, 4, 7],
// 			[2, 5, 8],
// 			[3, 5, 7],
// 			[3, 6, 9],
// 			[4, 5, 6],
// 			[7, 8, 9],
// 		]

// 		let winnerId = null

// 		winningPatterns.forEach(pattern => {
// 			const p1Wins = pattern.every(v => p1Moves.includes(v))
// 			const p2Wins = pattern.every(v => p2Moves.includes(v))

// 			if (p1Wins) winnerId = 1
// 			if (p2Wins) winnerId = 2
// 		})

// 		return {
// 			status:
// 				moves.length === maxMoves || winnerId != null
// 					? 'complete'
// 					: 'in-progress',
// 			winnerId,
// 		}
// 	},
// 	init() {
// 		app.registerEventListeners()
// 	},
// }

// window.addEventListener('load', app.init)

const app = {
	// dom elements
	$: {
		// Turn indicator
		turnIndicator: document.querySelector('[data-id="turn-indicator"]'),
		// Dropdown menu
		menu: document.querySelector('[data-id="menu"]'),
		menuBtn: document.querySelector('[data-id="menu-btn"]'),
		menuItems: document.querySelector('[data-id="menu-items"]'),
		resetBtn: document.querySelector('[data-id="reset-btn"]'),
		newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
		// Game board
		squares: document.querySelectorAll('[data-id="square"]'),
		// modal
		modal: document.querySelector('[data-id="modal"]'),
		modalText: document.querySelector('[data-id="modal-text"]'),
		modalBtn: document.querySelector('[data-id="modal-btn"]'),
	},

	// game state
	state: {
		playerOne: {
			id: 1,
			moves: '',
		},
		playerTwo: {
			id: 2,
			moves: '',
		},
		currentPlayerId: 1,
		totalMoves: 0,
		maxMoves: 9,
		winningPatterns: [
			[1, 2, 3],
			[1, 5, 9],
			[1, 4, 7],
			[2, 5, 8],
			[3, 5, 7],
			[3, 6, 9],
			[4, 5, 6],
			[7, 8, 9],
		],
	},

	registerEventListeners() {
		app.$.menu.addEventListener('click', e => {
			app.$.menuItems.classList.toggle('hidden')
		})

		app.$.resetBtn.addEventListener('click', e => {
			console.log('reset the game')
		})

		app.$.newRoundBtn.addEventListener('click', e => {
			console.log('start a new round')
		})

		app.$.squares.forEach(square => {
			square.addEventListener('click', e => {
				const playerOneState = app.state.playerOne
				const playerTwoState = app.state.playerTwo

				const isMoveExist =
					playerOneState.moves.includes(square.id) ||
					playerTwoState.moves.includes(square.id)

				if (isMoveExist) {
					return
				}

				const currentPlayerId = app.state.currentPlayerId
				const nextPlayerId = currentPlayerId === 1 ? 2 : 1

				const squareIcon = document.createElement('i')
				const turnIcon = document.createElement('i')
				const turnLabel = document.createElement('p')

				turnLabel.innerText = `Player ${nextPlayerId} you are up!`

				if (currentPlayerId === 1) {
					squareIcon.classList.add('fa-solid', 'fa-x', 'turquoise')
					turnIcon.classList.add('fa-solid', 'fa-o', 'yellow')
					turnLabel.classList = 'yellow'

					app.state.currentPlayerId = playerTwoState.id
					playerOneState.moves += square.id
				} else {
					squareIcon.classList.add('fa-solid', 'fa-o', 'yellow')
					turnIcon.classList.add('fa-solid', 'fa-x', 'turquoise')
					turnLabel.classList = 'turquoise'

					app.state.currentPlayerId = playerOneState.id
					playerTwoState.moves += square.id
				}

				app.$.turnIndicator.replaceChildren(turnIcon, turnLabel)

				square.replaceChildren(squareIcon)
				app.state.totalMoves++

				app.handleModal()
			})
		})

		app.$.modalBtn.addEventListener('click', () => {
			app.resetGame()
			app.closeModal()
		})
	},

	getGameStatus() {
		let winnerId = null
		let status = 'in-progress'

		app.state.winningPatterns.forEach(pattern => {
			const p1Wins = pattern.every(v => app.state.playerOne.moves.includes(v))
			const p2Wins = pattern.every(v => app.state.playerTwo.moves.includes(v))

			if (p1Wins) {
				winnerId = 1
				status = 'complete'
			}

			if (p2Wins) {
				winnerId = 2
				status = 'complete'
			}
		})

		if (app.state.totalMoves === app.state.maxMoves) {
			status = 'complete'
		}

		return {
			status,
			winnerId,
		}
	},

	handleModal() {
		const { winnerId, status } = app.getGameStatus()

		if (status === 'complete') {
			app.openModal()

			let message = ''

			if (winnerId) {
				message = `Player ${winnerId} wins`
			} else {
				message = 'Tie game!'
			}

			app.$.modalText.textContent = message
		}
	},

	resetGame() {
		app.$.squares.forEach(square => square.replaceChildren())
		app.state.playerOne.moves = ''
		app.state.playerTwo.moves = ''
		app.state.currentPlayerId = 1
		app.state.totalMoves = 0
	},

	openModal() {
		app.$.modal.classList.remove('hidden')
	},

	closeModal() {
		app.$.modal.classList.add('hidden')
	},

	init() {
		app.registerEventListeners()
	},
}

window.addEventListener('load', app.init)
