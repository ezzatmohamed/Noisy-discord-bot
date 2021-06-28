const { MessageActionRow, MessageButton } = require('discord-buttons')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: ['help', 'h'],

    handler: async (message, args, session, bot) => {
        
        let page_idx = 0
        help_list = bot.CommandsController.commands.filter(command => command.name[0] !== 'help')
        const pages = help_list.chunk(4)

        const random_token = Math.random().toString(36).substring(7)
        const prev_page_button_id = 'prev_page_button' + random_token
        const next_page_button_id = 'next_page_button' + random_token

        const prev_page_button = new MessageButton().setLabel(true ? '' :'Previous Page').setEmoji('🔼').setStyle('grey').setID(prev_page_button_id)
        const next_page_button = new MessageButton().setLabel(true ? '' :'Next Page').setEmoji('🔽').setStyle('grey').setID(next_page_button_id)

        const buttons = new MessageActionRow()
            .addComponent(prev_page_button)
            .addComponent(next_page_button)

        const help_message = new bot.MessagesController.Message(message.channel, {})

        const getHelpEmbed = () => {
            let embed = new MessageEmbed()
                .setDescription(`**Help**` + (pages.length > 1 ? ` page ${page_idx + 1}/${pages.length}` : '') + '\n\n' +
                    pages[page_idx].map(command => `${process.env.PREFIX}${command.name.map(name => '**' + name + '**').join('/')} ${command.usage}\n` + `${command.description}`).join('\n\n')
                )
            return embed
        }

        const update_help_message = async () => {
            const embed = getHelpEmbed()

            buttons.components[0].disabled = !(page_idx != 0)
            buttons.components[1].disabled = !(page_idx < pages.length - 1)
            
            help_message.setContent({ embed, component: pages.length > 1 ? [buttons] : undefined })
            
            await help_message.send()
        }
        await update_help_message()

        async function click_button_listener(button) {
            if (button.id === prev_page_button_id) page_idx -= 1
            if (button.id === next_page_button_id) page_idx += 1

            await update_help_message()

            button.defer()
        }
        bot.on('clickButton', click_button_listener)

        setTimeout(async () => {
            bot.removeListener('clickButton', click_button_listener)
        }, 120000)
    },

    description: `dump description`,

    usage: `[title]`
}