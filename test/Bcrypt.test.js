import { createHash, passwordValidation } from "../src/utils/index.js"
import { expect } from "chai";

describe('Testing Bcrypt', ()=>{
    it('El metodo createHash debe poder encriptar una contraseña', async ()=>{
        const password = '1234';
        const hashedPassword = await createHash(password);
        expect(hashedPassword).to.be.a('string');
        expect(hashedPassword).to.not.equal(password);
    })
    it('El metodo passwordValidation debe poder comparar una contraseña con su hash', async ()=>{
        const password = '1234';
        const hashedPassword = await createHash(password);
        const user = {
            password: hashedPassword
        }
        const result = await passwordValidation(user, password)
        expect(result).to.be.true;
    })
    it('El metodo passwordValidation debe fallar si la contraseña hasheada se altera', async ()=>{
        const password = '1234';
        const hashedPassword = await createHash(password);
        const alteredPassword = hashedPassword + 'altered';
        const user = {
            password: alteredPassword
        }
        const result = await passwordValidation(user, password)
        expect(result).to.be.false;
    })
})