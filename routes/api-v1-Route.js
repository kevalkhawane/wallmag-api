const express = require('express');
const apiv1Controller = require('../controllers/apiV1Controller');
const router = express.Router();


router.get('/getwidget', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getWidget);
router.get('/getslider', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getSlider);
router.get('/search/post', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getSearchPost);
router.get('/search/topic', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getSearchTopic);
router.get('/gettag/:tag', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getTag);
router.get('/getposts', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getPosts);
router.get('/getpost/:postid', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getPostById);
router.get('/gettopic/:topicid', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getTopicById);
router.post('/bookmark/:postId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.bookmarkById);
router.post('/unbookmark/:postId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.unbookmarkById);
router.post('/followtopic/:topicId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.followTopic);
router.post('/unfollowtopic/:topicId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.unfollowTopic);
router.post('/followtag/:tagId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.followTag);
router.post('/unfollowtag/:tagId', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.unfollowTag);
router.get('/getbookmarks', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getBookmarks);
router.get('/getfollowedtopics', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getTopics);
router.get('/getfollowedtags', apiv1Controller.checkKey,apiv1Controller.checkUser,apiv1Controller.getTags);


module.exports = router;

