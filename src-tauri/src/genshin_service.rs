use std::{fs::File, io::Read};

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

#[tauri::command]
pub fn read_web_cache(file_path: &str) -> Vec<String>{
    // this is a WebView cache index file,
    // ref to: https://ininet.org/an-evidence-based-android-cache-forensics-model.html?page=6
    let mut f = File::open(file_path).expect("web cache file not found");

    let mut buf = [0; 2048]; //web cache is 2048 bytes per block
    let binding = String::from("1/0/https"); // the keyword to match
    let identify = binding.as_bytes();

    let mut origin_text = Vec::new();
    while f.read(&mut buf).unwrap() > 0 {
        if buf.starts_with(&identify) {
            // let res = String::from_utf8_lossy(&buf);
            let res = String::from_utf8(buf.to_vec()).expect("slice not a valid utf8");
            
            origin_text.push(res.trim_end_matches(|c: char| {c.is_ascii_control()}).to_string());
        }
    }

    origin_text
}

async fn read_async() {
    
}