const utils = require("./utils");
const state = require("./state");
const Discord = require('discord.js')
const embedColor = 0xCB0000

let ScrollQueue = async(message, bot, emoji) => {
    if (emoji != '⬆️' && emoji != '⬇️')
        return

    let OldEmbed = new Discord.MessageEmbed(message.embeds[0])
    const queue = state.get_queue(message);
    const current_idx = state.get_current(message);

    const Songs = OldEmbed['fields'][0]['value'].split('\n')

    let LastSong = emoji == '⬆️' ? Songs[0] : Songs[Songs.length - 1]
    let LastSongNumber = ""
    console.log(LastSong)

    if (LastSong.substring(0, 2) == '🎧') {
        LastSong = LastSong.substring(5, LastSong.length)
    }

    for (let i = 0; i < LastSong.length && LastSong[i] != ')'; i++)
        LastSongNumber += LastSong[i]
    console.log(LastSongNumber)
    let idx = Number(LastSongNumber) - 1
    console.log(idx)
    if (isNaN(idx)) {
        console.log("Song number Error")
        return
    }
    if ((idx >= queue.length - 1 && emoji == '⬇️') || idx <= 0) {
        console.log("No queue found")
        return
    }

    let start = null
    let end = null
    if (emoji == '⬆️') {
        start = idx - 10 > 0 ? idx - 10 : 0
        end = start + 10
    } else
    if (emoji == '⬇️') {
        start = idx + 1
        end = start + 10 < queue.length ? start + 10 : queue.length;
    }
    console.log(start)
    console.log(end)
    let mssg = "";

    let count = start + 1
    let tempCount = start + 1
    for (let i = start; i < end; i += 1) {
        if (current_idx == i) mssg = mssg + "🎧 \t\t" + tempCount.toString() + ") " + ` ${queue[i][0]}` + " 🎧\n";
        else mssg = mssg + tempCount.toString() + ") " + `${queue[i][0]}` + "\n";

        count = count + 1
        tempCount = count

    }
    const NewEmbed = {
        color: embedColor,
        title: "Music Queue",
        fields: [{
            name: "Tracks",
            value: mssg
        }]

    };
    await message.edit({ embed: NewEmbed }).then((msg) => {
        msg.react("⬆️")
        msg.react("⬇️")
    })

}
let XOGame = async(message, bot, emoji, player) => {

    let XO_state = state.get_XO(message)
    let user1 = XO_state.user1
    let user2 = XO_state.user2
    let NextToPlay = XO_state.NextToPlay

    if (player.username != NextToPlay || XO_state.messageID != message.id)
        return
    let cell = null
    if (NextToPlay == user1)
        cell = '🇽'
    else
        cell = '🅾️'

    let OldEmbed = new Discord.MessageEmbed(message.embeds[0])
    let rows = OldEmbed.title.split('\n')
    let board = []
    for (let i = 0; i < 3; i++) {
        let row = rows[i].split('\t')
        for (let j = 0; j < 3; j++)
            board.push(row[j])
    }

    // console.log(board)
    let number = null
    if (emoji == '1️⃣')
        number = 1
    else if (emoji == '2️⃣')
        number = 2
    else if (emoji == '3️⃣')
        number = 3
    else if (emoji == '4️⃣')
        number = 4
    else if (emoji == '5️⃣')
        number = 5
    else if (emoji == '6️⃣')
        number = 6
    else if (emoji == '7️⃣')
        number = 7
    else if (emoji == '8️⃣')
        number = 8
    else if (emoji == '9️⃣')
        number = 9
    else {
        return
    }
    number = number - 1

    // console.log(board)
    if (board[number] == '⬜') {
        board[number] = cell
    } else
        return
    let NewBoard = board[0] + "\t" +
        board[1] + "\t" +
        board[2] + "\n" +
        board[3] + "\t" +
        board[4] + "\t" +
        board[5] + "\n" +
        board[6] + "\t" +
        board[7] + "\t" +
        board[8]


    const NewEmbed = {
        color: embedColor,
        title: NewBoard,
        description: "XO Game"
    };



    XO_state.NextToPlay = NextToPlay == user1 ? user2 : user1
    await message.edit({ embed: NewEmbed })
    if ((board[0] == cell && board[1] == cell && board[2] == cell) ||
        (board[3] == cell && board[4] == cell && board[5] == cell) ||
        (board[6] == cell && board[7] == cell && board[8] == cell) ||
        (board[0] == cell && board[3] == cell && board[6] == cell) ||
        (board[1] == cell && board[4] == cell && board[7] == cell) ||
        (board[2] == cell && board[5] == cell && board[8] == cell) ||
        (board[0] == cell && board[4] == cell && board[8] == cell) ||
        (board[2] == cell && board[4] == cell && board[6] == cell)) {
        state.clear_XO(message)
        await message.channel.send("Congratulations! " + NextToPlay + " has won the game!")
        return
    }
    for (let i = 0; i < 9; i++)
        if (board[i] == '⬜')
            return

    state.clear_XO(message)
    await message.channel.send("No one won!")

}
module.exports = { ScrollQueue, XOGame }