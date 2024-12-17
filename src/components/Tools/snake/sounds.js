import * as Tone from 'tone'

class SoundManager {
    constructor() {
        // Initialize synths
        this.foodSynth = new Tone.Synth({
            oscillator: {
                type: "sine"
            },
            envelope: {
                attack: 0.01,
                decay: 0.1,
                sustain: 0,
                release: 0.1
            }
        }).toDestination()

        this.gameOverSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: {
                type: "triangle"
            },
            envelope: {
                attack: 0.01,
                decay: 0.3,
                sustain: 0,
                release: 0.1
            }
        }).toDestination()

        this.moveSynth = new Tone.Synth({
            oscillator: {
                type: "square"
            },
            envelope: {
                attack: 0.01,
                decay: 0.05,
                sustain: 0,
                release: 0.05
            },
            volume: -20
        }).toDestination()

        // Initialize effects
        this.feedbackDelay = new Tone.FeedbackDelay("8n", 0.5).toDestination()
        this.gameOverSynth.connect(this.feedbackDelay)
    }

    async initialize() {
        // Only initialize if context is not running
        if (Tone.context.state !== 'running') {
            try {
                await Tone.start()
                console.log('Audio context started')
            } catch (error) {
                console.warn('Could not start audio context:', error)
            }
        }
    }

    playFoodCollect() {
        this.foodSynth.triggerAttackRelease("C5", "16n")
    }

    playGameOver() {
        // Play a descending pattern
        const now = Tone.now()
        this.gameOverSynth.triggerAttackRelease(["C4", "G3", "E3", "C3"], "8n", now)
    }

    playMove() {
        this.moveSynth.triggerAttackRelease("G4", "32n")
    }
}

// Create and export a singleton instance
const soundManager = new SoundManager()
export { soundManager }
