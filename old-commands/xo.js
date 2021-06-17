const imports = require('../imports')
Object.keys(imports).forEach(key => {
    global[key] = imports[key]
})

module.exports = async (message, args, bot) => {

    let Mention = message.mentions.users

    if (Mention.size != 1) {
        await message.channel.send("Mention only one user to play with. ex: .XO @someone")
        return
    }
    let user1Id = message.author.username
    let user2Id = Mention.values().next().value.username
    if (user2Id == user1Id) {
        await message.channel.send("You Can't play yourself")
        return
    }
    let NextToPlay = user1Id

    let XO_state = state.get_XO(message)
    let NewTime = (new Date()).getTime()

    if (XO_state.StartTime != null && (((NewTime - XO_state.StartTime) / 1000) < 45)) {
        await message.channel.send("You Can't play. There is still another game playing")
        return
    }

    XO_state.user1 = user1Id
    XO_state.user2 = user2Id
    XO_state.NextToPlay = NextToPlay
    XO_state.StartTime = NewTime

    let msg = "⬜\t⬜\t⬜\n⬜\t⬜\t⬜\n⬜\t⬜\t⬜"

    Msg = {
        color: embedColor,
        title: msg,
        description: "XO Game"
    }
    await message.channel.send({ embed: Msg }).then((msg) => {
        XO_state.messageID = msg.id
        msg.react('1️⃣')
        msg.react('2️⃣')
        msg.react('3️⃣')
        msg.react('4️⃣')
        msg.react('5️⃣')
        msg.react('6️⃣')
        msg.react('7️⃣')
        msg.react('8️⃣')
        msg.react('9️⃣')
    })
}