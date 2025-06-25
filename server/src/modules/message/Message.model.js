export default class Message {
    constructor(user, channel, content, status, sentTime = null) {
        this.user = user;
        this.channel = channel;
        this.content = content;
        this.sentTime = sentTime;
        this.status = status;
    }
}
