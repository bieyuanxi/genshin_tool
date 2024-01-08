// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod genshin_service;

use std::path::Path;

use genshin_service::{create_genshin_table, read_web_cache, RetMsg};

use sqlx::{
    sqlite::SqlitePoolOptions,
    Pool, Sqlite,
};

use tauri::{api::file, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn test1() {
    let strings = file::read_string(Path::new("/home/terra/Downloads/test.log")).unwrap();
    println!("{strings}");
}



#[tauri::command]
async fn pool_request(pool: tauri::State<'_, Pool<Sqlite>>) -> Result<RetMsg, String> {
    let result = sqlx::query("DELETE FROM table").execute(pool.inner()).await;
    match result {
        Ok(result) => Ok(result.into()),
        Err(msg) => Err(msg.to_string()),
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = tauri::async_runtime::spawn(async move {
                let pool = SqlitePoolOptions::new()
                    .max_connections(5)
                    .connect("sqlite::memory:")
                    .await
                    .expect("connect DB failed");
                pool
            });

            if let Ok(pool) = tauri::async_runtime::block_on(handle) {
                app.manage(pool);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet,
            test1,
            pool_request,
            create_genshin_table,
            read_web_cache
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
