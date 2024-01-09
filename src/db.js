import Database from "tauri-plugin-sql-api";
import { db_name } from "./config"

export async function insertInto(table = "", data = []) {
    if (data.length == 0) return;

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
}

export async function selectFrom(column = ["*"], table = "", where = {}) {
    if (data.length == 0) return;

    let db = await Database.load(db_name);
    const keys = `${column.toString()}`;
    const vals = [];    //each one contains a sql VALUE

    let where_msg = "";
    for (let [key, val] of Object.entries(where)) {
        where_msg += "";
    }

    const sql = `SELECT ${keys} FROM ${table} WHERE ${where_msg}`;
    const ret = await db.execute(sql).finally(async () => {
        await db.close(db_name);
    });
}


