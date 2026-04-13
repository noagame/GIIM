const { app, BrowserWindow } = require('electron');
const express = require('express');
const pool = require('./src/config/db');
const api = express();
const userRoutes = require('./src/routes/auth.routes');

app.disableHardwareAcceleration();

api.use('/api', userRoutes);
api.listen(3000, () => {
    console.log('Servidor Node.js escuchando en el puerto 3000');
});
api.use(express.json());


function createWindow() {
    const window = new BrowserWindow ({
        width: 800,
        height: 600,
        minHeight: 400,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false
        }
    })

    window.loadFile('./src/frontEnd/login.html');
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

