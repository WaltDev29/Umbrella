class User {
    constructor({ user_id, user_tel, user_pw, created_at }) {
        this.user_id = user_id;
        this.user_tel = user_tel;
        this.user_pw = user_pw;
        this.created_at = created_at;
    }


    isTelValid() {
        const tel1 = /^01[016789]-\d{3,4}-\d{4}$/;
        const tel2 = /^01[016789]\d{7,8}$/;
        return tel1.test(this.user_tel) || tel2.test(this.user_tel);
    }

    isPasswordValid() {
        const reg = /^\d{4}$/;
        return reg.test(this.user_pw);
    }

    // todo 밑에 두 개 필요함?
    isUserAllTrue() {
        return this.isTelValid() && this.isPasswordValid();
    }

    isUserFalse() {
        return !this.isUserAllTrue();
    }

}

export default User;