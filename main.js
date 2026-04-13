const { app, BrowserWindow } = require('electron');
const express = require('express');
const pool = require('./src/config/db');
const api = express();
const userRoutes = require('./src/routes/auth.routes');

api.use('/api', userRoutes);
api.use(express.json());


function createWindow() {
    const window = new BrowserWindow ({
        width: 800,
        height: 600,
        minHeight: 400
    })

    window.loadFile('index.html')
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window.all-closed', () => {
    if (process.platform !== 'darwin'){
        app.quit() 
    }
})

