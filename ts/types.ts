export type Player = {
	id: number
	icon: string
	color: string
	moves: string
	wins: number
}

export type Status = {
	winnerId: number | null
	isComplete: boolean
}

export type Game = {
	currentPlayer: Player
	players: Player[]
	status: Status
}

export type Stats = {
	tieGames: number
	playerOneWins: number
	playerTwoWins: number
}

export type GameState = {
	players: Player[]
	tieGames: number
	totalMoves: number
	maxMoves: number
	winningPatterns: number[][]
}
