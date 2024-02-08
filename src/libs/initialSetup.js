import roleModule from '../models/Role'

export const createRoles = async() =>{
    try {
        const verify = await roleModule.verifyRoleExists();
        if(verify.length > 0) return;
        const Roles = [
            {
                id: 1,
                name: 'Admin'},
            {
                id: 2,
                name: 'Employee'
            },
            {
                id: 3,
                name: 'Employer'
            }
        ]
        Roles.forEach(async element => {
            await roleModule.createRole(element)
        });
    } catch (error) {
        console.log(error)
    }
    
}

// export const insertRoles = async() =>{
//     const users = await roleModule.getUserProv()
//     users.forEach(element => {
//         console.log(element.name)
//         roleModule.assignRole(element.id)        
//     });
//     return 0;
// }