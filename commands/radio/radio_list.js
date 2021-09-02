const { MessageActionRow, MessageButton } = require('discord-buttons')

module.exports = {
    name: ['radio_list'],
    private: true,

    handler: async (message, args, session, bot) => {

        const radio = session.getRadio(message)
        
        if (session.radio_message) {
            session.radio_message.setContent({ ...session.radio_message.params, component: undefined })
            await session.radio_message.send()

            radio.removeListener('RadioChanged', session.radio_changes_listener)
            bot.removeListener('clickButton', session.radio_click_button_listener)

            session.radio_message = undefined
            session.radio_changes_listener = undefined
            session.radio_click_button_listener = undefined
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
        
        const radio_message = new bot.MessagesController.Message(message.channel, {}, message)

        const update_radio_message = async (radio_message, page=-1) => {
            let { embed, num_pages, page_idx } = radio.getEmbed(page)

            buttons.components[0].disabled = !(page_idx != 0)
            buttons.components[1].disabled = !(page_idx != 0)
            buttons.components[2].disabled = !(page_idx != num_pages - 1)
            buttons.components[3].disabled = !(page_idx != num_pages - 1)
            
            if (embed)  {
                radio_message.setContent({ embed, component: [buttons] })
            }
            else
                radio_message.setContent({
                    type: 'danger',
                    description: `No radio channels exist`,
                })
            await radio_message.send()
            return page_idx
        }

        page_idx = await update_radio_message(radio_message, page_idx)

        async function radio_changes_listener() {
            page_idx = await update_radio_message(radio_message, page_idx)
        }
        radio.on('RadioChanged', radio_changes_listener)
        
        async function radio_click_button_listener(button) {
            if (button.id === first_page_button_id) page_idx = 0
            if (button.id === prev_page_button_id) page_idx -= 1
            if (button.id === next_page_button_id) page_idx += 1
            if (button.id === last_page_button_id) page_idx = -2

            page_idx = await update_radio_message(radio_message, page_idx)

            button.defer()
        }
        bot.on('clickButton', radio_click_button_listener)

        session.radio_message = radio_message
        session.radio_changes_listener = radio_changes_listener
        session.radio_click_button_listener = radio_click_button_listener


    },

    description: `dump description`,

    usage: `[title]`
}