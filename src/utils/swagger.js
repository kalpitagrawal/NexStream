import swaggerJsdoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "NexStream API",
            version: "1.0.0",
            description:
                "NexStream is a production-grade video hosting REST API built with Node.js, Express 5, and MongoDB. Features include user authentication, video management, comments, likes, subscriptions, playlists, tweets, and a channel dashboard.",
            contact: {
                name: "Kalpit Agrawal",
                url: "https://github.com/kalpitagrawal",
            },
            license: {
                name: "ISC",
            },
        },
        servers: [
            {
                url: "http://localhost:{port}/api/v1",
                description: "Development server",
                variables: {
                    port: {
                        default: "8000",
                    },
                },
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter your access token",
                },
                CookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    description: "Access token stored in HTTP-only cookie",
                },
            },
            schemas: {
                ApiResponse: {
                    type: "object",
                    properties: {
                        statusCode: { type: "integer", example: 200 },
                        data: { type: "object" },
                        message: { type: "string", example: "Success" },
                        success: { type: "boolean", example: true },
                    },
                },
                ApiError: {
                    type: "object",
                    properties: {
                        statusCode: { type: "integer", example: 400 },
                        message: { type: "string", example: "Validation failed" },
                        success: { type: "boolean", example: false },
                        errors: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    field: { type: "string" },
                                    message: { type: "string" },
                                },
                            },
                        },
                    },
                },
                User: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        username: { type: "string", example: "johndoe" },
                        email: { type: "string", example: "john@example.com" },
                        fullname: { type: "string", example: "John Doe" },
                        avatar: { type: "string", example: "https://res.cloudinary.com/..." },
                        coverImage: { type: "string", example: "https://res.cloudinary.com/..." },
                        createdAt: { type: "string", format: "date-time" },
                        updatedAt: { type: "string", format: "date-time" },
                    },
                },
                Video: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        videoFile: { type: "string" },
                        thumbnail: { type: "string" },
                        title: { type: "string", example: "My First Video" },
                        description: { type: "string", example: "This is my first video on NexStream" },
                        duration: { type: "number", example: 120.5 },
                        views: { type: "integer", example: 1500 },
                        isPublished: { type: "boolean", example: true },
                        owner: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Comment: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        content: { type: "string", example: "Great video!" },
                        video: { type: "string" },
                        owner: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Tweet: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        content: { type: "string", example: "Just uploaded a new video!" },
                        owner: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
                Playlist: {
                    type: "object",
                    properties: {
                        _id: { type: "string" },
                        name: { type: "string", example: "Favorites" },
                        description: { type: "string", example: "My favorite videos" },
                        videos: { type: "array", items: { type: "string" } },
                        owner: { type: "string" },
                        createdAt: { type: "string", format: "date-time" },
                    },
                },
            },
        },
        tags: [
            { name: "Healthcheck", description: "Server health status" },
            { name: "Users", description: "Authentication & user management" },
            { name: "Videos", description: "Video CRUD & management" },
            { name: "Comments", description: "Video comments" },
            { name: "Likes", description: "Like/unlike content" },
            { name: "Subscriptions", description: "Channel subscriptions" },
            { name: "Tweets", description: "Community posts (tweets)" },
            { name: "Playlists", description: "Video playlists" },
            { name: "Dashboard", description: "Channel analytics & stats" },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerSpec };
