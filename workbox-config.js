module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{css,html,js,mp3}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};