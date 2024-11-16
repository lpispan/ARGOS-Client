const fs = require('fs');
const path = require('path');

const loadTranslations = (lang) => {
    console.log(__dirname)
    const filePath = path.resolve(__dirname, '../../locales', `${lang}.json`);
    if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } else {
        throw new Error(`Translations for language "${lang}" not found`);
    }
};


module.exports = {
    loadTranslations
};