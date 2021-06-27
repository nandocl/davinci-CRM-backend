import { Router } from 'express';

// Consts
const router = Router();

// Import controllers
import { ClientController } from '../controllers/clientes.controller';

router.route('/')
.get(ClientController.get)
.post(ClientController.post)
// .put(ClientController.put)

router.route('/:clientId')
.delete(ClientController.delete)

export default router;