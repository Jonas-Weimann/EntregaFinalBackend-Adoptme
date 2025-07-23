import mongoose from "mongoose";
import Users from '../src/dao/Users.dao.js'
import Assert from 'assert'
import dotenv from 'dotenv'
dotenv.config()

mongoose.connect(process.env.MONGODB_URI)

const assert = Assert.strict

describe('Testing Users Dao', ()=>{
    before(()=>{
        this.userDao = new Users()
    })

    it('El Dao debe poder obtener los usuarios en forma de arreglo', async ()=>{
        const result = await this.users.get()
        assert.strictEqual(Array.isArray(result),true)
    })

    it('El Dao debe agregar correctamente un elemento a la base de datos', async ()=>{
        const user = {
            first_name: 'Joni',
            last_name: 'Weimann',
            email: 'jweimann@gmail.com',
            password: '1234'
        }
        const result = await this.users.save(user)
        assert.strictEqual(result.first_name, user.first_name)
    })
    it('Al agregar un nuevo usuario, este debe crearse con un arreglo de mascotas vacio por defecto', async()=>{
        const user = {
            first_name: 'Damian',
            last_name: 'Weimann',
            email: 'dweimann@gmail.com',
            password: '1234'
        }
        const result = await this.users.save(user)
        assert.deepStrictEqual(result.pets, [])
    })

    it('El dao debe poder obtener un usuario por email', async ()=>{
        const user = {
            first_name: 'Damian',
            last_name: 'Weimann',
            email: 'dweimann@gmail.com',
            password: '1234'
        }
        const userCreated = await this.users.save(user)
        const userFound = await this.users.getBy({email: userCreated.email})
        assert.strictEqual(userFound.email, userCreated.email)
    })
})