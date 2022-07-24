import React, { useEffect, useState } from 'react';
import FeedbackMenu from "../includes/FeedbackMenubar";
import jwt from "jwt-decode";
import api from "../shared/api"
// import {Link} from 'react-router-dom'; 

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

    const onChange = (e) => {
        setText(e.target.value);
    };

    const onUpdate = (e) => {
        SetUpdateText(e.target.value);
    };

    const replyCreate = async () => {
        const replyData = { text: text, userId: userInfo.id, feedbackId: feedbackId }
        await api.post("/api/feedback/replyCreate", replyData)
            .then(res => {
                window.location.reload(true)
            })
    }

    const YMDFormat = (num) => {
        if (!num) return "";
        let firstNum = num.slice(0, 10);
        let secondNum = num.slice(11, 16);
        return firstNum + " " + secondNum
    }

    const replyDelete = async (id) => {
        await api.delete(`/api/feedback/replyDelete/${id}`)
            .then(res => {
                window.location.reload(true)
            })
    }

    const replyUpdateClick = async (idx, text) => {
        SetModify(true)
        SetIdx(idx)
        SetUpdateText(text)
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

    return (
        <div>
            <div className='left-menu'>
                <FeedbackMenu />
            </div>
            <div>
                <div className="feedbackdetail-title">
                    <span className="feedbackdetail-title-left"> {DetailFeedback.title}</span>
                    <span className='feedbackdetail-title-right'>{DetailFeedback.name}</span>
                    {DetailFeedback.deletebotton ?
                        <button style={{ color: 'red', backgroundColor: 'black' }} onClick={() => { deleteFeedbackPage() }}>삭제</button>
                        : ""}
                    {LikeStatus ? "누른상태" : "안누른상태"}
                    <button style={{ color: 'red', backgroundColor: 'black' }} onClick={() => { upLikeCnt() }}>좋아요  </button> ^_^ {FeedLikeCnt}
                </div>
                <div class="feedbackdetail-video-grid-container-box">
                    <div class="feedbackdetail-video-grid-box">
                        <div class="grid-item">url : {DetailFeedback.recordingUrl}   </div>
                    </div>
                </div>
                <div className='feedback-table'>
                    댓글 수 : {DetailFeedback.replys}
                    <table>
                        <thead>
                            <tr>
                                <th>작성자</th><th>제목</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>abc234</td><td>정말 도움이 많이 됐습니다</td>
                            </tr>
                            <tr>
                                <td>dddd</td><td>너무 잘생겼어요 좋아요!!!</td>
                            </tr>
                            <tr>
                                <td>999d9s</td><td>제가 생각한 답변이랑 많이 다른 것 같네요</td>
                            </tr>
                        </tbody>
                    </table>
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
