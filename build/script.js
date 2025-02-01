"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Video {
    constructor(options) {
        var _a, _b, _c, _d;
        this._preVolume = 1;
        Video.count++;
        this._url = options.url;
        this._BgColor = (_a = options.BgColor) !== null && _a !== void 0 ? _a : "white";
        this._skipTime = (_b = options.skipTime) !== null && _b !== void 0 ? _b : 5;
        this._iconsColor = (_c = options.iconsColor) !== null && _c !== void 0 ? _c : "white";
        this._autoPlay = (_d = options.autoPlay) !== null && _d !== void 0 ? _d : false;
        let parent = document.querySelector(".row");
        this.div = document.createElement("div");
        this.div.classList.add("col-lg-9", "m-auto", "my-4");
        this.div.innerHTML = ` 
        <video class="video w-100 ">
            <source src="${this._url}" type="video/mp4" />
        </video>
        <div class=" px-2 py-2 controls">
            <input type="range" class="w-100 timeRange" value="0" />
            <div class="d-flex justify-content-between align-items-sm-center">
              <div>
                <i class="fa-solid fa-backward backwardBtn me-2"></i>
                <i class="fa-solid fa-play me-2 play"></i>
                <i class="fa-solid fa-forward forwardBtn"></i>
              </div>
              <div>
                <div class="volume ">
                  <input type="range" value="1" min="0" max="1" step=".1" class="volumeInput" />
                </div>
                <i class="fa-solid fa-volume-high mx-4 muteBtn"></i>
                <i class="fa-solid fa-expand mx-1"></i>
              </div>
            </div>
        </div>`;
        parent === null || parent === void 0 ? void 0 : parent.appendChild(this.div);
        // Select elements inside the newly created div
        this.video = this.div.querySelector(".video");
        this.playbtn = this.div.querySelector(".play");
        this.timeRange = this.div.querySelector(".timeRange");
        this.forwardBtn = this.div.querySelector(".forwardBtn");
        this.backwardBtn = this.div.querySelector(".backwardBtn");
        this.muteBtn = this.div.querySelector(".muteBtn");
        this.volumeContainer = document.querySelector(".volume");
        this.volumInput = document.querySelector(".volumeInput");
        this.fullScreen = this.div.querySelector(".fa-expand");
        this.controls = this.div.querySelector(".controls");
        this.vedioContainer = this.div;
        this.allIcons = Array.from(this.div.querySelectorAll("i"));
        //////////////////////////style by valuse od constructor
        this.veidoHover();
        this.initStyle(this._iconsColor, this._BgColor);
        this.AutoPlay(this._autoPlay);
        this.playandPause();
        this.handleTimeRange();
        this.forward(this._skipTime);
        this.backward(this._skipTime);
        this.mutedAndTimeRange(this._BgColor);
        this.FullScreen();
    }
    ////////////////////////////////////////////////////////////////
    playandPause() {
        this.playbtn.addEventListener("click", () => {
            if (this.video.paused) {
                this.playbtn.classList.remove("fa-play");
                this.playbtn.classList.add("fa-pause");
                this.video.play();
            }
            else {
                this.video.pause();
                this.playbtn.classList.remove("fa-pause");
                this.playbtn.classList.add("fa-play");
            }
        });
    }
    ///////////////////////////////////////////////////////////////
    handleTimeRange() {
        if (!this.video || !this.timeRange)
            return;
        // Update range max value when metadata is loaded
        this.video.addEventListener("loadedmetadata", () => {
            this.timeRange.max = String(this.video.duration);
        });
        // Sync range with video time and handle play button state
        this.video.addEventListener("timeupdate", () => {
            this.timeRange.value = String(this.video.currentTime);
            this.updatePlayPauseIcon();
        });
        // Allow seeking when the user changes the range
        this.timeRange.addEventListener("input", () => {
            this.video.currentTime = Number(this.timeRange.value);
        });
    }
    ///////////////////////////////////////////////////////////////
    updatePlayPauseIcon() {
        if (!this.video || !this.playbtn)
            return;
        if (this.video.currentTime <= 0 ||
            this.video.currentTime >= this.video.duration) {
            this.playbtn.classList.remove("fa-pause");
            this.playbtn.classList.add("fa-play");
        }
    }
    ///////////////////////////////////////////////////////////////
    forward(skipTime) {
        this.forwardBtn.addEventListener("click", () => {
            this.video.currentTime = Math.min(this.video.currentTime + skipTime, this.video.duration);
        });
    }
    ///////////////////////////////////
    backward(skipTime) {
        this.backwardBtn.addEventListener("click", () => {
            this.video.currentTime = Math.max(this.video.currentTime - skipTime, 0);
        });
    }
    ////////////////////////////////////////////
    mutedAndTimeRange(_BgColor) {
        this.volumeContainer = this.vedioContainer.querySelector(".volume");
        this.volumInput = this.vedioContainer.querySelector(".volume input");
        this.volumeContainer.style.display = "none";
        this.volumeContainer.style.backgroundColor = "rgba(255,255,255,.2)";
        this.volumeContainer.style.padding = "3px 3px 0px 3px";
        this.volumeContainer.style.borderRadius = " 8px";
        this.volumeContainer.style.position = "relative";
        this.volumeContainer.style.top = "1px";
        this.volumeContainer.style.left = "29px";
        this.volumeContainer.style.zIndex = "1";
        this.muteBtn.style.zIndex = "2";
        this.muteBtn.addEventListener("click", () => {
            if (this.video.muted) {
                this.video.muted = false;
                this.muteBtn.classList.remove("fa-volume-xmark");
                this.muteBtn.classList.add("fa-volume-high");
                // this.volumInput.value = "1"; // Restore volume slider value to 1
                this.volumInput.value = String(this._preVolume);
                this.video.volume = this._preVolume;
            }
            else {
                this._preVolume = parseFloat(this.volumInput.value);
                this.volumInput.value = "0";
                this.video.muted = true;
                this.muteBtn.classList.remove("fa-volume-high");
                this.muteBtn.classList.add("fa-volume-xmark");
            }
        });
        this.muteBtn.addEventListener("mouseover", () => {
            this.volumeContainer.style.display = "inline-block";
            this.volumInput.style.display = "inline-block";
        });
        this.muteBtn.addEventListener("mouseleave", () => {
            this.volumeContainer.style.display = "none";
        });
        this.volumeContainer.addEventListener("mouseover", () => {
            this.volumeContainer.style.display = "inline-block";
        });
        this.volumeContainer.addEventListener("mouseleave", () => {
            this.volumeContainer.style.display = "none";
        });
        this.volumInput.addEventListener("input", () => {
            this.video.volume = parseFloat(this.volumInput.value);
            // Update mute icon based on the volume
            if (this.video.volume === 0) {
                this.muteBtn.classList.remove("fa-volume-high");
                this.muteBtn.classList.add("fa-volume-xmark");
            }
            else {
                this.muteBtn.classList.remove("fa-volume-xmark");
                this.muteBtn.classList.add("fa-volume-high");
            }
        });
    }
    //////////////////////////////////
    FullScreen() {
        this.fullScreen.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!document.fullscreenElement) {
                    if (this.vedioContainer) {
                        this.vedioContainer.style.position = "relative";
                        this.controls.style.position = "absolute";
                        this.controls.style.bottom = "0px";
                        this.controls.style.zIndex = "9";
                        this.controls.style.width = "99%";
                        yield this.vedioContainer.requestFullscreen();
                    }
                }
                else {
                    this.vedioContainer.style.position = "relative";
                    this.controls.style.position = "absolute";
                    this.controls.style.bottom = "5px";
                    this.controls.style.zIndex = "5";
                    this.controls.style.width = "97.2%";
                    yield document.exitFullscreen();
                }
            }
            catch (err) {
                console.error("Error changing screen", err);
            }
        }));
    }
    //////////////////////////////
    AutoPlay(autoPlay) {
        if (autoPlay === true) {
            this.video.autoplay = true;
            this.playbtn.classList.remove("fa-play");
            this.playbtn.classList.add("fa-pause");
        }
    }
    /////////////////////////////////////////
    initStyle(_iconsColor, _BgColor) {
        this.allIcons.forEach((ele) => {
            ele.style.color = _iconsColor;
            ele.style.cursor = "pointer";
        });
        this.timeRange.style.cursor = "pointer";
        this.volumInput.style.cursor = "pointer";
        this.controls.style.boxShadow = `1px  1px 35px 5px ${_BgColor} inset`;
        this.vedioContainer.style.position = "relative";
        this.controls.style.position = "absolute";
        this.controls.style.bottom = "5px";
        this.controls.style.zIndex = "5";
        this.controls.style.width = "97.2%";
        this.controls.style.opacity = "0";
    }
    veidoHover() {
        let controls = document.querySelector(".controls");
        this.div.addEventListener("mouseenter", () => {
            this.controls.style.opacity = ".8";
            console.log("menter");
        });
        this.div.addEventListener("mouseleave", () => {
            this.controls.style.opacity = "0";
            console.log("mleave");
        });
    }
}
Video.count = -1;
let vid1 = new Video({ url: "./videoplayback.mp4" });
let vid2 = new Video({ url: "./videoplayback.mp4", iconsColor: "red" });
let vid3 = new Video({
    url: "./videoplayback.mp4",
    BgColor: "red",
    skipTime: 10,
});
let vid4 = new Video({ url: "./videoplayback.mp4", autoPlay: true });
