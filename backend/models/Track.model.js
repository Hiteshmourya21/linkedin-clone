import mongoose from "mongoose";

const trackSchema = new mongoose.Schema({
    
},{timestamps: true});

const Track = mongoose.model('Track', trackSchema);

export default Track;