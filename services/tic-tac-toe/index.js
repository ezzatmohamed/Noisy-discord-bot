const { EventEmitter } = require('events')

class TicTacToe extends EventEmitter{
    constructor(bot, session, player_one, player_two, difficulty) {
        super()
        this.bot = bot
        this.session = session
        this.board = Array(3).fill().map(() => Array(3).fill(' '))
        this.turn = Math.floor(Math.random() * 2) === 0 ? 'X' : 'O'
        this.player_one_symbol = Math.floor(Math.random() * 2) === 0 ? 'X' : 'O'
        this.player_two_symbol = this.player_one_symbol === 'O' ? 'X' : 'O'
        this.difficulty = difficulty ? difficulty : Math.floor(Math.random() * 2) === 0 ? 'medium' : 'hard'

        this.player_one = player_one
        this.player_two = player_two

        this.result = undefined
    }

    /**
     * * Assume one win
     * * return undefined if not ended, 'D' if drawn, 'X' if X won, 'O' if O won
     */
    getResult() {

        const check = () => {
            // Rows
            for (let row = 0; row < this.board.length; row++)
                if (this.board[row].every( v => v === this.board[row][0] && v !== ' ' )) return this.board[row][0]
    
            // Columns
            const board_transpose = this.board[0].map((_, col_idx) => this.board.map(row => row[col_idx]))
            for (let col = 0; col < board_transpose.length; col++)
                if (board_transpose[col].every( v => v === board_transpose[col][0] && v !== ' ' )) return board_transpose[col][0]
    
            // Diagonal One
            const diagonal_one = this.board[0].map((_, row_idx) => this.board[row_idx][row_idx])
            if (diagonal_one.every( v => v === diagonal_one[0] && v !== ' ' )) return diagonal_one[0]
    
            // Diagonal Two
            const diagonal_two = this.board[0].map((_, row_idx) => this.board[row_idx][this.board.length - row_idx - 1])
            if (diagonal_two.every( v => v === diagonal_two[0] && v !== ' ' )) return diagonal_two[0]
    
            const board_flatten = this.board.flat()
            if (board_flatten.every( v => v !== ' ' )) return 'D'
    
            return undefined

        }

        this.result = check()
        return this.result
    }

    changeTurn() {
        this.turn = this.turn === 'X' ? 'O' : 'X'
    }

    /**
     * * return false if can't submit this move else true
     */
    submitMove(pos, fake=false) {
        if (this.board[pos[0]][pos[1]] !== ' ') return false
        this.board[pos[0]][pos[1]] = this.turn
        this.changeTurn()
        this.getResult()
        if (!fake) this.emit('GameChanged')
    }

    getWinner() {
        if (!this.result) return undefined
        if (this.result === 'D') return 'draw'
        return this.result === this.player_one_symbol ? this.player_one : this.player_two
    }

    /**
     * * return false if can't undo this move else true
     */
    undoMove(pos) {
        if (this.board[pos[0]][pos[1]] === ' ') return false
        this.board[pos[0]][pos[1]] = ' '
        this.changeTurn()
    }

    getAvailableMoves() {
        const moves = []

        this.board.forEach((row, row_idx) => {
            row.forEach((_, col_idx) => {
                if (this.board[row_idx][col_idx] === ' ') moves.push([row_idx, col_idx])
            })
        })

        return moves
    }

    printBoard() {
        console.log('='.repeat(50))
        this.board.forEach(row => console.log(...row, '\n'))
        console.log('='.repeat(50))
    }

    isAITurn() {
        if (this.player_two !== 'ai') return false
        return this.turn === this.player_two_symbol
    }

    getCurrentPlayer() {
        return this.turn === this.player_one_symbol ? this.player_one : this.player_two
    }

    /**
     * * alpha-beta minmax algorithm
     * * return undefined if game ended else pos([y, x])
     */
    getBestMove(for_symbol=undefined, depth=0, alpha=-Infinity, beta=+Infinity, best_move=undefined) {
        if (!for_symbol) for_symbol = this.player_two_symbol
        const result = this.getResult()
        if (depth === 0 && result !== undefined) return
        if (result === 'D') return { score: 0 }
        if (result === (for_symbol === 'X' ? 'O' : 'X')) return { score: depth - 10 }
        if (result === for_symbol) return { score: 10 - depth }

        depth += 1
        const available_moves = this.getAvailableMoves()

        available_moves.forEach(move => {
            this.submitMove(move, true)
            const { score } = this.getBestMove(for_symbol, depth, alpha, beta, best_move)
            this.undoMove(move)
            if (this.turn === for_symbol) {
                if (score > alpha) {
                    alpha = score
                    if (depth === 1) best_move = move
                }
                else if (alpha >= beta) return { score: alpha, move }
            } else {
                if (score < beta) {
                    beta = score
                    if (depth === 1) best_move = move
                }
                else if (beta <= alpha) return { score: beta, move }
            }
        })

        if (depth === 1) return best_move

        if (this.turn === for_symbol) return { score: alpha }
        else return { score: beta }
    }

    play() {
        let move = undefined
        if (this.difficulty === 'medium') {
            let play_hard = Math.floor(Math.random() * 7) >= 4 ? true : false
            if (play_hard) 
                move = this.getBestMove()
            else{
                const moves = this.getAvailableMoves()
                move = moves[Math.floor(Math.random() * moves.length)]
            }
        } else if (this.difficulty === 'hard') {
            move = this.getBestMove()
        }
        this.submitMove(move)
    }
}

module.exports = TicTacToe