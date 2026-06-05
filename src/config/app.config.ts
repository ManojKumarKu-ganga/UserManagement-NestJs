export default () => ({

    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    database: {
        uri: process.env.MONGO_URI || 'mongodb://localhost:27017/users'
    },
    jwtExpiresIn: process.env.JWT_WXPIRES_IN || '3000s'
});