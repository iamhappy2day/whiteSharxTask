export const userErrors = {
  VALIDATION_ERROR: {
    type: 'Validation Error',
    statusCode: 400,
    message: "Invalid input params"
  },
  ITEM_NOT_FOUND_ERROR: {
    type: 'Item not found Error',
    statusCode: 404,
    message: "It wasn't found. Check the id"
  },
  DUPLICATE_KEY_ERROR: {
    type: 'Bad request. Duplicate key error',
    statusCode: 400,
    message: "Duplicate key error. Check the id"
  },
  UNAUTHORIZED_ERROR: {
    type: 'Unauthorized',
    statusCode: 401,
    message: "Unauthorized. You are trying to get access to private route of another user"
  }
};
