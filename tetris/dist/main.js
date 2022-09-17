import { GameWindow } from "./gameWindow.js";
import { Language, LanguageName, loadLanguages } from "./i18n.js";
import { Menu } from "./menu.js";
class KeyState {
    constructor(shouldReset = false) {
        this.state = false;
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
    Menu_music = loadSound("assets/Music/Menu_music.wav");
    Gameplay_music = loadSound("assets/Music/Gameplay_music.wav");
    Game_over = loadSound("assets/Music/Game_over.wav");
    Wall_hit = loadSound("assets/Music/Wall_hit.wav");
    Line_cleared = loadSound("assets/Music/Line_cleared.mp3");
    hard_drop = loadSound("assets/Music/Hard_drop.wav");
    Tetris_image = loadImage('assets/Images/Tetris_image.png');
    loadLanguages();
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
let language = new Language(LanguageName.Japanese);
// inputs              shouldReset parameter is passed as `true` if the key should not act multiple times when held
const keys = {
    [37]: new KeyState(),
    [39]: new KeyState(),
    [40]: new KeyState(),
    [32]: new KeyState(true),
    [68]: new KeyState(true),
    [65]: new KeyState(true) // a
};
// main loop
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
    menu.render(language);
    game.render(language);
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
