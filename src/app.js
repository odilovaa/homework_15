const  express = require('express')
const http = require('http')
const {Server} = require("socket.io")
const {EvenEmitter} = require('events')
const fileUpload = require("express-fileupload")

const ee = new EvenEmitter()

const app = express()

app.use(fileUpload())
app.use(express.static(process.cwd() + "/uploads"))

app.set("view engine", "ejs")

const server  = http.createServer(app)

app.get("/", (req, res) =>
{
    res.render("index")
})

const io = new Server(server, {
    cors:{
        origen: "*"
    }
});

const groups = []
const files = []

io.on("connection", () =>
{
    socket.on("groupName", ({name, author}) =>
    {
        const findGroup = groups.find((group) => group.name === name)
        if(!findGroup)
        {
            groups.push({name, author})
        }
        io.emit("groups", {groups})

    })

    socket.on("joinGroup", ({name, group, message}) =>
    {
        socket.join(group);
        io.to(group).emit("message", {message : `${name} sended message: ${message}`});
    })

    socket.on("disconnect", () =>
    {
        console.log("Disconnected... ");
    })

    ee.on("photo", (data) =>
    {
        io.emit("file", {data})
    })

    const file = req.files.photo
    file.mv(process.cwd() + "/uploads/" + file.name)
    files.push(file.name)
    ee.emit("photo", {files})
})


server.listen(5050, () => 
{
    console.log(5050);
});