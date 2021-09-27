/**
 * @param {string[]} texts
 */
module.exports = function (...texts) {
    let langs = [ "fr", "en" ];
    let index = langs.indexOf(require('../config.json').lang.toLowerCase());
    return texts[index];
};