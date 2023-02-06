import models from "../models/Product";
import moment from 'moment';


export const getProducts = async(req, res) =>{
    const result = await models.getProduct()
    const date = new Date();
    console.log(req.timeId)

    res.json(result)

}
export const createProduct = async(req, res) =>{
    const date = moment().format('YYYY-MM-DD')
    const start_time = moment().format('YYYY-MM-DD HH:mm:ss')
    
    const data = {
        start_time,
        date,
        user_id: req.userId
    }
    const result = await models.createEntry(data)
    console.log(data)
    if(result){
        res.json(result)
    }else{
        res.json('There was a Trouble')
    }
}
export const getProductById = (req, res) =>{
    
}
export const updateEntryById = async(req, res) =>{
    const {start_time, end_time, date} = req.body
    const entryData = ({
        // start_time: date + ' ' + start_time.slice(0,2)+ ':' + start_time.slice(2) +':00',
        end_time: date + ' ' + end_time.slice(0,2)+ ':' + end_time.slice(2) +':00',
        date,
    })
    console.log(req.userId)
    const result = await models.updateEntryById(req.params.entryId, entryData)
    console.log(result)
    if(result){
        res.status(200).json({message:'Updated'})
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