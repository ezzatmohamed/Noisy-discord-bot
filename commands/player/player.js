const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['player', 'pr'],

    handler: async (message, args, session, bot) => {
        await session.joinVoice(message.member.voice.channel)
        const player = session.getPlayer(message)

        if (session.player_message) {
            session.player_message.setContent({ ...session.player_message.params, component: undefined })
            await session.player_message.send()

            bot.removeListener('clickButton', session.player_click_button_listener)

            session.player_message = undefined
            session.player_click_button_listener = undefined
        }
        
        const random_token = Math.random().toString(36).substring(7)
        const previous_button_id = 'previous_button' + random_token
        const rewind_button_id = 'rewind_button' + random_token
        const play_pause_button_id = 'play_pause_button' + random_token
        const fastforward_button_id = 'fastforward_button' + random_token
        const next_button_id = 'next_button' + random_token

        const previous_button = new MessageButton().setLabel(true ? '' :'Previous').setEmoji('⏮️').setStyle('grey').setID(previous_button_id)
        const rewind_button = new MessageButton().setLabel(true ? '' :'Rewind').setEmoji('⏪').setStyle('grey').setID(rewind_button_id)
        const play_pause_button = new MessageButton().setLabel(true ? '' :'Play/Pause').setEmoji('⏯️').setStyle('grey').setID(play_pause_button_id)
        const fastforward_button = new MessageButton().setLabel(true ? '' :'FastForward').setEmoji('⏩').setStyle('grey').setID(fastforward_button_id)
        const next_button = new MessageButton().setLabel(true ? '' :'Next').setEmoji('⏭️').setStyle('grey').setID(next_button_id)

        const buttons = new MessageActionRow()
            .addComponent(previous_button)
            .addComponent(rewind_button)
            .addComponent(play_pause_button)
            .addComponent(fastforward_button)
            .addComponent(next_button)
        
        let player_message = undefined

        const update_player_message = async () => {
            buttons.components[0].disabled = !(player.queue.current != 0)
            buttons.components[1].disabled = !(true)
            buttons.components[2].disabled = !(true)
            buttons.components[3].disabled = !(true)
            buttons.components[4].disabled = !(player.queue.current < player.queue.queue.length - 1 || player.queue.autoplay_on)
            
            player_message = await player.getPlayerMessage(player_message, message, {component: [buttons]})

            await player_message.send()

            setTimeout(async () => {
                await update_player_message()
            }, 1000)
        }

        await update_player_message()

        async function player_click_button_listener(button) {
            if (button.id === previous_button_id) await bot.CommandsController.handlers['previous'](message, '', session, bot, true, false)
            if (button.id === rewind_button_id) await bot.CommandsController.handlers['rewind'](message, '10s', session, bot, true, false)
            if (button.id === play_pause_button_id) await bot.CommandsController.handlers['toggle'](message, '', session, bot, true, false)
            if (button.id === fastforward_button_id) await bot.CommandsController.handlers['fastforward'](message, '10s', session, bot, true, false)
            if (button.id === next_button_id) await bot.CommandsController.handlers['next'](message, '', session, bot, true, false)
            
            button.defer()
            await update_player_message()
        }
        bot.on('clickButton', player_click_button_listener)

        session.player_message = player_message
        session.player_click_button_listener = player_click_button_listener
        
    },

    description: `dump description`,

    usage: `[title]`
}