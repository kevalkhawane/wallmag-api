const PostModel = require('../models/post-model');
const TopicModel = require('../models/topic-model');
const SliderModel = require('../models/sliderModel');
const UUID = require('../models/uuid-model');


exports.badRequest = (req, res, next) => {
    res.status(404).send("Bad Request");
};

exports.checkKey = (req, res, next) => {
    if(req.headers['api-key']){
        const apiKey = req.headers['api-key'].toString();
     if(apiKey == process.env.APIKEY_V1){
                 
      next();
    }
    else
    {
      //if user is not logged in 
      
        res.status(404).send('Api Key is not valid.');
    }  

    }
    else
    {
        res.status(404).send('Api Key is not Passed.');
    }
  
};
 
 
exports.checkUser = (req, res, next) => {
    if(req.headers['uuid-key']){
     const UserId = req.headers['uuid-key'].toString();

     UUID.findOne({uuid:UserId}).then((currentUser) => {
        if(currentUser){
            next();
            
        }else{
            //if already not the user
            //add user
            
            new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
            
            next();
        }
    });

    }
    else
    {
     res.status(404).send('UUID is not Passed.');
    }
  
};

exports.getWidget = async (req, res, next) => { 
    const _randomDocument = await PostModel.aggregate([
        { $sample: { size: 1 } }
      ]);
      const randomDocument = _randomDocument.map(post => ({ _id: post._id, thumbnail: post.thumbnail, haveContent:post.haveContent }));

      res.send(randomDocument[0]);
}
   
exports.getSlider = async (req, res, next) => { 

    // get slider 
  var slider = await SliderModel.findOne();

  if(slider==null){
    //Create model
    await SliderModel({
        tags: ["Tags"],      
        topic: "featured topic",
        tag: "tag",
        post1:"post",
        post2:"post",
        post3:"post",
        post4:"post",
        post5:"post",
        topic1:"topic",
        topic2:"topic",
        topic3:"topic",
        topic4:"topic",
        topic5:"topic"          
    }).save();
    slider = await SliderModel.findOne();    
  }

  //get latest posts
  const LatestPosts = await PostModel.find({haveContent:true}).sort({ lastUpdated: -1 }).limit(6).select('_id thumbnail');   

  // get featured Topic
  const Topic = await TopicModel.findOne();
  const TopicPosts = await PostModel.find({topic:Topic._id}).sort({ lastUpdated: 1 }).limit(6).select('_id thumbnail part');

  //get posts by Tag
  //const TagPosts = await PostModel.find({tags:{ $regex: slider.tag, $options: 'i' }}).limit(6);
  
  const _TagPosts = await PostModel.aggregate([
    {
      $match: { tags: { $regex: slider.tag, $options: 'i' } }
    },
    { $sample: { size: 6 } } // Sort and limit to 6 random documents
  ]).exec();
  
  const TagPosts = _TagPosts.map(post => ({ _id: post._id, thumbnail: post.thumbnail }));
  

  //get featured Topics
  const Topic1 = await TopicModel.findById(slider.topic1).select('_id thumbnail');
  const Topic2 = await TopicModel.findById(slider.topic2).select('_id thumbnail');
  const Topic3 = await TopicModel.findById(slider.topic3).select('_id thumbnail');
  const Topic4 = await TopicModel.findById(slider.topic4).select('_id thumbnail');
  const Topic5 = await TopicModel.findById(slider.topic5).select('_id thumbnail');

  //get featured Posts

  const Post1 = await PostModel.findById(slider.post1).select('_id thumbnail');
  const Post2 = await PostModel.findById(slider.post2).select('_id thumbnail');
  const Post3 = await PostModel.findById(slider.post3).select('_id thumbnail');
  const Post4 = await PostModel.findById(slider.post4).select('_id thumbnail');
  const Post5 = await PostModel.findById(slider.post5).select('_id thumbnail');

    res.send({featuredTags: slider.tags,latestPosts:LatestPosts,featuredTopic:Topic,topicPosts:TopicPosts,Tag:slider.tag,tagPost:TagPosts,featuredTopics:[Topic1,Topic2,Topic3,Topic4,Topic5],featuredPosts:[Post1,Post2,Post3,Post4,Post5]}); 
};

