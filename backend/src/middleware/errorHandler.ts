import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";

export const errorHandler = (
  error: FastifyError,
  req: FastifyRequest,
  reply: FastifyReply
) => {
  console.error("Error:", error.message);

  const statusCode = error.statusCode ?? 500;

  reply.code(statusCode).send({
    message: error.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && {
      stack: error.stack,
    }),
  });
};


// if status code is 200 and we still hit the error handler that means it's  an internal error
// so we set the status code as 500