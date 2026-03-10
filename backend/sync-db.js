const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function main() {
    const log = (msg) => {
        console.log(msg);
        fs.appendFileSync('sync-log.txt', msg + '\n');
    };

    log('Starting manual table creation...');
    try {
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Testimoni" (
        "id" SERIAL PRIMARY KEY,
        "nama" TEXT NOT NULL,
        "peran" TEXT NOT NULL,
        "pesan" TEXT NOT NULL,
        "rating" INTEGER NOT NULL DEFAULT 5,
        "gambarUrl" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        log('Table Testimoni created/exists.');

        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Galeri" (
        "id" SERIAL PRIMARY KEY,
        "judul" TEXT NOT NULL,
        "deskripsi" TEXT,
        "gambarUrl" TEXT NOT NULL,
        "kategori" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
        log('Table Galeri created/exists.');
    } catch (e) {
        log('Error creating tables: ' + e.message);
    } finally {
        await prisma.$disconnect();
        log('Disconnected.');
    }
}

main();
