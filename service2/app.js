const express = require('express')
const mq = require('amqplib')
const app = express()
let mqData
connect()

async function connect() {
    try {
        //connect to the messaging queue server
        const connection = await mq.connect('amqp://localhost:5672')
        //create a channel on the mq server
        const channel = await connection.createChannel()
        //consume the data on the mq
        channel.consume('Queue 1', data => {
            //acknowledge consumption of the mq data
            channel.ack(data)
            //convert the data from a string to json format
            mqData = JSON.parse(data.content)
        })
    } catch (error) {
        return console.log(error)
    }

}
app.get('/', (req, res) => {
    if (mqData) {
        return res.status(200).json(mqData)
    } else {
        return res.status(200).json({ msg: "no updates from queue" })
    }
})
app.use((req, res) => {
    res.status(404).json({
        msg: "Invalid route",
    });
});

app.listen(6000, () => {
})