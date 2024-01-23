import { reactive } from 'vue'

export const user = reactive({
    game_biz: "hk4e_cn",
    region: "cn_gf01",
    region_name: "天空岛",
    game_uid: "",
    nickname: "Terra",
    level: 60,
    mid: "",
    account_id: "",
    auth: {
        game_token: "",
        stoken: "",
        authkeyB: "",
    },

    updateGameToken(token) {
        this.auth.game_token = token
    },
    updateSToken(token) {
        this.auth.stoken = token
    },
    updateAuthkeyB(authkey) {
        this.auth.authkeyB = authkey
    }
})

