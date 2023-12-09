import express from "express";
import mySQL from "mysql";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
const salt = 10;

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(cookieParser());

const db = mySQL.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678@ABCDabcd",
  database: "parking",
});

db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("MySql Connected...");
  }
});

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ Error: "You are not authenticated" });
  } else {
    jwt.verify(token, "fwt-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ Error: "Token is not okay" });
      } else {
        req.name = decoded.name;
        req.location_id = decoded.location_id;
        next();
      }
    });
  }
};

app.get("/", verifyUser, (req, res) => {
  return res.json({
    Status: "Success",
    name: req.name,
    location_id: req.location_id,
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  return res.json({ Status: "Success" });
});

app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO admins (`name`, `location_id`, `password`) VALUES (?)";
  bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err); // Print to the server terminal
      return res.json({
        message: "Error in hashing password",
        error: err.message,
      });
    }
    const values = [req.body.name, req.body.location_id, hash];

    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error inserting values:", values, "Error:", err); // Print to the server terminal
        return res.json({
          message: "Error in inserting values",
          values,
          error: err.message,
        });
      } else {
        return res.json({ message: "Registered Successfully" });
      }
    });
  });
});

app.post("/login", (req, res) => {
  const sql = "SELECT * FROM admins WHERE location_id = ?";
  db.query(sql, [req.body.location_id], (err, result) => {
    if (err) {
      console.error("Error in query:", err); // Print to the server terminal
      return res.json({ message: "Error in query", error: err.message });
    }
    if (result.length == 0) {
      return res.json({ message: "User not found" });
    }
    bcrypt.compare(
      req.body.password.toString(),
      result[0].password,
      (err, result2) => {
        if (err) {
          console.error("Error comparing passwords:", err); // Print to the server terminal
          return res.json({
            message: "Error comparing passwords",
            error: err.message,
          });
        }
        if (result2 == false) {
          return res.json({ Status: "Wrong Password" });
        }
        const name = result[0].name;
        const location_id = result[0].location_id;
        const token = jwt.sign(
          { name, location_id }, // Include both name and email in the payload
          "fwt-secret-key",
          { expiresIn: "1h" }
        );
        res.cookie("token", token);
        return res.json({ Status: "Success" });
      }
    );
  });
});

app.post("/update_time_price", (req, res) => {
  const deletingQuery = "DELETE FROM time_price WHERE `location_id` = ?";
  db.query(deletingQuery, [req.body.location_id], (err, result) => {
    if (err) {
      console.error(err);
      return res.json({
        message: "Error in deleting values",
        values,
        error: err.message,
      });
    }
    console.log("Done deleting! Inserting...");
    const data = req.body.data;
    for (let i = 0; i < data.length; i++) {
      data[i].location_id = req.body.location_id;
    }
    const values = [];
    for (const item of data) {
      values.push([item.location_id, item.time_start, item.time_end, item.price]);
    }
    console.log(values);
    const sql =
    "INSERT INTO time_price (`location_id`, `time_start`, `time_end`, `price`) VALUES ?";
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.error("Error inserting values:", values, "error: ", err); // Print to the server terminal
        return res.json({
          message: "Error in inserting values",
          error: err.message,
        });
      } else {
        return res.json({ message: "Update Successfully" });
      }
    });
  });
});

app.post("/add_time", (req, res) => {
  const student_id = req.body.student_id;
  const location_id = req.body.location_id;
  const time = req.body.time;
  const sql_find_null =
    "SELECT * FROM parking_event WHERE student_id = ? AND location_id = ? AND time_out IS NULL AND time_in IS NOT NULL";
  db.query(sql_find_null, [student_id, location_id, time], (err, result) => {
    if (err) {
      console.error("Error inserting values:", err); // Print to the server terminal
      return res.json({
        message: "Error in inserting values",
        values,
        error: err.message,
      });
    } else {
      console.log(result.length);
      if (result.length === 0) {
        const sql =
          "INSERT INTO parking_event (student_id, location_id, time_in, is_paid) VALUES (?)";
        const values = [student_id, location_id, time, 0];
        console.log(values);
        db.query(sql, [values], (err, result2) => {
          if (err) {
            console.error("Error inserting values:", values, "Error:", err); // Print to the server terminal
            return res.json({
              message: "Error in inserting values",
              values,
              error: err.message,
            });
          } else {
            return res.json({ message: "insert Successfully" });
          }
        });
      } else {
        function parseTime(timeString) {
          const [hours, minutes, seconds] = timeString.split(":");
          return new Date(0, 0, 0, hours, minutes, seconds);
        }

        function findIndex(startTimeString, endTimeString, timeIntervals) {
          const startTime = parseTime(startTimeString);
          const endTime = parseTime(endTimeString);
          let startIndex = null;
          let endIndex = null;
          for (let i = 0; i < timeIntervals.length; i++) {
            const interval = timeIntervals[i];
            const intervalStart = parseTime(interval.time_start);
            const intervalEnd = parseTime(interval.time_end);

            if (intervalStart <= startTime && startTime <= intervalEnd) {
              startIndex = i;
            }
            if (intervalStart <= endTime && endTime <= intervalEnd) {
              endIndex = i;
            }
          }
          return { startIndex, endIndex };
        }
        const getPrice = (location_id, time_in, time_out, callback) => {
          let totalPrice = 0;
          const sqlQuery =
            "SELECT time_start, time_end, price FROM time_price WHERE location_id = ?";
          db.query(sqlQuery, location_id, (err, result) => {
            if (err) {
              console.error("Error: ", err); // Print to the server terminal
              return -1;
            } else {
              const { startIndex, endIndex } = findIndex(
                time_in,
                time_out,
                result
              );
              if (undefined == result[startIndex]) {
                callback(0);
                return -1;
              }
              totalPrice =
                result[startIndex].price + (endIndex - startIndex) * 1;
              if (!callback) return totalPrice;
              callback(totalPrice);
            }
          });
        };

        console.log(result);
        const timeInDate = new Date(
          result[0].time_in.getTime() + 7 * 60 * 60 * 1000
        );
        getPrice(
          location_id,
          timeInDate.toISOString().slice(11, 19),
          time.slice(11, 19),
          (price) => {
            const sql =
              "UPDATE parking_event SET time_out = ?, price = ? WHERE student_id = ? AND location_id = ? AND time_out IS NULL";
            const values = [time, price, student_id, location_id];
            db.query(sql, values, (err, result) => {
              if (err) {
                console.error("Error inserting values:", values, "Error:", err); // Print to the server terminal
                return res.json({
                  message: "Error in inserting values",
                  values,
                  error: err.message,
                });
              } else {
                return res.json({ message: "Update time_out Successfully" });
              }
            });
          }
        );
      }
    }
  });
});

app.post("/tickets/:location_id", (req, res) => {
  const { location_id, mode } = req.params;
  const query = `SELECT * FROM parking_event WHERE location_id = ?`;
  db.query(query, [location_id], (error, results) => {
    console.log(query, location_id);
    if (error) {
      console.error("Error fetching tickets:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.get("/time_price/:location_id", (req, res) => {
  const { location_id, mode } = req.params;
  const query = `SELECT time_start, time_end, price FROM time_price WHERE location_id = ?`;
  db.query(query, [location_id], (error, results) => {
    console.log(query, location_id);
    if (error) {
      console.error("Error fetching time_price:", error);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(results);
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app;
