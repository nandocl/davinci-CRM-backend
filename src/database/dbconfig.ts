const hrPool = {
    user: process.env.ORACLEUSER || 'SYSTEM',
    password: process.env.ORACLEPASSWORD || 'dbpass',
    connectString: process.env.ORACLEURL || 'localhost:1521/xe'
  }

export const dbConfig = hrPool;