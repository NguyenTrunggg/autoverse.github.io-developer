export default class SocialIntegration {
    constructor(thirdPartyAccount, provider, integrationId, integrationName, accessToken) {
        this.thirdPartyAccount = thirdPartyAccount; // đối tượng ThirdPartyAccount
        this.thirdPartyAccountId = thirdPartyAccount?.id || null; // id của tài khoản
        this.provider = provider; // 'facebook', 'instagram', 'tiktok'
        this.integrationId = integrationId; // ID thực trên nền tảng (ví dụ: pageId)
        this.integrationName = integrationName; // tên fanpage/kênh
        this.accessToken = accessToken; // token API
    }
}
