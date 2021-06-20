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
            // console.log('posttt' + req.body)
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
                        const endRes = await ClientModel.saveClients(clientsArray);
                        if(endRes == undefined) return res.status(500).send();
                        else if(endRes > 0) return res.status(200).send({msg: 'loaded'});
                        else res.status(404).send();
                    }
                }
            });
        });
    }

    static put = async (req: Request, res: Response) => {
        const endRes = await ClientModel.updateClient(req.body);
        if(endRes == undefined) return res.status(500).send();
        else if(endRes > 0) return res.status(200).send();
        else res.status(404).send();
    }

    static delete = async (req: Request, res: Response) => {
        const endRes = await ClientModel.deleteClient(req.params.clientId);
        if(endRes == undefined) return res.status(500).send();
        else if(endRes > 0) return res.status(200).send({id: req.params.clientId});
        else res.status(404).send();
    }
}