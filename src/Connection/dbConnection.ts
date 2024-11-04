import { mongoose } from "../Helper/path";

const URI = process.env.DB_STRING

class connectionClass {
    constructor() { }

    getConnection = async () => {
        await mongoose.connect(URI + "alterOffice", {})
            .then(() => console.log("DB Connected")).catch((err) => console.log("err:::::", err))
    }
}

export const dbConnection = new connectionClass();