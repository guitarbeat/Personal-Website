export class SnakeAudio {
    constructor() {
        this.files = {};
        this.endEvents = {};
        this.progressEvents = {};
        this.playing = [];
        this.soundDisabled = false;
    }

    load(name, path, callback) {
        const audio = this.files[name] = document.createElement("audio");
        
        this.progressEvents[name] = (event) => {
            if (event.loaded === event.total && typeof callback === "function") {
                callback();
                audio.removeEventListener("canplaythrough", this.progressEvents[name], true);
            }
        };

        const handleError = () => {
            console.warn(`Failed to load audio: ${path}`);
            if (typeof callback === "function") {
                callback();
            }
            audio.removeEventListener("error", handleError);
        };

        audio.addEventListener("canplaythrough", this.progressEvents[name], true);
        audio.addEventListener("error", handleError);
        audio.setAttribute("preload", "true");
        audio.setAttribute("autobuffer", "true");
        audio.setAttribute("src", path);
        audio.pause();
    }

    play(name) {
        if (!this.files[name]) {
            console.warn(`Audio file '${name}' not found`);
            return;
        }
        if (!this.soundDisabled && this.files[name]) {
            try {
                this.endEvents[name] = () => this.ended(name);
                this.playing.push(name);
                this.files[name].addEventListener("ended", this.endEvents[name], true);
                this.files[name].play().catch(error => {
                    console.warn(`Failed to play audio '${name}':`, error);
                });
            } catch (error) {
                console.warn(`Error playing audio '${name}':`, error);
            }
        }
    }

    ended(name) {
        const index = this.playing.indexOf(name);
        if (index !== -1) {
            this.playing.splice(index, 1);
        }
        this.files[name].removeEventListener("ended", this.endEvents[name], true);
    }

    pause() {
        this.playing.forEach(name => {
            if (this.files[name]) {
                this.files[name].pause();
            }
        });
    }

    resume() {
        this.playing.forEach(name => {
            if (this.files[name]) {
                this.files[name].play();
            }
        });
    }

    toggleSound() {
        this.soundDisabled = !this.soundDisabled;
        if (this.soundDisabled) {
            this.pause();
        }
        return this.soundDisabled;
    }

    loadSounds(callback) {
        const audioFiles = [
            ["eat", "/audio/snake-eat.mp3"],
            ["die", "/audio/snake-die.mp3"],
            ["turn", "/audio/snake-turn.mp3"]
        ];

        let loaded = 0;
        const onLoad = () => {
            loaded++;
            if (loaded === audioFiles.length) {
                callback();
            }
        };

        audioFiles.forEach(([name, path]) => {
            this.load(name, path, onLoad);
        });
    }
}
