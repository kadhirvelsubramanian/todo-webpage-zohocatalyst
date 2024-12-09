'use strict';
const zcatal = require('zcatalyst-sdk-node');
const express = require('express');

const expressapp = express();

expressapp.use(express.json())
expressapp.use(express.urlencoded({extended:true}))

expressapp.get('/getdata', async (req, res) => {
    const catalystapp = zcatal.initialize(req);
    const ds = catalystapp.datastore();

    const table = ds.table('10479000000010705');
    const rows = await table.getAllRows();
    res.send(rows);
});


expressapp.post('/insert',async (req,res)=> {
    const catalystapp=zcatal.initialize(req);
    const ds=catalystapp.datastore();

    const table=ds.table('10479000000010705')
    
    const body_data=req.body
    console.log(body_data)
    await table.insertRow(body_data).catch(err=>console.log(err))

    res.send("Inserted Successfully")
    });
    
expressapp.put('/update',async(req,res)=>
{
    const catalystapp=zcatal.initialize(req);
    const ds=catalystapp.datastore();

    const table=ds.table('10479000000010705')

    const updatedRowData=req.body;

    await table.updateRow(updatedRowData).catch(err=>console.log(err));

    res.send("Updated successfully");
})

expressapp.delete('/delete',async(req,res)=>
    {
        const catalystapp=zcatal.initialize(req);
        const ds=catalystapp.datastore();
    
        const table=ds.table('10479000000010705')
        
        var rowid=req.body["ROWID"]
        
        await table.deleteRow(rowid).catch(err=>console.log(err))
    
        res.send("DELETED SUCCESSFULLY");
    })
module.exports = expressapp;


 