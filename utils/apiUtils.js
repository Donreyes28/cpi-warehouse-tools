exports.generateBatchId = async() => {
const today = new Date();
const month = String(today.getMonth() + 1).padStart(2, '0');
const day = String(today.getDate()).padStart(2, '0');
const year = String(today.getFullYear()).slice(2);
const dateStr = month + day + year;

const result = await db.query(
  `SELECT MAX(SUBSTRING(batchId, 7)) AS maxNum FROM warehouse_tools.imports WHERE batchId LIKE ?`,
  [dateStr + '%']
);

const maxNum = result[0].maxNum || 0;
const nextNum = String(maxNum + 1).padStart(3, '0');

const batchId = dateStr + nextNum;

}