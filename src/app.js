import express from 'express';
import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { read, write } from './tools/json-files.js';

const app = express();
app.use(express.json());

const SECRET_KEY = "123456";

async function authenticateUser(username, password) {
    const users = await read('users');
    const user = users.find(u => u.username === username && bcrypt.compareSync(password, u.password));
    return user || null;
}

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied: No Token Provided!');
    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send('Invalid Token');
    }
}

app.post('/authenticate', async (req, res) => {
    const { username, password } = req.body;
    const user = await authenticateUser(username, password);
    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).json({ message: 'Invalid username or password' });
});

app.get('/questions', async (req, res) => {
    try {
<<<<<<< HEAD
        const questions = await read('questions');  
=======
        const questions = await read('questions');  // Assuming 'questions' reads 'questions.json'
>>>>>>> f02ea3a3192288a8d372e0cdcfc794bf5c419b16
        const formattedQuestions = questions.map(({ id, question, options }) => ({
            id,
            question,
            options
        }));
        res.json(formattedQuestions);
    } catch (error) {
        console.error('Failed to fetch questions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.get('/questions/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
<<<<<<< HEAD
        const questions = await read('questions');  
=======
        const questions = await read('questions');  // Reads all questions from the file
>>>>>>> f02ea3a3192288a8d372e0cdcfc794bf5c419b16
        const question = questions.find(q => q.id === questionId);

        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const { id, question: questionText, options } = question;
        res.json({ id, question: questionText, options });
    } catch (error) {
        console.error('Error retrieving question:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/game-runs', verifyToken, async (req, res) => {
    const newGameRun = {
        id: uuid(),
        userName: req.user.username,
        createdAt: Math.floor(Date.now() / 1000),
        responses: {}
    };

    let gameRuns = await read('game-runs');
    gameRuns.push(newGameRun);
    await write('game-runs', gameRuns);

    res.status(201).json({ runId: newGameRun.id });
});


app.put('/game-runs/:runId/responses', verifyToken, async (req, res) => {
    const { runId } = req.params;
    const { questionId, answerIndex } = req.body;

    let gameRuns = await read('game-runs');
    const gameRun = gameRuns.find(run => run.id === runId && run.userName === req.user.username);

    if (!gameRun) {
        return res.status(404).send('Game run not found.');
    }

    gameRun.responses[questionId] = answerIndex;
    await write('game-runs', gameRuns);

    res.json({ message: 'Response updated successfully', gameRun });
});

app.get('/game-runs/:runId/results', verifyToken, async (req, res) => {
    const { runId } = req.params;
    let gameRuns = await read('game-runs');
    const gameRun = gameRuns.find(run => run.id === runId && run.userName === req.user.username);

    if (!gameRun) {
        return res.status(404).send('Game run not found.');
    }

    const questions = await read('questions');
    const results = Object.keys(gameRun.responses).reduce((acc, questionId) => {
        const question = questions.find(q => q.id === questionId);
        acc[questionId] = gameRun.responses[questionId] === question.correctAnswer;
        return acc;
    }, {});

    res.json({
        id: gameRun.id,
        userName: gameRun.userName,
        createdAt: gameRun.createdAt,
        responses: results
    });
});


export default app;
