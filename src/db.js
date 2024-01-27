import Database from "tauri-plugin-sql-api";
import { db_name } from "./config"
import { error } from "tauri-plugin-log-api";
import { info } from "tauri-plugin-log-api";

export async function insertInto(table = "", data = []) {
    if (data.length == 0) return null;

    let db = await Database.load(db_name);
    const keys = `(${Object.keys(data[0]).toString()})`;
    const vals = [];    //each one contains a sql VALUE

    for (const row of data) {
        let arr = Object.values(row);
        arr.forEach((val, i, array) => {
            array[i] = `'${val}'`;
        });
        vals.push(`(${arr.toString()})`)
    }

    const sql = `INSERT into ${table} ${keys} VALUES ${vals.toString()}`;
    const ret = await db.execute(sql).finally(async () => {
        await db.close(db_name);
    });

    return ret;
}

export async function selectFrom(column = ["*"], table = "", where = "", limit = 10, offset = 0) {
    let db = await Database.load(db_name);
    const keys = `${column.toString()}`;
    const vals = [];    //each one contains a sql VALUE

    if (where != "") {
        where = "WHERE " + where;
    }

    const sql = `SELECT ${keys} FROM ${table} ${where} LIMIT ${limit} OFFSET ${offset}`;
    // console.log(sql)
    const ret = await db.select(sql).finally(async () => {
        await db.close(db_name);
    });

    // console.log(ret)

    return ret;
}

export async function create_table() {
    const data_db = db_name;

    let db = await Database.load(data_db);

    await _create_tbl(db)
        .catch(create_tbl_err)
        .finally(async () => await db.close(data_db));

}

async function _create_tbl(db) {
    // used to store gacha data TODO: UIGF v2.4
    await db.execute(
        `CREATE TABLE IF NOT EXISTS gacha_log(
            id          TEXT PRIMARY KEY     NOT NULL,
            uid         TEXT    NOT NULL,
            gacha_type  TEXT    NOT NULL,
            item_id     TEXT    NOT NULL,
            count       TEXT    NOT NULL,
            time        TEXT    NOT NULL,
            name        TEXT    NOT NULL,
            lang        TEXT    NOT NULL,
            item_type   TEXT    NOT NULL,
            rank_type   TEXT    NOT NULL
        );`
    );

    // used to store user login info
    await db.execute(
        `CREATE TABLE IF NOT EXISTS user(
            account_id  TEXT PRIMARY KEY NOT NULL,
            mid         TEXT,
            game_biz    TEXT,
            region      TEXT,
            region_name TEXT,
            game_uid    TEXT,
            nickname    TEXT,
            level       INT,
            game_token  TEXT    NOT NULL,
            stoken      TEXT,
            authkeyB    TEXT,
            last_login  INT     NOT NULL
        );`
    );
}

export async function queryUserInfo(game_uid = null){
    let db = await Database.load(db_name);
    let sql = "";
    if(game_uid) {
        sql = `SELECT * FROM user WHERE game_uid='${game_uid}'`;
    }else {
        sql = `SELECT * FROM user ORDER BY last_login DESC`;
    }
    return await db.select(sql);
}


function create_tbl_err(reason) {
    console.log(reason)
    error(JSON.stringify(reason))
}
