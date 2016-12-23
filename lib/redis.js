
let log = console.log
  , Bluebird = require('bluebird')
  , Redis = require('redis');

Bluebird.promisifyAll(Redis.RedisClient.prototype);

/**
 * A wrapper around a redis client.
 */
export class RedisClient {

    /**
     * Create a new instance of the RedisClient.
     */
    constructor() {
        let redisConfig = Object.assign( {},
            this.connectionConfig(),
            {retry_strategy: this._connectionRetryStrategy}
        );

        this.expiry = 7200;
        this.client = Redis.createClient(redisConfig)
           .on('error', this._logError)
           .on('connect', function () {
                log('Opened new connection to redis.');
            });
    }

    /**
     * Determine the redis connection parameters based on the current environment.
     * @returns {string} The redis connection config.
     */
    connectionConfig () {
        // Use a REDIS_URL environment variable if there is one,
        // otherwise use the default of redis://127.0.0.1:6379
        return process.env.REDIS_URL ? {url: process.env.REDIS_URL} : {}
    }

    /**
     * Get an item from the redis cache.
     * @param  {string} key - The key for the cached content.
     * @return {Promise} A Promise object wrapping the redis GET command.
     */
    getItem (key) {
        return this.client.getAsync(key)
            .catch(this._logError)
            .then(function (reply) {
                log(reply ? 'Page is already cached...' : 'No cached page available...');
                return reply;
            });
    }

    /**
     * Set an item in the redis cache.
     * @param  {string} key   - The key to index the item by.
     * @param  {string} value - The value of the item to cache.
     * @return {Promise} A Promise object wrapping the redis SETEX command.
     */
    setItem (key, value) {
        return this.client.setexAsync(key, this.expiry, value)
            .catch(this._logError)
            .then(function (reply) {
                log(reply ? 'Successfully cached content in redis...' : 'No content cached...');
                return reply;
            });
    }

    /**
     * Close the redis connection
     * @return {Promise} A Promise object wrapping the redis QUIT command.
     */
    closeConnection () {
        return this.client.quitAsync().finally(function () {
            log('Closed connection to redis.');
        });
    }

    /**
     * Call unref() on the underlying socket connection to the Redis server,
     *     allowing the program to exit once no more commands are pending.
     * @return {Promise} A Promise object wrapping the redis UNREF command.
     */
    unref () {
        return this.client.unrefAsync().finally(function () {
            log('Closed connection to redis after completing all pending non-blocking commands.')
        });
    }

    /**
     * A function that receives an options object as parameter including:
     *     - the retry attempt,
     *     - the total_retry_time indicating how much time passed
     *       since the last time connected,
     *     - the error why the connection was lost and the number
     *       of times_connected in total.
     *
     * If you return a number from this function, the retry will happen exactly after
     *     that time in milliseconds. If you return a non-number, no further retry
     *     will happen and all offline commands are flushed with errors. Return an
     *     error to return that specific error to all offline commands.
     *
     * @param  {Object} options - Properties available to determine the retry strategy.
     * @return {Error|number|undefined} See description above for specific behavior
     * @ignore
     */
    _connectionRetryStrategy (options) {
        if (options.error.code === 'ECONNREFUSED') {
            // End reconnecting on a specific error and flush all commands
            // with a individual error.
            return new Error('The server refused the connection');
        }
        if (options.total_retry_time > 1000 * 60 * 60) {
            // End reconnecting after a specific timeout and flush all
            // commands with a individual error.
            return new Error('Retry time exhausted');
        }
        if (options.times_connected > 10) {
            // End reconnecting with built in error
            return undefined;
        }
        // reconnect after
        return Math.max(options.attempt * 100, 3000);
    }

    /** @ignore */
    _logError (err) {
        log('Oops. There was a problem connecting to redis.', err);
    }
}

// Instantiate the RedisClient, and export the instance. Since the require()
// method that imports it will cache the imported module, any subsequent
// calls to require() will return the same instance.
// Effectively, this is a singleton.
let redisClient = new RedisClient;
module.exports = exports = redisClient;

