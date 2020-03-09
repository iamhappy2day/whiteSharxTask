import mongoose from "mongoose";
import {config} from "./config";
import {app} from "./app";

mongoose
    .connect(config.DB_CONNECT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('We successfully connected to DB'))
    .catch((error: Error) => {
        console.log(error.message);
    });

app.listen(config.PORT, () => {
    console.log('Server is running...');
});
