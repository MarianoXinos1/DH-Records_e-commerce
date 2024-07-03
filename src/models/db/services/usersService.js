// 1. Guardar al usuario en la DB ✔
// 2. Buscar al usuario en la DB que se quiere loguear segun propiedad DB ✔
// 3. Buscar al usuario en la DB por su ID ✔
// 4. Buscar a todos los usuarios ✔
// 5. Editar la informacion de un usuario
// 6. Eliminar un usuario DB ✔


const fs = require('fs');
const path = require('path');
const bcryptjs= require('bcryptjs');
const db = require('../models');


let userService = {

    
   
    getByField: async function(field, text) {
        return await db.Users.findOne({ where: { [field]: text } });
      },

    //Sequelize 
    getAll: async function (){
        try {
            const users = await db.Users.findAll();
            return users;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getAllCategories: async function() {
        try {
            const categories = await db.Categorias.findAll();
            return categories;
        } catch (error) {
            console.log(error);
            return [];
        }
    },

    getBy: async function(id) {
        try {
            let user = await db.Users.findByPk(id);
            if (!user) {
                user = {
                    id: 0,
                    nombreUsuario: "No encontrado",
                    apellidoUsuario: "No encontrado",
                    email: "No encontrado",
                    imagenUsuario: "No encontrado",
                    direccion: "No encontrado",
                    dni: "No encontrado"
                }
            }
            return user;

        } catch (error) {
            console.log(error);
            return {
                id: 0,
                nombreUsuario: "No encontrado",
                apellidoUsuario: "No encontrado",
                email: "No encontrado",
                imagenUsuario: "No encontrado",
                direccion: "No encontrado",
                dni: "No encontrado"
            }
        } 
    },
    
    update: async function (id, body) {
        try {
            const user = await this.getBy(id);
            if (user.id === 0) {
                console.log(`Usuario con id ${id} no encontrado`);
                return;
            }
            if (body.contraseña) {
                body.contraseña = bcryptjs.hashSync(body.contraseña, 10);
            }
            let updateData = {
                nombreUsuario: body.nombreUsuario,
                apellidoUsuario: body.apellidoUsuario,
                email: body.email,
                categorias_id: body.categorias_id, 
                contraseña: body.contraseña,
                direccion: body.direccion,
                dni: body.dni,
            }
            return await db.Users.update(updateData, {where: { id:id }});

        } catch (error) {
            console.log(error);
        }   
    },

    deleteUser: async function(id) {
        try {
            console.log(id);
            return await db.Users.destroy({ where: { id:id }});
        } catch (error) {
            console.log(error);
        }
    },

    createUser: async function(userData) {
        // Verificar si ya existe un usuario con el mismo nombre o correo electrónico
        const existingUser = await this.getByField('nombreUsuario', userData.nombreUsuario);
        if (existingUser) {
            return { error: 'Ya existe un usuario con este nombre de usuario' };
        }
        const existingEmail = await this.getByField('email', userData.email);
        if (existingEmail) {
            return { error: 'Ya existe un usuario con este correo electrónico' };
        }
    
        // Como es tipo Boolean, en mysql se representan como 1 o 0, por eso lo adapto.
        userData.terminosCondiciones = userData.terminosCondiciones === 'on' ? 1 : 0;
        let { nombreUsuario, email, contraseña, terminosCondiciones } = userData;
        let imagenUsuario = 'defaultUserImage.png';
        const newUser = await db.Users.create({
            nombreUsuario,
            apellidoUsuario,
            email,
            contraseña,
            imagenUsuario,
            direccion,
            dni,
            terminosCondiciones,
            categorias_id: 2
        });
        return newUser;
    },
 
    hashPassword: function(password){
        return bcryptjs.hashSync( password, 10);
    },

    comparePassword: function(inputPassword, userPassword){
        return bcryptjs.compareSync(inputPassword, userPassword);
    },

    updateImage: async function(userId, newUserData) {
        try {
            let user = await db.Users.findByPk(userId);
        
            if(user){
                user.imagenUsuario = newUserData.image;
                console.log(`New image data: ${newUserData.image}`); 
                await user.save();
                console.log(`Image updated successfully for user with ID: ${userId}`); 
                return true;
            }
    
            console.log(`No user found with ID: ${userId}`); 
            return false;
            
        } catch (error){
            console.log(`Error updating image for user with ID: ${userId}`); 
            console.log(error);
            return false;
        }
    },

    

 

    
}


module.exports = userService;




