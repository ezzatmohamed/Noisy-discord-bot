const Queue = require('../../services/player/Queue')
const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['search', 's'],

    handler: async (message, args, session, bot) => {
        const player = session.getPlayer()
        const songs = await player.search(message, args)
        
        let page_idx = 0

        const random_token = Math.random().toString(36).substring(7)
        const first_page_button_id = 'first_page_button' + random_token
        const prev_page_button_id = 'prev_page_button' + random_token
        const next_page_button_id = 'next_page_button' + random_token
        const last_page_button_id = 'last_page_button' + random_token

        const first_page_button = new MessageButton().setLabel(true ? '' :'First Page').setEmoji('⏫').setStyle('grey').setID(first_page_button_id)
        const prev_page_button = new MessageButton().setLabel(true ? '' :'Previous Page').setEmoji('🔼').setStyle('grey').setID(prev_page_button_id)
        const next_page_button = new MessageButton().setLabel(true ? '' :'Next Page').setEmoji('🔽').setStyle('grey').setID(next_page_button_id)
        const last_page_button = new MessageButton().setLabel(true ? '' :'Last Page').setEmoji('⏬').setStyle('grey').setID(last_page_button_id)

        const buttons = new MessageActionRow()
            .addComponent(first_page_button)
            .addComponent(prev_page_button)
            .addComponent(next_page_button)
            .addComponent(last_page_button)
        
        const queue_message = new bot.MessagesController.Message(message.channel, {}, message)

        const update_queue_message = async (queue_message, page=-1) => {
            let { embed, num_pages, _, page_idx } = Queue.createEmbed(songs, `${args} (${songs.length} track)`, null, -1, page, false)

            buttons.components[0].disabled = !(page_idx != 0)
            buttons.components[1].disabled = !(page_idx != 0)
            buttons.components[2].disabled = !(page_idx != num_pages - 1)
            buttons.components[3].disabled = !(page_idx != num_pages - 1)
            
            if (embed) 
                queue_message.setContent({ embed, component: buttons })
            else
                queue_message.setContent({
                    type: 'danger',
                    description: `Not found 😞!`,
                })
            await queue_message.send()
            return page_idx
        }

        page_idx = await update_queue_message(queue_message, page_idx)

        async function click_button_listener(button) {
            if (button.id === first_page_button_id) page_idx = 0
            if (button.id === prev_page_button_id) page_idx -= 1
            if (button.id === next_page_button_id) page_idx += 1
            if (button.id === last_page_button_id) page_idx = -2

            page_idx = await update_queue_message(queue_message, page_idx)

            button.defer()
        }
        bot.on('clickButton', click_button_listener)

        setTimeout(async () => {
            queue_message.setContent({ ...queue_message.params, component: undefined })
            await queue_message.send()

            bot.removeListener('clickButton', click_button_listener)
        }, 120000)
    },

    description: `dump description`,

    usage: `[query]`
}