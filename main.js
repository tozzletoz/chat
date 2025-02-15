const send = document.getElementById("send")
const message = document.getElementById("message")
const username = document.getElementById("username")
const messages = document.getElementById("messages")
const container = document.getElementById("container")

let usernameText = localStorage.getItem("username") || null
username.value = usernameText
send.addEventListener("click", sendMsg)

function sendMsg() {
	if  (message.value.trim() != "" && username.value.trim() != ""){
		console.log(encode(message.value))
		const newMessage = document.createElement("p")
		newMessage.style.backgroundColor = "rgba(60, 255, 0, 0.4)"
		newMessage.id = "chatItem"
		newMessage.textContent = `You: ${message.value}`
		messages.appendChild(newMessage)
		container.scrollTop = messages.scrollHeight
		socket.send(JSON.stringify({
			"method": "set",
			"user": "player",
			"project_id": "1133733472",
			"name": "☁ hruhoqf",
			"value": encode(`${username.value}: ${message.value}`)
		}))
	}
}

function encode(text) {
    return text.split('').map(char => {
        let code = char.charCodeAt(0).toString().padStart(4, '0')
        return code;
    }).join('');
}

function decode(encoded) {
    return encoded.match(/.{4}/g).map(num => String.fromCharCode(parseInt(num))).join('')
}

const socket = new WebSocket("wss://clouddata.turbowarp.org/")

socket.addEventListener("open", () => { socket.send(JSON.stringify({method:"handshake",user:"player",project_id:"1133733472"})) })

socket.addEventListener("message", (resp) => {
	const newMessage = document.createElement("p")
	newMessage.id = "chatItem"
	newMessage.textContent = decode(JSON.parse(resp.data).value)
	messages.appendChild(newMessage)
	container.scrollTop = messages.scrollHeight
})

username.addEventListener("input", () => {
	localStorage.setItem("username", username.value)
})

document.addEventListener("keypress", (event) => {
	if (event.key == "Enter") {
		sendMsg()
	}
})
