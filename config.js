export const MONGODB_URI = process.env.PROD_MONGODB || 'mongodb://127.0.0.1:27017/productsAssociationDatabase'
export const TOKEN_KEY = process.env.TOKEN_KEY || 'areallylonggoodkey'
export const SALT_ROUNDS = process.env.SALT_ROUNDS || 11