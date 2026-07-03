
// async handler through promises.
const asyncHandler =(requestHandler) =>{
    (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
    }
}


// async handler through try catch , we accept function as parameter as it is a high order function so  these lines just
// basic for understanding syntax of function inside function
// const asyncHandler = () =>{}
    //  const asyncHandler = (func) => () =>{}
 // const asyncHandler =(fn)=>async(req,res,next)


 // through try catch
//  const asycHandler  = (fn) => async(req,res,next) =>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code || 500).json({
//             success:false,
//             message:error.message
//         })
//     }

//  }
