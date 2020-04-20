const fetch = require('node-fetch');
const fs = require('fs');
// const args = process.argv.slice(2);
// const slackWebhook = args[0];

const webhooks = [];

const reader = require('readline').createInterface({
  input: fs.createReadStream('./webhooks.txt'),
});

reader.on('line', line => {
  webhooks.push(line);
})

reader.on('close', () => {
  grabAndOutputStats();
});

function grabAndOutputStats() {
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

      let promises = [];

      for (const webhook of webhooks) {

        console.log(webhook);
        promises.push(fetch(webhook, {
          method: 'post',
          body:    JSON.stringify(body),
          headers: { 'Content-Type': 'application/json' },
        }))
      }

      Promise.all(promises)
        .then(json => {
          console.log(message);
        })

  });
}
