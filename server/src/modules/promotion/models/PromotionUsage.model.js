export default class PromotionUsage {
    constructor(user, promotion, serviceType, usageDate, count) {
        this.user = user;
        this.promotion = promotion;
        this.serviceType = serviceType;
        this.usageDate = usageDate;
        this.count = count;
    }
}
