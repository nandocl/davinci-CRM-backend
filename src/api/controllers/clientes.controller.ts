import { Request, Response } from 'express';
import fs from 'fs';

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
            fs.readFile(req.file.path, async function(err, data) {
                if(err) return res.status(500).send();
                const clients = data.toString().split("\n");
                for(let line of clients) {
                    const lineArray = line.split(caracterPos);
                    if(lineArray.length >= 4){
                        const name = lineArray[nombrePos];
                        const lastname = lineArray[apellidoPos];
                        const phone = lineArray[telefonoPos];
                        const address = lineArray[direccionPos];
                        const client: string[] = [null,name,lastname,phone,address,campCode];
                        clientsArray.push(client);
                    }
                }
                Multer.deleteFile(req.file.path);
                if(clientsArray.length > 0){
                    const resp = await ClientModel.saveClients(clientsArray);
                    if(resp == undefined) return res.status(404).send({msg: 'No se guardó la informacion.'});
                    else if(resp > 0) return res.status(200).send({msg: 'cargado'});
                    else res.status(404).send({msg: 'No se guardó la informacion'});
                }else res.status(404).send({msg: 'Error de archivo.'});
            });
        });
    }

    // static put = async (req: Request, res: Response) => {
    //     const endRes = await ClientModel.updateClient(req.body);
    //     if(endRes == undefined) return res.status(500).send();
    //     else if(endRes > 0) return res.status(200).send();
    //     else res.status(404).send();
    // }

    static delete = async (req: Request, res: Response) => {
        const endRes = await ClientModel.deleteClient(req.params.clientId);
        if(endRes == undefined) return res.status(500).send();
        else if(endRes > 0) return res.status(200).send({id: req.params.clientId});
        else res.status(404).send();
    }
}