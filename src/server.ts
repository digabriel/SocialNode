import app from "./app";
import * as mongoose from "mongoose";

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

async function connect() {
    if (typeof MONGO_URI === 'string') {
        try {
            await mongoose.connect(MONGO_URI, {useNewUrlParser : true});
            await app.listen(PORT);
            console.log('Express server listening on port ' + PORT);
        }
        catch (error) {
            console.log("Failed to start.");
            console.log(error);
        }
    }
    else {
        console.log('Failed. No MONGO_URI provided in enviornoment');
    }
}

connect();
export const application = app;