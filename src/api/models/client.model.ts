import oracledb from 'oracledb';
import { IClient } from "../../interfaces/IClient";

export class ClientModel{

  static async getClients(){
    let connection = await oracledb.getConnection();
    try{
      const lastCode = await connection.execute('SELECT * FROM clientes');
      let out = JSON.parse(JSON.stringify(lastCode.rows));
      let toSend: any[] = [];
      out.forEach((e: any) => {
        let [id, name, lastname, phone, address, campCode] = e;
        toSend.push({id, name, lastname, phone, address, campCode});
      });
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
  
  static async saveClients(clientes: IClient[]){
    let connection = await oracledb.getConnection();
    try{
      const lastCode = await connection.execute('SELECT codigo FROM campanias WHERE id = (SELECT MAX(id) FROM campanias)');
      let campCode = JSON.parse(JSON.stringify(lastCode.rows))[0][0];
      clientes.forEach(async (e: any) => {
        const sql = `INSERT INTO clientes VALUES (:id,:name,:lastname,:phone,:address,:code)`;
        const binds = {'id': null, 'name': e.name, 'lastname': e.lastName, 'phone': e.phone, 'address': e.address, 'code': campCode};
        const options = {
          autoCommit: true,
          bindDefs: [
            { type: oracledb.NUMBER },
            { type: oracledb.STRING, maxSize: 20 }
          ]
        };
        await connection.execute(sql, binds, options);
      });
    }catch(e){
      console.log(e)
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