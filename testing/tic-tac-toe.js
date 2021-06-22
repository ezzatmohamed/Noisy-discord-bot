const Game = require('../services/tic-tac-toe')
const prompt = require('prompt-sync')()

const game = new Game()

console.log('difficulty', game.difficulty)
console.log('agent_symbol', game.agent_symbol)
// game.turn = 'O'
// game_agent_symbol = 'O'
// game.board = [
//     ['O', 'X', ' '],
//     ['X', 'O', ' '],
//     [' ', ' ', 'X']
// ]
game.printBoard()
while (!game.getResult()) {
    if (game.turn === game.agent_symbol) game.play()
    else {
        // const moves = game.getAvailableMoves()
        // move = moves[Math.floor(Math.random() * moves.length)]
        const row = prompt('Row: ')
        const col = prompt('Col: ')
        game.submitMove([parseInt(row), parseInt(col)])
    }
    game.printBoard()
}

console.log('difficulty', game.difficulty)
console.log('agent_symbol', game.agent_symbol)
console.log('result', game.getResult())