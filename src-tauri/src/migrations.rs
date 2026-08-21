use tauri_plugin_sql::{Migration, MigrationKind};

pub fn migrations() -> Vec<Migration> {
    vec![migrate_v1(), migrate_v2()]
}

fn migrate_v1() -> Migration {
    Migration {
        version: 1,
        description: "create_initial_tables",
        sql: r#"CREATE TABLE IF NOT EXISTS gacha_log(
            id          TEXT PRIMARY KEY     NOT NULL,
            uid         TEXT    NOT NULL,
            gacha_type  TEXT    NOT NULL,
            item_id     TEXT    NOT NULL,
            count       TEXT    NOT NULL,
            time        TEXT    NOT NULL,
            name        TEXT    NOT NULL,
            lang        TEXT    NOT NULL,
            item_type   TEXT    NOT NULL,
            rank_type   TEXT    NOT NULL
        );"#,
        kind: MigrationKind::Up,
    }
}

fn migrate_v2() -> Migration {
    Migration {
        version: 2,
        description: "add column op_gacha_type to table gacha_log",
        sql: r#"
        ALTER TABLE gacha_log ADD COLUMN op_gacha_type TEXT;
        "#,
        kind: MigrationKind::Up,
    }
}