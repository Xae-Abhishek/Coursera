const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = []; // In-memory database

// Utility: Validate user input
function validateUser(user) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!user.name || user.name.trim() === '') {
        return 'Name is required';
    }
    if (!user.email || !emailRegex.test(user.email)) {
        return 'Valid email is required';
    }
    return null;
}

// GET /users – List all users
app.get('/users', (req, res) => {
    res.json(users);
});

// GET /users/:id – Get user by ID
app.get('/users/:id', (req, res) => {
    try {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST /users – Add a new user
app.post('/users', (req, res) => {
    try {
        const error = validateUser(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        const newUser = {
            id: users.length + 1,
            name: req.body.name,
            email: req.body.email
        };

        users.push(newUser);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT /users/:id – Update a user
app.put('/users/:id', (req, res) => {
    try {
        const user = users.find(u => u.id === parseInt(req.params.id));
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const error = validateUser(req.body);
        if (error) {
            return res.status(400).json({ error });
        }

        user.name = req.body.name;
        user.email = req.body.email;

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE /users/:id – Remove a user
app.delete('/users/:id', (req, res) => {
    try {
        const index = users.findIndex(u => u.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'User not found' });
        }

        const deletedUser = users.splice(index, 1);
        res.json(deletedUser[0]);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`User Management API is running on http://localhost:${PORT}`);
});
