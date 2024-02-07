import Database from "tauri-plugin-sql-api";
import { db_name } from "./config"
import { error } from "tauri-plugin-log-api";
import { info } from "tauri-plugin-log-api";

export function key2sql(list = []) {
    // FIX ME: error handle when list is empty
    return `(${Object.keys(list[0]).toString()})`;
}

export function val2sql(list = []) {
    const vals = [];    //each one contains a sql VALUE
    for (const row of list) {
        let arr = Object.values(row);
        arr.forEach((val, i, array) => {
            array[i] = `'${val}'`;
        });
        vals.push(`(${arr.toString()})`)
    }

    return vals.toString();
}

export async function insertInto(table = "", list = []) {
    if (list.length == 0) return null;

    let db = await getDb(db_name);
    const keys = key2sql(list);
    const vals = val2sql(list);

    const sql = `INSERT into ${table} ${keys} VALUES ${vals}`;
    const ret = await db.execute(sql)

    return ret;
}

export async function selectFrom(column = ["*"], table = "", where = "", limit = 10, offset = 0) {
    let db = await getDb(db_name);
    const keys = `${column.toString()}`;
    const vals = [];    //each one contains a sql VALUE

    if (where != "") {
        where = "WHERE " + where;
    }

    const sql = `SELECT ${keys} FROM ${table} ${where} LIMIT ${limit} OFFSET ${offset}`;
    // console.log(sql)
    const ret = await db.select(sql)

    // console.log(ret)

    return ret;
}

export async function create_table() {
    let db = await getDb(db_name);

    await _create_tbl(db).catch(create_tbl_err);
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

    // // used to store user login info
    // await db.execute(
    //     `CREATE TABLE IF NOT EXISTS user(
    //         account_id  TEXT PRIMARY KEY NOT NULL,
    //         mid         TEXT,
    //         game_biz    TEXT,
    //         region      TEXT,
    //         region_name TEXT,
    //         game_uid    TEXT,
    //         nickname    TEXT,
    //         level       INT,
    //         game_token  TEXT    NOT NULL,
    //         stoken      TEXT,
    //         authkeyB    TEXT,
    //         login_time  INT     NOT NULL
    //     );`
    // );

    // used to store user account info
    await db.execute(
        `CREATE TABLE IF NOT EXISTS users(
            uid         TEXT PRIMARY KEY NOT NULL,
            mid         TEXT,
            game_token  TEXT,
            login_time  INT     NOT NULL
        );`
    );
}

export async function getDb(name = db_name){
    return await Database.load(name);
}

function create_tbl_err(reason) {
    console.log(reason)
    error(JSON.stringify(reason))
}
