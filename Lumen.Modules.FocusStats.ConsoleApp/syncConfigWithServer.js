import fs from 'fs';
import { key, url } from './config.js';

console.log('Tagging rules');

const taggingRules = JSON.parse(fs.readFileSync('./tagging_rules.json', { encoding: 'utf8', flag: 'r' }));
const APITaggingRulesRes = await fetch(`${url}/FocusStats/taggingRules`, {
	headers: {
		'X-Api-Key': key,
	},
});
if (!APITaggingRulesRes.ok) {
	console.log('Error when getting taggingRules');
	console.log(await res.test());
}
const APITaggingRules = await APITaggingRulesRes.json();

for (const taggingRuleKey in taggingRules) {
	if (APITaggingRules.find((x) => x.regex === taggingRuleKey)) {
		console.log('Skipping ' + taggingRuleKey);
		continue;
	}

	console.log('Creating ' + taggingRuleKey);
	const res = await fetch(`${url}/FocusStats/taggingRule`, {
		headers: {
			'X-Api-Key': key,
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			...taggingRules[taggingRuleKey],
			regex: taggingRuleKey
		})
	});

	if (!res.ok) {
		console.log('Error when creating taggingRule');
		console.log(await res.test());
	}
}

console.log('Tagging rules to remove:');
console.log(APITaggingRules.filter((x) => !Object.keys(taggingRules).find((c) => x.regex === c)));

console.log('\n\nCleaning rules');

const cleaningRules = JSON.parse(fs.readFileSync('./renaming_rules.json', { encoding: 'utf8', flag: 'r' }));
const APICleaningRulesRes = await fetch(`${url}/FocusStats/cleaningRules`, {
	headers: {
		'X-Api-Key': key,
	},
});
if (!APICleaningRulesRes.ok) {
	console.log('Error when getting cleaningRules');
}
const APICleaningRules = await APICleaningRulesRes.json();

for (const cleaningRuleKey in cleaningRules) {
	if (APICleaningRules.find((x) => x.regex === cleaningRuleKey)) {
		console.log('Skipping ' + cleaningRuleKey);
		continue;
	}

	console.log('Creating ' + cleaningRuleKey);
	const res = await fetch(`${url}/FocusStats/cleaningRule`, {
		headers: {
			'X-Api-Key': key,
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify({
			...cleaningRules[cleaningRuleKey],
			regex: cleaningRuleKey
		})
	});

	if (!res.ok) {
		console.log('Error when creating cleaningRule');
	}
}

console.log('Cleaning rules to remove:');
console.log(APICleaningRules.filter((x) => !Object.keys(cleaningRules).find((c) => x.regex === c)));
