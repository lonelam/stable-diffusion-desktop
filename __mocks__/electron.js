/** @type {import('electron')} */
module.exports = {
    app: {
      getPath: jest.fn().mockImplementation( pathName => {
        const pathMap =  {
            appData:'testApp/appData'
        }
        return pathMap[pathName];
      }),
      getAppPath: jest.fn().mockReturnValue('.')
      // Add other methods you need to mock here
    },
    // Add other modules you need to mock here
  };