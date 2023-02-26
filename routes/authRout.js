var express = require('express');
var { createUser,
    login,
    getAllUser,
    getAuser,
    deleteAuser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logOut
} = require('../controller/userCtrl');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
var router = express.Router();


router.post('/register', createUser);

router.post('/login', login);

router.get('/getAllUser', getAllUser);

router.get('/handleRefreshToken', handleRefreshToken)

router.get('/:id', authMiddleware, isAdmin, getAuser);

router.delete('/:id', deleteAuser);

router.put('/updateUser', authMiddleware, updateUser)

router.put('/blockuser/:id', authMiddleware, isAdmin, blockUser)

router.put('/unblockuser/:id', authMiddleware, isAdmin, unblockUser)

router.get('/logout/user', logOut);

module.exports = router;
