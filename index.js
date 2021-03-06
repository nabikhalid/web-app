const express = require('express');
const app = express();
const path = require('path');
// var List = require("collections/list");

app.use(express.json());

// app.get();
// app.post();
// app.put();
// app.delete();

// logic modelling

var courses = [
    // {id: 'EECS 2030', grade: 'A+', credits: 3}, 
    // {id: 'EECS 2040', grade: 'A+', credits: 3}, 
    // {id: 'EECS 2050', grade: 'A+', credits: 3}, 
    // {id: 'EECS 2060', grade: 'A+', credits: 3}, 
    // {id: 'EECS 2070', grade: 'A+', credits: 3}, 
    // {id: 'EECS 2080', grade: 'B+', credits: 3}
];

// can change type of scale, 12-point, 4-point, etc.

function calculateGPA(courses) {
    var totalPoints = 0, totalCredits = 0, i;
    for (i = 0; i < courses.length; i++) {
        totalPoints = totalPoints + gradeToPoints(courses[i].grade) * courses[i].credits;
        totalCredits = totalCredits + courses[i].credits;
    }
    return totalPoints / totalCredits;
}

function gradeToPoints(letterGrade){
    if(letterGrade === 'A+') {
        return 9;
    }
    else if (letterGrade === 'A'){
        return 8;
    }
    else if (letterGrade === 'B+'){
        return 7;
    }
    else if (letterGrade === 'B'){
        return 6;
    }
    else if (letterGrade === 'C+'){
        return 5;
    }
    else if (letterGrade === 'C'){
        return 4;
    }
    else if (letterGrade === 'D+'){
        return 3;
    }
    else if (letterGrade === 'D'){
        return 2;
    }
    else if (letterGrade === 'E'){
        return 1;
    }
    else if (letterGrade === 'F'){
        return 0;
    }
    else {
        return -1;
    }
}

function validGrade(grade) {
    if(grade === 'A+' || grade === 'A' || grade === 'B+' || grade === 'B' || grade === 'C+' || grade === 'C' || grade === 'D+' || grade === 'D' || grade === 'E' || grade === 'F') {
        return true;
    }
    else {
        return false;
    }
}

function validCredits(credits){
    if(credits === 0,1,2,3,6){
        return true;
    }
    return false;
}

// '/' is the root of a website
// this is a route to root
app.get('/api', (req, res) => {
    res.send('Welcome to your 9-Point scale GPA Calculator.');
});

// app.get('/', function(req, res) {
//     res.sendFile(path.join(__dirname, '/index.html'));
// });

app.post('/api/input', (req, res) => {
    // input validation
    if(!req.body.id || !req.body.grade || !req.body.credits){
        res.status(400).send('One of your course ID, grade, or credits is missing.');
        return;
    }
    if (!validGrade(req.body.grade) || !validCredits(req.body.credits)){
        res.status(400).send('One of your course grade or credits is invalid.');
        return;
    }
    let course = courses.find(c => c.id === req.params.id);
    if (!course) {
        let newCourse = {
            id: req.body.id, 
            grade: req.body.grade, 
            // parse JSON
            credits: parseInt(req.body.credits),
        };
    
        courses.push(newCourse);
        res.send(newCourse);
    }
    res.status(400).send('Course is already in database.');
});

app.get('/api/getgpa', (req, res) => {
    res.send(calculateGPA(courses).toFixed(5));
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    // backend logic
    let course = courses.find(c => c.id === req.params.id);
    // 404 not found
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }
    res.send(courses);
    return;
});

// can use const if course obj is not reset later
// can use let otherwise 


// put 
// finish this, update for text, not courses

app.put('/api/courses/:id', (req, res) => {
    // find the course, if doesn't exist, 404
    let course = courses.find(c => c.id === req.params.id);
    // 404 not found
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }
    // bad request 400
    if(!req.body.id || !req.body.grade || !req.body.credits){
        res.status(400).send('One of your course ID, grade, or credits is missing.');
        return;
    }
    if (!validGrade(req.body.grade) || !validCredits(req.body.credits)){
        res.status(400).send('One of your course grade or credits is invalid.');
        return;
    }

    course.grade = req.body.grade;
    course.credits = parseInt(req.body.credits);
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    let course = courses.find(c => c.id === req.params.id);
    // 404 not found
    if (!course) {
        res.status(404).send('The course with the given ID was not found.');
        return;
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(courses);
});

// environment variable, if port 3000 is not available, for deployment
app.listen(3000, () => console.log('Listening on port 3000...'));