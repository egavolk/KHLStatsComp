export function makeRequest(page) {
    let server_url = 'http://0.0.0.0:8000/'

    return fetch(server_url + page, {
        headers:{"Content-Type": "application/json"}
      })
      .then((response) => response.json());
}