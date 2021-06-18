import { Request, Response } from 'express';
import { upload } from '../utils/multer';
import lineReader from 'line-reader';

//Models
import { ClientModel } from '../models/client.model';
import { IClient } from '../../interfaces/IClient';

export class ClientController{
    static get = async (req: Request, res: Response) => {
        let clientes = await ClientModel.getClients();
        res.status(200).send({msg: 'loaded', data: clientes});
    }

    static post = (req: Request, res: Response) => {
        upload(req,res, async function(err: any) {
            let [nombrePos, apellidoPos, telefonoPos, direccionPos, caracterPos] = JSON.parse(req.body.pos);
            let clientsArray: IClient[] = [];
            lineReader.eachLine(req.file.path, async (line, last) => {
                let lineArray = line.split(caracterPos);
                if(lineArray.length > 3){
                    let name = lineArray[nombrePos - 1];
                    let lastName = lineArray[apellidoPos - 1];
                    let phone = lineArray[telefonoPos - 1];
                    let address = lineArray[direccionPos - 1];
                    let campCode = '';
                    let client: IClient = {name,lastName,phone,address,campCode}
                    clientsArray.push(client);
                    if(last){
                        await ClientModel.saveClients(clientsArray);
                        res.status(200).send({msg: 'loaded'});
                    }
                }
            });
        });
    }
}