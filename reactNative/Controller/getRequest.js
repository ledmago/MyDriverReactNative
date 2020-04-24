import config from '../config.json';
export default sendPostRequest = async (params, api) => {

    try {
        let response = await fetch(config.apiURL + api + '/', { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json', }, body: JSON.stringify(params), });
        let json = await response.json();
        return json;
    } catch (error) {
        console.log(error)
        return false;
    }

}
