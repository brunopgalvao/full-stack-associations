import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import Product from "../models/product.js";

import { SALT_ROUNDS, TOKEN_KEY } from "../config.js";

// for JWT expiration
const today = new Date();
const exp = new Date(today);
exp.setDate(today.getDate() + 30);

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const password_digest = await bcrypt.hash(password, SALT_ROUNDS);
        const user = new User({
            username,
            email,
            password_digest,
        });

        await user.save();

        const payload = {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: user.roles,
            exp: parseInt(exp.getTime() / 1000),
        };

        const token = jwt.sign(payload, TOKEN_KEY);
        res.status(201).json({ token });
    } catch (error) {
        console.log(error.message);
        res.status(400).json({ error: error.message });
    }
};

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }).select(
            "username email roles password_digest"
        );
        if (await bcrypt.compare(password, user.password_digest)) {
            const payload = {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
                exp: parseInt(exp.getTime() / 1000),
            };

            const token = jwt.sign(payload, TOKEN_KEY);
            res.status(201).json({ token });
        } else {
            res.status(401).send("Invalid Credentials");
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const verify = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const payload = jwt.verify(token, TOKEN_KEY);
        if (payload) {
            res.json(payload);
        }
    } catch (error) {
        console.log(error.message);
        res.status(401).send("Not Authorized");
    }
};

export const changePassword = async (req, res) => {};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("products");
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate("products");
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getUserProducts = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userProducts = await Product.find({ userId: user._id });
        res.json(userProducts);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getUserProduct = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const userProduct = await Product.findById(
            req.params.productId
        ).populate("userId");
        if (userProduct.userId.equals(user._id)) {
            return res.json(userProduct);
        }
        throw new Error(
            `Product ${userProduct._id} does not belong to user ${user._id}`
        );
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
};

export const createUserProduct = async (req, res) => {
    try {
        if (await User.findById(req.body.userId)) {
            const userProduct = new Product(req.body);
            await userProduct.save();
            res.status(201).json(userProduct);
        }
        throw new Error(`User ${req.body.userId} does not exist!`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const updateUserProduct = async (req, res) => {
    try {
        if (await User.findById(req.params.id)) {
            const product = await Product.findByIdAndUpdate(
                req.params.productId,
                req.body,
                { new: true }
            );
            res.status(200).json(product);
        }
        throw new Error(`User ${req.params.id} does not exist!`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const deleteUserProduct = async (req, res) => {
    try {
        // Are they the original creator of the product?
        // OR
        // Are they an admin?
        // If they are, let the delete the product
        const user = await User.findById(req.params.id);
        if (user.roles.includes("admin")) {
            // do something
        }
        if (await User.findById(req.params.id)) {
            const deleted = await Product.findByIdAndDelete(
                req.params.productId
            );
            if (deleted) {
                return res.status(200).send("Product deleted");
            }
            throw new Error(`Product ${req.params.productId} not found`);
        }
        throw new Error(`User ${req.params.id} does not exist!`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const getCart = async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
      const cart = await Promise.all(user.cart.map(async (item) => {
          const product = await Product.findById(item.productId)
          return {
              product,
              quantity: item.quantity
          }
      }))
      res.json(cart);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: error.message });
    }
  };

export const addToCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const product = await Product.findById(req.params.cartItemId);
        const cartItem = {
            productId: product.id,
            quantity: req.body.quantity,
        };
        user.cart.push(cartItem);
        await user.save();
        res.status(201).json(user.cart);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const productIndex = user.cart.indexOf(req.params.cartItemId);
        user.cart.splice(productIndex, 1);
        user.save();
        res.status(200).send("Cart item deleted");
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.cart = [];
        user.save();
        res.status(200).send("Cart cleared");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
