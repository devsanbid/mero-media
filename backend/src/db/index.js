import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('hamromedia', 'postgres', '33533', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database successfully!');
    await sequelize.sync({ force: false });
    console.log('Database synchronized!');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};

export { sequelize };
export default connectToDatabase;