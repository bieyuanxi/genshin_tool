import { reactive } from 'vue'


export const user = reactive({
    game_biz: "hk4e_cn",
    region: "cn_gf01",
    region_name: "天空岛",
    game_uid: "",
    nickname: "Terra",
    level: 60,
    mid: "",
    uid: "",
    game_token: "",
    stoken: "",
    authkeyB: "",
    curr_role: {},

    updateUID(uid, game_token) {
        this.uid = uid;
        this.game_token = game_token;
    },

    updateGameId(game_id) {
        this.game_uid = game_id;
    },

    updateGameToken(token) {
        this.game_token = token
    },
    updateSToken(token) {
        this.stoken = token
    },
    updateAuthkeyB(authkey) {
        this.authkeyB = authkey
    },
    updateCurrentRole(role) {
        this.curr_role = role;
    }
})
