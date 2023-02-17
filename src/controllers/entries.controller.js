import models from "../models/Entries";
import moment from 'moment';

export const getEntries = async(req, res) =>{
    const result = await models.getEntries(req.userId)
    console.log(req.userId)
    res.json(result)
}

export const createEntry = async(req, res) =>{
    const date = moment().format('YYYY-MM-DD')
    const start_time = moment().format('YYYY-MM-DD HH:mm:ss')
    
    const data = {
        start_time,
        end_time: start_time,
        date,
        user_id: req.userId,
        status: req.body.status
    }
    const result = await models.createEntry(data)
    console.log(data)
    if(result){
        res.json(result)
    }else{
        res.json('There was a Trouble')
    }
}
export const getStartedEntry = async(req, res) =>{
    const startedEntry = await models.getStartedEntry(req.userId)
    res.json(startedEntry);
}
export const updateEntryById = async(req, res) =>{
    const {start_time, end_time, date} = req.body
    console.log(req.body)
    console.log(start_time)
    
    const entryData = ({
        // start_time: date + ' ' + start_time.slice(0,2)+ ':' + start_time.slice(2) +':00',
        // end_time: date + ' ' + end_time.slice(0,2)+ ':' + end_time.slice(2) +':00',
        start_time: moment(date).format('YYYY-MM-DD') + ' ' + moment(start_time).format('HH:mm:ss'),
        end_time: moment(date).format('YYYY-MM-DD') + ' ' + moment(end_time).format('HH:mm:ss'),
        date,
    })

    const result = await models.updateEntryById(req.params.entryId, entryData)
    console.log(entryData)
    if(result){
        res.status(200).json({message:'Updated'})
    }else{
        res.status(400).json({message:"there whas an error"})
    }
    
}
export const closeEntry = async(req, res) =>{
    const {end_time} = req.body
    console.log(end_time);
    const entryData = ({
        end_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        status: 1
    })
    console.log(req.userId)
    const result = await models.closeCurrentEntry(req.params.entryId, entryData, req.userId)
    // console.log(result)
    if(result){
        res.status(200).json({message:'closed'})
    }else{
        res.status(400).json({message:"there whas an error"})
    }
}
export const deleteProductById = async(req, res) =>{
    const result = await models.deleteById(req.params.entryId)
    if(result){
        res.json(result)
    }else{
        res.json('error')
    }
}