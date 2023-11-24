'use strict';

import { ScriptBuilder } from '../vm';
import { Address } from '../types';
import { Transaction } from '../tx/Transaction';

/**
 * Expiration Date is in UTC Seconds
 * @param expirationDate
 * @returns
 */
export const GetDateAsUTCSeconds = (expirationDate) => {
  const expirationDateUTCms = Date.UTC(
    expirationDate.getUTCFullYear(),
    expirationDate.getUTCMonth(),
    expirationDate.getUTCDate(),
    expirationDate.getUTCHours(),
    expirationDate.getUTCMinutes(),
    expirationDate.getUTCSeconds()
  );
  return expirationDateUTCms / 1000;
};

/**
 * Get Expiration Date
 * @returns
 */
export const GetExpirationDate = () => {
  // TODO: make expirationDate configurable.
  const expirationMinutes = 5; // This is in minutes
  const expirationDate = new Date(Date.now() + expirationMinutes * 60000);
  return expirationDate;
};

/**
 *
 * @param transaction
 * @returns
 */
export const encodeSendTxWithSignature = (transaction) => {
  // console.log('encodeSendTx', 'transaction', transaction);
  const sendTx = transaction.toString(true);
  // console.log('encodeSendTx', 'sendTx', sendTx);
  return sendTx;
};

export const encodeSendTxWithoutSignature = (transaction) => {
  const sendTx = transaction.toString(false);
  // console.log('encodeSendTx', 'sendTx', sendTx);
  return sendTx;
};
