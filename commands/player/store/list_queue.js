const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['list_queue'],
    private: true,

    handler: async (message, args, session, bot, verbose=true, reply=true) => {

        const player = session.getPlayer(message)
        
        let saved_queue = await player.getSavedQueue(args, true)

        if (!saved_queue) return await (new bot.MessagesController.Message(message.channel, {
            type: 'danger',
            description: `Can't find this queue 😟`,
        }, reply ? message : undefined)).send()
        
        if (session.db_list_queue_message) {
            session.db_list_queue_message.setContent({ ...session.db_list_queue_message.params, component: undefined })
            await session.db_list_queue_message.send()

            bot.removeListener('clickButton', session.db_list_queue_click_button_listener)

            session.db_list_queue_message = undefined
            session.db_list_queue_click_button_listener = undefined
        }
        
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
        
        const db_list_queue_message = new bot.MessagesController.Message(message.channel, {}, message)

        const update_db_list_queue_message = async (db_list_queue_message, page=-1) => {
            let { embed, num_pages, page_idx } = saved_queue.getEmbed(page, false)

            buttons.components[0].disabled = !(page_idx != 0)
            buttons.components[1].disabled = !(page_idx != 0)
            buttons.components[2].disabled = !(page_idx != num_pages - 1)
            buttons.components[3].disabled = !(page_idx != num_pages - 1)
            
            if (embed)  {
                db_list_queue_message.setContent({ embed, component: [buttons] })
            }
            else
                db_list_queue_message.setContent({
                    type: 'danger',
                    description: `No saved queues exist`,
                })
            await db_list_queue_message.send()
            return page_idx
        }

        page_idx = await update_db_list_queue_message(db_list_queue_message, page_idx)
        
        async function db_list_queue_click_button_listener(button) {
            if (button.id === first_page_button_id) page_idx = 0
            if (button.id === prev_page_button_id) page_idx -= 1
            if (button.id === next_page_button_id) page_idx += 1
            if (button.id === last_page_button_id) page_idx = -2

            page_idx = await update_db_list_queue_message(db_list_queue_message, page_idx)

            button.defer()
        }
        bot.on('clickButton', db_list_queue_click_button_listener)

        session.db_list_queue_message = db_list_queue_message
        session.db_list_queue_click_button_listener = db_list_queue_click_button_listener

    },

    description: `dump description`,

    usage: `[title]`
}