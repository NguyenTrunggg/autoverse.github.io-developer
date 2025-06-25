export default class UserPromotion {
    constructor(user, startDate, endDate, aiModel, note = null) {
        this.user = user;
        this.startDate = startDate;
        this.endDate = endDate;
        this.aiModel = aiModel;
        this.note = note;
    }
}
