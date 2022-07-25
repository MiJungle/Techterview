import React, { useEffect, useState } from 'react';
import jwt from "jwt-decode";
import api from "../shared/api"
import ReactPlayer from 'react-player'

function FeedbackDetail() {
    const [DetailFeedback, SetDetailFeedback] = useState([]);
    const [LikeStatus, SetLikeStatus] = useState("");
    const [text, setText] = useState('');
    const [FeedLikeCnt, SetFeedLikeCnt] = useState(0);
    const [ReplyList, SetReplyList] = useState([]);
    const [Modify, SetModify] = useState(false);
    const [Idx, SetIdx] = useState(0);
    const [UpdateText, SetUpdateText] = useState("");

    let feedbackId = new URL(window.location.href).pathname.split('/')[3]
    const Token = sessionStorage.getItem('Authorization')
    const userInfo = jwt(Token)

    useEffect(() => {
        async function getFeedDetail() {
            api.get(`/api/feedback/getDetail/${feedbackId}/${userInfo.id}`)
                .then(res => {
                    SetDetailFeedback(res.data);
                    SetLikeStatus(res.data.userLikeCheck);
                    SetFeedLikeCnt(res.data.likes)
                    SetReplyList(res.data.replyList)
                });
        }
        getFeedDetail();
    }, [])

    const upLikeCnt = async () => {
        const LikeCntData = { userId: userInfo.id, feedId: feedbackId }
        await api.post('/api/feedback/LikeCnt', LikeCntData)
            .then(res => {
                if (LikeStatus) {
                    SetLikeStatus(false)
                    SetFeedLikeCnt(FeedLikeCnt - 1)
                } else {
                    SetLikeStatus(true)
                    SetFeedLikeCnt(FeedLikeCnt + 1)
                }
            })
    };

    const deleteFeedbackPage = async () => {
        await api.delete(`/api/feedback/deletePage/${feedbackId}`)
            .then(res => {
                window.location.href = '/feedback/main'
            })
    };

    const replyCreate = async () => {
        const replyData = { text: text, userId: userInfo.id, feedbackId: feedbackId }
        await api.post("/api/feedback/replyCreate", replyData)
            .then(res => {
                window.location.reload(true)
            })
    }

    const replyDelete = async (id) => {
        await api.delete(`/api/feedback/replyDelete/${id}`)
            .then(res => {
                window.location.reload(true)
            })
    }

    const replyUpdate = async (id) => {
        await api.put('/api/feedback/replyUpdate', {
            reply_id: id,
            comment: UpdateText
        })
            .then(res => {
                window.location.reload(true)
            })
    }

    const onChange = (e) => {
        setText(e.target.value);
    };

    const onUpdate = (e) => {
        SetUpdateText(e.target.value);
    };

    const replyUpdateClick = async (idx, text) => {
        SetModify(true)
        SetIdx(idx)
        SetUpdateText(text)
    }

    const YMDFormat = (num) => {
        if (!num) return "";
        let firstNum = num.slice(0, 10);
        let secondNum = num.slice(11, 16);
        return firstNum + " " + secondNum
    }

    return (
        <div>
            <div>
                <div className="feedbackdetail-title">
                    <span className="feedbackdetail-title-left"> {DetailFeedback.title}</span>
                    <span className='feedbackdetail-title-right'>{DetailFeedback.name}</span>
                    <div>
                        <ReactPlayer controls url={DetailFeedback.recordingUrl} />
                    </div>
                    {DetailFeedback.deletebotton ?
                        <button style={{ color: 'red', backgroundColor: 'black' }} onClick={() => { deleteFeedbackPage() }}>삭제</button>
                        : ""}
                    {LikeStatus ? "👍" : "🖕"}
                    <button style={{ color: 'red', backgroundColor: 'black' }} onClick={() => { upLikeCnt() }}>좋아요  </button> ^_^ {FeedLikeCnt}
                </div>
                <div class="feedbackdetail-video-grid-container-box">
                    <div class="feedbackdetail-video-grid-box">
                    </div>
                </div>
            </div>
            <div className='feedback-table'>
                {DetailFeedback.replys}의 댓글
                <input onChange={onChange} value={text} /><button style={{ color: 'yellow', backgroundColor: 'black' }} onClick={() => { replyCreate() }}>등록</button>
                <table>
                    <thead>
                        <tr>
                            <th>작성자</th><th>내용</th><th>등록일</th><th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ReplyList.map((value, idx) => {
                            return (
                                <tr>
                                    <td> {value.user_name} </td>
                                    {Modify && Idx == idx + 1 ?
                                        <td> <input onChange={onUpdate} value={UpdateText} /> </td> :
                                        <td>{value.reply_comment}{value.updateCheck ? "" : "(수정됨)"}</td>}
                                    <td> {YMDFormat(value.createdAt)} </td>
                                    {!value.replyCheck ? "" : Modify && Idx == idx + 1 ?
                                        <td>
                                            <button style={{ color: 'white', backgroundColor: 'black' }} onClick={() => { replyUpdate(value.id) }}>수정</button>
                                            <button style={{ color: 'yellow', backgroundColor: 'black' }} onClick={() => { window.location.reload(true) }}>취소</button>
                                        </td> :
                                        <td>
                                            <button style={{ color: 'white', backgroundColor: 'black' }} onClick={() => { replyDelete(value.id) }}>삭제</button>
                                            <button style={{ color: 'yellow', backgroundColor: 'black' }} onClick={() => { replyUpdateClick(idx + 1, value.reply_comment) }}>수정</button>
                                        </td>
                                    }
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default FeedbackDetail