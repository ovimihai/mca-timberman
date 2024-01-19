namespace StatusBarKind {
    export const timer = StatusBarKind.create()
}
controller.anyButton.onEvent(ControllerButtonEvent.Pressed, function () {
    if (started == 0) {
        ctimer = ctimer_max
    }
    started = 1
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    move(-1)
})
function increaseTimer () {
    if (ctimer < ctimer_max) {
        ctimer += 1
    }
}
function drawTree () {
    index = 0
    for (let value of branches) {
        tiles.setTileAt(tiles.getTileLocation(4, index), assets.tile`transparency16`)
        tiles.setTileAt(tiles.getTileLocation(6, index), assets.tile`transparency16`)
        tiles.setTileAt(tiles.getTileLocation(5, index), assets.tile`tree trunk`)
        if (value == -1) {
            tiles.setTileAt(tiles.getTileLocation(4, index), assets.tile`branch left`)
        } else if (value == 1) {
            tiles.setTileAt(tiles.getTileLocation(6, index), assets.tile`branch right`)
        }
        index += 1
    }
}
/**
 * Inspiration: https://falsam.com/timberman/
 */
info.onScore(100, function () {
    game.gameOver(true)
})
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    move(1)
})
function cutTree () {
    branches.pop()
    branches.unshift(branch_options._pickRandom())
}
function move (direction: number) {
    if (direction == -1) {
        position = 4
    } else {
        position = 6
    }
    increaseTimer()
    tiles.setTileAt(tiles.getTileLocation(3, 5), assets.tile`transparency16`)
    tiles.setTileAt(tiles.getTileLocation(7, 5), assets.tile`transparency16`)
    tiles.setTileAt(tiles.getTileLocation(5, 6), assets.tile`transparency16`)
    tiles.placeOnTile(timberman, tiles.getTileLocation(5, 6))
    pause(100)
    tiles.placeOnTile(timberman, tiles.getTileLocation(position, 6))
    if (branches[5] == direction) {
        game.gameOver(false)
    } else {
        info.changeScoreBy(1)
    }
    cutTree()
    drawTree()
}
let position = 0
let index = 0
let ctimer = 0
let ctimer_max = 0
let started = 0
let branches: number[] = []
let branch_options: number[] = []
let timberman: Sprite = null
scene.setBackgroundColor(0)
scene.setBackgroundImage(assets.image`Background`)
timberman = sprites.create(assets.image`timberman`, SpriteKind.Player)
tiles.setCurrentTilemap(tilemap`level2`)
branch_options = [-1, 0, 1]
branches = [0]
for (let index2 = 0; index2 < 6; index2++) {
    branches.unshift(branch_options._pickRandom())
}
drawTree()
tiles.placeOnTile(timberman, tiles.getTileLocation(4, 6))
tiles.setTileAt(tiles.getTileLocation(3, 5), assets.tile`arrow-left`)
tiles.setTileAt(tiles.getTileLocation(7, 5), assets.tile`arrow-right`)
let statusbar = statusbars.create(20, 4, StatusBarKind.timer)
statusbar.setBarBorder(1, 15)
tiles.placeOnTile(statusbar, tiles.getTileLocation(5, 0))
started = 0
ctimer_max = 3
game.onUpdateInterval(100, function () {
    ctimer += -0.1
    statusbar.value = ctimer * 20
    if (started == 1) {
        if (ctimer <= 0) {
            game.gameOver(false)
        }
    }
})
