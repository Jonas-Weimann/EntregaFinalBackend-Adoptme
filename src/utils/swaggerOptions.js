import __dirname from "./index.js";

export const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion con swagger',
            description: 'API pensada para implementar Swagger'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}