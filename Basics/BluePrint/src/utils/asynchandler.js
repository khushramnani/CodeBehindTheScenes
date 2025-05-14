const asynHandler = (requestHandler) => {
  return (req, res, next) => {
     Promise.resolve(requestHandler(req, res, next)).catch((err) =>
      next(err)
    );
  };
};

/*
const asynHandler = (func) => async ( res , req , next) =>{   // higher order func (function which accepts and return the function)
    try {
        await func(res , req , next)
    } catch (err) {
        res.status(err.code || 500).json({
            message: err.message,
            success: false
        })
        
    }
}
*/

export default asynHandler;
