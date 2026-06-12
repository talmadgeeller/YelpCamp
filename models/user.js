const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

// Case-insensitive uniqueness (e.g. "Foo@x.com" and "foo@x.com" collide),
// matching Athena-Web/models/talmadge-tech-user.js. Do NOT add a plain
// `unique: true` on the email field instead - a plain unique index with the
// same name but no collation conflicts with this one on the shared
// talmadge-tech.users collection.
UserSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

UserSchema.plugin(passportLocalMongoose, { usernameCaseInsensitive: true });

const mainDB = mongoose.connection.useDb('talmadge-tech');
module.exports = mainDB.model('User', UserSchema);