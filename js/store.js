const initialState = {
	players: [
		{
			id: 1,
			icon: 'fa-x',
			color: 'turquoise',
			moves: '',
			wins: 0,
		},
		{
			id: 2,
			icon: 'fa-o',
			color: 'yellow',
			moves: '',
			wins: 0,
		},
	],
	tieGames: 0,
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
}

export class Store {
	constructor(storageKey) {
		this.storageKey = storageKey
	}

	get stats() {
		const state = this.#getState()

		return {
			tieGames: state.tieGames,
			playerOneWins: state.players[0].wins,
			playerTwoWins: state.players[1].wins,
		}
	}

	get game() {
		const state = this.#getState()
		const currentPlayerIdx = state.totalMoves % 2
		const winnerId = this.#checkWinner()
		const isComplete = winnerId != null || state.totalMoves === state.maxMoves

		return {
			currentPlayer: state.players[currentPlayerIdx],
			players: state.players,
			status: {
				winnerId,
				isComplete,
			},
		}
	}

	handlePlayerMove(squareId, playerId) {
		const stateClone = structuredClone(this.#getState())
		const currentPlayerIdx = playerId - 1

		stateClone.players[currentPlayerIdx].moves += squareId
		stateClone.totalMoves++

		this.#saveState(stateClone)
	}

	reset() {
		const stateClone = structuredClone(this.#getState())
		const { status } = this.game
		let hasWinner = false

		for (const player of stateClone.players) {
			if (player.id === status.winnerId && status.isComplete) {
				player.wins++
				hasWinner = true
			}

			player.moves = ''
		}

		if (!hasWinner && status.isComplete) {
			stateClone.tieGames++
		}

		stateClone.totalMoves = 0

		this.#saveState(stateClone)
	}

	newRound() {
		this.reset()

		const stateClone = structuredClone(this.#getState())

		for (const player of stateClone.players) {
			player.wins = 0
		}

		stateClone.tieGames = 0

		this.#saveState(stateClone)
	}

	#checkWinner() {
		const state = this.#getState()
		let winnerId = null

		for (const player of state.players) {
			for (const pattern of state.winningPatterns) {
				const isWin = pattern.every(v => player.moves.includes(v))

				if (isWin) {
					winnerId = player.id
				}
			}
		}

		return winnerId
	}

	#getState() {
		const state = localStorage.getItem(this.storageKey)

		return state ? JSON.parse(state) : initialState
	}
	#saveState(newState) {
		localStorage.setItem(this.storageKey, JSON.stringify(newState))
	}
}
