const app = require('./server/app')
require('dotenv').config({ path: __dirname + '/./.env' })

const port = process.env.PORT

app.listen(port, () => {
	console.log(`server started on port: ${port}`)
})
