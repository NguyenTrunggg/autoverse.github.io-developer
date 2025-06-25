export default class Payment {
    constructor(user, method, amount, transactionId, status = null) {
        this.user = user;
        this.method = method;
        this.amount = amount;
        this.transactionId = transactionId;
        this.status = status;
    }
}
