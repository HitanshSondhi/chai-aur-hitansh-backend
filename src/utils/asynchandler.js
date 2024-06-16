const asynchandler=(requesthandler)=>{
    (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((error)=>next(err)) 
    }

}

export {asynchandler}

// const asynchandler=(fn)=>async(req,res,next)=>{
//     try {
        
//     } catch (error) {
//         req.status(error.code||500).json({
//             success:false ,
//             message:err.message
//         })
//     }
// }

