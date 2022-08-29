import axios from 'axios';

export const translate = async (text, languageCode) => {
    
    const encodedParams = new URLSearchParams();
    encodedParams.append("text", text);
    encodedParams.append("tl", languageCode);
    encodedParams.append("sl", "en");

    const options = {
        method: 'POST',
        url: 'https://google-translate20.p.rapidapi.com/translate',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'X-RapidAPI-Host': 'google-translate20.p.rapidapi.com',
            'X-RapidAPI-Key': '3f3224100amsh235ecde0909a0b9p11647fjsnec57b54ea1a7'
        }, data: encodedParams
    };

    return axios.request(options).then((response) => {
        // console.log(response.data.data.translation);
        return response.data.data.translation;
    }).catch((err) => {
        console.log(err);
    });

};

export const fetchTranslation = async (text, languageCode) => {
    try {
        const options = translate(text, languageCode);
        axios.request(options).then((response) => {
            return response.data;
        }).catch((err) => {
            console.log(err)
        })
    } catch (err) {
        console.log(err)
    }
} 
