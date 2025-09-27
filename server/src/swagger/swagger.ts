import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "News Service API",
    description: "API для новинного сервісу",
    version: "1.0.0",
  },
  host: "project-server-ec8e.onrender.com",
  schemes: ["https"],
  basePath: "/api",
  securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "JWT token in the format: Bearer {token}"
    }
  } 
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/routes.ts"];  

swaggerAutogen()(outputFile, endpointsFiles, doc);