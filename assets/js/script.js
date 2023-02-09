typingInfo = document.getElementById("typingInfo")
sendButton = document.getElementById("sendButton")
userNameInput = document.getElementById("userName")
messageInput = document.getElementById("text")
const url = ("ws://127.0.0.1:8080/game/"+name)
let ws = new WebSocket (url)
let typingUsers = new Map()
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

ws.onmessage = e =>{
    const data = JSON.parse(e.data)
    console.log(e.data);
    switch (data.type){
        case 1:
            createMessage(data)
            break;
        case 2:
            typingUsers.set(data.name, 0)

            updateTyping()

            setTimeout(()=>{
                typingUsers.clear()
                typingInfo.textContent = ""
            }, 3000)
            break
    }
}
ws.onclose = e =>{
    setTimeout(() =>{
        ws = new WebSocket(url)
    }, 1000)
}
// sendButton.onclick = () =>{
//     ws.send(JSON.stringify({
//         type: 1,
//         name: userNameInput.value,
//     }))
// }
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

let client = {
    Name: "asd",
    Message: "HELLO, Im  MAKSIM"

}
function createMessage(data) {

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
setInterval(SendCoords, 25)
function updateTyping() {
    let typing = []
    for (let [k,v] of typingUsers){
        console.log(k)
        typing.push(k)
    }
    console.log(typingUsers)
        if (typingUsers.size > 1){
            typingInfo.textContent = typing.join(", ") +  " набирают сообщение..."
        }
        else{
            typingInfo.textContent = typing.join(", ") +  " набирает сообщение..."
        }
    }
function UpdateFrame (players){
    for (let player of players) {
        const p = playerList.get(player.name)
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

            game.append(p1)
            playerList.set(player.name, p1)
        }
    }
}
    const A = {
        x: 0,
        y: 0,
    }
    HashChangeEvent(OfflineAudioCompletionEvent).FRAMEBUFFER_ATTACHMENT_OBJECT_NAME(KeyboardEvent).name