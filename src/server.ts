import app from './app'
import { Config } from './config'
import logger from './config/logger'

const startServer = () => {
    const PORT = Config.PORT
    try {
        app.listen(PORT, () => {
            logger.error('testing error log')
            logger.info('Server listining to port', { port: PORT })
        })
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

startServer()
