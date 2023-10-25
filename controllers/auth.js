const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const { decode } = require('punycode');
const { error } = require('console');


const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DATABASE_PORT
});

// login the user function

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).render('login', {
        message: 'Please provide an email and password'
      })
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
      console.log(results);
      if (!results || !(await bcrypt.compare(password, results[0].password))) {
        res.status(401).render('login', {
          message: 'Email or Password is incorrect'
        })
      }
      else {
        const id = results[0].id;

        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN
        });

        console.log("The token is:" + token);

        const cookieOptions = {
          expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
          ),
          httpOnly: true
        }

        res.cookie('jwt', token, cookieOptions);
        res.status(200).redirect('/');

      }

    })

  } catch (error) {
    console.log(error);
  }
}
//logged out function

exports.logout = async (req, res) => {
  res.cookie('jwt', 'logout', {      //setting up a new cookie
    expires: new Date(Date.now() + 2 * 1000),
    httpOnly: true
  });

  res.status(200).redirect('/');
}

//logged in function

exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      //1) verify the token
      const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
      // console.log(decoded);

      //2) check if the user still exists

      db.query('SELECT * FROM users WHERE id=?', [decoded.id], (error, result) => {
        // console.log(result);
        if (!result) {
          return next();
        }
        req.user = result[0];
        return next();
      });
    } catch (error) {
      // console.log(error);
      return next();    // after running the function ,go back again to the router
    }
  }
  else {
    next();
  }
}


// register the user function
exports.register = (req, res) => {
  console.log(req.body);

  const { name, email, password, passwordConfirm } = req.body;

  db.query('SELECT email FROM users WHERE email= ?', [email], async (error, results) => {
    if (error) {
      console.log(error);
    }
    if (results.length > 0) {
      return res.render('register', {
        message: 'That email is already in use'
      })
    }
    else if (password !== passwordConfirm) {
      return res.render('register', {
        message: 'Passwords do not match'
      });
    }

    let hashedPassword = await bcrypt.hash(password, 8);
    console.log(hashedPassword);

    db.query('INSERT INTO users SET ? ', { name: name, email: email, password: hashedPassword }, (error, results) => {
      if (error) {
        console.log(error);
      }
      else {
        console.log(results);
        return res.render('register', {
          message: 'User registered'
        });
      }
    })
  });

}
//submit survey

exports.survey = (req, res) => {
  console.log(req.body);
  const { time, department, Engagement, Communication, Leadership, Balance, Overall, comment } = req.body;
  db.query('INSERT INTO feedback SET ?', { SubmissionDate: time, Department: department, JobSatisfactionRating: Engagement, CommunicationRating: Communication, LeadershipRating: Leadership, WorkLifeBalanceRating: Balance, OverallSatisfactionRating: Overall, OpenEndedFeedback: comment }, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    else {
      console.log('Data inserted into database');
      res.status(200).send('Survey submitted successfully');
    }
  })
}
//charts

