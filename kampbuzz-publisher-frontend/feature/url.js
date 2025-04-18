/**
 * The function `url` returns the value of the VITE_BASE_URL environment variable if it exists.
 * @returns The `url` function is returning the value of the `VITE_BASE_URL` environment variable if it is
 * defined, otherwise it will return an empty string.
 */

function url() {
    let url = "http://127.0.0.1:3000/api/v1"
    if (import.meta.env.VITE_BASE_URL) {
        url = `${import.meta.env.VITE_BASE_URL}`
    }

    return url
}
export default url