//get search Post
exports.getSearchPost = async (req, res, next) => { 
    let page = 1;
    if(req.query.page){
        page = req.query.page;

    }

    let q = '';
    if(req.query.q){
        q = req.query.q;
    }


    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    const posts = await PostModel.find({
        $or:[
            { title:{ $regex:'.*'+q+'.*',$options:'i' }},
            { topic:{ $regex:'.*'+q+'.*',$options:'i' }},
            { content:{ $regex:'.*'+q+'.*',$options:'i' }},
            { tags:{ $regex:'.*'+q+'.*',$options:'i' }}
        ]
  }).limit(limit)
    .select('_id title thumbnail topic part')
    .skip((page-1) * limit)    
    .exec();

    const count = await PostModel.find({
        $or:[
            { title:{ $regex:'.*'+q+'.*',$options:'i' }},
            { topic:{ $regex:'.*'+q+'.*',$options:'i' }},
            { content:{ $regex:'.*'+q+'.*',$options:'i' }},
            { tags:{ $regex:'.*'+q+'.*',$options:'i' }}
        ]
  }).countDocuments();


    res.send({ posts: posts,totalpages: Math.ceil(count/limit),currentPage:page,query:q});
   
}


// get search topic
exports.getSearchTopic = async (req, res, next) => { 
    let page = 1;
    if(req.query.page){
        page = req.query.page;

    }

    let q = '';
    if(req.query.q){
        q = req.query.q;
    }


    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    const topics = await TopicModel.find({
        $or:[
            { name:{ $regex:'.*'+q+'.*',$options:'i' }},
            { description:{ $regex:'.*'+q+'.*',$options:'i' }}
        ]
  }).limit(limit)
  .select('_id thumbnail name')
    .skip((page-1) * limit)    
    .exec();

    const count = await TopicModel.find({
      $or:[
          { name:{ $regex:'.*'+q+'.*',$options:'i' }},
          { description:{ $regex:'.*'+q+'.*',$options:'i' }}
      ]
}).countDocuments();


    res.send({ topics: topics,totalpages: Math.ceil(count/limit),currentPage:page,query:q});
   
}

exports.getTag = async (req, res, next) => { 
    const tag = req.params.tag;

    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }

    let sort = -1; // -1 for latest & 1 for oldest
    if(req.query.sort){
        sort = req.query.sort;
    }
 
    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    const count = await PostModel.find({tags:{ $regex: tag, $options: 'i' }}).countDocuments();

  const posts = await PostModel.find({tags:{ $regex: tag, $options: 'i' }}).limit(limit)
    .select('_id thumbnail haveContent')
    .skip((page-1) * limit)
    .sort({ lastUpdated: sort })
    .exec();
    

    res.send({ posts:posts,totalpages: Math.ceil(count/limit),currentPage:page});

}

exports.getPosts = async (req, res, next) => { 
   

    let limit = 5;
    if(req.query.limit){
        limit = Number(req.query.limit);
    };

    
    const randomDocument = await PostModel.aggregate([
        { $sample: { size: limit } }
      ]);

    const posts = randomDocument.map(post => ({ _id: post._id, thumbnail: post.thumbnail, haveContent:post.haveContent }));

      res.send(posts);    
}

exports.getPostById = async (req, res, next) => { 
    const PostId = req.params.postid;
    
    const post = await PostModel.findById(PostId)

    const topic = await TopicModel.findById(post.topic).select('_id thumbnail name');;

    res.send({post,topic});

}

