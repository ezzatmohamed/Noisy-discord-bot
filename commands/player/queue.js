const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['queue', 'q'],

    handler: async (message, args, session, bot) => {
        const player = session.getPlayer(message)

        if (session.queue_message) {
            session.queue_message.setContent({ ...session.queue_message.params, component: undefined })
            await session.queue_message.send()

            player.queue.removeListener('QueueChanged', session.queue_changes_listener)
            bot.removeListener('clickButton', session.click_button_listener)

            session.queue_message = undefined
            session.queue_changes_listener = undefined
            session.click_button_listener = undefined
        }
        
        let page_idx = 0

        const random_token = Math.random().toString(36).substring(7)
        const first_page_button_id = 'first_page_button' + random_token
        const prev_page_button_id = 'prev_page_button' + random_token
        const current_page_button_id = 'current_page_button' + random_token
        const next_page_button_id = 'next_page_button' + random_token
        const last_page_button_id = 'last_page_button' + random_token

        const first_page_button = new MessageButton().setLabel(true ? '' :'First Page').setEmoji('⏫').setStyle('grey').setID(first_page_button_id)
        const prev_page_button = new MessageButton().setLabel(true ? '' :'Previous Page').setEmoji('🔼').setStyle('grey').setID(prev_page_button_id)
        const current_page_button = new MessageButton().setLabel(true ? '' :'Current Playing Page').setEmoji('↕️').setStyle('grey').setID(current_page_button_id)
        const next_page_button = new MessageButton().setLabel(true ? '' :'Next Page').setEmoji('🔽').setStyle('grey').setID(next_page_button_id)
        const last_page_button = new MessageButton().setLabel(true ? '' :'Last Page').setEmoji('⏬').setStyle('grey').setID(last_page_button_id)

        const buttons = new MessageActionRow()
            .addComponent(first_page_button)
            .addComponent(prev_page_button)
            .addComponent(current_page_button)
            .addComponent(next_page_button)
            .addComponent(last_page_button)
        
        const queue_message = new bot.MessagesController.Message(message.channel, {}, message)

        const update_queue_message = async (queue_message, page=-1) => {
            let { embed, num_pages, current_playing_page, page_idx } = player.queue.getEmbed(page)

            buttons.components[0].disabled = !(page_idx != 0)
            buttons.components[1].disabled = !(page_idx != 0)
            buttons.components[2].disabled = !(page_idx != current_playing_page)
            buttons.components[3].disabled = !(page_idx != num_pages - 1)
            buttons.components[4].disabled = !(page_idx != num_pages - 1)
            
            if (embed)  {
                embed = embed.setFooter(`loop: ${
                    player.queue.loop === player.queue.LOOP_MODES.LOOP_OFF ? 'off' : 
                    (player.queue.loop === player.queue.LOOP_MODES.LOOP_QUEUE ? 'queue 🔁' : 
                    (player.queue.loop === player.queue.LOOP_MODES.LOOP_SONG ? 'current song 🔂' : ''))
                }  |  autoplay: ${
                    player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_OFF ? 'off' : 
                    (player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_QUEUE ? 'related to the whole queue' : 
                    (player.queue.autoplay === player.queue.AUTOPLAY_MODES.AUTOPLAY_SONG ? 'related to last song' : ''))
                }`)
                queue_message.setContent({ embed, component: [buttons] })
            }
            else
                queue_message.setContent({
                    type: 'danger',
                    description: `The queue is empty! add some fun 😊`,
                })
            await queue_message.send()
            return page_idx
        }

        page_idx = await update_queue_message(queue_message, page_idx)

        async function queue_changes_listener() {
            page_idx = await update_queue_message(queue_message, page_idx)
        }
        player.queue.on('QueueChanged', queue_changes_listener)

        async function click_button_listener(button) {
            if (button.id === first_page_button_id) page_idx = 0
            if (button.id === prev_page_button_id) page_idx -= 1
            if (button.id === current_page_button_id) page_idx = -1
            if (button.id === next_page_button_id) page_idx += 1
            if (button.id === last_page_button_id) page_idx = -2

            page_idx = await update_queue_message(queue_message, page_idx)

            button.defer()
        }
        bot.on('clickButton', click_button_listener)

        session.queue_message = queue_message
        session.queue_changes_listener = queue_changes_listener
        session.click_button_listener = click_button_listener
        

    },

    description: `dump description`,

    usage: `[title]`
}