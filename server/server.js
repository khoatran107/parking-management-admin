import express from "express";
import mySQL from "mysql";
import cors from "cors"   
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
const salt = 10;

const app = express();  
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}));
app.use(cookieParser());

const db = mySQL.createConnection({
    host : "localhost",
    user: "root",
    password: "12345678@ABCDabcd",
    database: "parking"
});

db.connect((err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("MySql Connected...");
    }
});

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are not authenticated"});
    }
    else{
        jwt.verify(token, 'fwt-secret-key', (err, decoded) => {
            if (err) {
                return res.json({ Error: "Token is not okay"});
            }
            else{
                req.location_id = decoded.location_id;
                next();
            }
        });
    }
};

app.get('/',verifyUser,(req,res)=>{
    return res.json({Status: "Success", location_id: req.location_id});
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({Status: "Success"});
});

app.post('/register', (req, res) => {
    const sql = "INSERT INTO admins (`location_id`, `password`) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err); // Print to the server terminal
            return res.json({ message: "Error in hashing password", error: err.message });
        }
        const values = [req.body.location_id, hash];

        db.query(sql, [values], (err, result) => {
            if (err) {
                console.error('Error inserting values:', values, 'Error:', err); // Print to the server terminal
                return res.json({ message: "Error in inserting values", values, error: err.message });
            } else {
                return res.json({ message: "Registered Successfully" });
            }
        });
    });
});
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM admins WHERE location_id = ?";
    db.query(sql, [req.body.location_id], (err, result) => {
        if (err) {
            console.error('Error in query:', err); // Print to the server terminal
            return res.json({ message: "Error in query", error: err.message });
        }
        if (result.length == 0) {
            return res.json({ message: "User not found" });
        }
        bcrypt.compare(req.body.password.toString(), result[0].password, (err, result2) => {
            if (err) {
                console.error('Error comparing passwords:', err); // Print to the server terminal
                return res.json({ message: "Error comparing passwords", error: err.message });
            }
            if (result2 == false) {
                return res.json({Status: "Wrong Password"});
            }
            const location_id = result[0].location_id;
            const token = jwt.sign(
                {location_id}, // Include both name and email in the payload
                'fwt-secret-key',
                { expiresIn: '1h' }
            );
            res.cookie('token', token);
            return res.json({Status: "Success"});
        });
    });
}); 

app.listen(3000,() => {
    console.log("Server is running on port 3000");
});

export default app;