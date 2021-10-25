const app = require('./server/app')
require('dotenv').config({ path: __dirname + '/./.env' })
const { port } = require('./data/config.json')

// Launch the application
app.listen(port, () => {
	console.log(`server started on port: ${port}`)
})
