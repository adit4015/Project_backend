
// async handler through promises.
// return is very important as it is a higher order function which takes a function as parameter and return a function.
const asyncHandler =(requestHandler) =>{
   return  (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next)).catch
          ((err) => next(err))
    }
}

export {asyncHandler}


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
