import { model, Schema } from "mongoose";


const CourseSchema=new Schema(
    {
         photo:{
            public_id:{
                type:String
            },
            secure_url:{
                type:String
            }
         },
         title:{
            type:String
         },
         description:{
            type:String
         },
         teacherName:{
            type:Array
         },
         category:{
            type:String,
            enum:["Business","Design","Development"]
         },
         level:{
            type:String,
            enum:["AllLevels","Beginner","Intermediate"]
         },
         aboutCourse:{
            type:String
         },
         whatWeLearn:{
            type:Array
         },
         MaterialIncludes:{
            type:Array
         },
         Requirements:{
            type:Array
         },
         Audience:{
            type:Array
         },
         lectures:[ 
            {
                title:String,
                description:String,
                lecture:{
                    public_id:{
                    type:String
                    },
                    secure_url:{
                    type:String
                    }
                }
            }
        ],
        numberOfLecture:{
         type:Number,
         default:0
     },
    },
    {
        timestamps:true  
    }
)


const Courses=model("LMSCOURSES",CourseSchema)


export default Courses