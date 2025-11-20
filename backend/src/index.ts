import express from 'express';
import authRoutes from './routes/endpoints-autenticacion';
import userRoutes from './routes/endpoints-manejo-usuarios';
import policyRoutes from './routes/endpoints-insurance-policies';
import applicationRoutes from './routes/endpoints-aplicaciones-a-polizas';
import commentRoutes from './routes/endpoints-comentarios-de-polizas';
import paymentRoutes from './routes/endpoints-pasarela-de-pagos';
import reportRoutes from './routes/endpoints-de-reportes';
import brokerRoutes from './routes/endpoints-brokers';

/*
* @author: Santiago Arellano
* @date: 18-Nov-2025
* @description: El presente archivo implementa el backend de la aplicacion en base de una API REST construida con ExpressJS
* dado que es un framework simple y rapido para la creacio de APIs en JavaScript, lo que nos permite aprovecharnos de su
* facil deploy con docker y de la gran cantidad de librerias que ofrece.
*/

const app = express();
const PORT = process.env.PORT || 33761;

/*Le indicamos a la API que vamos a usar el modulo interno de jsond e express dado que las respuestas de la API se van a
* enviar en formato JSON en general*/
app.use(express.json());

// Ruta principal
app.get('/', (req, res) => {
  res.json({ message: 'MiSeguroDigital API is running!' });
});


// Rutas modulares
app.use('/api/autenticacion', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/polizas', policyRoutes);
app.use('/api/aplicaciones', applicationRoutes);
app.use('/api/comentarios', commentRoutes);
app.use('/api/pagos', paymentRoutes);
app.use('/api/reportes', reportRoutes);
app.use('/api/brokers', brokerRoutes);

app.listen(PORT, () => {
  console.log(`Servidor ejecutandose en puerto ${PORT}`);
});