import { api, app } from "../main"
import Component from "./Component"
import EmojiPicker from "./EmojiPicker"
import PostView from "./PostView"

// Credits to DeepSeek-R1, wow (edited though)
export default class ChatInput extends Component {

	readonly emojiPicker: EmojiPicker

	constructor(postView: PostView) {
		super("div", { id: "chat-input-container" })

		// Create file upload button
		const fileUploadLabel = document.createElement("label")
		fileUploadLabel.className = "file-upload-button"
		
		const fileInput = document.createElement("input")
		fileInput.type = "file"
		fileInput.className = "hidden-file-input"
		
		fileUploadLabel.appendChild(fileInput)

		// Create chat input
		const chatInput = document.createElement("div")
		chatInput.className = "chat-input"
		chatInput.setAttribute("contenteditable", "true")
		chatInput.setAttribute("placeholder", "Message #channel")
		chatInput.addEventListener("keypress", e => {
			if (e.code == "Enter" && !e.shiftKey) {
				e.preventDefault()
				const content = chatInput.innerText.trim()
				if (content == "") return
				chatInput.innerHTML = ""

				async function createMessage() {
					const forum_id = postView.getCurrentForumId()
					const post_id  = postView.getCurrentPostId()
					if (!forum_id || !post_id) {
						throw new Error("TODO")
					}

					const msg = await api.createMessage(forum_id, post_id, { content })
					console.log(msg)
				}

				console.log("Send MSG:", chatInput.innerText)
				createMessage()
			}
		})
		chatInput.addEventListener('input', () => { // this fixes weird browser behavior
			if (chatInput.innerHTML == "<br>") chatInput.innerHTML = ""
		})

		// Create emoji button
		const emojiButton = document.createElement("button")
		emojiButton.className = "emoji-button"
		emojiButton.setAttribute("popovertarget", "chat-input-emoji-picker")
		emojiButton.setAttribute("popovertargetaction", "show")

		// Emoji Picker
		this.emojiPicker = new EmojiPicker("chat-input-emoji-picker", "chat-input-container", emoji => {
			chatInput.textContent += emoji.native
		})

		// Div-engers, Assemble!
		this.element.appendChild(fileUploadLabel)
		this.element.appendChild(chatInput)
		this.element.appendChild(emojiButton)
		this.element.appendChild(this.emojiPicker.element)
	}

}
