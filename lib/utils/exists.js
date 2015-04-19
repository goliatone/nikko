// Dependencies
var fs = require("fs");

/*!
 * checkErr
 * Checks if the error is because the file doesn't exist.
 *
 * @name checkErr
 * @function
 * @param {Error|null} err The error value.
 * @return {Boolean} A boolean representing if the file exists or not.
 */
function checkErr(err) {
    return err && err.code === "ENOENT" ? false : true;
}

/**
 * exists
 * Checks if a file or directory exists on given path.
 *
 * @name exists
 * @function
 * @param {String} path The path to the file or directory.
 * @param {Function} callback The callback function called with a boolean value representing if the file or directory exists.
 * @return {exists} The `exists` function.
 */
function exists(path, callback) {
    fs.stat(path, function (err) {
        callback(checkErr(err));
    });
}

/**
 * sync
 * The sync version of `exists`.
 *
 * @name sync
 * @function
 * @param {String} path The path to the file or directory.
 * @return {Boolean} A boolean value representing if the file or directory exists.
 */
exists.sync = function (path) {
    try {
        fs.statSync(path);
        return true;
    } catch (err) {
        return checkErr(err);
    };
};

module.exports = exists;