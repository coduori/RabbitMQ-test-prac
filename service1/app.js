const express = require('express')
const mq = require('amqplib')
const app = express()
let channel, connection

connect()

async function connect() {
    try {
        //define the mq server URL
        const mqUrl = 'amqp://localhost:5672'
        //create a connection to the mq server
        connection = await mq.connect(mqUrl)
        //create a channel within the mq connection
        channel = await connection.createChannel()
        //add a queue within the channel
        await channel.assertQueue('Queue 1')
    } catch (error) {
        return console.log(error)
    }
}


app.post('/', async (req, res) => {
    const email = "coduori@finsense.co.ke"
    const username = "coduori"
    const data = { email, username }
    //prepare the data to be published as a buffer in form of a JSON String
    const bufferItem = Buffer.from(JSON.stringify(data))
    //publish the data to the queue
    await channel.sendToQueue('Queue 1', bufferItem)
    return res.status(200).json({ msg: "submitted to queue" })
})
app.use((_, res) => {
    res.status(404).json({
        msg: "Invalid route",
    });
});

app.listen(6001, () => {
})
