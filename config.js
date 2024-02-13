const fs = require('fs');
const yaml = require('js-yaml');

const configFile = fs.readFileSync('./config.yml', 'utf8');
const config = yaml.load(configFile);

module.exports = config;