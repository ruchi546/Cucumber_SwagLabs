const { $ } = require('@wdio/globals')
const Page = require('./page');

class LoginPage extends Page {
    get inputUsername () {
        return $('[data-test="username"]');
    }

    get inputPassword () {
        return $('[data-test="password"]');
    }

    get btnSubmit () {
        return $('[data-test="login-button"]');
    }

    get errorMessage () {
        return $('[data-test="error"]');
    }

    get loginCredentials () {
        return $('[data-test="login-credentials"]');
    }

    get loginPassword () {
        return $('[data-test="login-password"]');
    }

    get loginWrapperInner () {
        return $('.login_wrapper-inner');
    }

    get loginCredentialsWrapInner () {
        return $('.login_credentials_wrap-inner');
    }

    async login (username, password) {
        await this.inputUsername.setValue(username);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    async fillUsername(username) {
        await this.inputUsername.clearValue();
        await this.inputUsername.setValue(username);
    }

    async fillPassword(password) {
        await this.inputPassword.clearValue();
        await this.inputPassword.setValue(password);
    }

    async clickLoginButton() {
        await this.btnSubmit.click();
    }

    open () {
        return super.open('');
    }
}

module.exports = new LoginPage();