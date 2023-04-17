const db = require('./db');
const config = require('../utils/config');
// const helper = require('../utils/helper');

const getAllImportRequest = async () => {
  const rows = await db.query(
    `SELECT * 
    FROM warehouse_tools.imports`,
  );
  return {
    rows,
  };
};

const getImportRequest = async (category, status) => {
  const rows = await db.query(`SELECT * FROM warehouse_tools.imports WHERE category = '${category}' AND status = '${status}' LIMIT 1`);
  return {
    rows,
  };
};

const updateImportStatus = async (id, batch) => {
  const result = await db.query(
    `UPDATE warehouse_tools.imports
    SET batchId='${batch.batchId}', importedBy='${batch.importedBy}', importName='${batch.importName}', category='${batch.category}', status='${batch.newStatus}', dateImported='${batch.dateImported}'
    WHERE id=${batch.id}`,
  );
  let message = 'Error in updating the batch';
  if (result.affectedRows) {
    message = 'Batch updated successfully';
  }

  return {message};
};

const createImport = async (newImportName) => {
  // const batchId = ('WT-' + Date.now());
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const time = `${hours}:${minutes} ${now.getHours() < 12 ? 'AM' : 'PM'}`;
  const date = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${time}`;

  const result = await db.query(
    `INSERT INTO warehouse_tools.imports
          (batchId, importedBy, importName, status, category, dateImported)
          VALUES
          (?, ?, ?, ?, ?, ?)`,
    [newImportName.batchId, newImportName.importedBy, newImportName.importName, 'open', newImportName.category, date],
  );

  let message = 'Error in creating user profile';

  if (result.affectedRows) {
    message = 'User profile created successfully';
  }

  return {message};
};

const getImportName = async(batchID) => {
  const result= await db.query(
    `SELECT importName FROM warehouse_tools.imports WHERE batchID='${batchID}'`
  )

  return {
    result
  }
}

const deleteImport = async(id) => {
  const result = await db.query(
    `DELETE FROM warehouse_tools.imports WHERE id='${id}'`
  )
  return{
    result
  }
}

module.exports = {
  createImport,
  updateImportStatus,
  getImportRequest,
  getAllImportRequest,
  deleteImport
};
