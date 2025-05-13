const express=require('express')
const app=express()
const port=process.env.PORT ||3000
const cors = require('cors');
const mysql = require('mysql2'); 
const send = require('send');
// const multer = require('multer');

app.use(cors({
    origin: 'http://localhost:5173' 
  }));
  app.use(express.json());

const db=mysql.createConnection({
    host: '127.0.0.1',      
    port: 3306,             
    user: 'root',          
    password: 'riyad2002@',           
    database: 'finmin'
  })

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database!');
  });

  

  app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    console.log(email);
    console.log(password);
  
    const empquery = 'SELECT * FROM employee WHERE email = ? AND password = ?';
    db.execute(empquery, [email, password], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
  
      // console.log(result);
  
      if (result.length > 0) {
        return res.json({ message: "employee" });
      } else {
        
        const managerquery = 'SELECT * FROM manager WHERE email = ? AND password = ?';
        db.execute(managerquery, [email, password], (err, managerResult) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Internal server error" });
            return;
          }
  
          if (managerResult.length > 0) {
           return res.json({ message: "manager" });
          } else {
            return res.status(401).json({ message: "Invalid email or password" });
          }
        });
      }
    });
  });
  




  app.post("/empName", (req, res) => {
    const { email } = req.body;
    console.log("im listening from empName");
  
    const query = "SELECT * FROM employee WHERE email=?";
  
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }
  
      if (result.length > 0) {
        console.log(result);
        const name=result[0].name
        const id=result[0].emp_id
        const deptquery="SELECT dept_name from employee JOIN department ON employee.dept_id=department.dept_id WHERE email=?"

    db.execute(deptquery, [email], (err, result)=>{
      if(err){
        console.log(err)
      }
      if (result.length > 0) {
        return res.json({ name, id, dept_name: result[0].dept_name });
        
      } else {
       return  res.status(404).json({ error: "Department not found for this employee" });
      }
    })
      } else {
        return res.status(404).send("Employee not found");
      }
    });

    
  });


  app.post("/currentRequest", (req, res) => {
    const { email } = req.body;
    const query = "SELECT emp_id FROM employee WHERE email=?";
  
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }
  
      if (result.length > 0) {
        const emp_id = result[0].emp_id;
        console.log("emp_id:", emp_id);
  
        const expquery = "SELECT * FROM expence WHERE emp_id=? AND status=?";
        const reject="pending"
        db.execute(expquery, [emp_id, reject], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Expense query error");
          }
  
          if (result.length > 0) {
            console.log("Current request:", result);
            return res.json(result); // or format as needed
          } else {
            return res.status(404).json({ message: "No expenses found" });
          }
        });
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    });
  });
  
  
  app.post("/accepted", (req, res)=>{
    const {email}=req.body;
    const query = "SELECT emp_id FROM employee WHERE email=?";
  
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database error");
      }
  
      if (result.length > 0) {
        const emp_id = result[0].emp_id;
        console.log("emp_id:", emp_id);
  
        const expquery = "SELECT * FROM expence WHERE emp_id=? AND status=?";
        const reject="accepted"
        db.execute(expquery, [emp_id, reject], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Expense query error");
          }
  
          if (result.length > 0) {
            console.log("Current request:", result);
            return res.json(result); 
          } else {
            return res.status(404).json({ message: "No expenses found" });
          }
        });
      } else {
        return res.status(404).json({ message: "Employee not found" });
      }
    });
  })

  // app.post("/managerInfo")

  app.post("/pendingRequest", (req, res) => {
    const { email } = req.body;
  
    const query = `
      SELECT e.emp_id, e.name, ex.expence_id, ex.amount, ex.image_url, ex.status, ex.date,ex.title
      FROM employee e
      JOIN expence ex ON e.emp_id = ex.emp_id
      JOIN department d ON e.dept_id = d.dept_id
      JOIN manager m ON d.manager_id = m.manager_id
      WHERE m.email = ? AND ex.status = 'pending'
    `;
  
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log("Query Error: ", err);
        return res.status(500).send("Database Error");
      }
  
      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).json({ message: "No pending requests found" });
      }
    });
  });
  
  app.post("/manageraccept", (req, res) => {
    const { expence_id, email, amount } = req.body;
  
    if (!expence_id) {
      return res.status(400).send("expence_id is required");
    }
  
    const query = "UPDATE expence SET status='accepted' WHERE expence_id=?";
    db.execute(query, [expence_id], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database update failed");
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).send("No matching request found");
      }
  
      const idquery = 'SELECT dept_id, manager_id FROM manager WHERE email=?';
      db.execute(idquery, [email], (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).send("Database error");
        }
  
        if (result.length > 0) {
          const dept_id = result[0].dept_id;
          const manager_id = result[0].manager_id;
  
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth() + 1;
          const currentYear = currentDate.getFullYear();  
  
          const prevAmountQuery = "SELECT SUM(amount) AS totalAmount FROM expence WHERE manager_id=? AND MONTH(date) = ? AND YEAR(date) = ? AND status = 'accepted'";
  
          db.execute(prevAmountQuery, [manager_id, currentMonth, currentYear], (err, result) => {
            if (err) {
              console.error("Error querying database:", err);
              return res.status(500).send("Database error");
            }
  
            const totalAmount = result[0]?.totalAmount ?? 0;  
            const newTotalAmount = Number(totalAmount) + Number(amount);

  
            const updateBudget = "UPDATE budget SET used_budget=? WHERE dept_id=?";
  
            db.execute(updateBudget, [Number(newTotalAmount), dept_id], (err, result) => {
              if (err) {
                console.error("Error updating budget:", err);
                return res.status(500).send("Failed to update budget");
              }
  
              if (result.affectedRows > 0) {
                return res.status(200).json({ message: "Budget updated successfully" });
              } else {
                return res.status(404).send("Department not found");
              }
            });
          });
        }
      });
    });
  });
  

  app.post("/approvedtask", (req, res) => {
    const { email } = req.body;
  
    const query = `
      SELECT e.emp_id, e.name, ex.expence_id, ex.amount, ex.image_url, ex.status, ex.date,ex.title
      FROM employee e
      JOIN expence ex ON e.emp_id = ex.emp_id
      JOIN department d ON e.dept_id = d.dept_id
      JOIN manager m ON d.manager_id = m.manager_id
      WHERE m.email = ? AND ex.status = 'accepted'
    `;
  
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log("Query Error: ", err);
        return res.status(500).send("Database Error");
      }
  
      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).json({ message: "No accepted requests found" });
      }
    });
  });

  app.post("/budgetHistory", (req,res)=>{
    const { email } = req.body;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();
    const dquery = "SELECT dept_id FROM manager WHERE email = ?";
    db.execute(dquery, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }
      if(result.length>0){
        const dept_id=result[0].dept_id

        const query = `
  SELECT total_budget, used_budget 
  FROM budget 
  WHERE month = ? AND year = ? AND dept_id = ?
`;
     db.execute(query,[currentMonth,currentYear,dept_id], (err, result)=>{
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }
      if(result.length > 0){
        const totalBudget = result[0].total_budget;
        const usedBudget = result[0].used_budget;
        res.json({
          total_budget: totalBudget,
          used_budget: usedBudget,
        });
      }
      
     })
      }


    });
  })
  
  
  // app.post("/budgetHistory", (req, res) => {
  //   const { email } = req.body;
  //   const currentDate = new Date();
  //   const currentMonth = currentDate.getMonth() + 1;
  //   const currentYear = currentDate.getFullYear();

  //   const aquery = "SELECT dept_id FROM manager WHERE email = ?";
  //   db.execute(aquery, [email], (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).json({ error: "Database error" });
  //     }

  //     console.log(result)
  
      

  //   });
  
  //   const query = `
  //   SELECT 
  //     b.total_budget, 
  //     IFNULL(SUM(ex.amount), 0) AS used_budget
  //   FROM budget b
  //   LEFT JOIN expense ex ON b.dept_id = ex.dept_id 
  //     AND MONTH(ex.date) = ? 
  //     AND YEAR(ex.date) = ? 
  //     AND ex.status = 'accepted'
  //   JOIN department d ON b.dept_id = d.dept_id
  //   JOIN manager m ON d.manager_id = m.manager_id
  //   WHERE m.email = ?
  //   GROUP BY b.dept_id;
  // `;
  //   db.execute(query, [currentMonth, currentYear, email], (err, result) => {
  //     if (err) {
  //       console.error("DB error:", err);
  //       return res.status(500).json({ error: "Database error" });
  //     }
  
  //     if (result.length === 0) {
  //       return res.status(404).json({ error: "No budget found for this manager" });
  //     }
  
  //     const budgetData = result[0];
  //     const totalBudget = budgetData.total_budget ?? 0;
  //     const usedBudget = budgetData.used_budget;
  
  //     res.json({
  //       total_budget: totalBudget,
  //       used_budget: usedBudget,
  //     });
  //   });
  // });
  

  // const storage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'uploads/');
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = path.extname(file.originalname);
  //     cb(null, Date.now() + ext);
  //   }
  // });
  // const upload = multer({ storage });

  // Backend: Express.js - newrequest endpoint

  app.post("/newrequest", (req, res) => {
    const { title, amount, description, date,  email, status } = req.body;
  
    console.log("Received data:", req.body); 
  
    const empidquery="SELECT emp_id FROM employee WHERE email=?";

    db.execute(empidquery,[email], (err,result)=>{
      if(err){
        console.log(err)
        return;
      }
      const emp_id = result[0].emp_id;

      console.log("emp_id: ", emp_id)

      const manageridquery = `SELECT department.manager_id 
FROM employee 
JOIN department ON employee.dept_id = department.dept_id 
JOIN manager ON department.manager_id = manager.manager_id 
WHERE employee.emp_id = ?`;

      db.execute(manageridquery, [emp_id], (err, result)=>{
        if(err){
          return console.log(err)
        }
        console.log("manager id:", result[0].manager_id)
        const manager_id=result[0].manager_id
        const query = "INSERT INTO expence (title, amount, date, emp_id, manager_id, status) VALUES (?, ?, ?, ?, ?, ?)";
        
        db.query(query, [title, amount, date, emp_id, manager_id, status], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Failed to save expense");
          }
          console.log(result)
          res.status(200).json({ message: "Expense request submitted successfully", id: result.insertId });
        });
      })
    })

    // Now handle the data as before, inserting into the database, etc.
    // db.query(
    //   "SELECT manager_id FROM employee WHERE emp_id = ?",
    //   [emp_id],
    //   (err, result) => {
    //     if (err) {
    //       console.error(err);
    //       return res.status(500).send("Database error");
    //     }
  
    //     const managerId = result[0]?.manager_id || manager_id; // Use the manager_id from DB or from request
    //     const image = null; // As image is optional, leave it as null
  
    //     const query = "INSERT INTO expence (title, amount, description, date, emp_id, manager_id, status, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
    //     db.query(query, [title, amount, description, date, emp_id, managerId, status, image], (err, result) => {
    //       if (err) {
    //         console.error(err);
    //         return res.status(500).send("Failed to save expense");
    //       }
  
    //       res.status(200).json({ message: "Expense request submitted successfully", id: result.insertId });
    //     });
    //   }
    // );
  });

  app.post("/managerid", (req, res) => {
    const { email } = req.body;
    const query = "SELECT dept_id FROM manager WHERE email = ?";
    db.execute(query, [email], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }

      return res.json(result)
  
      

    });
  });


  app.post("/createbudget", (req, res) => {
    const { email, total_budget, month, year } = req.body;
  
    if (!email || !total_budget || !month || !year) {
      return res.status(400).json({ error: "All fields are required" });
    }
  
    // Step 1: Get manager_id and dept_id in one query
    const managerQuery = 
      `SELECT manager_id, dept_id FROM manager WHERE email = ?`
    ;
    db.execute(managerQuery, [email], (err, managerResult) => {
      if (err) {
        console.log("Manager Query Error:", err.message);
        return res.status(500).json({ error: "Database error when fetching manager_id" });
      }
  
      if (managerResult.length === 0) {
        return res.status(404).json({ error: "Manager not found for the provided email" });
      }
  
      const { manager_id, dept_id } = managerResult[0];
  
      // Step 2: Check if a budget record exists for the same month and year
      const checkQuery = "SELECT * FROM budget WHERE month = ? AND year = ? AND dept_id = ?";
      db.execute(checkQuery, [month, year, dept_id], (err3, checkResult) => {
        if (err3) {
          console.log("Check Budget Error:", err3.message);
          return res.status(500).json({ error: "Database error while checking budget" });
        }
  
        if (checkResult.length > 0) {
          // Step 3: If a budget record exists, update the budget
          const updateQuery = 
            `UPDATE budget
            SET total_budget = ?, used_budget = 0.00
            WHERE month = ? AND year = ? AND dept_id = ?`
          ;
          db.execute(updateQuery, [total_budget, month, year, dept_id], (err4, result) => {
            if (err4) {
              console.log("Update Budget Error:", err4.message);
              return res.status(500).json({ error: "Failed to update the budget" });
            }
  
            return res.status(200).json({ message: "Budget updated successfully" });
          });
        } else {
          // Step 4: If no record exists, insert a new budget record
          const insertQuery = 
            `INSERT INTO budget (total_budget, used_budget, month, year, dept_id)
            VALUES (?, 0.00, ?, ?, ?)`
          ;
          db.execute(insertQuery, [total_budget, month, year, dept_id], (err5, result) => {
            if (err5) {
              console.log("Insert Budget Error:", err5.message);
              return res.status(500).json({ error: "Failed to insert budget into database" });
            }
  
            return res.status(200).json({ message: "Budget created successfully" });
          });
        }
      });
    });
  });

  // app.post("/manageraccept", (req, res) => {
  //   const { expence_id,email,amount  } = req.body; 
  
  //   if (!expence_id) {
  //     return res.status(400).send("expence_id is required");
  //   }
  
  //   const query = "UPDATE expence SET status='accepted' WHERE expence_id=?";
  //   db.execute(query, [expence_id], (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send("Database update failed");
  //     }
  
  //     if (result.affectedRows === 0) {
  //       return res.status(404).send("No matching request found");
  //     }

  //     const idquery='SELECT dept_id, manager_id FROM manager WHERE email=?'
  //     db.execute(idquery,[email], (err,result)=>{
  //       if(err){
  //         return console.log(err)
  //       }
  //       if(result.length>0){
  //         const dept_id=result[0].dept_id
  //         const manager_id=result[0].manager_id

  //         const currentDate = new Date();
  //         const currentMonth = currentDate.getMonth() + 1; // 1 থেকে 12 পর্যন্ত মাস 
  //         const currentYear = currentDate.getFullYear();

  //         const prevAmountQuery="SELECT SUM(amount) AS totalAmount FROM expence WHERE manager_id=? AND MONTH(date) = ? AND YEAR(date) = ? AND status = 'accepted'"

  //         db.execute(prevAmountQuery, [manager_id, currentMonth, currentYear], (err, result) => {
  //           if (err) {
  //             console.error("Error querying database:", err);
  //             return res.status(500).send("Database error");
  //           }
          
  //           const totalAmount = result[0]?.totalAmount ?? 0;  
  //           const newTotalAmount=totalAmount+amount

  //           const updateBudget="UPDATE budget SET used_budget=? WHERE dept_id=? "

  //           db.execute(updateBudget, [newTotalAmount, dept_id], (err, result) => {
  //             if (err) {
  //               console.error("Error updating budget:", err);
  //               return res.status(500).send("Failed to update budget");
  //             }
          
  //             if (result.affectedRows > 0) {
  //               res.status(200).json({ message: "Budget updated successfully" });
  //             } else {
  //               res.status(404).send("Department not found");
  //             }
  //           });

  //         });
  //       }
  //     })
  
  //     res.status(200).json({ message: "Request accepted successfully" });
  //   });
  // });

  


app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});