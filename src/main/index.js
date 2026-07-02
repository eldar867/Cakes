import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import connectDB from './db';

async function foo(event, data) {
  try {
    console.log(data)
    dialog.showMessageBox({ message: 'message back' })
  } catch (e) {
    dialog.showErrorBox('Ошибка', e)
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.electron')

  global.dbclient = await connectDB();

  ipcMain.handle('sendSignal', foo)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

import getDbClient from './db.js';

ipcMain.handle('get-products', async () => {
  try {
    const client = await getDbClient();
    const result = await client.query('SELECT * FROM products ORDER BY id');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
});

ipcMain.handle('add-product', async (event, product) => {
  try {
    const client = await getDbClient();
    const { article, name, unit, price, brand_id, type_id, category_id, description } = product;
    const result = await client.query(
      `INSERT INTO products (article, name, unit, price, brand_id, type_id, category_id, description, is_active, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, true, 0) 
       RETURNING *`,
      [article, name, unit, price, brand_id || null, type_id || null, category_id || null, description || '']
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('update-product', async (event, id, product) => {
  try {
    const client = await getDbClient();
    const { article, name, unit, price, brand_id, type_id, category_id, description } = product;
    const result = await client.query(
      `UPDATE products SET article=$1, name=$2, unit=$3, price=$4, brand_id=$5, type_id=$6, category_id=$7, description=$8 WHERE id=$9 RETURNING *`,
      [article, name, unit, price, brand_id || null, type_id || null, category_id || null, description || '', id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
});

ipcMain.handle('delete-product', async (event, id) => {
  try {
    const client = await getDbClient();
    await client.query('DELETE FROM products WHERE id = $1', [id]);
    return true;
  } catch (error) {
    throw error;
  }
});

















