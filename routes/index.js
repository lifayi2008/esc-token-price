var express = require('express');
const dbService = require('../dbService');
var router = express.Router();

function formatNumber(number) {
  return number >= 10 ? number : '' + '0' + number; 
}

/* GET home page. */
router.get('/check', function(req, res, next) {
  res.json({code: 200, message: 'success'});
});

router.get('/price', async function(req, res, next) {
  let date = req.query.date;

  if(!date) {
    let now = new Date();
     date = '' + now.getFullYear() 
              + formatNumber(now.getMonth() + 1) 
              + formatNumber(now.getDate())
              + formatNumber(now.getHours())
              + formatNumber(now.getMinutes());
  }

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

  let data = await dbService.select(date);
  res.json({code: 200, message: 'success', data})
})

module.exports = router;
