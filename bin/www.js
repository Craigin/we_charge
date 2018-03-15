/**
 * Created by paki on 2018/1/8.
 */
var exec = require('child_process').exec;
exec('cd D:/workspace/we-charge/src/backend && npm start',function(error, stdout, stderr){
  if(error){
    console.log('====exec err:',error.message)
  }else{
    console.log(stdout);
  }
})
