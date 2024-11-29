require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const authRoutes = require('./routes/authRoutes');
const articleRoute = require('./routes/articleRoute');
const tagsRoute = require('./routes/tagsRoute');
const ordersRoute = require('./routes/ordersRoute');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true
}));
app.use(fileUpload());

// Routes
app.use('/auth', authRoutes);
app.use('/articles', articleRoute);
app.use('/tags', tagsRoute);
app.use('/orders', ordersRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
