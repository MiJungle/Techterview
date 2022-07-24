function VideoFaceVoiceEditModal({ closeModal }) {

    return (
        <div className="video-edit-modal" >
            <div className="video-edit-modal-content">
                <div className="video-edit-modal-body">
                    <div className="video-edit-thumbnail" >
                        <img className="video-edit-thumbnail" src={require("../images/video_thumbnail.png")} alt={"video thumbnail"} />
                    </div>
                    <div className="video-edit-voice-filter-btn">
                        <button className="video-edit-face-btn">얼굴 필터</button>
                        <button className="video-edit-voice-btn">목소리</button>
                        <div className="video-edit-face-choice-body"> </div>
                        <div className="video-edit-voice-choice-body"> </div>

                    </div>
                </div>
                <div className="video-edit-modal-footer">
                    <button className="btn-cancel">저장</button>
                    <button onClick={() => closeModal(false)} className="btn-yes">취소</button>
                </div>
            </div>
        </div>
    )
}

export default VideoFaceVoiceEditModal