import { Store } from './store.js'
import { View } from './view.js'

const LIVE_T3_STORAGE_KEY = 'live-t3-storage-key'
const STATE_CHANGE_EVENT_KEY = 'stateChange'

function init() {
	const view = new View()
	const store = new Store(LIVE_T3_STORAGE_KEY, STATE_CHANGE_EVENT_KEY)

	// utility funcs
	const checkIsMoveExist = (players, squareId) =>
		players.forEach(player => player.moves.includes(squareId))

	// bindings
	view.bindGameResetEvent(() => {
		store.reset()
	})

	view.bindNewRoundEvent(e => {
		store.newRound()
	})

	view.bindPlayerMoveEvent(currentSquare => {
		const isMoveExist = checkIsMoveExist(store.game.players, currentSquare.id)

		if (isMoveExist) {
			return
		}

		// advance to the next state
		store.handlePlayerMove(currentSquare.id, store.game.currentPlayer.id)
	})

	// listen current tab state changes
	store.addEventListener(STATE_CHANGE_EVENT_KEY, () =>
		view.render(store.game, store.stats)
	)

	// listen different tab state changes
	window.addEventListener('storage', () => view.render(store.game, store.stats))

	// initialize view
	view.render(store.game, store.stats)
}

window.addEventListener('load', init)
