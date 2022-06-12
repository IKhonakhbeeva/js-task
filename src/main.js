import Phaser from 'phaser'
import Spinner from './spinner.js'

function startGame() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const phaserGameConfig = {
        type: Phaser.WEBGL,
        backgroundColor: '#DDDDDD',
        parent: 'gameWrapper',
        width: 640,
        height: 512,
        render: {
            powerPreference: 'high-performance',
            mipmapFilter: 'LINEAR_MIPMAP_LINEAR',
        },
        scale: {
            mode: Phaser.Scale.NONE,
        },
        scene: [
            {
                key: 'default',
                preload,
                create,
                update,
                active: true,
            },
        ],
        audio: {
            context: audioContext,
        },
    }
    new Phaser.Game(phaserGameConfig)
}

function preload() {
    // load your assets here
    this.load.setPath('assets')
    this.load.image('star', 'symbols/01_star.png')
    this.load.image('circle', 'symbols/02_circle.png')
    this.load.image('triangle', 'symbols/03_triangle.png')
    this.load.image('square', 'symbols/04_square.png')
}

function update(tt, dt) {
    // use for doing smthing on every frame
    for (let spinner of this.spinners) {
        spinner.nextFrame(tt, dt)
    }
}

function create() {
    // Global shortcut for current scene
    window.PHASER = this

    // start your code here
    const minSpeed = 100
    const maxSpeed = 200
    const symbols = ['star', 'circle', 'triangle', 'square']
    this.spinners = []
    for (let i = 0; i < 5; i++) {
        this.spinners[i] = new Spinner(PHASER, symbols)
        this.spinners[i].setBorders(50 + i * 100, 50, 100, 300)
        this.spinners[i].speed = minSpeed + Math.random() * (maxSpeed - minSpeed)
    }
}

window.startGame = startGame
