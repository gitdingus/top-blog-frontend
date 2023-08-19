function createErrorObject(expressValidatorErrorsArray) {
  const errors = expressValidatorErrorsArray.reduce((errorsObj, error) => {
    const newErrorsObj = { ...errorsObj };
    
    if(error.type === 'field') {
      newErrorsObj[error.path] = error.msg;
    }

    return newErrorsObj;
  }, {});

  return errors;
}

export default createErrorObject;