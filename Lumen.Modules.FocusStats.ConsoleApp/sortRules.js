import fs from 'fs';

const driveRule = /^\^\w:\\/;

function cleanupKey(key) {
	return key.replaceAll('\\w', '').replace(/[^a-zA-Z0-9]/g, '');
}

function sortEntries(rules) {
	const keys = Object.keys(rules);
	
	keys.sort((a, b) => {
		if (driveRule.test(a) && !driveRule.test(b)) {
			console.log(a, b);
			return 1;
		}
		if (driveRule.test(b) && !driveRule.test(a)) {
			console.log(a, b);
			return -1;
		}

		return cleanupKey(a).localeCompare(cleanupKey(b));
	});

	const newRules = {};
	for (const key of keys) {
		newRules[key] = {
			...rules[key],
			tests: {},
		};

		const testKeys = Object.keys(rules[key].tests);
		testKeys.sort((a, b) => cleanupKey(a).localeCompare(cleanupKey(b)));

		console.log(testKeys)

		for (const testKey of testKeys) {
			newRules[key].tests[testKey] = rules[key].tests[testKey];
		}
	}

	return newRules;
}

const renamingRules = JSON.parse(
	fs.readFileSync('renaming_rules.json')
);

const newRenamingRules = sortEntries(renamingRules);
fs.writeFileSync('renaming_rules.json', JSON.stringify(newRenamingRules, null, 4), 'utf8');

console.log(Object.keys(renamingRules).length);
console.log(Object.keys(newRenamingRules).length);