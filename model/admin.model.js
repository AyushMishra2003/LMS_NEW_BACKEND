import { model, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const adminSchema=new Schema(
    {
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        role:{
          type:String,
          default:"admin"
        },

        token:{
            type:String,
            default:""
        }
    },
    {
        timestamps:true
    }
)

adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  });
  
  adminSchema.methods = {
    generateJWTToken: async function () {
      return await jwt.sign(
        { id: this._id, userName: this.userName },
        process.env.SECRET,
        {
          expiresIn: "24h",
        }
      );
    },
    comparePassword: async function (plaintextPassword) {
      return await bcrypt.compare(plaintextPassword, this.password);
    },
  };

const Admin=model("LMSADMIN",adminSchema)

export default Admin