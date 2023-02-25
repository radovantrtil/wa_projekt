module.exports  = {
    allowedFrontendOrigin: 'http://localhost:3001',
    jwtConfig:{
        secret: "re6546431eaea3e541ae",
        algorithms: ["HS256"],
    },
    passwordConfig: {
        salt: 're54rere53a4r5e4r5e4r5er',
        iterations: 1000,
        keylen: 64,
        digest: 'sha512',
    }
}