var express = require('express');
const dbService = require('../dbService');
var router = express.Router();

/* GET home page. */
router.get('/check', function(req, res, next) {
  res.json({code: 200, message: 'success'});
});

router.get('/price', function(req, res, next) {
  let date = req.date;
  // let numberStr = req.num;
  // let dateStr = req.date;

  // let number = 10;
  // let date = Date.time();

  // if(numberStr) {
  //   try {
  //     number = parseInt(numberStr);
  //     if(number <= 0 || number > 10) {
  //       number = 10;
  //     }
  //   } catch(error) {
  //     logger.error(error);
  //     res.json({code: 400, message: 'Parameters not valid'});
  //   }
  // }

  // if(dateStr) {
  //   try {
  //     date = parseInt(dateStr);
  //   } catch(error) {
  //     logger.error(error);
  //     res.json({code: 400, message: 'Parameters not valid'});
  //   }
  // }

  let data = dbService.select(date);
  res.json({code: 200, message: 'success', data})
})

module.exports = router;
