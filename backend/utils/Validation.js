import Joi from "joi";

const userValidate = (data, type) => {
  const userSchema = Joi.object({
    username: Joi.string().min(3).when("$type", {
      is: "signup",
      then: Joi.required(),
      otherwise: Joi.optional(),
    }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });

  return userSchema.validate(data, { context: type });
};

export { userValidate };
