import { Store } from './store.js'
import { View } from './view.js'

const LIVE_T3_STORAGE_KEY = 'live-t3-storage-key'

function init() {
	const view = new View()
	const store = new Store(LIVE_T3_STORAGE_KEY)

	// utility funcs
	const checkIsMoveExist = (players, squareId) =>
		players.forEach(player => player.moves.includes(squareId))

	// bindings
	view.bindGameResetEvent(() => {
		store.reset()
		view.render(store.game, store.stats)
	})

	view.bindNewRoundEvent(e => {
		store.newRound()
	})

	view.bindPlayerMoveEvent(e => {
		const currentSquare = e.target
		const isMoveExist = checkIsMoveExist(store.game.players, currentSquare.id)

		if (isMoveExist) {
			return
		}

		// advance to the next state
		store.handlePlayerMove(currentSquare.id, store.game.currentPlayer.id)

		view.render(store.game, store.stats)
	})

	// listen storage events
	window.addEventListener('storage', () => view.render(store.game, store.stats))

	// initialize view
	view.render(store.game, store.stats)
}

window.addEventListener('load', init)
