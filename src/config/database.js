var sql=require('mssql');
let config={
    user:'drugwrite',
    password:'Admin@123',
    database:'Entrebator',
    server:'SERVER-DRUG-PC',
    driver:'tedious',
    encrypt:true
}
module.exports=function(data,res){
    console.log(data);
    sql.connect(config,function(err) {
        if(!err)
        {
        const requset=new sql.Request();
        requset.input('ChatID',sql.UniqueIdentifier,data.ChatID);
        requset.input('SendFrom',sql.UniqueIdentifier,data.SendFrom);
        requset.input('SendTo',sql.UniqueIdentifier,data.SendTo);
        requset.input('ChatText',sql.NVarChar(sql.MAX),data.ChatText);
        requset.input('SentDate',sql.DateTime2(7),data.SentDate);
        requset.execute('Eb_InsertChatMessage',function(err,recordset,returnvalue){
            if(recordset.returnValue===0){
                sql.close();
                res.json({
                    objreturn:'Success',
                    recordset
                });
            }
    })
        }
        else{
        console.log('Error:',JSON.stringify(err,undefined,2));
        }
    })
}
