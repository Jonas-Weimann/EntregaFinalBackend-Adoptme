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
    describe('Test de adopciones', async ()=>{
        it('Debe poder obtener todas las adopciones', async ()=>{
            const response = await requester.get('/api/adoptions');
            expect(response.status).to.equal(200);
            expect(response._body).to.have.property('status');
            expect(response._body).to.have.property('payload');
            expect(response._body.payload).to.be.an('array');
            expect(response._body.status).to.equal('success');
        })
        it('Debe fallar en caso de querer obtener una adopción por ID y que no exista', async ()=>{
            const response = await requester.get('/api/adoptions/68433c60b09ae697ed1d2d10');
            expect(response.status).to.equal(404);
            expect(response._body).to.have.property('status');
            expect(response._body).to.have.property('error');
            expect(response._body.error).to.equal('Adoption not found');
        })

        it('Debe poder crear una nueva adopcion', async ()=>{
            const pet = {
                name: 'Miau',
                specie: 'Gato',
                birthDate: '10/11/2015',
            };
            const user = {
                first_name: 'Johnny',
                last_name: 'Suh',
                email: 'johnny.suh@127.com',
                password: '123456'
            }
            const createPetResponse = await requester.post('/api/pets').send(pet);
            const createUserResponse = await requester.post('/api/sessions/register').send(user);
            const petId = createPetResponse._body.payload._id;
            const userId = createUserResponse._body.payload;
            const createAdoptionResponse = await requester.post(`/api/adoptions/${userId}/${petId}`)
            expect(createAdoptionResponse.status).to.equal(200);
            expect(createAdoptionResponse._body).to.have.property('status');
            expect(createAdoptionResponse._body).to.have.property('payload');
            expect(createAdoptionResponse._body.status).to.equal('success');
            expect(createAdoptionResponse._body.payload._id).to.be.a('string');
            expect(createAdoptionResponse._body.payload._id).to.have.lengthOf(24);
            expect(createAdoptionResponse._body.payload).to.not.equal('undefined');
            expect(createAdoptionResponse._body.payload).to.not.be.empty;
            expect(createAdoptionResponse._body.payload).to.have.property('owner');
            expect(createAdoptionResponse._body.payload).to.have.property('pet');
            expect(createAdoptionResponse._body.payload.owner).to.equal(userId);
            expect(createAdoptionResponse._body.payload.pet).to.equal(petId);
        })
        it('Debe poder obtener una adopcion por id', async ()=>{
            const pet = {
                name: 'Miau',
                specie: 'Gato',
                birthDate: '10/11/2015',
            };
            const user = {
                first_name: 'Johnny',
                last_name: 'Suh',
                email: 'johnsuh@127.com',
                password: '123456'
            }
            const createPetResponse = await requester.post('/api/pets').send(pet);
            const createUserResponse = await requester.post('/api/sessions/register').send(user);
            const petId = createPetResponse._body.payload._id;
            const userId = createUserResponse._body.payload;
            const createAdoptionResponse = await requester.post(`/api/adoptions/${userId}/${petId}`)
            const adoptionId = createAdoptionResponse._body.payload._id;
            const getResponse = await requester.get(`/api/adoptions/${adoptionId}`);
            expect(getResponse.status).to.equal(200);
            expect(getResponse._body).to.have.property('status');
            expect(getResponse._body).to.have.property('payload');
            expect(getResponse._body.payload).to.have.property('_id');
            expect(getResponse._body.payload._id).to.equal(adoptionId);
            expect(getResponse._body.payload).to.have.property('owner');
            expect(getResponse._body.payload).to.have.property('pet');
            expect(getResponse._body.payload.owner).to.equal(userId);
            expect(getResponse._body.payload.pet).to.equal(petId);
        })
    })
})