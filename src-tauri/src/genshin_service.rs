use serde::Serialize;
use sqlx::{Pool, Sqlite, sqlite::SqliteQueryResult};

#[derive(Serialize)]
pub struct RetMsg {
    changes: u64,
    last_insert_rowid: i64,
}

impl From<SqliteQueryResult> for RetMsg {
    fn from(value: SqliteQueryResult) -> Self {
        Self {
            changes: value.rows_affected(),
            last_insert_rowid: value.last_insert_rowid(),
        }
    }
}


#[tauri::command]
pub async fn create_genshin_table(pool: tauri::State<'_, Pool<Sqlite>>) -> Result<RetMsg, String> {
    let result = sqlx::query(
        "CREATE TABLE IF NOT EXISTS todos
        (
            id          INTEGER PRIMARY KEY NOT NULL,
            description TEXT                NOT NULL,
            done        BOOLEAN             NOT NULL DEFAULT 0
        );").execute(pool.inner()).await;

        match result {
            Ok(result) => Ok(result.into()),
            Err(msg) => Err(msg.to_string()),
        }
}

pub async fn insert_genshin_table(pool: &Pool<Sqlite>) -> Result<RetMsg, String> {


    let result = sqlx::query(
    "INSERT INTO todos VALUES (1,'value2',false);")
    .execute(pool).await;
    match result {
        Ok(result) => Ok(result.into()),
        Err(msg) => Err(msg.to_string()),
    }
}

pub async fn insert() {

}