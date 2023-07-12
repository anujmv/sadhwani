var mongoose = require('mongoose');
// var child = mongoose.Schema({ image: String });
// var Empty3 = new Schema({ type: arrayany: [mongoose.Schema.Types.Mixed] });
var ProjectSchema = mongoose.Schema({
    project_name: String,
    location: String,
    area: String,
    rent: String,
    property_type: String,
    no_of_floors_available:String,
    number_of_floors:String,
    status:String,
    gallery: {
        type: Array,
    },
    area_type:String,
    description:String,
    price: String,
    banner:String,
}, {
    timestamps: true
});
module.exports = mongoose.model('Projects', ProjectSchema);
