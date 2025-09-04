import Joi from 'joi';

export const createUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().optional(),
  userType: Joi.string().valid('homeowner', 'service_provider', 'admin').required(),
  profile: Joi.object({
    bio: Joi.string().optional(),
    companyName: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    yearsExperience: Joi.number().min(0).optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    emergencyAvailable: Joi.boolean().optional()
  }).optional(),
  addresses: Joi.array().items(
    Joi.object({
      addressType: Joi.string().valid('home', 'business', 'billing').required(),
      streetAddress: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      isPrimary: Joi.boolean().optional()
    })
  ).optional()
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  profile: Joi.object({
    bio: Joi.string().optional(),
    companyName: Joi.string().optional(),
    website: Joi.string().uri().optional(),
    yearsExperience: Joi.number().min(0).optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    emergencyAvailable: Joi.boolean().optional()
  }).optional(),
  addresses: Joi.array().items(
    Joi.object({
      addressType: Joi.string().valid('home', 'business', 'billing').required(),
      streetAddress: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      postalCode: Joi.string().required(),
      country: Joi.string().required(),
      isPrimary: Joi.boolean().optional()
    })
  ).optional()
});

export const getUserSchema = Joi.object({
  id: Joi.string().required()
});
