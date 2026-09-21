import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SyncBoard API",
      version: "0.2.0",
      description: "Mock-data-backed REST API for the SyncBoard (CollabBoard) Kanban app — Milestone 2.",
    },
    servers: [{ url: "http://localhost:5000", description: "Local dev" }],
  },
  apis: ["./src/routes/*.js"],
});
