import fs from 'fs';
import { key, url } from './config.js';

const history = JSON.parse(fs.readFileSync('./aw-buckets-export.json', { encoding: 'utf8', flag: 'r' }));
let activities = [];
async function sendData() {
	console.log(activities);

	console.log('Pushing up to 1000 activities');
	const res = await fetch(`${url}/FocusStats/activities`, {
		headers: {
			'X-Api-Key': key,
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(activities)
	});
	if (!res.ok) {
		console.log('Error when creating activities');
		console.log(res);
		console.log(await res.text());
		throw '';
	}
	activities = [];
}
for (const entry of history.buckets['aw-watcher-android-test'].events) {
	const startTime = (new Date(entry.timestamp)).toISOString();
	if (activities.find((x) => x.startTime === startTime)) {
		continue;
	}

	activities.push({
		"startTime": startTime,
		"secondsDuration": Math.round(entry.duration),
		"appOrExe": entry.data.package,
		"name": entry.data.app,
		"device": "Pixel 7A"
	});

	if (activities.length === 1000) {
		await sendData();
	}
}

await sendData();
