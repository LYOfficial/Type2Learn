// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn save_data(data: String) -> Result<(), String> {
    let mut path = std::env::current_exe().map_err(|e| e.to_string())?;
    path.pop(); // 移除 exe 文件名，得到目录
    path.push("data.json");
    fs::write(path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn load_data() -> Result<String, String> {
    let mut path = std::env::current_exe().map_err(|e| e.to_string())?;
    path.pop();
    path.push("data.json");
    if path.exists() {
        fs::read_to_string(path).map_err(|e| e.to_string())
    } else {
        Ok("".to_string())
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save_data, load_data])
        .setup(|app| {
            // 获取主窗口
            let _window = app.get_webview_window("main").unwrap();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
