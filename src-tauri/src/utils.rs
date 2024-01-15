
use fast_qr::qr::QRBuilder;

#[tauri::command]
pub fn gen_qrcode(url: &str) -> Result<String, String> {
    // QRBuilder::new can fail if content is too big for version,
    // please check before unwrapping.
    let qrcode = match QRBuilder::new(url)
    .build() {
        Ok(code) => code,
        Err(err) => return Err(err.to_string())
    };

    let str = qrcode.to_str(); // .print() exists
    
    Ok(str)
}