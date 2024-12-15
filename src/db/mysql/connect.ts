import { Connection, createConnection } from "typeorm";
import { User } from "../../entities/user";
import { Token } from "../../entities/token";

class DBConnection {
    static #db_connection: any = null;
    static set_db_connection(connection: Connection) {
        DBConnection.#db_connection = connection;
    }
    static get_db_connection() {
        return this.#db_connection;
    }
}

const create_db_connection = async () => {
    try {
        return await createConnection(
            {
                type: "mysql",
                host: "mysql.railway.internal",
                port: 3306,
                username: "root",
                password: "uVIVWddiHLUhYuBnelAIiNnniQwAmYcu",
                database: "railway",
                entities: [User, Token],
                synchronize: false,
            }
        );
    } catch (error) {
        console.error("Error establishing database connection:", error);
        throw error;
    }
}

export {
    DBConnection,
    create_db_connection
}
