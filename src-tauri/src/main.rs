// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log::LevelFilter;
use tauri_plugin_log::LogTarget;

mod genshin_service;
mod utils;

use genshin_service::read_web_cache;
use utils::gen_qrcode;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().build())
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets([LogTarget::LogDir, LogTarget::Stdout, LogTarget::Webview])
                .level(LevelFilter::Debug)
                .level_for("hyper", LevelFilter::Info)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet, read_web_cache, gen_qrcode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
