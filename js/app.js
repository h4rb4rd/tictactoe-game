import { Store } from './store.js'
import { View } from './view.js'

function init() {
	const view = new View()
	const store = new Store()

	view.bindGameResetEvent(() => {
		store.reset()
		view.closeAll()
		view.clearMoves()
		view.setTurnIndicator(store.game.currentPlayer)
		view.updateScoreboard(
			store.stats.playerOneWins,
			store.stats.playerTwoWins,
			store.stats.tieGames
		)
	})

	view.bindNewRoundEvent(e => {
		store.newRound()
		view.closeAll()
		view.clearMoves()
		view.setTurnIndicator(store.game.currentPlayer)
		view.updateScoreboard(
			store.stats.playerOneWins,
			store.stats.playerTwoWins,
			store.stats.tieGames
		)
	})

	view.bindPlayerMoveEvent(e => {
		const currentSquare = e.target
		const isMoveExist = store.game.moves.includes(currentSquare.id)

		if (isMoveExist) {
			return
		}

		// place an icon of the current player in a square
		view.handlePlayerMove(currentSquare, store.game.currentPlayer)
		// advance to the next state
		store.handlePlayerMove(currentSquare.id, store.game.currentPlayer.id)

		// check is game complete & open modal
		if (store.game.status.isComplete) {
			const winnerId = store.game.status.winnerId
			const message = winnerId ? `Player ${winnerId} wins!` : 'Tie game!'

			view.openModal(message)

			return
		}

		// set the next player's turn indicator
		view.setTurnIndicator(store.game.currentPlayer)
	})
}

window.addEventListener('load', init)
