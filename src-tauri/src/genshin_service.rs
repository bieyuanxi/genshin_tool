use std::{fs::File, io::Read};

#[tauri::command]
// read all https text from web cache file
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
