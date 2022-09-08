const { MessageActionRow, MessageButton } = require('discord-buttons')
// const delay = time => new Promise(res=>setTimeout(res,time))

module.exports = {
    name: ['xo'],

    handler: async (message, args, session, bot, verbose=true) => {

        let opponent = /<@!?(\d{18})>/.exec(args)
        opponent = opponent ? opponent[1] : 'ai'
        args = args.replace(new RegExp(`<@!?${opponent}>`), '')

        let board_size = /(\d+)/.exec(args)
        board_size = board_size ? parseInt(board_size[1]) : 3
        
        // TODO: variable board size (larger than 3 the ai engine hangs out)
        if (board_size < 3 || board_size > 3) {
            const reply_message = new bot.MessagesController.Message(message.channel, {description: 'Invalid board size'}, message)
            return await reply_message.send()
        }

        difficulty = /.*medium.*/.exec(args) ? 'medium' : 'hard'
        let game = session.createTicTacToe(message.author.id, opponent, difficulty, board_size)

        /**
         * * Initialize the buttons
         */
        const random_token = Math.random().toString(36).substring(7)
        const buttons = game.board.map((row, row_idx) => row.map((_, col_idx) => 
            new MessageButton().setLabel('⠀').setStyle('grey').setID(`${row_idx},${col_idx},${random_token}`)
        ))
        const buttons_containers = buttons.map((row_buttons) => {
            const row = new MessageActionRow()
            row_buttons.forEach(button => row.addComponent(button))
            return row
        })

        const game_message = new bot.MessagesController.Message(message.channel, {})
        const game_info = `<@!${game.player_one}> 🆚 ` + (game.player_two === 'ai' ? `<@!${bot.user.id}>` : `<@!${game.player_two}>`)
        let current_player = game.getCurrentPlayer()

        const update_game_message = async () => {
            current_player = game.getCurrentPlayer()

            game.board.forEach((row, row_idx) => row.forEach((value, col_idx) => {
                if (value === ' ') {
                    buttons_containers[row_idx].components[col_idx].emoji = undefined
                    buttons_containers[row_idx].components[col_idx].label = '⠀'
                    buttons_containers[row_idx].components[col_idx].disabled = game.isAITurn() || Boolean(game.result)
                } else {
                    buttons_containers[row_idx].components[col_idx].emoji = value === 'X' ? {name: '❌'} : {name: '⭕'}
                    buttons_containers[row_idx].components[col_idx].label = undefined
                    buttons_containers[row_idx].components[col_idx].disabled = true
                }
            }))

            const turn_info = !game.result ? (`Turn **${game.turn}** : ` + (current_player !== 'ai' ? `<@!${current_player}>` : `<@!${bot.user.id}> 🤔`)) : undefined
            const result_info = game.result ? (game.result === 'D' ? 'Draw!' : `WE HAVE A WINNER 🎉🎉 <@!${game.getWinner() === 'ai' ? bot.user.id : game.getWinner()}>`) : undefined
            game_message.setContent({
                content: `${game_info}\n\n${turn_info || result_info}`,
                component: buttons_containers
            })
            
            await game_message.send()

            if (game.result) {
                game.removeListener('GameChanged', game_changes_listener)
                bot.removeListener('clickButton', click_button_listener)
                delete game
                game = null
            }
        }

        const update_game = async () => {

            await update_game_message()
            
            if (game && !game.result && game.isAITurn()) {
                // await delay(1000)
                game.play()
            }

        }

        async function game_changes_listener() {
            await update_game()
        }
        game.on('GameChanged', game_changes_listener)

        await game_changes_listener()

        async function click_button_listener(button) {
            if (button.clicker.user.id !== current_player) {
                await button.reply.send([game.player_one, game.player_two].includes(button.clicker.user.id) ? 'Not your turn!' : 'You aren\'t in the game! Start one.', true)
                return
            }
            const move = button.id.split(',').slice(0, 2)
            game.submitMove(move)
            await button.defer()
        }
        bot.on('clickButton', click_button_listener)

    },

    description: `dump description`,

    usage: `[title]`
}