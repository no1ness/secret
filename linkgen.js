const unique = () => Date.now().toString().substr(-10, 10);
const generateLink = () => `/secret/${unique()}`;

module.exports = generateLink;