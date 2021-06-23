import oracledb from 'oracledb';
import { IClient } from "../../interfaces/IClient";

export class ClientModel{

  static async getClients(){
    let connection = await oracledb.getConnection();
    try{
      const lastCode = await connection.execute('SELECT * FROM clientes');
      let out = JSON.parse(JSON.stringify(lastCode.rows));
      let toSend: any[] = [];
      for(const e of out){
        let [id, name, lastname, phone, address, campCode] = e;
        toSend.push({id, name, lastname, phone, address, campCode});
      }
      return toSend;
    } catch(e){
      return [];
    }finally {
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }
  
  static async saveClients(clientes: any[]){
    let connection = await oracledb.getConnection();
    try{
      const lastCode = await connection.execute('SELECT codigo FROM campanias WHERE id = (SELECT MAX(id) FROM campanias)');
      let campCode = JSON.parse(JSON.stringify(lastCode.rows))[0][0];
      const sql = `INSERT INTO clientes VALUES (:1,:2,:3,:4,:5,:6)`;
      const options = {
        autoCommit: true,
        bindDefs: [
          { type: oracledb.NUMBER },
          { type: oracledb.STRING, maxSize: 20 },
          { type: oracledb.STRING, maxSize: 20 },
          { type: oracledb.STRING, maxSize: 20 },
          { type: oracledb.STRING, maxSize: 20 },
          { type: oracledb.STRING, maxSize: 20 },
        ]
      };
      const result = await connection.executeMany(sql, clientes, options);
      return result.rowsAffected;
    }catch(e){
      return -1;
    }finally{
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  static async updateClient(client: IClient){
    let connection = await oracledb.getConnection();
    try{
      const query = `UPDATE clientes SET names=:names, lastnames=:lastnames, phone=:phone, address=:address WHERE id=:id`;
      const binds = {id:client.id,names:client.name,lastnames:client.lastname,phone:client.phone,address:client.address};
      const options = {
        autoCommit: true,
      };
      const result = await connection.execute(query, binds, options);
      return result.rowsAffected;
    } catch(err){
      return undefined;
    }finally{
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

  static async deleteClient(clientId: string){
    let connection = await oracledb.getConnection();
    try{
      const query = `DELETE FROM clientes WHERE id=:id`;
      const bind = {id: clientId};
      const options = {
        autoCommit: true,
      };
      const result = await connection.execute(query, bind, options);
      return result.rowsAffected;
    }catch(err){
      return -1;
    }finally{
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
    }

  }

  static async getLastCode(){
    let connection = await oracledb.getConnection();
    try{
      const lastCode = await connection.execute('SELECT codigo FROM campanias WHERE id = (SELECT MAX(id) FROM campanias)');
      return JSON.parse(JSON.stringify(lastCode.rows))[0][0];
    } catch(err){
      return null;
    }finally{
      if (connection) {
        try {
          await connection.close();
        } catch (err) {
          console.log(err);
        }
      }
    }
  }

}