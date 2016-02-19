//redux middleware for api actions
function createApiMiddleware(options) {

  const {defaultFailureType } = options;
  if(defaultFailureType && typeof defaultFailureType !== 'string') {
    throw new Error('Expected a string for defaultFailureType.');
  }

  return function ({ dispatch, getState }) {
    return next => action => {
      const {
        types,
        callAPI,
        shouldCallAPI = () => true,
        payload = {}
        } = action;

      if (!types) {
        // Normal action: pass it on
        return next(action);
      }

      if (
        !Array.isArray(types) ||
        types.length < 2 || types.length > 3  || !types.every(type => typeof type === 'string')
      ) {
        throw new Error('Expected an array of two or three string types.');
      }

      if (typeof callAPI !== 'function') {
        throw new Error('Expected fetch to be a function.');
      }

      if (!shouldCallAPI(getState())) {
        return;
      }

      const [ requestType, successType, failureType ] = types;

      dispatch(Object.assign({}, payload, {
        type: requestType
      }));

      return callAPI().then(
        response => dispatch(Object.assign({}, payload, {
          response,
          type: successType
        })),
        error => {
          if(failureType) {
            dispatch(Object.assign({}, payload, {
              error,
              type: failureType
            }));
          }

          if(defaultFailureType) {
            dispatch(Object.assign({}, payload, {
              error,
              type: defaultFailureType
            }));
          }
        }
      );
    };
  };
}

module.exports = createApiMiddleware;