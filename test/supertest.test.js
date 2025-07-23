import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:3000");

describe('Testing con Supertest', ()=>{
    describe('Test de mascotas', async ()=>{
        it('Debe poder crear una mascota', async ()=>{
            const pet = {
                name: 'Firulais',
                specie: 'Perro',
                birthDate: '10/11/2012',
            };
            const response = await requester.post('/api/pets').send(pet);
            expect(response.status).to.equal(200);
            expect(response._body.payload).to.have.property('_id');
            expect(response._body.payload.name).to.equal(pet.name);
        })
        it('Debe poder crear una mascota y que devuelva adopted en false', async ()=>{
            const pet = {
                name: 'Miau',
                specie: 'Gato',
                birthDate: '10/11/2015',
            };
            const response = await requester.post('/api/pets').send(pet);
            expect(response.status).to.equal(200);
            expect(response._body.payload.adopted).to.be.false;
        })
        it('Debe poder crear una mascota y que devuelva statusCode 400 si no se envian los datos requeridos', async ()=>{
            const pet = {};
            const response = await requester.post('/api/pets').send(pet);
            expect(response.status).to.equal(400);
            expect(response._body.error).to.equal('Incomplete values');
        })
        it('Debe poder obtener todas las mascotas', async ()=>{
            const response = await requester.get('/api/pets');
            expect(response.status).to.equal(200);
            expect(response._body).to.have.property('status');
            expect(response._body).to.have.property('payload');
            expect(response._body.payload).to.be.an('array');
        })
        it('Debe poder actualizar una mascota existente', async ()=>{
            const pet = {
                name: 'Firulais',
                specie: 'Perro',
                birthDate: '10/11/2012',
            };
            const createResponse = await requester.post('/api/pets').send(pet);
            const petId = createResponse._body.payload._id;
            const updatedPet = {
                name: 'Firulais Updated',
                specie: 'Perro',
                birthDate: '10/11/2012',
            };
            const updateResponse = await requester.put(`/api/pets/${petId}`).send(updatedPet);
            expect(updateResponse.status).to.equal(200);
            expect(updateResponse._body).to.have.property('payload');
            expect(updateResponse._body.payload.name).to.be.equal(updatedPet.name);
            expect(updateResponse._body.payload.name).to.be.not.equal(createResponse._body.payload.name);
        })
        it('Debe poder eliminar una mascota existente', async ()=>{
            const pet = {
                name: 'Firulais',
                specie: 'Perro',
                birthDate: '10/11/2012',
            };
            const createResponse = await requester.post('/api/pets').send(pet);
            const petId = createResponse._body.payload._id;
            const deleteResponse = await requester.delete(`/api/pets/${petId}`);
            const getResponse = await requester.get(`/api/pets/${petId}`);
            expect(getResponse.status).to.equal(404);
            expect(deleteResponse.status).to.equal(200);
            expect(deleteResponse._body).to.have.property('status');
            expect(deleteResponse._body.status).to.equal('success');
        })
    })
})