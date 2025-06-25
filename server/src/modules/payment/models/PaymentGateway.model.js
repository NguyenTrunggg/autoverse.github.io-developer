export default class PaymentGateway {
    constructor(name, apiUrl, callbackUrl, clientId, clientSecret, status) {
        this.name = name;
        this.apiUrl = apiUrl;
        this.callbackUrl = callbackUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.status = status;
    }
}
