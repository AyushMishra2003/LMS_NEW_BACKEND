import { model, Schema } from "mongoose";



const studentSchema=new Schema(
    {
        name:{
            type:String,
            required:true
        },
        phoneNumber:{
            type:Number,
            required:true
        },
        whastappNumber:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            required:true,
            enum:["male","female"],
            default:""
        },
        enrollCourses:{
            type:Array,
            default:[]
        },
        token:{
            type:String,
            default:""
        }
    }
)

studentSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  });
  
  studentSchema.methods = {
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


const Student=model("LMSSTUDENT",studentSchema)


export default Student