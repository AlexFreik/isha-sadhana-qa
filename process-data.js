const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const dataFolderPath = path.join(__dirname, 'public/data');
const outputFilePath = path.join(__dirname, 'public/data/bundle.json');

const mergedData = [];

// Read and merge YAML files
fs.readdirSync(dataFolderPath).forEach((file) => {
	if (file.endsWith('.yml')) {
		const filePath = path.join(dataFolderPath, file);
		const yamlData = fs.readFileSync(filePath, 'utf8');
		const jsonData = yaml.load(yamlData);
		mergedData.push(...jsonData);
	}
});

// Write merged data to bundle.json
fs.writeFileSync(outputFilePath, JSON.stringify(mergedData, null, 2), 'utf8');

console.log('Merging complete. Output saved in bundle.json');
