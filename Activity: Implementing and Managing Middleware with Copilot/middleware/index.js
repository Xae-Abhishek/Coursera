// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

app.use(express.json());

// === MIDDLEWARE PIPELINE ===
// 1. Error handler at the top for catching any sync/async errors.
app.use((req, res, next) => {
    try {
        next();
    } catch (err) {
        next(err);
    }
});

// 2. Auth middleware - protect all routes
app.use(auth);

// 3. Logging middleware - log only after auth passes
app.use(logger);

// === Your existing routes go here ===
let users = [];

function validateUser(user) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.name || user.name.trim() === '') return 'Name is required';
    if (!user.email || !emailRegex.test(user.email)) return 'Valid email is required';
    return null;
}

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
});

app.post('/users', (req, res) => {
    const error = validateUser(req.body);
    if (error) return res.status(400).json({ error });

    const newUser = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });

    const error = validateUser(req.body);
    if (error) return res.status(400).json({ error });

    user.name = req.body.name;
    user.email = req.body.email;

    res.json(user);
});

app.delete('/users/:id', (req, res) => {
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ error: 'User not found' });

    const deletedUser = users.splice(index, 1);
    res.json(deletedUser[0]);
});

// Final error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`User Management API running on http://localhost:${PORT}`);
});
