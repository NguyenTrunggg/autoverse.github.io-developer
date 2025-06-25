export default class ThirdPartyAccount {
    constructor(user, provider, providerUserId, name, email, accessToken, refreshToken = null) {
        this.user = user;
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.name = name;
        this.email = email;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
