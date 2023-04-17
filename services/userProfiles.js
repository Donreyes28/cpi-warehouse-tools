const db = require("./db");
const config = require("../utils/config");
const helper = require("../utils/helper");

async function getMultiple(page = 1) {
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, first_name, last_name, gender, email, role, password 
    FROM warehouse_tools.user_list`
    // LIMIT ${offset},${config.listPerPage}
  );
  const data = helper.emptyOrRows(rows);
  const meta = { page };

  return {
    data,
    meta,
  };
}

async function create(user) {
  const { firstName, lastName, gender, email, role, password } = user;
  const result = await db.query(
    `INSERT INTO warehouse_tools.user_list 
      (first_name, last_name, gender, email, role, password) 
      VALUES 
      (?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, gender, email, role, password]
  );

  let message = "Error in creating user profile";

  if (result.affectedRows) {
    message = "User profile created successfully";
  }

  return { message };
}

async function update(id, user) {
  const result = await db.query(
    `UPDATE warehouse_tools.user_list 
    SET first_name="${user.first_name}", last_name="${user.last_name}", gender="${user.gender}", role="${user.role}"
    WHERE id=${id}`
  );

  let message = "Error in updating user profile";

  if (result.affectedRows) {
    message = "User profile updated successfully";
  }

  return { message };
}

async function remove(id) {
  const result = await db.query(
    `DELETE FROM warehouse_tools.user_list WHERE id=${id}`
  );

  let message = "Error in deleting user profile";

  if (result.affectedRows) {
    message = "User profile deleted successfully";
  }

  return { message };
}

module.exports = {
  getMultiple,
  create,
  update,
  remove,
};
