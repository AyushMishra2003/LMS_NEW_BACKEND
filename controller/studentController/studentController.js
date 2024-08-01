import Student from "../../model/student.model.js";
import AppError from "../../utils/error.utlis.js";

const cokkieOption={ 
    secure:process.env.NODE_ENV==='production'?true:false,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
}


const addStudent=async(req,res,next)=>{
    try{
       
        const {name,phoneNumber,whastappNumber,gender,email,password}=req.body

        if(!name || !phoneNumber || !whastappNumber || !gender || !email || !password){
            return next(new AppError("All Filed are Required",400))
        }

        const alreadyStudent=await Student.findOne({email})

        if(alreadyStudent){
            return next(new AppError("Already Student Login",400))
        }

        const student=await Student.create({
            name,
            phoneNumber,
            whastappNumber,
            gender,
            email,
            password
        })

        if(!student){
            return next(new AppError("Student not created Succesfully",400))
        }

        const token=await student.generateJWTToken()

        console.log(token);

         res.cookie('token',token,cokkieOption)

         student.token=token

         await student.save()
   
         student.password=undefined
    

         res.status(200).json({
        success:true,
        message:"Student Registration Succesfully",
        data:student
      })
    }catch(error){
        return next(new AppError(error.message,500))
    }
}

const getStudent=async(req,res,next)=>{
    try{
    
        const student = await Student.find().select('-password');
    
        if(!student){
          return next(new AppError("Student Not Reterive Succesfully",400))
        }
    
        res.status(200).json({
          success:true,
          message:"All Student are:-",
          data:student
        })
    
    
      }catch(error){
        return next(new AppError(error.message,500))
      }
}

const loginStudent=async(req,res,next)=>{
    try{

        const { email, password } = req.body;
    
            console.log(req.body);
            
            if (!email || !password) {
                return next(new AppError('All fields are required', 400));
            }
    
            const student = await Student.findOne({ email }).select('+password');
    
            if (!student) {
                return next(new AppError('Email or Password not matched', 400));
            }
    
            const isPasswordMatch = await student.comparePassword(password);
    
            if (!isPasswordMatch) {
                return next(new AppError('Email or Password not matched', 400));
            }
    
            const token = await student.generateJWTToken();
    
            console.log(token);
    
            student.token=token
    
            // Remove sensitive information from user object
            student.password = undefined;
    
            // Set cookie with the token
            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 3600000, // Example: cookie expires in 1 hour (in milliseconds)
                sameSite: 'strict' // Recommended to prevent CSRF
            });
    
            // Debugging: Log parsed cookies from the request
            console.log("cokkie is",req.cookies);
    
            res.status(200).json({
                success: true,
                message: 'Login Successfully',
                data: student
            });
      }catch(error){
        return next(new AppError(error.message,500))
      }
}

const logoutStudent=async(req,res,next)=>{
    try{ 
        res.cookie('token',null,{
            secure:true,
            maxAge:0,
            httpOnly:true
        })
    
        res.status(200).json({
            success:true,
            message:"Student logged out Successfully"
        })
    }catch(error){
    return next(new AppError(error.message,500))
}
}

const profile=async(req,res,next)=>{
    try{

        const {id}=req.params

        const student=await Student.findById(id)

        if(!student){
            return next(new AppError("Opps!,Student are not Found"))
        }


        res.status(200).json({
            success:true,
            message:"Profile of Student",
            data:student
        })

    }catch(error){
        return next(new AppError(error.message))
    }
}

export {
    addStudent,
    getStudent,
    loginStudent,
    logoutStudent,
    profile
}