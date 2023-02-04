typingInfo = document.getElementById("typingInfo")
sendButton = document.getElementById("sendButton")
userNameInput = document.getElementById("userName")
messageInput = document.getElementById("text")
const url = ("ws://127.0.0.1:8080/ws")
let ws = new WebSocket (url)
let typingUsers = new Map()
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
        name: userNameInput.value,
        message: messageInput.value,
    }))
}
messageInput.oninput = () =>{
    if (messageInput. value.length > 0){
        ws.send(JSON.stringify({
            type: 2,
            name: userNameInput.value,
        }))
    }
}

let client = {
    Name: "asd",
    Message: "HELLO, Im  MAKSIM"

}
function createMessage(data) {

}
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




    const A = {
        x: 0,
        y: 0,
    }