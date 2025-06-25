export default class Post {
    constructor(user, socialIntegration, template, channel, status, scheduledDate, scheduledHour) {
        this.user = user;
        this.socialIntegration = socialIntegration;
        this.template = template;
        this.channel = channel;
        this.status = status;
        this.scheduledDate = scheduledDate; // Expecting a Date object or string 'YYYY-MM-DD'
        this.scheduledHour = scheduledHour; // Expecting a string 'HH:mm:ss' or Date object with time only
    }
}
