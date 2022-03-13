import Phaser from 'phaser'

function startGame() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const phaserGameConfig = {
        type: Phaser.WEBGL,
        background: '#000000',
        parent: 'gameWrapper',
        width: 1280,
        height: 1024,
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
    // Rule 'no-new' is disabled becouse we need side effects from creating instance of Phaser Game, but no reasons to keep reference to that instance.
    // eslint-disable-next-line no-new
    new Phaser.Game(phaserGameConfig)
}

function preload() {
    // load your assets here
    // this.load.
}

function update(tt, dt) {
    // use for doing smthing on every frame
}

function create() {
    window.PHASER = this
    // start your code here
}

window.startGame = startGame
