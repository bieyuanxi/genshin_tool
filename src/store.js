import { reactive } from 'vue'
import Database from "tauri-plugin-sql-api";
import { db_name } from "./config"

export const user = reactive({
    game_biz: "hk4e_cn",
    region: "cn_gf01",
    region_name: "天空岛",
    game_uid: "",
    nickname: "Terra",
    level: 60,
    mid: "",
    account_id: "",
    game_token: "",
    stoken: "",
    authkeyB: "",

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

let db = await Database.load(db_name);
let ret = await db.select("SELECT * FROM user ORDER BY login_time DESC LIMIT 1");
console.log(Object.assign(user, ret[0]))
