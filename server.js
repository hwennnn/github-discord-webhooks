const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Client, Intents } = require('discord.js');
require('dotenv').config()

const PORT = 8080;
const clientPrivate = process.env.DISCORD_CLIENT_PRIVATE;
const channelID = process.env.DISCORD_CHANNEL_ID;
const app = express();
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

app.use(helmet()); //safety
app.use(cors()); //safety
app.use(express.json()); //receive do respond with request

app.get('/', function (req, res) {
    res.json('Hello World!')
})

app.post('/api/v1/github_webhook', async function (req, res) {
    let body = req.body;
    var message;

    if (body.action === 'opened' && body.pull_request !== null && body.pull_request !== undefined) {
        message = `@everyone\nThere is a new PR #${body.number},\n${body.pull_request.title} by ${body.pull_request.user.login},\nHere's the url ${body.pull_request.html_url}.`;
    } else if (body.action === 'opened' && body.issue !== null && body.issue !== undefined) {
        message = `@everyone\nThere is a new Issue #${body.issue.number},\n${body.issue.title} by ${body.issue.user.login},\nHere's the url ${body.issue.html_url}.`;
    } else if (body.action == 'closed' && body.pull_request !== null && body.pull_request !== undefined && body.pull_request.merged === true) {
        message = `@everyone\nThe PR #${body.number}, ${body.pull_request.title}\nhas been merged into ${body.pull_request.base.ref} by ${body.pull_request.user.login},\nHere's the url ${body.pull_request.html_url}.`;
    } else if (body.action == 'closed' && body.issue !== null && body.issue !== undefined) {
        message = `@everyone\nThe Issue #${body.issue.number},\n${body.issue.title} has been closed by ${body.sender.login},\nHere's the url ${body.issue.html_url}.`;
    }

    if (message !== null && message !== undefined) {
        const channel = await client.channels.fetch(channelID);
        await channel.send(message);
    }

    res.sendStatus(200);
})

async function initDiscordClient() {
    await client.login(clientPrivate)
    console.log('done init client')
}

app.listen(PORT, async () => {
    console.log(`Listening on port ${PORT}`);
});

initDiscordClient();