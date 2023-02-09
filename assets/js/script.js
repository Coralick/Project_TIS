typingInfo = document.getElementById("typingInfo")
sendButton = document.getElementById("sendButton")
userNameInput = document.getElementById("userName")
messageInput = document.getElementById("text")
const game = document.querySelector(".game")


let playerList = new Map()

const player = document.createElement('div')
player.className = "player"
player.style.width = "100px"
player.style.height = "100px"
player.style.backgroundColor = "#FF0010"

game.append(player)
playerList.set(playerName,player)

const url = ("ws://127.0.0.1:8080/game/"+ playerName)
let ws = new WebSocket (url)
let typingUser = new Map()

let keyPressed = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
}

document.onkeydown = (e) => {
    keyPressed[e.code] = true
}

document.onkeyup = (e) => {
    keyPressed[e.code] = false
}

function SendCoords(){
    let direction = {
        x: 0,
        y: 0
    }
    if (keyPressed.ArrowLeft === true ^ keyPressed.ArrowRight === true){
        if (keyPressed.ArrowLeft === true) {
            direction.x = -1
        } else{
            direction.x = 1
        }
    }
    if (keyPressed.ArrowUp === true ^ keyPressed.ArrowDown === true){
        if (keyPressed.ArrowUp === true) {
            direction.y = -1
        } else{
            direction.y = 1
        }
    }
    ws.send(JSON.stringify({
        type: 3,
        data: JSON.stringify(direction)
    }))
}

ws.onmessage = e =>{
    const data = JSON.parse(e.data)
    console.log(e.data);

    const dataMesseng = JSON.parse(data.data)

    switch (data.type){
        case 1:
            createMessage(dataMesseng)
            break;
        case 2:
            playerList.set(dataMesseng.name, 0)

            updateTyping()

            setTimeout(()=>{
                playerList.clear()
                typingInfo.textContent = ""
            }, 3000)
            break
        case 3:
            UpdateFrame(dataMesseng)
            break
    }
}
ws.onclose = e =>{
    setTimeout(() =>{
        ws = new WebSocket(url)
    }, 1000)
}

sendButton.onclick = () =>{
    ws.send(JSON.stringify({
        type: 1,
        data:JSON.stringify({
            name:playerName
        }) 
    }))
}

sendButton.onclick = () => {
    ws.send(JSON.stringify({
        type: 1,
        data: JSON.stringify({
            name: playerName,
            message: messageInput.value,
        })

    }))
}

messageInput.oninput = () =>{
    if (messageInput. value.length > 0){
        ws.send(JSON.stringify({
            type: 2,
            data: JSON.stringify({
                name: playerName,
            })
        }))
    }
}
function createMessage(data){
    const messegeDiv = document.createElement("div")
    const userName = document.createElement("span")
    const userMsg = document.createElement("span")

    messegeDiv.append(userName,userMsg)
    userName.textContent = data.name +": "
    userMsg.textContent = data.message
    messegContainer.append(messegeDiv)
}

// let client = {
//     Name: "asd",
//     Message: "HELLO, Im  MAKSIM"

// }



setInterval(SendCoords, 25)

function updateTyping() {
    let typing = []
    for (let k of typingUser){
        console.log(k)
        typing.push(k)
    }
    console.log(playerList)
        if (playerList.size > 1){
            typingInfo.textContent = typing.join(", ") +  " набирают сообщение..."
        }
        else{
            typingInfo.textContent = typing.join(", ") +  " набирает сообщение..."
        }
    }

function UpdateFrame (players){
    for (let player of players) {
        const p = playerList.get(player.name)
        if(player.isDead == true){
            if(p) p.remove()
            playerList.delete(player.name)
            continue
        
        }
        if (p) {
            p.style.left = player.coords.X + "px"
            p.style.top = player.coords.Y + "px"
            p.style.height = (player.radius * 100) + "px"
            p.style.width = (player.radius * 100) + "px"
        } else {
            const p1 = document.createElement("div")
            p1.className = "player"
            p1.style.width = "100px"
            p1.style.height = "100px"
            p1.style.backgroundColor = "#000000"
            p1.textContent = "Саблезубый ййй"

            game.append(p1)
            playerList.set(player.name, p1)
        }
    }
}

    const A = {
        x: 0,
        y: 0,
    }