import app from './app'
import { create_db_connection, DBConnection } from './db/mysql/connect';


const server = async() => {
    const connection = await create_db_connection();
    DBConnection.set_db_connection( connection );
    const application = new app();
    return application.httpServer;
}

export default server;
