import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { socket } from "../../lib/socket";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import jwt from 'jwt-decode'

function CreateRoomWith({ closeModal }) {

    const Options = [
        {
            key: 1,
            value: "네트워크",
        },
        {
            key: 2,
            value: "데이터베이스",
        },
        {
            key: 3,
            value: "디자인패턴",
        },
        {
            key: 4,
            value: "알고리즘",
        },
        {
            key: 5,
            value: "운영체제",
        },
        {
            key: 6,
            value: "자료구조",
        },
        {
            key: 7,
            value: "컴퓨터구조"
        }];

    const Options1 = [
        {
            key: 8,
            value: "개발상식",
        },
        {
            key: 9,
            value: "기본질문",
        }];

    const Options2 = [
        {
            key: 10,
            value: "JavaScript",
        },
        {
            key: 11,
            value: "Java",
        },
        {
            key: 12,
            value: "React",
        }];

    const Options3 = [

        {
            key: 13,
            value: "프론트엔드",
        },
        {
            key: 14,
            value: "백엔드"
        }];

    const roomId = uuidv4();
    const [clicked, checkclicked] = useState(false);
    const [SendNum, setSendNum] = useState(0)
    const [Mandatoryselect, setMandatoryselect] = useState("아래 4가지의 카테고리 중 하나를 선택해보세요!");

    function handleClick() {
        sessionStorage.removeItem('QuestionList')
        window.location.replace("/training/with/" + SendNum + "/" + roomId)
    }
    
    const [roomName, setRoomName] = useState('');

    const onChangeInput0  = (e) => {
        setRoomName(e.target.value);
    };

    
    useEffect(() => {
        if(clicked===true) {
            if (!!!document.getElementById('input-room-name').value) {
                setMandatoryselect("방제목을 입력해주세요!")
                checkclicked(false);
                return
            } else if (!SendNum ) {
                setMandatoryselect("카테고리는 필수선택 사항입니다!")
                checkclicked(false);
                return
            } else if (!checkedInterview) {
                setMandatoryselect("면접자, 면접관을 선택해주세요!")
                checkclicked(false);
                return
            } 
            const Token = sessionStorage.getItem('Authorization')
            const memberId = jwt(Token).id
            socket.emit("createRoom", roomId, SendNum,roomName,checkedTitle,checkedValue, checkedInterview, memberId);
            handleClick();
        }
    }, [clicked]);

    const [radioValue, setRadioValue] = useState('1');
    const [checkedValue, setCheckedValue] = useState("");
    const [checkedTitle, setcheckedTitle] = useState("");
    const [checkedInterview, setCheckedInterview] = useState(0);

    const checkOnlyOne = (checkThis) => {
        if (!checkThis.checked) { 
            setCheckedInterview(0) 
        } else {
            setCheckedInterview(checkThis.value)
        } 
        const checkboxes = document.getElementsByName('test')
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i] !== checkThis) {
                checkboxes[i].checked = false
            }
        }
    }

    
    return (
        <div className="Create-delete-modal">
            <div className="Create-delete-modal-content"  style={{position:"relative", textAlign:"center"}}>
            <div className="Create-delete-modal-body" style={{position:"flex", alignContent:"center"}}>
                    <h2>어떤 면접을 준비해 볼까요?</h2><br/>
                </div>
                <div className="create-room-header" style={{display: "flex", justifyContent: "center", verticalAlign:"middle", marginTop:"1rem"}}> 
                        <div style={{paddingTop:"0.5rem"}}><input id="input-room-name" placeholder="방제목을 입력해주세요" name="roomname" onChange={onChangeInput0} style={{height: "2rem"}}/></div>
                        <div className="interview-checkbox" style={{width: "9rem",paddingBottom:"1rem"}}> 
                            <div style={{margin:"0 0.7rem 0 0.7rem"}}> <input type="checkbox" name="test" value="1" onChange={(e) => checkOnlyOne(e.target)} /> 면접자</div>
                            <div  > <input type="checkbox" name="test" value="2" onChange={(e) => checkOnlyOne(e.target)} /> 면접관</div>
                        </div>
                    </div>
                    <div style={{marginTop:"1rem"}}> {Mandatoryselect ? Mandatoryselect: ""}</div>

                    <div>
                        <Tabs   style={{ width: 520, borderBottom:"none"  }}
                            defaultActiveKey="profile"
                            id="fill-tab-example"
                            className="mb-3"
                            fill>
                            
                            <Tab eventKey="CS" title="CS" onClick={()=> setcheckedTitle("CS")}>
                                <ButtonGroup style={{marginTop:"0.5rem"}} >
                                    {Options.map((radio, idx) => (
                                        <ToggleButton
                                            key={idx}
                                            id={`radio-${idx}`}
                                            type="radio"
                                            variant="outline-dark"
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                            onClick={() => {setSendNum(radio.key); setCheckedValue(radio.value)}}
                                        > {radio.value} </ToggleButton>
                                    ))}
                                </ButtonGroup>

                            </Tab>
                            <Tab eventKey="Basic" title="Basic" onClick={()=> setcheckedTitle("Basic")}>
                                <ButtonGroup style={{marginTop:"0.5rem"}}>
                                    {Options1.map((radio, idx) => (
                                        <ToggleButton
                                            style={{padding:"1rem"}}
                                            key={idx}
                                            id={`radio2-${idx}`}
                                            type="radio"
                                            variant="outline-dark"
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                            onClick={() => {setSendNum(radio.key); setCheckedValue(radio.value)}}
                                        > {radio.value} </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Tab>
                            <Tab eventKey="Language" title="Language" onClick={()=> setcheckedTitle("Language")}>
                                <ButtonGroup style={{marginTop:"0.5rem"}}>
                                    {Options2.map((radio, idx) => (
                                        <ToggleButton
                                            style={{padding:"1rem"}}
                                            key={idx}
                                            id={`radio1-${idx}`}
                                            type="radio"
                                            variant="outline-dark"
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                            onClick={() => {setSendNum(radio.key); setCheckedValue(radio.value)}}
                                        > {radio.value} </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Tab>
                            <Tab eventKey="Position" title="Position" onClick={()=> setcheckedTitle("Position")}>
                                <ButtonGroup style={{marginTop:"0.5rem"}}>
                                    {Options3.map((radio, idx) => (
                                        <ToggleButton
                                            style={{padding:"1rem"}}
                                            key={idx}
                                            id={`radio3-${idx}`}
                                            type="radio"
                                            variant="outline-dark"
                                            name="radio"
                                            value={radio.value}
                                            checked={radioValue === radio.value}
                                            onChange={(e) => setRadioValue(e.currentTarget.value)}
                                            onClick={() => {setSendNum(radio.key); setCheckedValue(radio.value)}}
                                        > {radio.value} </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Tab>
                        </Tabs>
                    </div>
                    <div className="create-delete-modal-footer" style={{marginTop: "4rem", paddingTop:"1rem", position:"absolute",width:"82%",  top: "65%",left: "8%", borderTop: "1px solid #dee2e6", }}>
                        <button className="go-interview-btn" onClick={()=> { checkclicked(true)}}>면접하러 가기</button>
                        <button className="next-time-interview-btn" onClick={() => closeModal(false)}>다음에 할래요</button>
                    </div>
            </div >
        </div >
    )
}

export default CreateRoomWith