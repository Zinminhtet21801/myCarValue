var dotenv = require('dotenv');
var fs = require('fs');
var path = require('path');
// var variable = fs.readFileSync(path.resolve(__dirname, '.env.production'),'utf8');
// console.log(__dirname,dotenv.config({ path: '.env.production' }), variable);
var parsed = dotenv.config({ path: '.env.production' });
var dbConfig = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;
  case 'test':
    Object.assign(dbConfig, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });
    break;
  case 'production':
    Object.assign(dbConfig, {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  default:
    Object.assign(dbConfig, {
      type: 'postgres',
      url: parsed.parsed.DATABASE_URL,
      migrationsRun: true,
      entities: ['**/*.entity.js'],
      ssl: {
        rejectUnauthorized: false,
      },
    });
    break;
  // throw new Error('unknown environment');
}

console.log(process.env.NODE_ENV, dbConfig);

module.exports = dbConfig;
