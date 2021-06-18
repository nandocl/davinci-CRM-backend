import { Router } from 'express';

// Consts
const router = Router();

// Import controllers
import { ClientController } from '../controllers/clientes.controller';

router.route('/')
.get(ClientController.get)
.post(ClientController.post)

export default router;