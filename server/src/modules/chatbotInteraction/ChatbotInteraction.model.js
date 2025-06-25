export default class ChatbotInteraction {
    constructor(
        user,
        aiModel,
        message,
        response,
        interactionId = null,
        timestamp = new Date()
    ) {
        this.interactionId = interactionId;
        this.user = user;
        this.aiModel = aiModel;
        this.message = message;
        this.response = response;
        this.timestamp = timestamp;
    }
}
