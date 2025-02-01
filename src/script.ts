class Video {
  private _url: string;
  private _autoPlay: boolean;
  private _iconsColor: string;
  private _BgColor: string;
  private _skipTime: number;
  private div: HTMLDivElement;
  private _preVolume: number = 1;
  private static count = -1;
  video: HTMLVideoElement;
  playbtn: HTMLElement;
  timeRange: HTMLInputElement;
  forwardBtn: HTMLElement;
  backwardBtn: HTMLElement;
  muteBtn: HTMLElement;
  volumeContainer: HTMLDivElement;
  volumInput: HTMLInputElement;
  fullScreen: HTMLElement;
  controls: HTMLElement;
  vedioContainer: HTMLDivElement;
  allIcons: HTMLElement[];

  constructor(options: {
    url: string;
    iconsColor?: string;
    BgColor?: string;
    autoPlay?: boolean;
    skipTime?: number;
  }) {
    Video.count++;
    this._url = options.url;
    this._BgColor = options.BgColor ?? "white";
    this._skipTime = options.skipTime ?? 5;
    this._iconsColor = options.iconsColor ?? "white";
    this._autoPlay = options.autoPlay ?? false;
    let parent = document.querySelector(".row");
    this.div = document.createElement("div") as HTMLDivElement;
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

    parent?.appendChild(this.div);

    // Select elements inside the newly created div
    this.video = this.div.querySelector(".video") as HTMLVideoElement;
    this.playbtn = this.div.querySelector(".play") as HTMLElement;
    this.timeRange = this.div.querySelector(".timeRange") as HTMLInputElement;
    this.forwardBtn = this.div.querySelector(".forwardBtn") as HTMLElement;
    this.backwardBtn = this.div.querySelector(".backwardBtn") as HTMLElement;
    this.muteBtn = this.div.querySelector(".muteBtn") as HTMLElement;
    this.volumeContainer = document.querySelector(".volume") as HTMLDivElement;
    this.volumInput = document.querySelector(
      ".volumeInput"
    ) as HTMLInputElement;
    this.fullScreen = this.div.querySelector(".fa-expand") as HTMLElement;
    this.controls = this.div.querySelector(".controls") as HTMLElement;
    this.vedioContainer = this.div;
    this.allIcons = Array.from(this.div.querySelectorAll<HTMLElement>("i"));
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
  public playandPause() {
    this.playbtn.addEventListener("click", () => {
      if (this.video.paused) {
        this.playbtn.classList.remove("fa-play");
        this.playbtn.classList.add("fa-pause");
        this.video.play();
      } else {
        this.video.pause();
        this.playbtn.classList.remove("fa-pause");
        this.playbtn.classList.add("fa-play");
      }
    });
  }

  ///////////////////////////////////////////////////////////////
  public handleTimeRange() {
    if (!this.video || !this.timeRange) return;

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
  public updatePlayPauseIcon() {
    if (!this.video || !this.playbtn) return;

    if (
      this.video.currentTime <= 0 ||
      this.video.currentTime >= this.video.duration
    ) {
      this.playbtn.classList.remove("fa-pause");
      this.playbtn.classList.add("fa-play");
    }
  }

  ///////////////////////////////////////////////////////////////
  public forward(skipTime: number) {
    this.forwardBtn.addEventListener("click", () => {
      this.video.currentTime = Math.min(
        this.video.currentTime + skipTime,
        this.video.duration
      );
    });
  }
  ///////////////////////////////////
  public backward(skipTime: number) {
    this.backwardBtn.addEventListener("click", () => {
      this.video.currentTime = Math.max(this.video.currentTime - skipTime, 0);
    });
  }
  ////////////////////////////////////////////
  public mutedAndTimeRange(_BgColor: string) {
    this.volumeContainer = this.vedioContainer.querySelector(
      ".volume"
    ) as HTMLDivElement;
    this.volumInput = this.vedioContainer.querySelector(
      ".volume input"
    ) as HTMLInputElement;
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
      } else {
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
      } else {
        this.muteBtn.classList.remove("fa-volume-xmark");
        this.muteBtn.classList.add("fa-volume-high");
      }
    });
  }
  //////////////////////////////////
  public FullScreen() {
    this.fullScreen.addEventListener("click", async () => {
      try {
        if (!document.fullscreenElement) {
          if (this.vedioContainer) {
            this.vedioContainer.style.position = "relative";
            this.controls.style.position = "absolute";
            this.controls.style.bottom = "0px";
            this.controls.style.zIndex = "9";
            this.controls.style.width = "99%";
            await this.vedioContainer.requestFullscreen();
          }
        } else {
          this.vedioContainer.style.position = "relative";
          this.controls.style.position = "absolute";
          this.controls.style.bottom = "5px";
          this.controls.style.zIndex = "5";
          this.controls.style.width = "97.2%";
          await document.exitFullscreen();
        }
      } catch (err) {
        console.error("Error changing screen", err);
      }
    });
  }
  //////////////////////////////
  public AutoPlay(autoPlay: boolean) {
    if (autoPlay === true) {
      this.video.autoplay = true;
      this.playbtn.classList.remove("fa-play");
      this.playbtn.classList.add("fa-pause");
    }
  }
  /////////////////////////////////////////
  public initStyle(_iconsColor: string, _BgColor: string) {
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
  public veidoHover() {
    let controls = document.querySelector(".controls") as HTMLElement;

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
let vid1 = new Video({ url: "./videoplayback.mp4" });
let vid2 = new Video({ url: "./videoplayback.mp4", iconsColor: "red" });
let vid3 = new Video({
  url: "./videoplayback.mp4",
  BgColor: "red",
  skipTime: 10,
});
let vid4 = new Video({ url: "./videoplayback.mp4", autoPlay: true });
