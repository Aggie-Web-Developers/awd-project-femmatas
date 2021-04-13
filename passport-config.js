const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const sql = require('mssql');

function init(passport) {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email);
        
        if (user == null) {
            return done(null, false, {
                message: 'Authentication failed. Please check your credentials.'
            });
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Authentication failed. Please check your credentials.'
                });
            }
        } catch (err) {
            done(err);
        }
    };

    passport.use(new localStrategy({usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            let user = await getUserById(id);

            if (!user) {
                return done(new Error('Deserialization error.'));
            }

            done(null, user);
        } catch (e) {
            done(e);
        }
    });
}

function getUserByEmail(email) {
    const sqlReq = new sql.Request().input('email', sql.NVarChar, email);
    sqlReq.query('SELECT TOP 1 * FROM tbl_user WHERE email = @email').then((result) => {
        console.log(result.recordset[0]);
    })
    .catch((err) => {
        console.log(err);
    });
}

function getUserById(id) {
    const sqlReq = new sql.Request().input('id', sql.Int, id);
    sqlReq.query('SELECT TOP 1 * FROM tbl_user WHERE id = @id').then((result) => {
        console.log(result.recordset[0]);
    })
    .catch((err) => {
        console.log(err);
    });
}

module.exports = init;