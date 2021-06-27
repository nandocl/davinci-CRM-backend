import oracledb from 'oracledb';
import { dbConfig } from './dbconfig';

export class dataBase{
  static async startDb(){
    try{
      await oracledb.createPool(dbConfig);
    } catch (err) {
      console.error(err);
    }
  }
}