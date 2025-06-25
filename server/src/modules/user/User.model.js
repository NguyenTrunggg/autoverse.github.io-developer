export default class User {
    constructor(
        name,
        email,
        phone,
        address,
        password,
        role = null,
        status = null,
        loginProvider = null,
        providerId = null
    ) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.password = password;
        this.role = role;
        this.status = status;
        this.loginProvider = loginProvider;
        this.providerId = providerId;
    }
}
