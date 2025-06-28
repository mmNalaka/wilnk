import { protectedProcedure, publicProcedure } from "@/server/lib/orpc";


const healthCheck = publicProcedure.handler(() => {
    return { 
        status: "success",
        data: {
            message: "OK"
        }
    };
});

const protectedHealthCheck = protectedProcedure.handler(() => {
    return { 
        status: "success",
        data: {
            message: "OK"
        }
    };
});


export const healthRouter = {
    healthCheck,
    protectedHealthCheck
};
    