exports.getTopicById = async (req, res, next) => { 
    const TopicId = req.params.topicid;    

    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }

    let sort = 1; // -1 for latest & 1 for oldest
    if(req.query.sort){
        sort = req.query.sort;
    }
 
    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    const topic = await TopicModel.findById(TopicId);

    const posts = await PostModel.find({topic:TopicId}).limit(limit)
    .sort({ part: sort })
    .select('_id thumbnail haveContent part')
    .skip((page-1) * limit)    
    .exec();

    res.send({topic,posts})
};
// BOOKMARK BY ID
exports.bookmarkById = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const postId = req.params.postId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.bookmarks.includes(postId)) {
            res.send("Post is already bookmarked");
        }else{
            uuidDocument.bookmarks.push(postId);        //if not found add bookmark
            await uuidDocument.save();
            res.status(200).send("Post bookmarked successfully.");

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

exports.unbookmarkById = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const postId = req.params.postId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.bookmarks.includes(postId)) {

            uuidDocument.bookmarks = uuidDocument.bookmarks.filter(bookmark => bookmark !== postId);
            await uuidDocument.save(); // Save the document with the updated bookmarks array
            res.status(200).send({ "success": "Unbookmarked Succesfully" });
           
        }else{

           res.status(200).send({ "success": "Already Unbookmarked" });

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

  
exports.followTopic = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const topicId = req.params.topicId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.topics.includes(topicId)) {
            res.send("topic is already followed");
        }else{
            uuidDocument.topics.push(topicId);        //if not found add bookmark
            await uuidDocument.save();
            res.status(200).send("topic followed successfully.");

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

exports.unfollowTopic = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const topicId = req.params.topicId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.topics.includes(topicId)) {

            uuidDocument.topics = uuidDocument.bookmarks.filter(bookmark => bookmark !== topicId);
            await uuidDocument.save(); // Save the document with the updated bookmarks array
            res.status(200).send({ "success": "Unfollowed topic Succesfully" });
           
        }else{

           res.status(200).send({ "success": "Already Unfollowed topic" });

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

exports.followTag = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const tagId = req.params.tagId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.tags.includes(tagId)) {
            res.send("tag is already followed");
        }else{
            uuidDocument.tags.push(tagId);        //if not found add bookmark
            await uuidDocument.save();
            res.status(200).send("tag followed successfully.");

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

exports.unfollowTag = async (req, res, next) => {
    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();
        const tagId = req.params.tagId;

    // Find the UUID document with the specified uuid
    let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

        uuidDocument = await UUID.findOne({ uuid: UserId });  //get again document

        if (uuidDocument.tags.includes(tagId)) {

            uuidDocument.tags = uuidDocument.bookmarks.filter(bookmark => bookmark !== tagId);
            await uuidDocument.save(); // Save the document with the updated bookmarks array
            res.status(200).send({ "success": "Unfollowed tag Succesfully" });
           
        }else{

           res.status(200).send({ "success": "Already Unfollowed tag" });

        }  
    }else{
        res.send("UserID Is Not Passed");
    }
};

exports.getBookmarks = async (req, res, next) => { 

    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
 
    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();    
    
        let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }
    

    const arrayOfIds = await UUID.findOne({uuid:UserId},'bookmarks -_id')
     .then(document => document.bookmarks.slice((page-1)*limit)  // Skip the first item
     .slice(0, limit));

     const documents = await PostModel.find({ _id: { $in: arrayOfIds } }).select('_id thumbnail haveContent');
     res.send( documents );

  
    }else{

        res.send({"Error":"User Not send"});
    }
};

exports.getTopics = async (req, res, next) => { 
    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
 
    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();    
    
        let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }

    const arrayOfIds = await UUID.findOne({uuid:UserId},'topics -_id')
     .then(document => document.topics.slice((page-1)*limit)  // Skip the first item
     .slice(0, limit));

     const documents = await TopicModel.find({ _id: { $in: arrayOfIds } }).select('-description');
     res.json(documents);
  
    }else{

        res.send({"Error":"User Not send"});
    }
};

exports.getTags = async (req, res, next) => { 
    let page = 1;
    if(req.query.page){
        page = req.query.page;
    }
 
    let limit = 5;
    if(req.query.limit){
        limit = req.query.limit;
    }

    if(req.headers['uuid-key']){
        const UserId = req.headers['uuid-key'].toString();    
    
        let uuidDocument = await UUID.findOne({ uuid: UserId });

        if(uuidDocument==null){ // IF USER IS NOT FOUND CREATE NEW USER
            await new UUID({
                uuid: UserId,
                bookmarks: [],
                topics: [],
                tags: []            
            }).save();
        }
    

    const arrayOfIds = await UUID.findOne({uuid:UserId},'tags -_id')
     .then(document => document.tags.slice((page-1)*limit)  // Skip the first item
     .slice(0, limit));

        res.send( arrayOfIds );

  
    }else{

        res.send({"Error":"User Not send"});
    }
};