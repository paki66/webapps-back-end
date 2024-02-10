/*import mongo from "mongodb"

let connnection_string = 
"mongodb+srv://pabursic:admin@cluster0.omoamcy.mongodb.net/";

let client = new mongo.MongoClient(connection_string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

export default () => {
    return new Promise((resolve, reject) => {
        if (db && client.isConnected()) {
            resolve(db)
        }

        client.connect(err => {
            if (err) {
                reject("Doslo je do pogreske prilikom spajanja: " + err)
            }
            else {
                console.log("Uspjesno spajanje na bazu")
                db = client.db("fipogram")
                resolve(db)
            }
        })
    })
}*/
