use std::{fs::File, io::Read};

#[tauri::command]
// read all https text from web cache file
pub fn read_web_cache(file_path: &str) -> Result<Vec<String>, String>{
    // this is a WebView cache index file,
    // ref to: https://ininet.org/an-evidence-based-android-cache-forensics-model.html?page=6
    let mut file;
    if let Ok(_f) = File::open(file_path) {
        file = _f;
    }else {
        return Err("web cache file not found".to_string());
    }

    let mut buf = [0; 2048]; //web cache is 2048 bytes per block
    let binding = String::from("1/0/https"); // the keyword to match
    let identify = binding.as_bytes();

    let mut origin_text = Vec::new();
    while file.read(&mut buf).unwrap_or(0) > 0 {
        if buf.starts_with(&identify) {
            // let res = String::from_utf8_lossy(&buf);
            if let Ok(res) = String::from_utf8(buf.to_vec()) {  // Err: slice not a valid utf8
                origin_text.push(res.trim_end_matches(|c: char| {c.is_ascii_control()}).to_string());
            }
        }
    }

    Ok(origin_text)
}
