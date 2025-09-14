import { publicProcedure } from "@/server/lib/orpc";

const healthCheck = publicProcedure.handler(() => {
  return {
    status: "success",
    data: {
      message: "OK",
    },
  };
});

export const healthRouter = {
  healthCheck,
};
