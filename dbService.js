let MongoClient = require('mongodb').MongoClient;

module.exports = {
    insertRecord: async function(record) {
        let mongoClient = new MongoClient(config.mongodb, {useNewUrlParser: true, useUnifiedTopology: true});
        try {
            await mongoClient.connect();
            const collection = mongoClient.db(config.dbName).collection('esc_prices_record');
            await collection.insertOne(record);
            return true;
        } catch (err) {
            logger.error(err);
            throw new Error();
        } finally {
            await mongoClient.close();
        }
    }
}
