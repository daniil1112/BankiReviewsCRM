const middleware = {}

middleware['authAdmin'] = require('../middleware/authAdmin.js')
middleware['authAdmin'] = middleware['authAdmin'].default || middleware['authAdmin']

middleware['authStudent'] = require('../middleware/authStudent.js')
middleware['authStudent'] = middleware['authStudent'].default || middleware['authStudent']

middleware['authTeacher'] = require('../middleware/authTeacher.js')
middleware['authTeacher'] = middleware['authTeacher'].default || middleware['authTeacher']

export default middleware
