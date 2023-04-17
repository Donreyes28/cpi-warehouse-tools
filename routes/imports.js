const express = require('express');
const router = express.Router();
const imports = require('../services/imports');

router.get("/getAllImportRequest", async function (req, res, next) {
  try {
    res.json(await imports.getAllImportRequest(req.query.page));
  } catch (err) {
    console.error(`Error while getting all imports `, err.message);
    next(err);
  }
});

router.get('/getImportRequest', async function (req, res, next) {
  try {
    res.json(await imports.getImportRequest(req.query.category, req.query.status));
  } catch (err) {
    console.error(`Error while getting import data`, err.message);
    next(err);
  }
});

router.post('/createImport', async function (req, res, next) {
  try {
    res.json(await imports.createImport(req.body));
  } catch (err) {
    console.error(`Error while creating order import`, err.message);
    next(err);
  }
});

router.put('/updateImportStatus/:id', async function (req, res, next) {
  try {
    res.json(await imports.updateImportStatus(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating import`, err.message);
    next(err);
  }
});

router.delete('/deleteImport/:id', async function(req, res, next) {
  try {
    res.json(await imports.deleteImport(req.params.id));
  } catch (err) {
    console.error(`Error while deleting import`, err.message);
    next(err);
  }
});

module.exports = router;
