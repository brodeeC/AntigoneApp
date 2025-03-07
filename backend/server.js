import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(cors());







app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});