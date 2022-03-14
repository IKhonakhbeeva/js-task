import Phaser from 'phaser'

function startGame() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const phaserGameConfig = {
        type: Phaser.WEBGL,
        background: '#000000',
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
    this.load.image('01_star', 'symbols/01_star.png')
}

function update(tt, dt) {
    // use for doing smthing on every frame
}

function create() {
    // Global shortcut for current scene
    window.PHASER = this

    // start your code here
    const sceneWidth = PHASER.sys.game.scale.gameSize.width
    const sceneHeight = PHASER.sys.game.scale.gameSize.height
    const stubImg = PHASER.add.image(sceneWidth / 2, sceneHeight / 2, '01_star')
    stubImg.scale = 2
}

window.startGame = startGame
