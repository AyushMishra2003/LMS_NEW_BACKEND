import Admin from "../../model/admin.model.js"
import AppError from '../../utils/error.utlis.js'

const cokkieOption={ 
  secure:process.env.NODE_ENV==='production'?true:false,
  maxAge:7*24*60*60*1000,
  httpOnly:true,
}


const addAdmin=async(req,res,next)=>{
   try{
      const {email,password}=req.body

      if(!email || !password){
        return next(new AppError("All Field are Required",402))
      }

      const emailExist=await Admin.findOne({email})

      if(emailExist){
        return next(new AppError("Email Already Exist",400))
      }

      const admin=await Admin.create({
         email,
         password
      })

      if(!admin){
        return next(new AppError("Admin not created",400))
      }

      await admin.save()

          
  

    const token=await admin.generateJWTToken()

    console.log(token);

    res.cookie('token',token,cokkieOption)

    admin.token=token

    await admin.save()
  
    admin.password=undefined
    

      res.status(200).json({
        success:true,
        message:"Admin Created Succesfully",
        data:admin
      })

   }catch(error){
    return next(new AppError(error.message,500))
   }
}

const loginAdmin=async(req,res,next)=>{
  try{

    const { email, password } = req.body;

        console.log(req.body);
        
        if (!email || !password) {
            return next(new AppError('All fields are required', 400));
        }

        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return next(new AppError('Email or Password not matched', 400));
        }

        const isPasswordMatch = await admin.comparePassword(password);

        if (!isPasswordMatch) {
            return next(new AppError('Email or Password not matched', 400));
        }

        const token = await admin.generateJWTToken();

        console.log(token);

        admin.token=token

        // Remove sensitive information from user object
        admin.password = undefined;

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
            data: admin
        });
  }catch(error){
    return next(new AppError(error.message,500))
  }
}

const getAdmin=async(req,res,next)=>{
  try{
    
    const user = await Admin.find().select('-password');

    if(!user){
      return next(new AppError("Reterive not Succesfully",400))
    }

    res.status(200).json({
      success:true,
      message:"All Admin are:-",
      data:user
    })


  }catch(error){
    return next(new AppError(error.message,500))
  }
}

const logoutAdmin=async(req,res,next)=>{
  try{ 
          res.cookie('token',null,{
              secure:true,
              maxAge:0,
              httpOnly:true
          })
      
          res.status(200).json({
              success:true,
              message:"User logged out successfully"
          })
      }catch(error){
      return next(new AppError(error.message,500))
  }
  }
  

export {
    addAdmin,
    loginAdmin,
    getAdmin,
    logoutAdmin
}