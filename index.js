const inquirer = require("inquirer");
const db = require("./config/connection");

require("console.table");

db.connect(() => {
  menu();
});
/*
view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

*/
const menuQuestion = [
  {
    type: "list",
    name: "menu",
    message: "choose the following option:",
    choices: [
      "view all departments",
      "view all roles",
      "view all employees",
      "add a department",
      "add a role",
      "add an employee",
      "update an employee role",
    ],
  },
];

function menu() {
  inquirer.prompt(menuQuestion).then((response) => {
    if (response.menu === "view all employees") {
      viewEmployees();
    } else if (response.menu === "view all departments") {
      viewDepartments();
    } else if (response.menu === "add an employee") {
      addEmployees();
    } else if (response.menu === "update employee role") {
      updateEmployeeRole();
    } else if (response.menu === "add a department") {
      addDept();
    } else if (response.menu === "add a role") {
      addRole();
    } else if (response.menu === "view all roles") {
      viewRoles();
    }
  });
}
function viewDepartments() {
  db.query("select * from department", (err, data) => {
    console.table(data);
    menu();
  });
}

function viewRoles() {
  db.query("select * from role", (err, data) => {
    console.table(data);
    menu();
  });
}

function addEmployees() {
  db.query("select title as name, id as value from role", (er, roleData) => {
    db.query(
      `select CONCAT(first_name, " " , last_name) as name,  id as value from employee where  manager_id is null `,
      (err, managerData) => {
        const employeeAddQuestions = [
          {
            type: "input",
            name: "first_name",
            message: "What is your first name?",
          },
          {
            type: "input",
            name: "last_name",
            message: "What is your first name?",
          },
          {
            type: "list",
            name: "role_id",
            message: "Choose the following role title",
            choices: roleData,
          },
          {
            type: "list",
            name: "manager_id",
            message: "Choose the following manager",
            choices: managerData,
          },
        ];
        inquirer.prompt(employeeAddQuestions).then((response) => {
          const parameters = [
            response.first_name,
            response.last_name,
            response.role_id,
            response.manager_id,
          ];
          db.query(
            "INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",
            parameters,
            (err, data) => {
              viewEmployees();
            }
          );
        });
      }
    );
  });
}
function viewEmployees() {
  db.query(
    `
SELECT 
employee.id,
employee.first_name,
employee.last_name,
role.title,
department.name as department,
role.salary,
CONCAT(mgr.first_name, " " , mgr.last_name) as manager
FROM employee
LEFT JOIN role ON role.id= employee.role_id
LEFT JOIN department ON role.department_id=department.id
LEFT JOIN employee as mgr ON employee.manager_id =  mgr.id

`,
    (err, data) => {
      //   console.log(data)
      console.table(data);

      menu();
    }
  );

  function updateEmployeeRole() {
    db.query("select title as name, id as value from role", (er, roleData) => {
      db.query(
        `select CONCAT(first_name, " " , last_name) as name,  id as value from employee where  manager_id is null `,
        (err, managerData) => {
          const employees = [
            {
              type: "list",
              name: "employeeName",
              message: "Which employee's role would you like to update?",
            },
            {
              type: "input",
              name: "role",
              message: "What is your new role?",
            },
          ];
          inquirer.prompt(employees).then((response) => {
            const parameters = [
              response.first_name,
              response.last_name,
              response.role_id,
              response.manager_id,
            ];
            db.query(
              "INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",
              parameters,
              (err, data) => {
                viewEmployees();
              }
            );
          });
        }
      );
    });
  }

  function addDept() {
    db.query("select title as name, id as value from role", (er, roleData) => {
      db.query(
        `select CONCAT(first_name, " " , last_name) as name,  id as value from employee where  manager_id is null `,
        (err, managerData) => {
          const departmentAddQuestions = [
            {
              type: "input",
              name: "name",
              message: "What departmen would you like to add?",
            },
            {
              type: "input",
              name: "id",
              message: "What is the new department ID number?",
            },
            {
              type: "list",
              name: "role_id",
              message: "Choose the following role title",
              choices: roleData,
            },
          ];
          inquirer.prompt(departmentAddQuestions).then((response) => {
            const parameters = [
              response.first_name,
              response.last_name,
              response.role_id,
              response.manager_id,
            ];
            db.query(
              "INSERT INTO employee (first_name,last_name,role_id,manager_id)VALUES(?,?,?,?)",
              parameters,
              (err, data) => {
                viewDepartments();
              }
            );
          });
        }
      );
    });
  }

  function addRole() {
    db.query("select title as name, id as value from role", (er, roleData) => {
      db.query(
        `select role.title, role.salary AS Salary  id as value from employee where  manager_id is null `,
        (err, managerData) => {
          const roleAddQuestions = [
            {
              type: "input",
              name: "title",
              message: "What is the name of the new role",
            },
            {
              type: "input",
              name: "salary",
              message: "What is the salary of the new role",
            },
            {
              type: "rawlist",
              name: "department",
              message: "Under which department does this new role fall",
              choices: roleData,
            },
          ];
          inquirer.prompt(roleAddQuestions).then((response) => {
            const parameters = [
              response.role.title,
              response.role.salart,
              response.role_id,
              response.manager_id,
            ];
            db.query(
              "INSERT INTO employee (role.title,role.salary,role_id,manager_id)VALUES(?,?,?,?)",
              parameters,
              (err, data) => {
                viewRoles();
              }
            );
          });
        }
      );
    });
  }
}
