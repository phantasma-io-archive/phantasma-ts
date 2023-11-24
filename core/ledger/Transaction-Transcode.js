'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeSendTxWithoutSignature = exports.encodeSendTxWithSignature = exports.GetExpirationDate = exports.GetDateAsUTCSeconds = void 0;
/**
 * Expiration Date is in UTC Seconds
 * @param expirationDate
 * @returns
 */
var GetDateAsUTCSeconds = function (expirationDate) {
    var expirationDateUTCms = Date.UTC(expirationDate.getUTCFullYear(), expirationDate.getUTCMonth(), expirationDate.getUTCDate(), expirationDate.getUTCHours(), expirationDate.getUTCMinutes(), expirationDate.getUTCSeconds());
    return expirationDateUTCms / 1000;
};
exports.GetDateAsUTCSeconds = GetDateAsUTCSeconds;
/**
 * Get Expiration Date
 * @returns
 */
var GetExpirationDate = function () {
    // TODO: make expirationDate configurable.
    var expirationMinutes = 5; // This is in minutes
    var expirationDate = new Date(Date.now() + (expirationMinutes * 60000));
    return expirationDate;
};
exports.GetExpirationDate = GetExpirationDate;
/**
 *
 * @param transaction
 * @returns
 */
var encodeSendTxWithSignature = function (transaction) {
    // console.log('encodeSendTx', 'transaction', transaction);
    var sendTx = transaction.toString(true);
    // console.log('encodeSendTx', 'sendTx', sendTx);
    return sendTx;
};
exports.encodeSendTxWithSignature = encodeSendTxWithSignature;
var encodeSendTxWithoutSignature = function (transaction) {
    var sendTx = transaction.toString(false);
    // console.log('encodeSendTx', 'sendTx', sendTx);
    return sendTx;
};
exports.encodeSendTxWithoutSignature = encodeSendTxWithoutSignature;
