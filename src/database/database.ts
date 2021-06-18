import oracledb from 'oracledb';
import { dbConfig } from './dbconfig';

export async function initialize() {
  try{
    await oracledb.createPool(dbConfig);
  } catch (err) {
    console.error(err);
  }
}