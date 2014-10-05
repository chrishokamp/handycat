module.exports = {
  secret: 'secret-passcode',
	port: process.env.PORT || 3000,
    db: process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/handycat'
}