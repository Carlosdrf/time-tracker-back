import fetch from "node-fetch";

async function cronReport(){
    console.log('cron test')

    await fetch('http://localhost:3001/email', {
        method: 'POST',
        headers: { 'content-type': 'application/json'},
        body: JSON.stringify({message: 'mensaje para enviar'})
    })
    .then(res => console.log(`nodemailer response: ${res.status}`))
    .cathc(err => console.log(err))
    
}

module.exports = {run: cronReport};