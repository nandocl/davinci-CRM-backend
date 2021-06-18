import { Router } from 'express';
import clientsRoutes from './clientes.routes'

const router = Router();

router.get('/', (req,res) => res.status(200).send('Funcionando'));
router.use('/api/clients', clientsRoutes);

export default router;