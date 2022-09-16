import { GameWindow } from "./gameWindow.js";
import { Menu } from "./menu.js";
class KeyState {
    constructor(state, shouldReset) {
        this.state = state;
        this.shouldReset = shouldReset;
    }
}
// game is designed for a square window
// runtime variables
const resolution = [500, 500];
let canvas;
const flags = {
    "gameOver": false,
    "lineClear": false,
    "tetris": false,
    "wallHit": false,
    "hardDrop": false
};
let timeElapsed = 0;
let running = false; // Start as false  to prevent mouse callback from glitching
let endTime;
// Visuals
export let Tetris_image;
// Music and sfx
export let Menu_music, Gameplay_music, Game_over, Wall_hit, Line_cleared, hard_drop;
window.preload = function () {
    Menu_music = loadSound("Assets/Music/Menu_music.wav");
    Gameplay_music = loadSound("Assets/Music/Gameplay_music.wav");
    Game_over = loadSound("Assets/Music/Game_over.wav");
    Wall_hit = loadSound("Assets/Music/Wall_hit.wav");
    Line_cleared = loadSound("Assets/Music/Line_cleared.mp3");
    hard_drop = loadSound("Assets/Music/Hard_drop.wav");
    Tetris_image = loadImage('Assets/Images/Tetris_image.png');
};
window.setup = function () {
    canvas = createCanvas(...resolution);
    frameRate(15);
    game = new GameWindow(resolution, flags);
    menu = new Menu();
    // Menu_music.play();
    running = true;
};
// UI elements
let game;
let menu;
// // inputs Format .active, .shouldReset
const keys = {
    [37]: new KeyState(false, false),
    [39]: new KeyState(false, false),
    [40]: new KeyState(false, false),
    [32]: new KeyState(false, true),
    [68]: new KeyState(false, true),
    [65]: new KeyState(false, true) // a
};
// mainloop
window.draw = function () {
    if (!running) {
        if (Date.now() - endTime > 2000) {
            background(0);
            noLoop();
            return;
        }
        else {
            background(0, 50);
            return;
        }
    }
    const time_start = Date.now();
    // rendering
    menu.render(canvas);
    game.render(canvas);
    // events and flags
    game.update(timeElapsed);
    game.userInput(keys);
    if (flags["gameOver"]) {
        flags["gameOver"] = false;
        game.render(canvas);
        Gameplay_music.stop();
        Game_over.play();
        game.active = false;
        running = false;
    }
    if (flags["wallHit"]) {
        flags["wallHit"] = false;
        Wall_hit.play();
    }
    if (flags["lineClear"]) {
        flags["lineClear"] = false;
        Line_cleared.play();
    }
    if (flags["hardDrop"]) {
        flags["hardDrop"] = false;
        hard_drop.play();
    }
    endTime = Date.now();
    timeElapsed = endTime - time_start;
};
window.keyPressed = function () {
    if (!keys.hasOwnProperty(keyCode)) {
        return;
    }
    keys[keyCode].state = true;
};
window.keyReleased = function () {
    if (!keys.hasOwnProperty(keyCode)) {
        return;
    }
    keys[keyCode].state = false;
};
window.mousePressed = function () {
    if (!running) {
        return;
    }
    const buttons = menu.checkButtons([mouseX, mouseY]);
    if (buttons["play"]) {
        menu.close();
        Menu_music.stop();
        Gameplay_music.play();
        game.start();
    }
    if (buttons["exit"]) {
        running = false;
        endTime = Date.now();
        Game_over.play();
    }
};