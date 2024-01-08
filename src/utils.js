

export async function sleep(ms = 1000) {
    await new Promise(res => setTimeout(res, ms));
}