exports.charts = (req, res) => {
  // Fetch data from the 'feedback' table in your 'db' database
  db.query('SELECT SubmissionDate, Department, JobSatisfactionRating, CommunicationRating, LeadershipRating, WorkLifeBalanceRating, OverallSatisfactionRating FROM feedback', (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    // Process the retrieved data into a format that can be used by Chart.js
    const dataPoints = results.map((row) => ({
      date: new Date(row.SubmissionDate), // Assuming SubmissionDate is in a valid date format
      department: row.Department,
      jobSatisfactionRating: row.JobSatisfactionRating,
      communicationRating: row.CommunicationRating,
      leadershipRating: row.LeadershipRating,
      workLifeBalanceRating: row.WorkLifeBalanceRating,
      overallSatisfactionRating: row.OverallSatisfactionRating,
    }));

    // Sort the dataPoints by date if they are not already sorted
    dataPoints.sort((a, b) => a.date - b.date);

    // Extract the dates and ratings for Chart.js
    const dates = dataPoints.map((dataPoint) => dataPoint.date);
    const department = dataPoints.map((dataPoint) => dataPoint.department);
    const jobSatisfactionRating = dataPoints.map((dataPoint) => dataPoint.jobSatisfactionRating);
    const communicationRating = dataPoints.map((dataPoint) => dataPoint.communicationRating);
    const leadershipRating = dataPoints.map((dataPoint) => dataPoint.leadershipRating);
    const workLifeBalanceRating = dataPoints.map((dataPoint) => dataPoint.workLifeBalanceRating);
    const overallSatisfactionRating = dataPoints.map((dataPoint) => dataPoint.overallSatisfactionRating);

    // Execute the second database query to calculate month-wise average overall rating
    db.query('SELECT DATE_FORMAT(SubmissionDate, "%Y-%m") AS month, AVG(OverallSatisfactionRating) AS avgOverallRating FROM feedback GROUP BY month', (error2, results2) => {
      if (error2) {
        console.error(error2);
        return res.status(500).json({ error: 'Internal server error' });
      }
      // Process the results of the second query
      const monthWiseAvgOverallRating = results2.map((row) => ({
        month: row.month,
        avgOverallRating: row.avgOverallRating,
      }));

      // Extract the month and avgOverallRating values from monthWiseAvgOverallRating
      const month = monthWiseAvgOverallRating.map((dataPoint) => dataPoint.month);
      const avgOverallRating = monthWiseAvgOverallRating.map((dataPoint) => dataPoint.avgOverallRating);

      // avgOverallRating per department
      db.query('SELECT Department as departmentr, AVG(OverallSatisfactionRating) AS avgOverallRatingByDepartment FROM feedback GROUP BY Department', (error3, results3) => {
        if (error3) {
          console.error(error3);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // Process the results of the third query
        const departmentWiseAvgOverallRating = results3.map((row) => ({
          departmentr: row.departmentr,
          avgOverallRatingByDepartment: row.avgOverallRatingByDepartment,
        }));

        // Extract the department and avgOverallRating values from departmentWiseAvgOverallRating
        const departmentr = departmentWiseAvgOverallRating.map((dataPoint) => dataPoint.departmentr);
        const avgOverallRatingByDepartment = departmentWiseAvgOverallRating.map((dataPoint) => dataPoint.avgOverallRatingByDepartment);

        // avg ratings 
        db.query('SELECT AVG(JobSatisfactionRating) AS avgJobSatisfactionRating, AVG(CommunicationRating) AS avgCommunicationRating, AVG(LeadershipRating) AS avgLeadershipRating, AVG(WorkLifeBalanceRating) AS avgWorkLifeBalanceRating FROM feedback', (error4, results4) => {
          if (error4) {
            console.error(error4);
            return res.status(500).json({ error: 'Internal server error' });
          }

          // Process the results of the query
          const avgRatings = results4[0]; // Assuming the query returns a single row

          // Extract the data for Chart.js
          const avgJobSatisfactionRating = avgRatings.avgJobSatisfactionRating;
          const avgCommunicationRating = avgRatings.avgCommunicationRating;
          const avgLeadershipRating = avgRatings.avgLeadershipRating;
          const avgWorkLifeBalanceRating = avgRatings.avgWorkLifeBalanceRating;

          // avg jobSatisfactionRating per department
          db.query('SELECT Department as dep1, AVG(JobSatisfactionRating) AS AvgJobSatisfactionRatingperdep FROM feedback GROUP BY Department', (error5, results5) => {
            if (error5) {
              console.error(error5);
              return res.status(500).json({ error: 'Internal server error' });
            }

            // Process the results of the query
            const departmentWiseAvgRating = results5.map((row) => ({
              dep1: row.dep1,
              AvgJobSatisfactionRatingperdep: row.AvgJobSatisfactionRatingperdep,
            }));

            // Extract the data for Chart.js
            const dep1 = departmentWiseAvgRating.map((dataPoint) => dataPoint.dep1);
            const AvgJobSatisfactionRatingperdep = departmentWiseAvgRating.map((dataPoint) => dataPoint.AvgJobSatisfactionRatingperdep);

            db.query('SELECT Department as dep2, AVG(CommunicationRating) AS AvgCommunicationRatingperdep FROM feedback GROUP BY Department', (error6, results6) => {
              if (error6) {
                console.error(error6);
                return res.status(500).json({ error: 'Internal server error' });
              }

              // Process the results of the query
              const departmentWiseAvgRating = results6.map((row) => ({
                dep2: row.dep2,
                AvgCommunicationRatingperdep: row.AvgCommunicationRatingperdep,
              }));

              // Extract the data for Chart.js
              const dep2 = departmentWiseAvgRating.map((dataPoint) => dataPoint.dep2);
              const AvgCommunicationRatingperdep = departmentWiseAvgRating.map((dataPoint) => dataPoint.AvgCommunicationRatingperdep);



              db.query('SELECT Department as dep3, AVG(LeadershipRating) AS AvgLeadershipRatingperdep FROM feedback GROUP BY Department', (error7, results7) => {
                if (error7) {
                  console.error(error7);
                  return res.status(500).json({ error: 'Internal server error' });
                }

                // Process the results of the query
                const departmentWiseAvgRating = results7.map((row) => ({
                  dep3: row.dep3,
                  AvgLeadershipRatingperdep: row.AvgLeadershipRatingperdep,
                }));

                // Extract the data for Chart.js
                const dep3 = departmentWiseAvgRating.map((dataPoint) => dataPoint.dep3);
                const AvgLeadershipRatingperdep = departmentWiseAvgRating.map((dataPoint) => dataPoint.AvgLeadershipRatingperdep);


                db.query('SELECT Department as dep4, AVG(WorkLifeBalanceRating) AS AvgWorkLifeBalanceRatingperdep FROM feedback GROUP BY Department', (error8, results8) => {
                  if (error8) {
                    console.error(error8);
                    return res.status(500).json({ error: 'Internal server error' });
                  }

                  // Process the results of the query
                  const departmentWiseAvgRating = results8.map((row) => ({
                    dep4: row.dep4,
                    AvgWorkLifeBalanceRatingperdep: row.AvgWorkLifeBalanceRatingperdep,
                  }));

                  // Extract the data for Chart.js
                  const dep4 = departmentWiseAvgRating.map((dataPoint) => dataPoint.dep4);
                  const AvgWorkLifeBalanceRatingperdep = departmentWiseAvgRating.map((dataPoint) => dataPoint.AvgWorkLifeBalanceRatingperdep);


                  // Send the data to the client side
                  return res.json({
                    dates: dates,
                    department: department,
                    jobSatisfactionRating: jobSatisfactionRating,
                    communicationRating: communicationRating,
                    leadershipRating: leadershipRating,
                    workLifeBalanceRating: workLifeBalanceRating,
                    overallSatisfactionRating: overallSatisfactionRating,
                    month: month,
                    avgOverallRating: avgOverallRating,
                    departmentr: departmentr,
                    avgOverallRatingByDepartment: avgOverallRatingByDepartment,
                    avgJobSatisfactionRating: avgJobSatisfactionRating,
                    avgCommunicationRating: avgCommunicationRating,
                    avgLeadershipRating: avgLeadershipRating,
                    avgWorkLifeBalanceRating: avgWorkLifeBalanceRating,
                    dep1: dep1,
                    AvgJobSatisfactionRatingperdep: AvgJobSatisfactionRatingperdep,
                    dep2: dep2,
                    AvgCommunicationRatingperdep: AvgCommunicationRatingperdep,
                    dep3: dep3,
                    AvgLeadershipRatingperdep: AvgLeadershipRatingperdep,
                    dep4: dep4,
                    AvgWorkLifeBalanceRatingperdep: AvgWorkLifeBalanceRatingperdep,
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};







