var express = require('express');
var router = express.Router();
const { Feedback, LikeCnt, Member, Recording, Reply, Questions } = require('../models');

// Feedback Main
router.get('/category/main', async (req, res) => {
    try {
        const feedbackAll = await Feedback.findAll({ order: [['like_cnt', 'DESC']], include: {model:Recording, include:{model:Member}}})
        feedbackArray = []
        feedbackAll.forEach((value) => {
            feedbackArray.push({
                id: value.id,
                feedback_title: value.feedback_title,
                like_cnt: value.like_cnt,
                reply_cnt: value.reply_cnt,
                user_name: value.Recording.Member.name,
                createdAt: value.createdAt
            })
        })
        res.json(feedbackArray);
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// LikeCnt
router.post('/LikeCnt', async (req, res) => {
    try {
        memId = req.body.userId;
        feedId = req.body.feedId;
        const likes = await LikeCnt.findOne({ where: { MemberId: memId, FeedbackId: feedId }})
        
        if (likes) {
            await LikeCnt.destroy({ where: { MemberId : memId, FeedbackId : feedId }})
            await Feedback.decrement({like_cnt: 1}, {where: { id: feedId }})
        } else {
            await LikeCnt.create({ MemberId : memId, FeedbackId : feedId })
            await Feedback.increment({like_cnt: 1}, {where: { id: feedId }})
        }
        const feedback_likes = await Feedback.findOne({where: {id: feedId}})
        res.json({Detaillikes : feedback_likes.like_cnt})
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// Feedback Detail
router.get('/getDetail/:feedbackId/:memberId', async (req, res) => {
    try {
        let flag = false;
        const feedback = await Feedback.findOne({where : {id : req.params.feedbackId}, include: {model:Recording, include:{model:Member}}})
        const likeCheck = await LikeCnt.findOne({where: { FeedbackId : req.params.feedbackId, MemberId: req.params.memberId}})
        let DetailId = feedback.Recording.Member.id
        let userId = req.params.memberId
        if (likeCheck) { flag = true; } 

        replyList = []
        const reply = await Reply.findAll({order: [['createdAt', 'DESC']], where: {FeedbackId : req.params.feedbackId}, include: {model: Member}})
        reply.forEach((value) => {
            replyList.push({
                id: value.id,
                reply_comment: value.reply_comment,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
                user_name: value.Member.name,
                user_id: value.Member.id,
                replyCheck: userId == value.Member.id,
                updateCheck: value.createdAt == value.updatedAt
            })
        })
    
        const detail = {
            title : feedback.feedback_title,
            name : feedback.Recording.Member.name,
            likes : feedback.like_cnt,
            replys : feedback.reply_cnt,
            recordingUrl : feedback.Recording.recording_url,
            userLikeCheck : flag,
            deletebotton : DetailId == userId,
            replyList : replyList
        }
        res.json(detail)
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// Feedback delete
router.delete('/deletePage/:feedbackId', async (req, res) => {
    try {
        const feedback = await Feedback.findOne({where: {id : req.params.feedbackId}})
        const result = await Feedback.destroy({where: {id: req.params.feedbackId}})
        await Recording.destroy({where: {id: feedback.RecordingId}})
        if (result) {
            res.json({success : true })
        } else {
            res.json({success : false })
        }
    } catch (err) {
        console.error(err);
        done(err)
    }
})

// feedback category get
router.get('/category/:main/:subcategoryId', async (req, res) => {
    try {
        const feedback_category = await Feedback.findAll({ order: [['like_cnt', 'DESC']], include:[{model: Recording, include:{model: Member}},{model:Questions, where: {SubCategoryId : req.params.subcategoryId}}]})
        feedbackList = []
        if(feedback_category) {
            feedback_category.forEach((value) => {
                feedbackList.push({
                    id: value.id,
                    feedback_title: value.feedback_title,
                    like_cnt: value.like_cnt,
                    reply_cnt: value.reply_cnt,
                    user_name: value.Recording.Member.name,
                    createdAt: value.createdAt
                })
            })
        }
        res.json(feedbackList)
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// reply create
router.post('/replyCreate', async(req, res) => {
    try {
        const result = await Reply.create({ MemberId : req.body.userId, FeedbackId : req.body.feedbackId, reply_comment: req.body.text })
        await Feedback.increment({reply_cnt: 1}, {where: { id: req.body.feedbackId }})

        if (result) {
            res.json({ success : true })
        } else {
            res.json({ success : false })
        }
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// reply delete
router.delete('/replyDelete/:replyId', async(req, res) => {
    try {
        const findReply = await Reply.findOne({where: {id: req.params.replyId}, include: {model: Feedback}})
        await Feedback.decrement({reply_cnt: 1}, {where: { id: findReply.Feedback.id }})
        await Reply.destroy({ where: { id: req.params.replyId }})
        const replys = await Feedback.findOne({ where: {id: findReply.Feedback.id}})

        res.json({replys: replys.reply_cnt})
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// reply update
router.put('/replyUpdate', async(req, res) => {
    try {
        await Reply.update({reply_comment : req.body.comment}, {where: {id : req.body.reply_id}})

        res.json({success: true})
    } catch (err) {
        console.error(err);
        done(err);
    }
})

// feedback My recording 
router.get('/recording/:number/:userId', async(req, res) => {
    try {
        const user_name = await Member.findOne({where: {id : req.params.userId}})
        let recordingList = []
        if(req.params.number == 15) {
            const recording = await Recording.findAll({order: [['createdAt', 'DESC']],where: { registered : '0',  MemberId: req.params.userId}})

            if(recording) {
                recording.forEach((value) => {
                    recordingList.push({
                        id: value.id,
                        title: value.recording_title,
                        name: user_name.name,
                        createdAt: value.createdAt,
                        recordingUrl: value.recording_url
                    })
                })
            }
            return res.json(recordingList)
        } else {
            const MyFeedbackAll = await Recording.findAll({order: [['createdAt', 'DESC']],where: { registered : '1',  MemberId: req.params.userId}})
            let MyFeedbackArray = []
            for (const value of MyFeedbackAll) {
                const feedbackInfo = await Feedback.findOne({where: {RecordingId : value.id}})
                MyFeedbackArray.push({
                    id: feedbackInfo.id,
                    feedback_title: feedbackInfo.feedback_title,
                    like_cnt: feedbackInfo.like_cnt,
                    reply_cnt: feedbackInfo.reply_cnt,
                    user_name: user_name.name,
                    createdAt: feedbackInfo.createdAt
                })
            }
            return res.json(MyFeedbackArray)
        }

    } catch (err) {
        console.error(err);
        done(err);
    }
})

router.delete('/deleterecording/:checklist', async (req, res) => {
    try {
        const recordingId = req.params.checklist.split(',')
        for (let value of recordingId) {
            await Recording.destroy({where: {id: value}})
        }
        res.json({success : true})
    } catch (err) {
        console.error(err);
        done(err);
    }
})

router.post('/createfeedback', async (req, res) => {
    try {
        for (let value of req.body.recordingIdList) {
            const recording = await Recording.findOne({where : {id : value}})
            const questions = await Questions.findOne({where: {questions_name : recording.recording_title}})
            await Feedback.create({
                feedback_title : recording.recording_title,
                RecordingId : value,
                QuestionId : questions.id
            })
            await Recording.update({registered : '1'}, {where: {id: value}})
        }
        res.json({success : true})
    } catch (err) {
        console.error(err);
        done(err);
    }
})

module.exports = router;