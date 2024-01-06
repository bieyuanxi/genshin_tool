// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{path::Path, string};

use tauri::api::file;
use tauri::api::path;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_authkey(path: &str) -> String {
    todo!()
}

fn store_authkey() -> bool {
    todo!()
}

#[tauri::command]
fn test1() {
    let strings = file::read_string(Path::new("/home/terra/Downloads/test.log")).unwrap();
    println!("{strings}");
}

#[tauri::command]
fn gen_default_config() {
    // path::BaseDirectory::AppConfig;
    let cfg_path = path::config_dir().unwrap();
    // println!("{cfg_path}");
}

fn query_record(game_id: i32, user: &str) {
    let strings = file::read_string(Path::new("~/.config/.trashrc")).unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            greet, test1
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
