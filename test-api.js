const axios = require('axios');

const key = '74bf90ba80mshe04e6f5b49b2465p187f36jsn1d2678dd4a19';
const host = 'instagram-scraper-api2.p.rapidapi.com';
const username = 'azursol786';

async function testEndpoints() {
  console.log('Testing instagram-scraper-api2 /v1/info...');
  try {
    const response = await axios.get(`https://${host}/v1/info`, {
      params: { username_or_id_or_url: username },
      headers: {
        'X-RapidAPI-Key': key,
        'X-RapidAPI-Host': host,
      },
    });
    console.log('scraper info status:', response.status);
    console.log('scraper info keys:', Object.keys(response.data));
  } catch (error) {
    console.error('scraper info error:', error.response ? error.response.status : error.message);
    if (error.response && error.response.data) console.log('Error data:', error.response.data);
  }
}

testEndpoints();
