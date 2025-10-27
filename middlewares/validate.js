import { body, validationResult } from "express-validator";

export const validateUser = [
  body("email")
    .isEmail()
    .withMessage("Email must be valid email address")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long"),

  (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: err.array() });
  },
];

export const validateProduct = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .matches(/^[a-zA-Z]/)
    .withMessage("Name must not contain spaces or special characters"),
  body("description").notEmpty().withMessage("Description is required"),
  body("price").notEmpty().withMessage("price is required"),

  (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: err.array() });
  },
];
