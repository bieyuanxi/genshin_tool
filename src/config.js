//default config
import { BaseDirectory, exists, createDir, writeTextFile, readTextFile } from "@tauri-apps/api/fs"
import { invoke } from "@tauri-apps/api"

export const appName = "flyme2genshin"

export const timeout = 15 * 1000   //15 seconds

export const apiDomain = "https://hk4e-api.mihoyo.com"
export const apiPath = "event/gacha_info/api/getGachaLog"

export const firstPage = "setting"

export const authKeyPath = ""

export const authKey = ""

const userConfigFile = "user_config.json"
const sysConfigFile = "sys_config.json"

export const GachaLogPath = "./"

let _config = defaultSysConfig();

export const sys_config = Object.assign(defaultSysConfig(), readSysConfig());   //merge
export const user_config = defaultUserConfig();

// invoke('test1')
//   // `invoke` returns a Promise
//   .then((response) => console.log(response));

readSysConfig();

//default config
export function defaultSysConfig() {
    return {
        genshin: {
            request: {
                api_domain: apiDomain,
                api_path: apiPath,
                timeout,
            },
            gacha_log: {
                dir: "",
                file_path: ""
            }
        },
        proxy: {},
        theme: {},
        log: {
            dir: BaseDirectory.AppLog,
            file_path: "",
        }

    };
}

export async function readSysConfig() {
    let dir = BaseDirectory.AppConfig;
    let config = JSON.stringify({});
    if(await exists(sysConfigFile, { dir })) {
        config = await readTextFile(sysConfigFile, { dir }).then(
            null,
            (reason) => {
                console.log("dbg! error occur when reading sys_config: " + reason);
            }
        );
    }

    return JSON.parse(config);
}

export async function writeSysConfig(config) {
    let dir = BaseDirectory.AppConfig;
    let file_path = sysConfigFile;

    await createDir("", { dir, recursive: true });  // create config dir if possible

    // will cover existing config file!!!
    await writeTextFile(file_path, JSON.stringify(config, null, 4), { dir, append: false });

}

export function defaultUserConfig() {
    return {

    };
}

// read user config file
export async function readUserConfig() {
    let dir = BaseDirectory.AppConfig;
    let config = JSON.stringify({});
    if(await exists(userConfigFile, { dir })) {
        config = await readTextFile(userConfigFile, { dir }).then(
            null,
            (reason) => {
                console.log("dbg! error occur when reading user_config: " + reason);
            }
        );
    }

    return JSON.parse(config);
}

export async function writeUserConfig(config) {
    let dir = BaseDirectory.AppConfig;
    let file_path = userConfigFile;

    await createDir("", { dir, recursive: true });  // create config dir if possible

    // will cover existing config file!!!
    await writeTextFile(file_path, JSON.stringify(config, null, 4), { dir, append: false });
}