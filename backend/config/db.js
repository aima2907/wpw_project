const { Pool } = require('pg');

const pool = new Pool({
  host: 'ep-aged-surf-ao98bfy9.c-2.ap-southeast-1.aws.neon.tech',
  port: 5432,
  user: 'neondb_owner',
  password: 'npg_tU80disSZoMy',
  database: 'neondb',
  ssl: {
    rejectUnauthorized: false,
  },
});

// Tes Koneksi Langsung saat server dinyalakan
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Gagal konek ke Neon:', err.message);
  }
  console.log('Koneksi ke Neon PostgreSQL SUKSES 100%! 🎉');
  release();
});

module.exports = pool;