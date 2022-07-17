import { swaggerJSDoc } from "@ipare/swagger";

export function getSwaggerOptions(version: string) {
  return <swaggerJSDoc.Options>{
    definition: {
      openapi: "3.0.n",
      info: {
        title: "NewApplication",
        description: "A new application",
        version: version,
        license: {
          name: "MIT",
        },
        contact: {
          email: "hi@hal.wang",
        },
      },
      servers: [
        {
          url: "/",
        },
      ],
      schemes: ["https"],
      tags: [
        {
          name: "user",
        },
      ],
      components: {
        schemas: {
          user: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                description: "Automatically generated ID",
              },
              password: {
                type: "string",
                description: "Plaintext password",
              },
            },
          },
        },
        securitySchemes: {
          password: {
            type: "apiKey",
            in: "header",
            name: "Authorization",
          },
        },
        parameters: {
          page: {
            in: "query",
            required: false,
            name: "page",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1,
            },
          },
          limit: {
            in: "query",
            required: false,
            name: "limit",
            schema: {
              type: "integer",
              minimum: 1,
              default: 20,
            },
          },
        },
      },
    },
    apis: ["actions/**/*.js"],
  };
}
