const app = require('./app')
import 'semantic-ui-css/semantic.min.css'
const port = process.env.PORT || 3000;


app.listen(port, () => {
    console.log(`Server is up and running on port ${port}`)
})
