timeOpened = new Date()

const send = document.getElementById("send")
const message = document.getElementById("message")
const username = document.getElementById("username")
const messages = document.getElementById("messages")
const container = document.getElementById("container")

let usernameText = localStorage.getItem("username") || null
username.value = usernameText
send.addEventListener("click", sendMsg)

async function sendMsg() {
	if  (message.value.trim() != "" && username.value.trim() != ""){
		username.value = await checkChat(username.value)
		console.log(encode(message.value))
		const newMessage = document.createElement("div")
		const msg = await checkChat(message.value)
		newMessage.style.backgroundColor = "rgba(60, 255, 0, 0.4)"
		newMessage.className = "message sent"
		newMessage.textContent = `You: ${msg}`
		messages.appendChild(newMessage)
		container.scrollTo({
			top: messages.scrollHeight,
			behavior: 'smooth'
		  })
		socket.send(JSON.stringify({
			"method": "set",
			"user": "player",
			"project_id": "1133733472",
			"name": "☁ hruhoqf",
			"value": encode(`${username.value}: ${msg}`)
		}))}
	message.value = ""
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
	console.log(new Date() - timeOpened)
	if (new Date() - timeOpened > 1000) {
		const newMessage = document.createElement("div")
		newMessage.className = "message received"
		newMessage.textContent = decode(JSON.parse(resp.data).value)
		messages.appendChild(newMessage)
		container.scrollTo({
			top: messages.scrollHeight,
			behavior: 'smooth'
		  })
	}
})

username.addEventListener("input", async () => {
	localStorage.setItem("username", username.value)
})

document.addEventListener("keypress", (event) => {
	message.focus()
	if (event.key == "Enter") {
		sendMsg()
	}
})

function checkChat(word){
	return axios.get(`https://www.purgomalum.com/service/plain?text=${word}`).then(response => {
		console.log(response.data)
		return response.data
	})
}
