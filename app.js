// Required Classes. //
const Manager = require('./lib/Manager');
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');

// Required Dependacies. //
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
// const {Validator} = require('node-input-validator');

// const phone = require('phone');

// Output Paths required for the output file. //
const OUTPUT_DIR = path.resolve(__dirname, 'output');
const outputPath = path.join(OUTPUT_DIR, 'team.html');

// File to be rendered. //
const renderToHTML = require('./lib/htmlRenderer');

// This is how the team's data will be stored. //
teamArr = [];

// This declarations are for the function of adding team members. //
let addMember;

// I do not want to repeat myself.  This variable is created for reusability between the additional team members to be genereated; such as adding an intern: I now only need to include the properties that are exclusive to the intern, etc. //
let employeeQ = [
    {
        type: 'input',

        name: 'name',
    },

    {
        type: 'input',

        name: 'id',

        message: 'Please state your ID number.'
    },

    {
        type: 'input',

        name: 'email',

        message: 'Please state your email.'
    },

    // Ref. https://www.npmjs.com/package/node-input-validator //
    // Validator
];


// Code used by inquirer, to gather information about the development team members. //
function addTeamMember(addMember) {

   if (addMember === 'Intern') {

        addInt();

    }   else if (addMember === 'Engineer') {

        addEng();

    } else if (addMember === 'Manager') {

        addMgr();
    }  
};


// Validation. //
// app.post('login', function (req, res) {
//     const v = new Validator(req.body, {
//       name: 'required|name',
//       email: 'required|email',
//       id: 'required|id'
//     });
  
//     v.check().then((matched) => {
//       if (!matched) {
//         res.status(422).send(v.errors);
//       }
//     });
//   });


// This function will generate and return a block of HTML including templated divs for each employee, to ./lib/htmlRenderer.js //
function render() {

    var html = renderToHTML(teamArr);

    fs.writeFile(outputPath, html, (err) => {
        if (err) throw err;
        console.log('Your team is generated.');
    });
};


// Inquires for User to start generating a team. //
function teamGenerator() {

    return inquirer

        .prompt([
            
            {
                type: 'list',

                name: 'role',

                message: `What is your role?`,

                choices: ['Intern', 'Engineer', 'Manager', 'No additional team members.  Generate team.  Quit CLI application.']
            } 
        ])

        .then(data => {

            if (data.role === 'No additional team members.  Generate team.  Quit CLI application.') {
                
                render();
            }
            
            else {
                
                addTeamMember(data.role);
            }    
        })
        
        .catch(err => {
            if (err) throw err;
        });
        
};


// If New Team Member Is An Intern. //
function addInt() {
    
    employeeQ.push( {
        
        type: 'input',

        name: 'school',

        message: 'Please enter the university the intern attends.'
    })

    return inquirer

        .prompt(employeeQ)

        .then(data => {

            const {name, id, email, school} = data;

            // Passing the intern data class constructor. //
            const intern = new Intern(name, id, email, school);

            teamArr.push(intern);

            render();

            teamGenerator();
        })
        
        .catch(err => {
            
            if (err) throw err;
        });
};


// If New Team Member Is An Engineer. //
function addEng() {
    
    employeeQ.push( {
    
        type: 'input',

        name: 'github',

        message: `Please enter the engineer's GitHub user name.`
    })

    return inquirer

        .prompt(employeeQ)

        .then(data => {

            const {name, id, email, github} = data;

            // Passing the engineer data class constructor. //
            const engineer = new Engineer(name, id, email, github);

            teamArr.push(engineer);

            render();

            teamGenerator();
        })
        
        .catch(err => {
            if (err) throw err;
        });
};


// If New Team Member Is A Manager. //
function addMgr() {
    
    employeeQ.push({
    
        type: 'input',

        name: 'deskNumber',
            // phone,

        message: `Please enter the manager's desk number.`
    })

    return inquirer

        .prompt(employeeQ)

        .then(data => {

            const {name, id, email, deskNumber} = data;

            // Passing the manager data class constructor. //
            const manager = new Manager(name, id, email, deskNumber);

            teamArr.push(manager);

            teamGenerator();
        })
        
        .catch(err => {
            if (err) throw err;
        });
};

teamGenerator();

module.exports = teamArr;