const fetch = require('node-fetch');
const fs = require('fs');

const args = process.argv.slice(2);

const slackWebhook = args[0];

fetch('https://corona-stats.online?format=json')
  .then(res => res.json())
  .then(json => {
    let aus = json.data.find(country => country.country === 'Australia')
    let time = new Date(aus.updated);

let message = `
Cases today: ${aus.todayCases}
Deaths today: ${aus.todayDeaths}
Total cases: ${aus.confirmed}
Total deaths: ${aus.deaths}
Last Updated: ${time.toLocaleString()}
`;

    let body = {
      text: message,
      username: 'Corona-Bot',
      icon_emoji: aus.todayDeaths > 0 ? ':skull_and_crossbones:' : ':face_with_thermometer:',
    }

    fetch(slackWebhook, {
      method: 'post',
      body:    JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.text())
    .then(json => {
      console.log(message);
    })

});
