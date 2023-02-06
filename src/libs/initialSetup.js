import roleModule from '../models/Role'

export const createRoles = async() =>{
    try {
        const verify = await roleModule.verifyRoleExists();
        // console.log(verify)
        if(verify.length > 0) return;
        const Roles = [{
            id: 1,
            name: 'Employee'},
            {id: 2,
            name: 'Employer'
        }]
        Roles.forEach(async element => {
            // console.log(element)
            await roleModule.createRole(element)
        });
    } catch (error) {
        console.log(error)
    }
    
}