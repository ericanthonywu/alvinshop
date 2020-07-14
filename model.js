const mongoose = require('mongoose')

require('dotenv').config({path: ".env"})

mongoose.connect(process.env.MONGOURL, {
    useNewUrlParser: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(_ => mongoose.connection.db.on('error', console.error.bind(console, 'connection error:')))
    .catch(err => console.log(err));

const adminSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true, select: false},
}, {timestamps: true});

exports.admin = mongoose.model("admin", adminSchema);

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, trim: true, unique: true},
    email: {type: String, unique: true},
    password: {type: String, required: true, select: false},
    cart: [{
        productId: {type: mongoose.Schema.Types.ObjectID, ref: 'product'},
        qty: Number
    }],
    favourites: [{type: mongoose.Schema.Types.ObjectID, ref: 'product'}]
}, {timestamps: true});

exports.user = mongoose.model("user", userSchema);

const bannerSchema = new mongoose.Schema({
    gambar: {type: String, required: true, trim: true, unique: true},
    order: {type: Number, default: 0, unique: true},
}, {timestamps: true});

exports.banner = mongoose.model("banner", bannerSchema);

const productSchema = new mongoose.Schema({
    gambar: {type: String, required: true, trim: true, unique: true},
    title: String,
    description: String,
    genre: [{type: mongoose.Schema.Types.ObjectID, ref: 'category'}],
    price: {type: Number, default: 0},
    stock: {type: Number, default: 0},
    youtubeLink: String
}, {
    weights:{
        title: 5
    },
    timestamps: true
});

exports.product = mongoose.model("product", productSchema);

const categorySchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true, unique: true},
}, {timestamps: true});
exports.category = mongoose.model("category", categorySchema);
