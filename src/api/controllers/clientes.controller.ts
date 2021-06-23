import { Request, Response } from 'express';
import lineReader from 'line-reader';

//Models
import { ClientModel } from '../models/client.model';
import { Multer } from '../utils/multer';

export class ClientController{
    static get = async (req: Request, res: Response) => {
        let clientes = await ClientModel.getClients();
        res.status(200).send({msg: 'loaded', data: clientes});
    }

    static post = (req: Request, res: Response) => {
        Multer.upload(req,res, async function(err: any) {
            let [nombrePos, apellidoPos, telefonoPos, direccionPos, caracterPos] = JSON.parse(req.body.pos);
            let clientsArray: string[][] = [];
            let campCode = await ClientModel.getLastCode();
            lineReader.eachLine(req.file.path, async (line, last) => {
                let lineArray = line.split(caracterPos);
                if(lineArray.length >= 4){
                    let name = lineArray[nombrePos - 1];
                    let lastname = lineArray[apellidoPos - 1];
                    let phone = lineArray[telefonoPos - 1];
                    let address = lineArray[direccionPos - 1];
                    let client: string[] = [null,name,lastname,phone,address,campCode]
                    clientsArray.push(client);
                    if(last){
                        const endRes = await ClientModel.saveClients(clientsArray);
                        Multer.deleteFile(req.file.path);
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

    static deleteFile(filePath: string){

    }
}