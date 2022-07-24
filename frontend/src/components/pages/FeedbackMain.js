import React, { Component, useEffect, useState } from 'react';
import FeedbackMenu from "../includes/FeedbackMenubar"
// import { Link } from 'react-router-dom';
import api from "../shared/api";
import '../css/FeedBack.css'
import Table from 'react-bootstrap/Table';


function Feedback() {
    const [MainLengthCheck, SetMainLengthCheck] = useState("");
    const [FeedArray, SetFeedArray] = useState([]);

    useEffect(() => {
        async function getFeedback() {
            await api.get('/api/feedback/category/main')
                .then(res => {
                    SetMainLengthCheck((res.data).length)
                    SetFeedArray(res.data)
                });
        }
        getFeedback();
    }, []);

    const YMDFormat = (num) => {
        if (!num) return "";
        let firstNum = num.slice(0, 10);
        let secondNum = num.slice(11, 16);
        return firstNum + " " + secondNum
    }

    const selectFeedMenu = (path) => {
        getCategoryFeed(path);
    }

    const getCategoryFeed = async (path) => {
        await api.get(`/api/feedback/category${path}`)
            .then(res => {
                SetMainLengthCheck((res.data).length)
                SetFeedArray(res.data)
            })
    }

    return (
        <div className='Wrapper'>
            {/* <div className="others-lobby-header2" > */}
            <div className='left-menu'>
                <FeedbackMenu selectFeedMenu={(id) => selectFeedMenu(id)} />
            </div>
            {MainLengthCheck ?
                <div className="Main-body">
                    <div className='feedback-table'>
                        <div className='feeback-table-box'>
                            {FeedArray.map((value, idx) => {
                                return (
                                    <>
                                        <div className='left-text'> 순위 : {idx + 1}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    <a style={{ textDecoration: 'none', color: "black" }} href={`/feedback/detail/${value.id}`} >
                                            {value.feedback_title}&nbsp;&nbsp;[{value.reply_cnt}] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;👍 {value.like_cnt}</a>
                                            <p />
                                        </div>
                                        <div className='right-text' style={{ textAlign: "right" }}> {value.user_name} <p /> {YMDFormat(value.createdAt)}</div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                </div> : <div className="Main-body"> 검색된 것이 없어요 알아서 하세요</div>
            }
        </div >
    )
}

export default Feedback;